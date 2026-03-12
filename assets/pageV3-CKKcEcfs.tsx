import { ArrowRight, ChevronLeft, ChevronsUp } from "lucide-react";
import GradientBorderCard from "@/components/GradientBorderCard";
import Button from "@/components/Button";
import { formatReward, handleConvertModal, handleMultiplierModal, handleRewardsDetailModal, handleStakeModal, handleVoucherModal } from "@/utils/tools";
import { ReactNode } from "react";
import Copy from "@/components/Copy";

import NFTProverCard from "@/components/NFTCard";
import { cn } from "@nextui-org/react";
import useCosmos from "@/models/_global/cosmos";
import useUser from "@/models/user";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import ZkTasks from "@/routes/components/usePortal/cards/ZkTasks";
import JoinZkPhase3 from "@/routes/components/JoinZkPhase3";
import ZkBalanceCard from "@/routes/components/usePortal/cards/ZkBalanceCard";
import VoucherInfo from "@/routes/components/usePortal/cards/VoucherInfo";
import CysicBalance from "@/routes/components/usePortal/cards/CysicBalance";
import Profile from "@/routes/components/Profile";
import SocialAccount from "@/routes/components/SocialAccount";
import InviteCodeCard from "@/routes/components/usePortal/cards/InviteCodeCard";

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


// 用户详情页面
const UserDetailsPage = () => {
    const { balanceMap } = useCosmos()
    const cgtBalance = balanceMap?.CGT?.hm_amount || 0
    const cysBalance = balanceMap?.CYS?.hm_amount || 0

    const {
        balance,
        voucherCnt = 0
    } = useUser();

    return (
        <>
            <div className="container mx-auto relative z-10 py-12">
                {/* 返回按钮 */}
                <Link to={"/userPortal"} className="flex items-center text-sub mb-6 hover:text-white">
                    <ChevronLeft size={20} />
                    <span>USER PORTAL</span>
                </Link>


                <div className="flex flex-wrap gap-4">
                    {/* total rewards */}
                    <div className="flex-[5] min-w-[250px]">
                        <ZkBalanceCard />
                    </div>

                    {/* balance / voucher */}
                    <div className="flex-[4] min-w-[250px] flex flex-col gap-4">
                        <CysicBalance />
                        <VoucherInfo />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-12">
                    <div className="flex-1"><Profile /></div>
                    <div className="flex-1"><SocialAccount /></div>
                    <div className="flex-1"><InviteCodeCard /></div>                    
                </div>

                {/* DETAILS 标题 */}
                <h2 className="unbounded-30-300 my-12 text-center">DETAILS</h2>

                <div className="flex flex-col gap-4 w-full">
                    {/* 第一行 details 部分 */}
                    <div className={cn("flex gap-4 w-full", isMobile ? "flex-col" : "")}>
                        {/* 任务完成度卡片 */}
                        <GradientBorderCard borderRadius={8} className="flex-1 w-full">
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
                        <div className="flex-1" />
                        <div className="flex-1" />
                    </div>

                    {/* 验证器和证明者状态 */}
                    <ZkTasks />
                </div>

                <JoinZkPhase3 className="pt-12" slogen="Join Cysic ZK " />
            </div>
        </>
    );
};

export default UserDetailsPage; 