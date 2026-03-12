import { ArrowRight, ChevronLeft, ChevronsUp } from "lucide-react";
import GradientBorderCard from "@/components/GradientBorderCard";
import Button from "@/components/Button";
import { formatReward, handleConvertModal, handleMultiplierModal, handleRewardsDetailModal, handleStakeModal } from "@/utils/tools";
import { ReactNode } from "react";
import Copy from "@/components/Copy";

import NFTProverCard from "@/components/NFTCard";
import { cn } from "@nextui-org/react";
import useCosmos from "@/models/_global/cosmos";
import useUser from "@/models/user";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";

// 统计卡片组件
interface StatCardProps {
    title: string | ReactNode;
    children: ReactNode;
    rightActions?: ReactNode[];
    className?: string;
}

const StatCard = ({ title, children, rightActions = [], className = "" }: StatCardProps) => (
    <GradientBorderCard borderRadius={8} className={`h-full ${className}`}>
        <div className="px-6 py-4 h-full w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="unbounded-16-300">{title}</div>
                <div className="flex items-center gap-4">
                    {rightActions.map((action, index) => (
                        <div key={index}>{action}</div>
                    ))}
                </div>
            </div>
            {children}
        </div>
    </GradientBorderCard>
);

// 详情指标卡片
interface DetailCardProps {
    title: string;
    subtitle?: string;
    value: ReactNode;
    moreLink?: string;
    className?: string;
    status?: Array<{
        label: string;
        value: string;
        color: string;
    }>;
}

