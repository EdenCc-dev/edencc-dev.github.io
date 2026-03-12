import { ArrowRight, ExternalLink } from "lucide-react";
import GradientBorderCard from "@/components/GradientBorderCard";
import { ReactNode, useEffect } from "react";
import { formatReward, getImageUrl, handleConvertModal, handleSignIn, handleStakeModal, handleVoucherModal } from "@/utils/tools";
import Button from "@/components/Button";
import Copy from "@/components/Copy";
import { Link, useNavigate } from "react-router-dom";
import useUser from "@/models/user";
import useAccount from "@/hooks/useAccount";
import useCosmos from "@/models/_global/cosmos";
import { isMobile } from "react-device-detect";
import { cn } from "@nextui-org/react";
import Profile from "@/routes/components/Profile";
import SocialAccount from "@/routes/components/SocialAccount";

// 信息卡片组件
interface InfoCardProps {
    title: string;
    children: ReactNode;
    rightAction?: ReactNode;
    className?: string;
}

const InfoCard = ({ title, children, rightAction, className = "" }: InfoCardProps) => (
    <GradientBorderCard borderRadius={8} className={`h-full relative ${className}`}>
        <div className="h-full flex flex-col justify-between px-6 py-4 w-full gap-4">
            <div className="text-base !font-light uppercase font-medium ">{title}</div>
            <div className="flex-1 flex flex-col justify-between w-full gap-4">
                <div className="flex-1 flex items-center ">
                    {children}
                </div>
                {rightAction && (
                    <div className="">
                        {rightAction}
                    </div>
                )}
            </div>
        </div>
    </GradientBorderCard>
);

