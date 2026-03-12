import { useState, useEffect, useMemo } from "react";
import useModalState from "@/hooks/useModalState";
import Modal from "@/components/Modal";
import { ChevronDown, ChevronUp, Wallet } from "lucide-react";
import Button from "@/components/Button";
import { formatReward, showStatusModal, sleep } from "@/utils/tools";
import { Slider } from "@nextui-org/react";
import { StatusType } from "./statusModal";
import useCosmos from "@/models/_global/cosmos";
import useStake from "@/models/stake";
import { checkKeplrWallet, checkkTx, signAndBroadcastDirect } from "@/utils/cosmos";
import { blockTime, cosmosFee, cosmosCysicTestnet } from "@/config";
import { MsgDelegate, MsgUndelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import GradientBorderCard from "@/components/GradientBorderCard";
import { TableAvatar } from "@/routes/pages/Zk/dashboard/components/tableComponents";

// 操作类型枚举
enum StakeAction {
    STAKE = "STAKE",
    UNSTAKE = "UNSTAKE"
}

// 验证人选项卡
enum ValidatorTab {
    MY_VALIDATORS = "MY_VALIDATORS",
    ALL = "ALL"
}

// 直接使用接口数据类型，确保与API响应一致
interface ValidatorResponse {
    validatorName: string;
    stake?: {
        amount: string;
        symbol: string;
    };
    votingPower: {
        amount: string;
        symbol: string;
    };
    votingPowerPercent: string;
    commissionRate: string;
    apr?: string;
}

// 自定义滚动条组件
const PercentageSlider = ({ value, onChange }: { value: number, onChange: (value: number) => void }) => {
    return (
        <div className="px-2 mt-4">
            <div className="relative pt-6 pb-10">
                <Slider
                    size="md"
                    step={1}
                    minValue={0}
                    maxValue={100}
                    value={value}
                    onChange={(val) => onChange(val as number)}
                    classNames={{
                        // base: "max-w-md",
                        filler: "bg-gradient-to-r from-lightBrand to-[#9D47FF] rounded-[20px]",
                        track: "border-none",
                        labelWrapper: "mb-2",
                        label: "font-medium text-default-700 text-medium",
                        value: "font-medium text-default-500 text-small",
                        thumb: [
                            "[&:after]:!bg-white [&:after]:!h-3 [&:after]:!w-3",
                            "transition-size",
                            "bg-gradient-to-r from-[#9D47FF] to-lightBrand",
                            "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
                            "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6",
                        ],
                        step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
                    }}
                    showSteps={false}
                    marks={[
                        { value: 0, label: "0%" },
                        { value: 25, label: "25%" },
                        { value: 50, label: "50%" },
                        { value: 75, label: "75%" },
                        { value: 100, label: "100%" },
                    ]}
                />


            </div>
        </div>
    );
};

// 修改下拉框组件以直接使用store中的数据
const ValidatorDropdown = ({
    selectedValidator,
    onSelect,
    isOpen,
    onOpenChange,
    activeTab
}: {
    selectedValidator: ValidatorResponse | null,
    onSelect: (validator: ValidatorResponse) => void,
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    activeTab: StakeAction
}) => {
    const [validatorTab, setValidatorTab] = useState<ValidatorTab>(ValidatorTab.MY_VALIDATORS);
    const { stakeList, activeList } = useStake(); // 使用stake store

    // 当activeTab变化时，确保在Unstake模式下默认选择MY_VALIDATORS
    useEffect(() => {
        if (activeTab === StakeAction.UNSTAKE) {
            setValidatorTab(ValidatorTab.MY_VALIDATORS);
        }
    }, [activeTab]);
    // 直接从store获取验证者数据，不再使用本地状态和请求
    const validators = useMemo(() => {
        if (validatorTab === ValidatorTab.MY_VALIDATORS) {
            return stakeList?.data?.validatorList || [];
        } else {
            return activeList?.data?.validatorList || [];
        }
    }, [validatorTab, stakeList, activeList]);

    // 选项卡切换处理
    const handleValidatorTabChange = (tab: ValidatorTab) => {
        setValidatorTab(tab);
    };

    return (
        <div className="relative">
            <div
                className="flex justify-between items-center bg-transparent border border-[#333] rounded-lg p-4 cursor-pointer"
                onClick={() => onOpenChange(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {selectedValidator ? (
                        <>
                            <TableAvatar switchColor name={selectedValidator.validatorName} />
                        </>
                    ) : (
                        <span className="text-[#777]">Select Validator</span>
                    )}
                </div>
                <div>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isOpen && (
                <GradientBorderCard borderRadius={8}
                    style={{
                        '--border-width': '0.5px'
                    }}
                    className="absolute left-0 right-0 top-full mt-1 z-50 bg-black border border-[#333] rounded-lg overflow-hidden">
                    <div className="p-4">
                        <h3 className="text-white text-xl mb-4">VALIDATOR</h3>

                        {/* 验证人选项卡 - 在Unstake模式下禁用ALL选项卡 */}
                        <div className="grid grid-cols-2 rounded-lg overflow-hidden mb-4 border border-[#FFFFFF4D]">
                            <button
                                className={`py-3 uppercase text-center text-base ${validatorTab === ValidatorTab.MY_VALIDATORS
                                    ? "bg-white text-black"
                                    : "bg-[#1E1E1E] text-[#777]"
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleValidatorTabChange(ValidatorTab.MY_VALIDATORS);
                                }}
                            >
                                MY STAKE
                            </button>
                            <button
                                className={`py-3 uppercase text-center text-base ${validatorTab === ValidatorTab.ALL
                                        ? "bg-white text-black"
                                        : "bg-[#1E1E1E] text-[#777]"
                                    } ${activeTab === StakeAction.UNSTAKE
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // 只有在Stake模式下才能切换到ALL
                                    if (activeTab !== StakeAction.UNSTAKE) {
                                        handleValidatorTabChange(ValidatorTab.ALL);
                                    }
                                }}
                            >
                                ALL
                            </button>
                        </div>

                        {/* 验证人列表或空状态 */}
                        {validators.length > 0 ? (
                            <>
                                {/* 验证人列表头部 */}
                                <div className="flex justify-between items-center bg-[#111] p-3 rounded-md mb-2">
                                    <div className="text-white w-[8.25rem]">Validator</div>
                                    {
                                        validatorTab === ValidatorTab.MY_VALIDATORS ? (
                                            <div className="text-white text-center">Staked Amount</div>
                                        ) : (
                                            null
                                        )
                                    }
                                    {
                                        validatorTab === ValidatorTab.MY_VALIDATORS ? (
                                            <div className="text-white text-right w-[8.25rem]">Expected APR</div>
                                        ) : (
                                            <div className="text-white text-right w-[8.25rem]">Commission Rate</div>
                                        )
                                    }
                                </div>

                                {/* 验证人列表 */}
                                <div className="max-h-[200px] overflow-y-auto">
                                    {validators.map((validator: ValidatorResponse, index: number) => (
                                        <div
                                            key={`${validator.validatorName}-${index}`}
                                            className="flex justify-between items-center p-3 cursor-pointer hover:bg-gradient-to-r from-[#19ffe066] to-[#9d47ff66] rounded-md"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect(validator);
                                            }}
                                        >
                                            <TableAvatar switchColor name={validator.validatorName} className="w-[8.25rem]" />
                                            {
                                                validatorTab === ValidatorTab.MY_VALIDATORS ? (
                                                    <div className="text-white text-center">
                                                        {formatReward(validator.stake?.amount || '0', 4)} CGT
                                                    </div>
                                                ) : null
                                            }
                                            <div className="text-white text-right w-[8.25rem]">
                                                {validatorTab === ValidatorTab.MY_VALIDATORS
                                                    ? (validator.apr || "0") + "%"
                                                    : `${(Number(validator.commissionRate) * 100).toFixed(2)}%` || "0%"
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            // 空状态显示
                            <div className="text-center text-white py-10">
                                {validatorTab === ValidatorTab.MY_VALIDATORS
                                    ? "My Staked Validators not found"
                                    : "No active validators found"}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center px-4 py-2 border-t border-[#333]">
                        <div className="text-[#777]">Unstaking period</div>
                        <div className="text-white">21 Days</div>
                    </div>
                </GradientBorderCard>
            )}
        </div>
    );
};

const StakeModal = () => {
    // 获取模态框状态
    const { visible, setVisible, data }: any = useModalState({
        eventName: "modal_stake_visible",
    });
    const { queryActiveListLoading, queryStakeListLoading, stakeList, activeList } = useStake(); // 使用stake store
    const activeLoading = queryActiveListLoading
    const stakeLoading = queryStakeListLoading
    // 状态管理
    const [activeTab, setActiveTab] = useState<StakeAction>(StakeAction.STAKE);
    const [selectedValidator, setSelectedValidator] = useState<ValidatorResponse | null>(null);
    const [showValidatorList, setShowValidatorList] = useState(false);
    const [amount, setAmount] = useState("");
    const [stakePercentage, setStakePercentage] = useState(0);
    // const [estimatedArrivalTime, setEstimatedArrivalTime] = useState("Nov 12, 2025 08:00");
    const { balanceMap, address, connector } = useCosmos()
    const cgtBalance = balanceMap?.CGT?.hm_amount || 0
    const balance = cgtBalance.toString();

    // 获取活跃验证者列表
    useEffect(() => {
        if (data?.validator && !selectedValidator &&
            (!stakeList || !stakeList.data || !stakeList.data.validatorList)) {
            const foundValidator = activeList?.data?.validatorList?.find(
                (v: ValidatorResponse) => v.validatorName === data.validator
            );
            if (foundValidator) {
                setSelectedValidator(foundValidator);
            }
        }
    }, [data?.validator, selectedValidator, stakeList, activeList])

    // 通过名称查找验证者
    const findValidatorByName = (name: string): ValidatorResponse | null => {
        // 在我的验证者列表中查找
        const myValidatorMatch = stakeList?.data?.validatorList?.find(
            v => v.validatorName === name
        );
        if (myValidatorMatch) return myValidatorMatch;

        // 在活跃验证者列表中查找
        const activeValidatorMatch = activeList?.data?.validatorList?.find(
            v => v.validatorName === name
        );
        if (activeValidatorMatch) return activeValidatorMatch;

        // 如果未找到，返回null
        return null;
    };

    // 在弹窗打开时初始化状态
    useEffect(() => {
        if (visible) {
            // 设置选项卡
            if (data?.tab && (data.tab === "stake" || data.tab === "unstake")) {
                setActiveTab(data.tab === "stake" ? StakeAction.STAKE : StakeAction.UNSTAKE);
            }

            // 设置验证者
            if (data?.validator) {
                const foundValidator = findValidatorByName(data.validator);
                if (foundValidator) {
                    setSelectedValidator(foundValidator);
                } else if (stakeList?.data?.validatorList?.length) {
                    // 如果找不到指定验证者但有验证者列表，使用第一个
                    setSelectedValidator(stakeList.data.validatorList[0]);
                } else if (activeList?.data?.validatorList?.length) {
                    // 否则使用活跃验证者列表的第一个
                    setSelectedValidator(activeList.data.validatorList[0]);
                }
                // 注意：如果这时候没有找到验证者，接口请求成功后会再次尝试设置
            }

            // 设置金额
            if (data?.amount) {
                setAmount(data.amount.toString());
                calculatePercentage(data.amount.toString());
            }
        }
    }, [visible, data, stakeList, activeList]);

    // 处理Tab切换
    const handleTabChange = (tab: StakeAction) => {
        setActiveTab(tab);
        // 切换选项卡时清空输入数据和选择的验证者
        setAmount("");
        setStakePercentage(0);
        setSelectedValidator(null); // 清空验证者选择
    };

    const precision = 4
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/,/g, "");
        if (!/^(\d*\.?\d*)$/.test(rawValue)) {
          return;
        }

        const parts = rawValue.split('.');
        const old = amount?.split('.')

        if (parts.length > 1 && parts[1].length > precision && parts?.[1]?.length > old?.[1]?.length) {
            return;
        }

        setAmount(rawValue);
        calculatePercentage(rawValue);


    };

    // 计算质押百分比 - 需要根据不同模式使用不同的基准值
    const calculatePercentage = (amountStr: string) => {
        const cleanAmount = parseFloat(amountStr.replace(/,/g, "")) || 0;

        if (activeTab === StakeAction.STAKE) {
            // 质押模式：基于用户余额计算百分比
            const cleanBalance = parseFloat(balance.replace(/,/g, "")) || 1;
            const percentage = Math.min(Math.max((cleanAmount / cleanBalance) * 100, 0), 100);
            setStakePercentage(percentage);
        } else {
            // 取消质押模式：基于已质押金额计算百分比
            if (selectedValidator?.stake?.amount) {
                const stakeAmount = parseFloat(selectedValidator.stake.amount.replace(/,/g, "")) || 1;
                const percentage = Math.min(Math.max((cleanAmount / stakeAmount) * 100, 0), 100);
                setStakePercentage(percentage);
            } else {
                setStakePercentage(0);
            }
        }
    };

    // 设置最大金额
    const handleSetMax = () => {
        if (activeTab === StakeAction.STAKE) {
            // 质押模式下使用账户余额
            setAmount(balance);
            setStakePercentage(100);
        } else {
            // 取消质押模式下使用验证人的质押金额
            if (selectedValidator?.stake?.amount) {
                setAmount(selectedValidator.stake.amount);
                // 在取消质押模式下，百分比应该基于验证人已质押的金额
                setStakePercentage(100);
            }
        }
    };

    // 处理百分比选择 - 同样需要根据不同模式使用不同的基准值
    const handlePercentageSelect = (value: number) => {
        setStakePercentage(value);

        if (activeTab === StakeAction.STAKE) {
            // 质押模式：基于用户余额计算金额
            const cleanBalance = parseFloat(balance.replace(/,/g, "")) || 0;
            const newAmount = (cleanBalance * (value / 100)).toFixed(2);
            setAmount(newAmount);
        } else {
            // 取消质押模式：基于已质押金额计算金额
            if (selectedValidator?.stake?.amount) {
                const stakeAmount = parseFloat(selectedValidator.stake.amount.replace(/,/g, "")) || 0;
                const newAmount = (stakeAmount * (value / 100)).toFixed(2);
                setAmount(newAmount);
            }
        }
    };

    // 处理质押操作
    const handleStake = async () => {
        if (!selectedValidator) return;

        try {
            console.log(`Staking ${amount} CGT to ${selectedValidator.validatorName}`);

            // 显示加载状态
            showStatusModal({
                type: StatusType.LOADING,
                message: `Staking ${amount} CGT to ${selectedValidator.validatorName}, Confirm this tx in your wallet`
            });



            checkKeplrWallet()
            const msg = {
                typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                value: MsgDelegate.encode(MsgDelegate.fromPartial({
                    delegatorAddress: address,
                    // TODO 需要根据验证人列表的地址来选择
                    validatorAddress: selectedValidator?.validatorAddress,
                    amount: {
                        denom: "CGT", // 代币的denom
                        amount: BigNumber(amount).multipliedBy(1e18).toString(), // 委托的数量
                    },
                })).finish(),
            };

            const result = await signAndBroadcastDirect(address, msg, cosmosFee, connector)
            const tx = await checkkTx(connector, result?.transactionHash)
            console.log('tx', tx)

            showStatusModal({
                type: StatusType.SUCCESS,
                title: "Transaction Submitted",
                message: 'Your Stake status will be updated in few seconds.',
                chainName: cosmosCysicTestnet.chainName,
                txHash: tx
            });

            dispatchEvent(new Event('refresh_stake_list'))

            // 关闭质押模态框
            handleClose();
        } catch (error) {
            console.error("Error staking:", error);

            // 显示错误状态
            showStatusModal({
                type: StatusType.ERROR,
                title: "Transaction Failed",
                message: "The transaction was not processed correctly. Please try again.",
                onRetry: () => handleStake()
            });
        }
    };

    // 处理取消质押操作
    const handleUnstake = async () => {
        if (!selectedValidator) return;

        try {
            console.log(`Unstaking ${amount} CGT from ${selectedValidator.validatorName}`);

            // 显示加载状态
            showStatusModal({
                type: StatusType.LOADING,
                message: `Unstaking ${amount} CGT from ${selectedValidator.validatorName}, Confirm this tx in your wallet`
            });


            checkKeplrWallet()
            const msg = {
                typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
                value: MsgUndelegate.encode(MsgUndelegate.fromPartial({
                    delegatorAddress: address,
                    // TODO 需要根据验证人列表的地址来选择
                    validatorAddress: selectedValidator?.validatorAddress,
                    amount: {
                        denom: "CGT", // 代币的denom
                        amount: BigNumber(amount).multipliedBy(1e18).toString(), // 委托的数量
                    },
                })).finish(),
            };

            const result = await signAndBroadcastDirect(address, msg, cosmosFee, connector)
            const tx = await checkkTx(connector, result?.transactionHash)

            showStatusModal({
                type: StatusType.SUCCESS,
                title: "Unstake Successful",
                message: 'Your Unstake status will be updated in few seconds.',
                chainName: "CYSIC CHAIN",
                txHash: tx
            });

            dispatchEvent(new Event('refresh_stake_list'))

            handleClose();
        } catch (error) {
            console.error("Error unstaking:", error);

            // 显示错误状态
            showStatusModal({
                type: StatusType.ERROR,
                title: "Transaction Failed",
                message: "The transaction was not processed correctly. Please try again.",
                onRetry: () => handleUnstake()
            });
        }
    };

    // 关闭模态框并重置状态
    const handleClose = () => {
        // setVisible(false);
        dispatchEvent(new CustomEvent('modal_stake_visible', { detail: { visible: false } }))
        resetState();
    };

    // 重置所有状态
    const resetState = () => {
        setAmount("");
        setStakePercentage(0);
        setShowValidatorList(false);
    };

    // 当选择验证人变化时，如果是在取消质押模式，需要重新计算进度条
    useEffect(() => {
        if (activeTab === StakeAction.UNSTAKE && selectedValidator) {
            // 清空当前输入，确保进度条与新选择的验证人保持一致
            setAmount("");
            setStakePercentage(0);
        }
    }, [selectedValidator, activeTab]);

    return (
        <Modal
            isOpen={visible}
            onClose={handleClose}
            title="STAKE"
            className="max-w-[600px]"
        >
            {/* 加载状态显示 */}
            {(stakeLoading || activeLoading) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="text-white">Loading validator data...</div>
                </div>
            )}

            {/* 选项卡头部 */}
            <div className="grid grid-cols-2 rounded-lg overflow-hidden mb-6 border border-[#FFFFFF4D]">
                <button
                    className={`py-4 uppercase text-center text-base ${activeTab === StakeAction.STAKE
                        ? "bg-white text-black"
                        : "bg-[#1E1E1E] text-[#777]"
                        }`}
                    onClick={() => handleTabChange(StakeAction.STAKE)}
                >
                    STAKE
                </button>
                <button
                    className={`py-4 uppercase text-center text-base ${activeTab === StakeAction.UNSTAKE
                        ? "bg-white text-black"
                        : "bg-[#1E1E1E] text-[#777]"
                        }`}
                    onClick={() => handleTabChange(StakeAction.UNSTAKE)}
                >
                    UNSTAKE
                </button>
            </div>

            {/* 代币选择 - 目前只有CGT */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-white text-base">Token</div>
                <div className="text-white text-base">CGT</div>
            </div>

            {/* 验证人选择 - 使用自定义下拉框组件 */}
            <div className="mb-4">
                <div className="text-white text-base mb-2">Validator</div>
                <ValidatorDropdown
                    selectedValidator={selectedValidator}
                    onSelect={(validator) => {
                        setSelectedValidator(validator);
                        setShowValidatorList(false);
                    }}
                    isOpen={showValidatorList}
                    onOpenChange={setShowValidatorList}
                    activeTab={activeTab}
                />
            </div>

            {activeTab === StakeAction.STAKE ? (
                <>
                    {/* 质押金额输入 */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-white">Staking Amount</div>
                            <div className="flex items-center text-white">
                                <Wallet size={16} className="mr-2" />
                                Balance: {formatReward(cgtBalance, 4, true)}
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-transparent border border-[#333] rounded-lg p-4">
                            <input
                                type="text"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="ENTER"
                                className="bg-transparent border-none outline-none w-full text-white"
                            />
                            <button
                                className="bg-transparent border border-white rounded-full px-4 py-2 text-white"
                                onClick={handleSetMax}
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    {/* 质押百分比选择器 */}
                    <PercentageSlider
                        value={stakePercentage}
                        onChange={handlePercentageSelect}
                    />

                    {/* 质押信息 */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="text-[#777]">APR</div>
                            <div className="text-white">{formatReward(selectedValidator?.apr || "0", 2)}%</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#777]">Voting Power</div>
                            <div className="text-white">{formatReward(selectedValidator?.votingPower?.amount || "0", 4, true)}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#777]">Commission rate</div>
                            <div className="text-white">{selectedValidator?.commissionRate ? (Number(selectedValidator?.commissionRate) * 100) : "0"}%</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-[#777]">Unstaking period</div>
                            <div className="text-white">21 Days</div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* 取消质押金额输入 */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-white">Amount</div>
                            <div className="flex items-center text-white">
                                <Wallet size={16} className="mr-2" />
                                Amount to unstake: {selectedValidator?.stake?.amount || '-'}
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-transparent border border-[#333] rounded-lg p-4">
                            <input
                                type="text"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="0.00"
                                className="bg-transparent border-none outline-none w-full text-white"
                            />
                            <button
                                className="bg-transparent border border-white rounded-full px-4 py-2 text-white"
                                onClick={handleSetMax}
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    {/* 质押百分比选择器 */}
                    <PercentageSlider
                        value={stakePercentage}
                        onChange={handlePercentageSelect}
                    />

                    {/* 取消质押信息 */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="text-[#777]">Redemption Amount</div>
                            <div className="text-white">{amount || '0'}</div>
                        </div>
                        {/* <div className="flex justify-between items-center">
                            <div className="text-[#777]">Total Earnings</div>
                            <div className="text-white">{totalEarnings}</div>
                        </div> */}
                        <div className="flex justify-between items-center">
                            <div className="text-[#777]">Estimated Arrival Time</div>
                            <div className="text-white">{dayjs().add(21, 'day').format('YYYY-MM-DD HH:mm')}</div>
                        </div>
                    </div>
                </>
            )}

            {/* 操作按钮 */}
            <Button
                type="light"
                className="w-full py-4 rounded-lg text-base"
                onClick={activeTab === StakeAction.STAKE ? handleStake : handleUnstake}
                disabled={!Number(amount) || !selectedValidator || BigNumber(amount).gt(activeTab === StakeAction.STAKE ? cgtBalance : selectedValidator?.stake?.amount || "0")}
            >
                {activeTab === StakeAction.STAKE ? "STAKE" : "UNSTAKE"}
            </Button>
        </Modal>
    );
};

export default StakeModal;