const DetailCard = ({ title, subtitle, value, moreLink, status, className }: DetailCardProps) => (
    <GradientBorderCard borderRadius={8} className={cn("h-full w-full flex-1", className)}>
        <div className="px-6 py-4 h-full w-full">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <div className="unbounded-16-300">{title}</div>
                    {subtitle && <div className="text-sm !font-[400] text-sub">{subtitle}</div>}
                </div>
                {moreLink && (
                    <a href={moreLink} className="flex items-center text-sub text-xs hover:text-white">
                        {moreLink} <ArrowRight size={12} className="ml-1" />
                    </a>
                )}
            </div>

            <div className="flex justify-between items-center">
                <div className="text-2xl !font-light">{value}</div>
            </div>

            {status && (
                <div className="mt-4 flex flex-col gap-4">
                    {status.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full mr-2 ${item.color}`}></span>
                            <span className="unbounded-14-300">{item.label}</span>
                            <span className="ml-auto text-sm text-sub">{item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </GradientBorderCard>
);

// 速度指示器组件
const SpeedIndicator = () => (
    <div className="w-full mt-2">
        <div className="relative w-full h-3 bg-[#FFFFFF4D] rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-green-400"></div>
            <div className="absolute top-1/2 -translate-y-1/2 right-1/3 w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="flex justify-end mt-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="unbounded-14-400">HIGH SPEED</span>
            </div>
            <div className="flex items-center ml-4 text-xs cursor-pointer" onClick={handleMultiplierModal}>
                <span className="text-sub text-sm !font-[400]">SPEED UP</span>
                <ChevronsUp size={12} className="ml-1 text-sub" />
            </div>
        </div>
    </div>
);

// 用户详情页面
const UserDetailsPage = () => {
    const { balanceMap } = useCosmos()
    const cgtBalance = balanceMap?.CGT?.hm_amount || 0
    const cysBalance = balanceMap?.CYS?.hm_amount || 0

    const { 
        name, 
        avatarUrl, 
        inviteCode, 
        balance,
        rewardList = [],
        socialAccount,
        voucherCnt = 0,  // 添加代金券数量
        nftCnt = 0       // 添加NFT数量
    } = useUser();

    return (
        <>
            <div className="container mx-auto relative z-10 py-12">
                {/* 返回按钮 */}
                <Link to={"/nft/userPortal"} className="flex items-center text-sub mb-6 hover:text-white">
                    <ChevronLeft size={20} />
                    <span>GENERAL</span>
                </Link>

                {/* 第一行：奖励和余额 */}
                <div className={cn("flex gap-4 flex-col lg:flex-row")}>
                    {/* 总奖励 */}
                    <div className="flex-[3]">
                        <StatCard
                            title={<div className="unbounded-16-300" >TOTAL REWARDS</div>}
                            rightActions={[
                                <div onClick={() => handleRewardsDetailModal({ phase: "phase1" })} className="cursor-pointer flex items-center text-sub text-sm hover:text-white">
                                    DETAILS <ArrowRight size={12} className="ml-1" />
                                </div>
                            ]}
                        >
                            <div className="flex flex-col gap-6">
                                <div className={cn("flex gap-6", isMobile ? "flex-col" : "items-center justify-end")}>
                                    <div className="unbounded-30-300">{formatReward(cysBalance, 2)} CYS</div>
                                    <Button type="light" className="rounded py-3 px-4" onClick={handleConvertModal}>
                                        CONVERT
                                    </Button>
                                </div>

                                <div className="h-px w-full bg-white"></div>

                                <div className={cn("flex gap-6", isMobile ? "flex-col" : "items-center justify-end")}>
                                    <div className="unbounded-30-300">{formatReward(cgtBalance, 2)} CGT</div>
                                    <Button type="light" className="rounded py-3 px-4" onClick={() => { handleStakeModal() }}>
                                        STAKE
                                    </Button>
                                </div>
                            </div>
                        </StatCard>
                    </div>

                    <div className="flex-[2] flex flex-col gap-4">
                        {/* CYSIC 余额 */}
                        <StatCard
                            title="CYSIC BALANCE"
                            rightActions={[
                                <Link to="/bridge" target="_blank" className="flex items-center text-sub text-xs hover:text-white">
                                    BRIDGE <ArrowRight size={12} className="ml-1" />
                                </Link>,
                                <a href="#" className="flex items-center text-sub text-xs hover:text-white">
                                    HISTORY <ArrowRight size={12} className="ml-1" />
                                </a>
                            ]}
                        >
                            <div className={cn("unbounded-30-300", isMobile ? "text-left" : "text-right")}>{balance ? `${balance.amount} ${balance.symbol}` : "0 USDC"}</div>
                        </StatCard>

                        {/* 代金券 */}
                        <StatCard
                            title="VOUCHER"
                            rightActions={[
                                <a href="#" className="flex items-center text-sub text-xs hover:text-white">
                                    VIEW ALL <ArrowRight size={12} className="ml-1" />
                                </a>,
                                <Link to="/nft/socialTask" className="flex items-center text-sub text-xs hover:text-white">
                                    SOCIAL TASKS <ArrowRight size={12} className="ml-1" />
                                </Link>
                            ]}
                        >
                            <div className={cn("unbounded-30-300", isMobile ? "text-left" : "text-right")}>{voucherCnt}</div>
                        </StatCard>
                    </div>
                </div>

                {/* DETAILS 标题 */}
                <h2 className="unbounded-30-300 my-12 text-center">DETAILS</h2>

                <div className="flex flex-col gap-4 w-full">
                    {/* 第一行 details 部分 */}
                    <div className={cn("flex gap-4 w-full", isMobile ? "flex-col" : "")}>
                        {/* 邀请码卡片 */}
                        <GradientBorderCard borderRadius={8} className="flex-[4] w-full">
                            <div className="w-full px-6 py-4 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start w-full">
                                    <div className="unbounded-16-300">INVITE<br />CODE</div>
                                    <div className="unbounded-16-300">SUCCESSFUL<br />INVITES</div>
                                </div>

                                <div className="flex justify-between items-center w-full mt-8">
                                    <div className="flex items-center gap-2">
                                        <Copy value={inviteCode} className="unbounded-24-300">
                                            {inviteCode || '-'}
                                        </Copy>
                                    </div>
                                    <div className="unbounded-24-300">-</div>
                                </div>
                            </div>
                        </GradientBorderCard>

                        {/* 乘数卡片 */}
                        <GradientBorderCard borderRadius={8} className="flex-[3] w-full">
                            <div className="w-full px-6 py-4 h-full flex flex-col justify-between">
                                <div className="flex items-center gap-1">
                                    <div className="unbounded-16-300">MULTIPLIER</div>
                                    <div className="text-sub text-xs">ⓘ</div>
                                </div>

                                {/* 进度条 */}
                                <div className="relative w-full h-2 bg-gray-500 rounded-full overflow-hidden">
                                    <div className="absolute inset-0 left-0 w-3/4 h-full bg-gradient-to-r from-purple-500 via-blue-400 to-green-300 rounded-full"></div>
                                    {/* <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-2 h-2 bg-white rounded-full"></div> */}
                                </div>

                                {/* HIGH SPEED 指示器 */}
                                <div className={cn("flex items-center gap-2", isMobile ? "self-start" : "self-end")}>
                                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                    <span className="unbounded-14-400">HIGH SPEED</span>
                                </div>
                                <div className="ml-4 flex items-center gap-1 self-end cursor-pointer" onClick={handleMultiplierModal}>
                                    <span className="text-sm text-sub text-sub">SPEED UP</span>
                                    <ArrowRight size={12} />
                                </div>
                            </div>
                        </GradientBorderCard>

                        {/* 任务完成度卡片 */}
                        <GradientBorderCard borderRadius={8} className="flex-[2] w-full">
                            <div className="w-full px-6 py-4 h-full flex flex-col justify-between gap-4">
                                <div className="unbounded-16-300">MY TASK COMPLETION</div>
                                <div className="unbounded-24-300 text-right">2500</div>

                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex justify-between items-center w-full">
                                        <div className="text-sm">Prover</div>
                                        <div className="text-sm text-sub">1000</div>
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <div className="text-sm">Verifier</div>
                                        <div className="text-sm text-sub">1500</div>
                                    </div>
                                </div>
                            </div>
                        </GradientBorderCard>
                    </div>

                    {/* 验证器和证明者状态 */}
                    <div className={cn("flex gap-4 w-full", isMobile ? "flex-col" : "")}>
                        {/* ZK 验证器 */}
                        <DetailCard
                            title="ZK VERIFIER"
                            moreLink="MORE ABOUT ZK VERIFIER"
                            value={<div></div>}
                            status={[
                                { label: "STANDARD ACTIVE", value: "", color: "bg-lightBrand" },
                                { label: "MOBILE INACTIVE", value: "", color: "bg-error" }
                            ]}
                        />

                        {/* ZK 证明者 */}
                        <DetailCard
                            title="ZK PROVER"
                            moreLink="MORE ABOUT ZK PROVER"
                            value={<div></div>}
                            status={[
                                { label: "NFT ACTIVE", value: "", color: "bg-lightBrand" },
                                { label: "SELF INACTIVE", value: "", color: "bg-error" }
                            ]}
                        />

                        {/* ZK 项目 */}
                        <DetailCard
                            title="ZK PROJECT"
                            moreLink="MORE ABOUT ZK PROJECT"
                            value={<div></div>}
                            status={[
                                { label: "100 ONGOING PROJECTS", value: "", color: "bg-lightBrand" },
                                { label: "10 PROJECTS UNDER REVIEW", value: "", color: "bg-warning" }
                            ]}
                        />
                    </div>
                </div>

                {/* 我的 ZK 收割机 */}
                <div className="mb-12">
                    <div className="flex flex-col items-center my-12 gap-4">
                        <h2 className="unbounded-30-300">MY ZK HARVESTER</h2>
                        <a href="#" className="flex items-center text-sub text-sm hover:text-white">
                            ORDER HISTORY <ArrowRight size={16} className="ml-1" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NFTProverCard
                            status={{ nft: true }}
                        />

                        <NFTProverCard
                            status={{ nft: false }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetailsPage; 