// 主要组件
const UserPortal = () => {
    const navigate = useNavigate();
    const { balanceMap } = useCosmos()


    const { user } = useAccount()
    const { 
        inviteCode, 
        balance,
        voucherCnt = 0,  // 添加代金券数量
        nftCnt = 0       // 添加NFT数量
    } = user || {};
    
    // 格式化CYS和CGT余额
    // const cysReward = rewardList?.find(item => item.symbol === "CYS")?.amount || "0";
    // const cgtReward = rewardList?.find(item => item.symbol === "CGT")?.amount || "0";

    const cysReward = formatReward(balanceMap?.CYS?.hm_amount || "0", 2);
    const cgtReward = formatReward(balanceMap?.CGT?.hm_amount || "0", 2);


    return (
        <>

            {/* content */}
            <div className="container mx-auto relative z-10 pt-20 pb-16">
                {/* title */}
                <h1 className="title text-7xl md:text-[120px] !font-[200] mb-24 text-center">USER PORTAL</h1>

                {/* GENERAL 部分 */}
                <div className="mb-4">
                    <h2 className={cn("title !font-light uppercase mb-12 text-center", isMobile ? "!text-2xl" : "text-4xl")}>GENERAL</h2>

                    <div className="flex flex-wrap gap-4">
                        {/* 个人资料卡片 */}
                        <div className="flex-1 min-w-[250px]">
                            <Profile />
                        </div>

                        {/* 邀请码卡片 */}
                        <div className="flex-1 min-w-[250px]">
                            <InfoCard
                                title="INVITE CODE"
                                rightAction={
                                    <Link to='/zk/invite' className="flex items-center text-sub justify-end hover:text-white text-sm font-[400]">
                                        INVITE DETAILS <ArrowRight size={12} className="ml-1" />
                                    </Link>
                                }
                            >
                                <Copy className={cn("!font-light justify-end title w-full", isMobile ? "!text-2xl" : "text-2xl ")} value={inviteCode || ''}>
                                    {inviteCode || '-'}
                                </Copy>
                            </InfoCard>
                        </div>

                        {/* 余额卡片 */}
                        <div className="flex-1 min-w-[250px]">
                            <InfoCard
                                title="BALANCE"
                                rightAction={
                                    <Link to="/zk/serviceHub" className="flex items-center text-sub justify-end hover:text-white text-sm font-[400]">
                                        HISTORY <ArrowRight size={12} className="ml-1" />
                                    </Link>
                                }
                            >
                                <div className={cn("!font-light text-right title w-full", isMobile ? "!text-2xl" : "text-2xl")}>
                                    {balance ? `${balance.amount} ${balance.symbol}` : "0 USDC"}
                                </div>
                            </InfoCard>
                        </div>

                        {/* 代金券卡片 */}
                        <div className="flex-1 min-w-[250px]">
                            <InfoCard
                                title="VOUCHER"
                                rightAction={
                                    <div onClick={handleVoucherModal} className="cursor-pointer flex items-center text-sub justify-end hover:text-white text-sm font-[400]">
                                        VIEW ALL <ArrowRight size={12} className="ml-1" />
                                    </div>
                                }
                            >
                                <div className={cn("!font-light text-right title w-full", isMobile ? "!text-2xl" : "text-2xl")}>{voucherCnt}</div>
                            </InfoCard>
                        </div>
                    </div>
                </div>

                {/* 奖励信息和社交账户 */}
                <div className="flex flex-wrap gap-4 mb-12">
                    {/* 总奖励信息 */}
                    <div className="flex-[2] min-w-[300px]">
                        <GradientBorderCard borderRadius={8} className="h-full">
                            <div className="py-4 px-6 w-full h-full">
                                <div className="flex justify-between items-center mb-4">
                                    <div className={cn("text-base !font-light title", isMobile ? "!text-base" : "")}>TOTAL REWARDS</div>
                                    <Link to="/zk/serviceHub" className="flex items-center text-sub text-sm hover:text-white">
                                        DETAILS <ArrowRight size={12} className="ml-1" />
                                    </Link>
                                </div>

                                <div className={cn("flex gap-6 justify-between", isMobile ? "flex-col" : "")}>
                                    <div className={cn("min-w-[18.75rem] flex flex-col gap-6 border-white", isMobile ? "border-b pb-6   " : "border-r pr-6")}>
                                        <div className="title !text-3xl !font-light">{cysReward} CYS</div>
                                        <Button onClick={handleConvertModal} type="light" className={cn("min-w-fit self-end text-base py-2 px-3 rounded-md", isMobile ? "w-full" : "w-[8.125rem]")}>
                                            CONVERT
                                        </Button>
                                    </div>

                                    <div>
                                        <div className="flex flex-col gap-6">
                                            <div className="title !text-3xl !font-light">{cgtReward} CGT</div>
                                            <Button onClick={handleStakeModal} type="light" className={cn("min-w-fit self-end text-base py-2 px-3 rounded-md", isMobile ? "w-full" : "w-[8.125rem]")}>
                                                STAKE
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GradientBorderCard>
                    </div>

                    {/* 社交账户 */}
                    <div className="flex-1 min-w-[300px]">
                       <SocialAccount />
                    </div>

                    {/* 我的NFT */}
                    <div className="flex-1 min-w-[300px]">
                        <GradientBorderCard borderRadius={8} className="h-full">
                            <div className="py-4 px-6 h-full w-full flex flex-col justify-between">
                                <div className="flex justify-between items-center w-full">
                                    <div className={cn("title !font-light text-base", isMobile ? "!text-base" : "")}>MY NFTS</div>
                                    <div className={cn("title !font-light !text-2xl", isMobile ? "!text-base" : "")}>{nftCnt}</div>
                                </div>

                                <div className="flex justify-end items-center">
                                    <Link to="/zk/serviceHub" className="flex items-center text-sub text-sm !font-[400] hover:text-white">
                                        CHECK DETAILS <ArrowRight size={12} className="ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </GradientBorderCard>
                    </div>
                </div>

                {/* SERVICE HUB 部分 */}
                <div>
                    <h2 className="title !text-4xl !font-light uppercase mb-12 text-center">SERVICE HUB</h2>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <AdCard
                                title="CYSIC ZK"
                                imageSrc={getImageUrl("@/assets/images/nft/preset1.png")}
                                onClick={() => { navigate('/zk/serviceHub') }}
                            />
                        </div>

                        <div className="flex-1 min-w-[300px]">
                            <AdCard
                                title="CYSIC AI"
                                imageSrc={getImageUrl("@/assets/images/nft/preset2.png")}
                                onClick={() => { navigate('/ai') }}
                            />
                        </div>

                        <div className="flex-1 min-w-[300px]">
                            <AdCard
                                title="CYSIC MINING"
                                imageSrc={getImageUrl("@/assets/images/nft/preset1.png")}
                                onClick={() => { navigate('/stake') }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserPortal;