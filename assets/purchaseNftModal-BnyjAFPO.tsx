import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import useModalState from "@/hooks/useModalState";
import Copy from "@/components/Copy";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { useReadContracts } from "wagmi";
import { useWriteContract } from "@/hooks/useWriteContract";
import { purchaseChainId, USDC, purchaseNftContract, purchaseNftAbi, USDCDecimal } from "@/config";
import useAccount from "@/hooks/useAccount";
import { cn } from "@nextui-org/react";
import Input from "@/components/Input";



// NFT 信息接口
interface NFTInfo {
    id: string;
    name: string;
    rewards: string;
    lock: string;
    price: string;
    supply: string;
    chip: string;
    computingPower: string;
    image?: string;
    tokenId: string;
}

// 优惠券类型
interface Voucher {
    code: string;
    discount: string;
    disabled?: boolean;
}

// 模式选择选项
interface PurposeOption {
    id: string;
    title: string;
    description: string;
    selected?: boolean;
    disabled?: boolean;
}

// 购买步骤枚举
enum PurchaseStep {
    DETAILS = 0,
    CONFIRMATION = 1,
    PURPOSE = 99,
}

// 默认优惠券选项
const defaultVouchers: Voucher[] = [
    { code: "0% OFF", discount: "0" },
    { code: "5% OFF", discount: "5", disabled: true },
    { code: "10% OFF", discount: "10", disabled: true },
    { code: "15% OFF", discount: "15", disabled: true }
];

