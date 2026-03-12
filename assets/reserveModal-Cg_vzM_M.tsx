import { useState, useEffect } from "react";
import useModalState from "@/hooks/useModalState";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { getImageUrl } from "@/utils/tools";
import useCosmos from "@/models/_global/cosmos";
import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import { toast } from "react-toastify";
import {
    cosmosFee,
    cosmosReservedValue,
    cysicBaseCoin,
} from "@/config";
import { checkKeplrWallet, signAndBroadcastDirect, checkkTx } from "@/utils/cosmos";
import { useRequest } from "ahooks";
import { DepositType, MsgDeposit, MsgWithdraw } from "@/utils/cysic-msg";
import useAccount from "@/hooks/useAccount";

// 操作类型枚举
enum ReserveAction {
    RESERVE = "RESERVE",
    WITHDRAW = "WITHDRAW"
}

const ReserveModal = () => {
    const { address, balanceMap, connector, depositMap } = useCosmos();
    const { walletAddress: evmAddress } = useAccount();
    const cgtBalance = balanceMap?.CGT?.hm_amount || 0;
    const cysBalance = balanceMap?.CYS?.hm_amount || 0;

    // 获取模态框状态
    const { visible, setVisible, data } = useModalState({
        eventName: "modal_reserve_visible",
    });

    // 状态管理
    const [activeTab, setActiveTab] = useState<ReserveAction>(ReserveAction.RESERVE);
    const [amount, setAmount] = useState("");

    // 在弹窗打开时初始化状态
    useEffect(() => {
        if (visible) {
            // 如果有指定的初始选项卡
            if (data?.tab && (data.tab === "reserve" || data.tab === "withdraw")) {
                setActiveTab(data.tab === "reserve" ? ReserveAction.RESERVE : ReserveAction.WITHDRAW);
            }

            // 如果有指定的初始金额
            if (data?.amount) {
                setAmount(data.amount.toString());
            }
        }
    }, [visible, data]);

    // 处理Tab切换
    const handleTabChange = (tab: ReserveAction) => {
        setActiveTab(tab);
        setAmount('');
    };

    // 处理金额变更
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 仅允许数字和小数点
        const value = e.target.value.replace(/[^0-9.]/g, "");
        setAmount(value);
    };

    // 处理预留/存款操作
    const { loading: reserveLoading, run: handleReserve } = useRequest(
        async () => {
            try {
                checkKeplrWallet();
                console.log(`Reserve ${amount} CYS`);

                if (
                    BigNumber(balanceMap?.[cysicBaseCoin]?.hm_amount)
                        .minus(amount)
                        .lt(cosmosReservedValue)
                ) {
                    throw { message: `Reserved Balance < ${cosmosReservedValue}` };
                }
                
                // 构建存款参数
                const msgContent = {
                    depositType: DepositType.PROVER_DEPOSIT_TYPE,
                    amount: BigNumber(amount || 0).multipliedBy(1e18).toString(),
                    sender: evmAddress,
                };

                const msg = {
                    typeUrl: MsgDeposit.typeUrl,
                    value: MsgDeposit.encode(MsgDeposit.fromPartial(msgContent)).finish(),
                };

                const result = await signAndBroadcastDirect(address, msg, cosmosFee, connector);
                const tx = await checkkTx(connector, result?.transactionHash);

                toast.success(`Tx Success at ${tx?.hash}`);
                
                // 重置状态
                setAmount("");
                
                // 刷新余额
                dispatchEvent(new CustomEvent("refresh_cosmosBalance"));
                // dispatchEvent(new CustomEvent("refresh_depositInfo"));
            } catch (error: any) {
                console.error("Error reserving:", error);
                toast.error(error?.message || error?.msg || error);
                throw error;
            }
        },
        {
            manual: true,
        }
    );

    // 处理提款操作
    const { loading: withdrawLoading, run: handleWithdraw } = useRequest(
        async () => {
            try {
                checkKeplrWallet();
                console.log(`Withdrawing ${amount} CYS`);

                // 构建提款参数
                const msgContent = {
                    depositType: DepositType.PROVER_DEPOSIT_TYPE,
                    amount: BigNumber(amount || 0).multipliedBy(1e18).toString(),
                    sender: evmAddress,
                };

                const msg = {
                    typeUrl: MsgWithdraw.typeUrl,
                    value: MsgWithdraw.encode(MsgWithdraw.fromPartial(msgContent)).finish(),
                };

                const result = await signAndBroadcastDirect(address, msg, cosmosFee, connector);
                const tx = await checkkTx(connector, result?.transactionHash);

                toast.success(`Tx Success at ${tx?.hash}`);
                
                // 重置状态
                setAmount("");
                
                // 刷新余额
                dispatchEvent(new CustomEvent("refresh_cosmosBalance"));
                // dispatchEvent(new CustomEvent("refresh_depositInfo"));
            } catch (error: any) {
                console.error("Error withdrawing:", error);
                toast.error(error?.message || error?.msg || error);
                throw error;
            }
        },
        {
            manual: true,
        }
    );

    // 关闭模态框并重置状态
    const handleClose = () => {
        setVisible(false);
        resetState();
    };

    // 重置所有状态
    const resetState = () => {
        setAmount("");
    };

    return (
        <Modal
            isOpen={visible}
            onClose={handleClose}
            title="RESERVE"
            className="max-w-[600px]"
        >
            {/* 选项卡头部 */}
            <div className="grid grid-cols-2 rounded-lg overflow-hidden mb-6 border border-[#FFFFFF4D]">
                <button
                    className={`py-4 uppercase text-center text-base ${activeTab === ReserveAction.RESERVE
                            ? "bg-white text-black"
                            : "bg-[#1E1E1E] text-[#777]"
                        }`}
                    onClick={() => {handleTabChange(ReserveAction.RESERVE); setAmount('')}}
                >
                    RESERVE
                </button>
                <button
                    className={`py-4 uppercase text-center text-base ${activeTab === ReserveAction.WITHDRAW
                            ? "bg-white text-black"
                            : "bg-[#1E1E1E] text-[#777]"
                        }`}
                    onClick={() => {handleTabChange(ReserveAction.WITHDRAW); setAmount('')}}
                >
                    WITHDRAW
                </button>
            </div>

            {/* 注意提示 - 仅在提款选项卡显示 */}
            {activeTab === ReserveAction.WITHDRAW && (
                <div className="mb-6 text-white">
                    Note: Reserving less than 100 CYS will deactivate your Verifier/Prover.
                </div>
            )}

            {/* 金额输入区域 */}
            <div className="bg-[#0E0E0E] border border-[#333] rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="unbounded-36-300">
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="100"
                            className="bg-transparent border-none outline-none w-full max-w-[200px] text-white"
                        />
                    </div>
                    <div className="text-base flex items-center bg-[#222] p-2 rounded-full">
                        <img
                            src={activeTab === ReserveAction.RESERVE ? getImageUrl('@/assets/images/tokens/CYS.svg') : getImageUrl('@/assets/images/tokens/CYS.svg')}
                            alt={activeTab === ReserveAction.RESERVE ? "CYS" : "CYS"}
                            className="w-6 h-6 mr-2"
                        />
                        <span className="unbounded-16-500">{activeTab === ReserveAction.RESERVE ? "CYS" : "CYS"}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-[#777]">Amount</div>
                    <div className="text-white">
                        {activeTab === ReserveAction.RESERVE
                            ? `Amount ${cysBalance}`
                            : `Reserved Amount ${depositMap?.proverHmAmount || 0}`
                        }
                    </div>
                </div>
            </div>

            {/* 提款信息 - 仅在提款选项卡显示 */}
            {activeTab === ReserveAction.WITHDRAW && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[#777]">Withdraw Amount</span>
                        <span className="text-white">{amount || '-'} CYS</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[#777]">Estimated arrival time</span>
                        <span className="text-white">{dayjs().add(1, 'm').format('YYYY-MM-DD')}</span>
                    </div>
                </div>
            )}

            {/* 操作按钮 */}
            <Button
                needLoading
                loading={activeTab === ReserveAction.RESERVE ? reserveLoading : withdrawLoading}
                type="light"
                className="w-full py-4 rounded-lg text-base font-medium"
                onClick={activeTab === ReserveAction.RESERVE ? handleReserve : handleWithdraw}
                disabled={!Number(amount) || Number(amount) < 100}
            >
                {activeTab === ReserveAction.RESERVE ? (Number(amount) < 100 ? "Amount must be greater than 100 CYS" : "RESERVE") : "WITHDRAW"}
            </Button>

            {
                (activeTab === ReserveAction.WITHDRAW && BigNumber(depositMap?.proverHmAmount).minus(amount).lte(100)) ? (
                    <div className="text-sm text-danger mt-2 text-center">
                        Your Verifier/Prover status will be deactivated
                    </div>
                ) : null
            }
        </Modal>
    );
};

export default ReserveModal;