const PurchaseNftModal = () => {
    // 获取模态框状态
    const { visible, setVisible, data } = useModalState({
        eventName: "modal_purchase_nft_visible",
    });

    // 用户钱包信息
    const { address: userAddress, inviteCode } = useAccount();

    // 基础状态（用户输入项）
    const [currentStep, setCurrentStep] = useState<PurchaseStep>(PurchaseStep.DETAILS);
    const [nft, setNft] = useState<NFTInfo | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher>(defaultVouchers[0]);
    const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>(defaultVouchers);
    const [voucherOpen, setVoucherOpen] = useState<boolean>(false);
    const [purposeOptions, setPurposeOptions] = useState<PurposeOption[]>([
        {
            id: "zk",
            title: "CYSIC ZK",
            description: "Become a Cysic ZK Prover (free of staking) and start earning CYS/CGT now.",
            selected: true,
        },
        {
            id: "ai",
            title: "CYSIC AI",
            description: "Support Cysic AI and earn a share of future AI-generated rewards.",
            disabled: true,
        },
        {
            id: "mining",
            title: "CYSIC MINING",
            description: "Support Cysic Mining and get extra token rewards after miner launches.",
            disabled: true,
        }
    ]);

    const { writeContractAsync, isPending: isWritePending } = useWriteContract();
    const [writeError, setWriteError] = useState<string>("");

    // 使用useReadContracts获取余额和授权信息
    const { data: contractsData, isLoading: isContractsLoading, refetch: refetchContractsData } = useReadContracts({
        contracts: userAddress ? [
            {
                address: USDC[purchaseChainId] as `0x${string}`,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [userAddress as `0x${string}`],
                chainId: purchaseChainId,
            },
            {
                address: USDC[purchaseChainId] as `0x${string}`,
                abi: erc20Abi,
                functionName: 'allowance',
                args: [
                    userAddress as `0x${string}`,
                    purchaseNftContract[purchaseChainId] as `0x${string}`,
                ],
                chainId: purchaseChainId,
            },
        ] : [],
        query: {
            enabled: !!userAddress && visible,
        },
    });

    // 使用useMemo计算派生状态
    const {
        formattedBalance,
        totalPrice,
        totalPriceWei,
        needApprove,
        hasInsufficientBalance,
        errorMessage,
        isLoading
    } = useMemo(() => {
        // 合约数据
        const balance = contractsData?.[0]?.result as bigint || BigInt(0);
        const allowance = contractsData?.[1]?.result as bigint || BigInt(0);
        const formattedBalance = formatUnits(balance, USDCDecimal);
        
        // 如果没有NFT数据，返回初始值
        if (!nft) {
            return {
                formattedBalance,
                totalPrice: "0",
                totalPriceWei: BigInt(0),
                needApprove: false,
                hasInsufficientBalance: false,
                errorMessage: "",
                isLoading: isContractsLoading || isWritePending
            };
        }
        
        // 计算总价格
        let priceValue = parseFloat(nft.price) * quantity;
        if (selectedVoucher) {
            const discount = parseInt(selectedVoucher.discount);
            priceValue = priceValue * (1 - discount / 100);
        }
        const totalPrice = priceValue.toFixed(2);
        
        // 转换为BigInt进行比较 - 只保留整数部分用于合约交互
        const totalPriceInteger = Math.floor(priceValue).toString();
        const totalPriceWei = parseUnits(totalPriceInteger, USDCDecimal);
        
        // 检查余额和授权状态
        const insufficientBalance = balance < totalPriceWei;
        const needApproval = allowance < totalPriceWei;
        
        // 构建错误消息
        let error = writeError;
        if (insufficientBalance) {
            error = `Insufficient USDC balance. You have ${formattedBalance} USDC, but need ${totalPrice} USDC.`;
        }
        
        return {
            formattedBalance,
            totalPrice,
            totalPriceWei,
            needApprove: needApproval,
            hasInsufficientBalance: insufficientBalance,
            errorMessage: error,
            isLoading: isContractsLoading || isWritePending
        };
    }, [contractsData, nft, quantity, selectedVoucher, isContractsLoading, isWritePending, writeError]);
    
    // 在弹窗打开时初始化状态
    useEffect(() => {
        if (visible && data?.nft) {
            setNft(data.nft as NFTInfo);
            setWriteError("");
            setQuantity(1);
            setSelectedVoucher(defaultVouchers[0]);
            setVoucherOpen(false);
            
            // 根据用户状态设置可用优惠券
            setAvailableVouchers(defaultVouchers);
            
            // 如果有指定的初始步骤
            if (data.step !== undefined) {
                setCurrentStep(Number(data.step) as PurchaseStep);
            } else {
                setCurrentStep(PurchaseStep.DETAILS);
            }
        }
    }, [visible, data]);

    // 处理优惠券选择
    const handleVoucherSelect = (voucher: Voucher) => {
        if (!voucher.disabled) {
            setSelectedVoucher(voucher);
            setVoucherOpen(false);
        }
    };

    // 处理授权操作
    const handleApprove = async () => {
        if (!userAddress || !nft) return;
        setWriteError("");

        try {
            await writeContractAsync({
                address: USDC[purchaseChainId] as `0x${string}`,
                abi: erc20Abi,
                functionName: 'approve',
                args: [purchaseNftContract[purchaseChainId] as `0x${string}`, totalPriceWei],
                chainId: purchaseChainId,
            });

            // 授权成功后重新获取授权情况
            await refetchContractsData();
        } catch (error) {
            console.error("Approval error:", error);
            setWriteError(`Failed to approve USDC: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    // 处理购买操作
    const handlePurchase = async () => {
        if (!userAddress || !nft || !nft.id) return;
        setWriteError("");

        try {
            const purposeData = '0x';

            const res = await writeContractAsync({
                address: purchaseNftContract[purchaseChainId] as `0x${string}`,
                abi: purchaseNftAbi,
                functionName: 'userMint',
                args: [nft.id, quantity, purposeData],
                chainId: purchaseChainId,
            });

            // 购买成功，显示确认页面
            setCurrentStep(PurchaseStep.CONFIRMATION);
            return res;
        } catch (error) {
            console.error("Purchase error:", error);
            setWriteError(`Failed to purchase NFT: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    // 选择用途
    const handlePurposeSelect = (id: string) => {
        setPurposeOptions(
            purposeOptions.map(option => ({
                ...option,
                selected: option.id === id
            }))
        );
    };

    // 继续购买流程
    const handleContinue = async () => {
        setWriteError("");
       
        if (needApprove) {
            await handleApprove();
        } else {
            const res = await handlePurchase();
            console.log('res', res);
        }
        // if (currentStep === PurchaseStep.DETAILS) {
        //     // 进入第二步前重新检查余额和授权
        //     await refetchContractsData();
        //     setCurrentStep(PurchaseStep.PURPOSE);
        // } else if (currentStep === PurchaseStep.PURPOSE) {
        //     // 根据是否需要授权执行不同操作
        //     if (needApprove) {
        //         await handleApprove();
        //     } else {
        //         await handlePurchase();
        //     }
        // }
    };

    // 返回上一步
    const handleBack = () => {
        if (currentStep === PurchaseStep.PURPOSE) {
            setCurrentStep(PurchaseStep.DETAILS);
        }
    };

    // 关闭模态框并重置状态
    const handleClose = () => {
        setVisible(false);
        setTimeout(resetState, 300);
    };

    // 重置所有状态
    const resetState = () => {
        setCurrentStep(PurchaseStep.DETAILS);
        setQuantity(1);
        setSelectedVoucher(defaultVouchers[0]);
        setVoucherOpen(false);
        setPurposeOptions(purposeOptions.map(option => ({
            ...option,
            selected: option.id === "zk"
        })));
        setWriteError("");
    };

    // 获取按钮文本
    const getContinueButtonText = useMemo(() => {
        if (currentStep === PurchaseStep.DETAILS) {
            return "CONTINUE TO PURCHASE";
        }
        
        return needApprove ? "APPROVE USDC" : "COMPLETE PURCHASE";
    }, [currentStep, needApprove]);

    // 获取当前步骤对应的标题
    const getModalTitle = useMemo(() => {
        switch (currentStep) {
            case PurchaseStep.DETAILS:
                return "PURCHASE NFT";
            case PurchaseStep.PURPOSE:
                return "PLEASE SELECT YOUR PURPOSE";
            case PurchaseStep.CONFIRMATION:
                return "PURCHASE CONFIRMATION";
            default:
                return "PURCHASE NFT";
        }
    }, [currentStep]);

    return (
        <Modal
            isOpen={visible}
            onClose={handleClose}
            title={getModalTitle}
            className="max-w-4xl"
        >
            {nft ? (
                <>
                    {/* 错误消息展示 */}
                    {errorMessage && (
                        <div className="bg-red-900/20 border border-error rounded-md p-3 mb-4 flex items-start">
                            <AlertCircle className="text-error mr-2 flex-shrink-0 mt-0.5" size={16} />
                            <div className="text-error">{errorMessage}</div>
                        </div>
                    )}

                    {/* 第一步：NFT 详情 */}
                    {currentStep === PurchaseStep.DETAILS && (
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* 左侧图片和详细参数 */}
                            <div className="md:w-1/3">
                                <div className="w-full aspect-square bg-sub rounded-md mb-4">
                                    {nft.image && <img src={nft.image} alt={nft.name} className="w-full h-full object-cover rounded-md" />}
                                </div>
                                <div className="border-t border-gray-700 pt-4 mt-2">
                                    <h3 className="text-lg font-light mb-4">Detailed Parameters</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sub">Chip</span>
                                            <span className="text-white">{nft.chip}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sub">Computing Power</span>
                                            <span className="text-white">{nft.computingPower}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 右侧详情和购买选项 */}
                            <div className="md:w-2/3">
                                <h1 className="unbounded-36-300 mb-4">{nft.name}</h1>

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sub">Supply</span>
                                    <span className="text-white">{nft.supply}</span>
                                </div>

                                <div className="mb-6">
                                    <div className="text-3xl text-white">{nft.rewards} <span className="text-sub">CYS</span></div>
                                    <div className="text-sub mt-1">{nft.lock}</div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sub mb-2">Quantity</label>
                                        <div className="flex items-center border border-gray-700 rounded-md overflow-hidden">
                                            <Input
                                                type="number"
                                                value={quantity}
                                                onChange={(v: string | number) => setQuantity(Number(v))}
                                                className="bg-[#0E0E0E] text-white px-4 py-3 w-full focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sub mb-2">Voucher</label>
                                        <div className="relative">
                                            <div 
                                                className="bg-[#0E0E0E] border border-gray-700 rounded-md p-4 flex justify-between items-center cursor-pointer"
                                                onClick={() => setVoucherOpen(!voucherOpen)}
                                            >
                                                <span className="text-white">{selectedVoucher?.code || "No voucher"}</span>
                                                <span>▼</span>
                                            </div>
                                            
                                            {/* 优惠券下拉菜单 */}
                                            {voucherOpen && (
                                                <div className="absolute w-full mt-1 bg-[#0E0E0E] border border-gray-700 rounded-md z-10">
                                                    {availableVouchers.map((voucher) => (
                                                        <div 
                                                            key={voucher.code}
                                                            className={`p-3 hover:bg-gray-800 cursor-pointer ${voucher.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            onClick={() => handleVoucherSelect(voucher)}
                                                        >
                                                            {voucher.code}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-8 mb-6">
                                    <span className="text-xl text-sub">Total Price</span>
                                    <span className="text-3xl text-white">{totalPrice} USDC</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 第二步：选择用途 */}
                    {currentStep === PurchaseStep.PURPOSE && (
                        <div>
                            <button onClick={handleBack} className="flex items-center text-white mb-6">
                                <ArrowLeft size={20} className="mr-2" />
                                <span>Back</span>
                            </button>

                            <p className="text-sub mb-6">You will unlock additional benifits based on the category that you choose</p>

                            <div className="space-y-2 mb-6">
                                {purposeOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className={cn(`border ${option.selected ? 'border-blue-500' : 'border-gray-700'} rounded-lg p-6 cursor-pointer`, option.disabled && 'opacity-50 cursor-not-allowed')}
                                        onClick={() => !option.disabled && handlePurposeSelect(option.id)}
                                    >
                                        <div className="flex items-center mb-1">
                                            <div className={`w-6 h-6 rounded-full border ${option.selected ? 'border-blue-500 bg-blue-500' : 'border-gray-400'} flex items-center justify-center mr-3`}>
                                                {option.selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                            <h3 className="unbounded-16-300">{option.title}</h3>
                                        </div>
                                        <p className="text-sm !font-[400] ml-9">{option.description}</p>
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-white mb-2">Summary</h3>
                            <div className="border-t border-gray-700 pt-2">
                                <div className="space-y-1 mb-6 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-sub">Price</span>
                                        <span className="text-white">{nft.price} USDC</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sub">Quantity</span>
                                        <span className="text-white">{quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sub">Voucher</span>
                                        <span className="text-white">{selectedVoucher?.discount}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sub">Total Price</span>
                                        <span className="text-white">{totalPrice} USDC</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 第三步：购买确认 */}
                    {currentStep === PurchaseStep.CONFIRMATION && (
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* 左侧图片 */}
                            <div className="md:w-1/3">
                                <div className="w-full aspect-square bg-sub rounded-md">
                                    {nft.image && <img src={nft.image} alt={nft.name} className="w-full h-full object-cover rounded-md" />}
                                </div>
                            </div>

                            {/* 右侧确认信息 */}
                            <div className="md:w-2/3 flex flex-col">
                                <h1 className="unbounded-36-300 mb-2">{nft.name} x{quantity}</h1>
                                <h2 className="text-2xl text-white mb-8">Purchase Confirmed!</h2>

                                <div className="bg-[#0E0E0E] border border-gray-700 rounded-lg p-6 mb-6">
                                    <p className="text-sub text-center mb-2">Invite Code</p>
                                    <div className="flex justify-center items-center">
                                        <Copy value={inviteCode || ''} className="text-4xl text-white mr-3">{inviteCode}</Copy>
                                    </div>
                                </div>

                                <p className="text-sub text-center mb-8">*Valid for all services within Cysic Space</p>

                                <div className="text-center mb-8">
                                    <p className="text-white text-lg mb-2">
                                        At this moment, you have become a part of <span className="text-blue-400">Cysic ZK Prover</span>!
                                    </p>
                                    <p className="text-white">Your NFT has already started generating rewards for you!</p>
                                </div>

                                <Button
                                    type="light"
                                    className="flex items-center justify-center gap-2 w-full rounded-lg py-4"
                                >
                                    PLEASE CLICK HERE TO FURTHER EXPLORE CYSIC ZK
                                    <ArrowRight size={20} />
                                </Button>

                                <p className="text-center text-white mt-6">
                                    And you can always visit the <span className="text-blue-400">User Portal - Cysic ZK</span> to
                                    view all your NFTs and earning information.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 底部按钮 - 仅在第一步和第二步显示 */}
                    {(currentStep === PurchaseStep.DETAILS || currentStep === PurchaseStep.PURPOSE) && (
                        <div className="mt-8">
                            <Button
                                needLoading
                                type="light"
                                className="w-full py-4 rounded-lg text-base font-medium"
                                onClick={handleContinue}
                                disabled={hasInsufficientBalance || isLoading}
                                loading={isLoading}
                            >
                                {getContinueButtonText}
                            </Button>
                            {userAddress && (
                                <div className="mt-4 flex justify-end items-center gap-2">
                                    <span className="text-sub">Your USDC Balance:</span>
                                    <span className={hasInsufficientBalance ? "text-error" : "text-white"}>
                                        {formattedBalance} USDC
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="p-4 text-center text-sub">
                    Loading NFT information...
                </div>
            )}
        </Modal>
    );
};

export default PurchaseNftModal;