import Button from "@/components/Button";
import {
    getImageUrl,
    shortStr,
    handleHowInviteWorkModal,
    handleMultiplierModal,
} from "@/utils/tools";
import { ArrowRight, CircleHelp } from "lucide-react";
import Copy from "@/components/Copy";
import { useState } from "react";
import GradientBorderCard from "@/components/GradientBorderCard";

import CysicTable, { CysicTableColumn } from "@/components/Table";
import Tooltip from "@/components/Tooltip";
import axios from "@/service";
import { useRequest } from "ahooks";
import useAccount from "@/hooks/useAccount";
import { isMobile } from "react-device-detect";
import { cn, Divider, Pagination } from "@nextui-org/react";
import useStatic from "@/models/_global";
import {
    TableAvatar,
    TaskReward,
} from "@/routes/pages/Zk/dashboard/components/tableComponents";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { commonPageSize, enableSocialTask } from "@/config";
import usePagnation from "@/hooks/usePagnation";

// 团队成员类型
interface TeamMember {
    avatar: string;
    address: string;
    status: number;
    joinAt: string;
    layer: number;
    referralRewardList: Array<{
        amount: string;
        symbol: string;
    }>;
}

// 团队领导类型
interface TeamLeader {
    avatar: string;
    address: string;
    status: number;
    joinAt: string;
    inviteBy: string;
    referralRewardList: Array<{
        amount: string;
        symbol: string;
    }>;
}

export const getTierIcon = (tierName: string) => {
    if (!tierName) return "";
    const lowerName = tierName?.toLowerCase();
    return getImageUrl(`@/assets/images/invite/${lowerName}.png`);
};

const InvitePage = () => {
    const { referralLevelList: tiers } = useStatic();
    const {
        isSigned,
        walletAddress,
        inviteCode: registeredInviteCode,
        currentRebateRate,
        zkPart,
        inviteLevelId,
    } = useAccount();

    const [memberData, setMemberData] = useState<TeamMember[]>([]);
    const [leaderData, setLeaderData] = useState<TeamLeader | null>(null);
    const [rewards, setRewards] = useState({
        cys: "0",
        CGT: "0",
    });

    // 获取邀请概览信息
    const { data: overviewData } = useRequest(
        () => axios.get("/api/v1/referral/overview"),
        {
            ready: !!isSigned && !!walletAddress,
            refreshDeps: [isSigned, walletAddress],
            onSuccess: (res) => {
                if (res?.data) {
                    // 设置邀请奖励数据
                    const cysReward =
                        res.data.referralEaringList.find(
                            (item: { symbol: string }) => item.symbol === "CYS"
                        )?.amount || "0";
                    setRewards({
                        cys: cysReward,
                        CGT: res.data.upgradeEaring.amount,
                    });
                }
            },
        }
    );

    // 获取团队列表
    const {
        loading: teamLoading,
        currentPage,
        total,
        setCurrentPage,
    } = usePagnation((page: number) => axios.get("/api/v1/referral/teamList", {
        params: {
            pageNum: page,
            pageSize: commonPageSize,
        },
    }), {
        ready: !!isSigned && !!walletAddress,
        refreshDeps: [isSigned, walletAddress],
        onSuccess: (res) => {
            if (res?.data) {
                setLeaderData(res.data.leaderInfo);
                setMemberData(res.data.teamList);
            }
        },
    });

    // 团队领导表格列定义
    const leaderColumns: CysicTableColumn<TeamLeader>[] = [
        {
            key: "address",
            label: "My Address",
            width: "15%",
            renderCell: (leader) => (
                <TableAvatar avatar={leader.avatar} name={leader.address} />
            ),
        },
        {
            key: "status",
            label: "Status",
            width: "35%",
            renderCell: (leader) => (
                <div className="flex items-center">
                    <div
                        className={`h-3 w-3 rounded-full ${leader.status == 1 ? "bg-success" : "bg-error"
                            } mr-2 flex-shrink-0`}
                    ></div>
                    <span>{leader.status == 1 ? "Activated" : "Not Activated"}</span>
                </div>
            ),
        },
        {
            key: "time",
            label: "Time",
            width: "40%",
            renderCell: (leader) => (
                <div className="">
                    {dayjs.unix(Number(leader.joinAt)).format("YYYY-MM-DD HH:mm:ss")}
                </div>
            ),
        },
        // {
        //     key: "inviteBy",
        //     label: "Invited by",
        //     width: "40%",
        //     renderCell: (leader) => (
        //         <div className="capitalize">{shortStr(leader.inviteBy, 14) || "-"}</div>
        //     ),
        // },
    ];

    // 团队成员表格列定义
    const memberColumns: CysicTableColumn<TeamMember>[] = [
        {
            key: "address",
            label: "Address",
            width: "15%",
            renderCell: (member) => (
                <TableAvatar avatar={member.avatar} name={member.address} />
            ),
        },
        {
            key: "status",
            label: "Status",
            width: "10%",
            renderCell: (member) => (
                <div className="flex items-center">
                    <div
                        className={`h-3 w-3 rounded-full ${member.status == 1 ? "bg-success" : "bg-error"
                            } mr-2 flex-shrink-0`}
                    ></div>
                    <span>{member.status == 1 ? "Activated" : "Not Activated"}</span>
                </div>
            ),
        },
        {
            key: "layer",
            label: "Layer",
            width: "10%",
            renderCell: (member) => (
                <div className="text-left flex gap-2">
                    <span>{member.layer || "-"}</span>
                </div>
            ),
        },
        {
            key: "referral",
            label: "Referral Rewards",
            width: "35%",
            renderCell: (member) => (
                <div className="text-left flex gap-2">
                    {member?.referralRewardList?.map(
                        (reward: { amount: string; symbol: string }, index: number) => (
                            <TaskReward
                                key={index}
                                rewardCYS={reward.symbol === "CYS" ? reward.amount : undefined}
                                rewardCGT={reward.symbol === "CGT" ? reward.amount : undefined}
                            />
                        )
                    )}
                </div>
            ),
        },
        {
            key: "time",
            label: "Time",
            width: "25%",
            renderCell: (member) => (
                <div className="text-right">
                    {dayjs.unix(Number(member.joinAt)).format("YYYY-MM-DD HH:mm:ss")}
                </div>
            ),
        },
    ];

    // 分享到Twitter
    const shareToTwitter = () => {
        if (!overviewData?.data?.inviteCode && !registeredInviteCode) return;

        const inviteCode = overviewData?.data?.inviteCode || registeredInviteCode;
        const text = `Join me on Cysic using my invite code: ${inviteCode}`;
        const url = `https://cysic.io/invite?code=${inviteCode}`;

        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                text
            )}&url=${encodeURIComponent(url)}`,
            "_blank"
        );
    };

    const inviteCode =
        overviewData?.data?.inviteCode || registeredInviteCode || "-----";

    // 获取当前用户等级
    const getCurrentLevelId = () => {
        return overviewData?.data?.currentLevelID || 1;
    };

    return (
        <>
            {/* 顶部标题部分 */}
            <div className="pt-12 flex flex-col items-center gap-6 relative z-[2]">
                <div className="flex flex-col items-center">
                    <span className="unbounded-36-400 text-white text-center">
                        INVITE
                    </span>
                    <div
                        className="flex items-center gap-4 mt-4 cursor-pointer"
                        onClick={handleHowInviteWorkModal}
                    >
                        <div className="unbounded-16-300">HOW INVITE WORK</div>
                        <ArrowRight width={16} height={16} />
                    </div>
                </div>
            </div>

            {/* 主要内容部分 */}
            <div className="mx-auto w-full mt-12 relative z-[2]">
                <div className="flex flex-col gap-6">
                    {/* 左侧 - 总邀请奖励 */}
                    <GradientBorderCard
                        className={isMobile ? "" : "col-span-2"}
                        borderRadius={8}
                    >
                        <div className="w-full py-4">
                            <h2 className="unbounded-20-300 mb-4 px-4 lg:px-6">
                                TOTAL INVITE REWARDS
                            </h2>
                            <div className="border-b border-white my-4 "></div>

                            {/* 推荐收益 */}
                            <div className="flex justify-between items-start px-4 lg:px-6">
                                <span className="unbounded-16-300">REBATE EARNINGS</span>
                                <div className="flex flex-col items-center gap-4">
                                    <span className="unbounded-24-400 text-right">
                                        {rewards.cys} CYS
                                    </span>
                                    <div className="bg-white h-px w-8 self-end" />
                                    <span className="unbounded-24-400 text-right">
                                        {rewards.cys} CGT
                                    </span>
                                </div>
                            </div>

                            {/* <div className="border-b border-white my-4 px-4 lg:px-6"></div> */}

                            {/* 升级收益 */}
                            {/* <div className="flex justify-between items-center px-4 lg:px-6">
                                <span className="unbounded-16-300">
                                    UPGRADE EARNINGS
                                </span>
                                <span className="unbounded-24-400 text-right">
                                    {rewards.CGT || "0"} CGT
                                </span>
                            </div> */}
                        </div>
                    </GradientBorderCard>

                    {/* 右侧 - 您的推荐码 */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        <GradientBorderCard
                            borderRadius={8}
                            className="flex-[2] flex flex-col lg:flex-row gap-4 px-4 lg:px-6 py-4 "
                        >
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <h2 className="unbounded-20-300">Invite code</h2>
                                    <div className="flex items-center self-start">
                                        <Copy value={inviteCode}>
                                            <span className="unbounded-24-400">{inviteCode}</span>
                                        </Copy>
                                    </div>
                                </div>

                                <p className="teacher !normal-case text-base">
                                    Invite your friends and earn more from their NFT purchases—get
                                    <span className="text-lightBrand teacher !normal-case text-base">
                                        &nbsp;a maximum of 50%&nbsp;
                                    </span>{" "}
                                    of what your direct invites purchase and{" "}
                                    <span className="text-lightBrand teacher !normal-case text-base">
                                        &nbsp;2%&nbsp;
                                    </span>{" "}
                                    from your indirect invitees.
                                </p>
                            </div>

                            <Divider className="bg-[#FFFFFFCC] w-full lg:w-divider h-divider lg:h-full" />

                            <div className="flex-1 flex flex-col gap-4 justify-between">
                                <div className="flex justify-between items-start">
                                    <h2 className="unbounded-20-300">
                                        Successful <br />
                                        Invites
                                    </h2>
                                </div>

                                <p className="unbounded text-2xl font-light ml-auto">
                                    {zkPart?.successInviteCnt || 0}
                                </p>
                            </div>
                        </GradientBorderCard>

                        <GradientBorderCard borderRadius={8} className="flex-1">
                            <div className="w-full px-6 py-4 flex flex-col gap-4 justify-between">
                                <div className="flex justify-between items-start">
                                    <h2 className="unbounded text-xl font-light">rebate rate</h2>
                                    <span className="unbounded-24-400">
                                        {currentRebateRate || "0"}%
                                    </span>
                                </div>

                                {enableSocialTask ? (
                                    <Link
                                        to="/socialTask"
                                        className="unbounded text-xs font-light !normal-case !text-lightBrand"
                                    >
                                        Complete the basic tasks to earn extra 3% →
                                    </Link>
                                ) : null}

                                <p className="teacher !normal-case text-base">
                                    Your Rebate Rate determines how much token rebate you earn
                                    from your invitees’ NFT purchases.
                                </p>
                            </div>
                        </GradientBorderCard>
                    </div>
                </div>

                {/* 成功邀请部分 */}
                <GradientBorderCard className="mt-8" borderRadius={8}>
                    <div className="w-full px-6 py-4 flex flex-col gap-6">
                        <div
                            className={cn(
                                "flex justify-between items-center",
                                "flex-col lg:flex-row gap-4 lg:gap-0"
                            )}
                        >
                            <div>
                                <h2 className="unbounded-20-300 mb-2">INVITE LEVEL</h2>
                                <div className="text-base !font-[400] flex items-center flex-wrap break-words">
                                    Successful Invites{" "}
                                    <Tooltip
                                        content={
                                            <div className="max-w-[16rem] py-2">
                                                A user must complete all Basic Tasks in the Social Tasks
                                                to count as a Successful Invite.
                                            </div>
                                        }
                                    >
                                        <div className="text-sub text-xs">&nbsp;ⓘ&nbsp;</div>
                                    </Tooltip>{" "}
                                    could also speed up your Multiplier for Earnings from
                                    Verifier/Prover.
                                </div>
                            </div>

                            <div className="flex self-start">
                                <Button
                                    type="solid"
                                    className="text-base !font-[400] !p-6"
                                    onClick={handleMultiplierModal}
                                >
                                    <div className="flex items-center gap-2">
                                        CLICK HERE TO CHECK YOUR MULTIPLIER
                                    </div>
                                </Button>
                            </div>
                        </div>

                        {/* 邀请等级 */}
                        <div className="w-full overflow-x-scroll">
                            <div
                                style={{
                                    gap: isMobile
                                        ? "9rem"
                                        : `calc(calc(100% - 10rem * ${tiers.length}) / ${tiers.length})`,
                                }}
                                className={cn("grid grid-cols-5 overflow-x-scroll ")}
                            >
                                {tiers
                                    .sort((a, b) => a.level - b.level)
                                    .map((tier, index) => (
                                        <div
                                            key={tier.id}
                                            className="relative h-full min-w-[8rem] lg:min-w-[10rem]"
                                        >
                                            <GradientBorderCard
                                                gradientFrom={
                                                    tier.level == inviteLevelId ? "#19FFE0" : undefined
                                                }
                                                gradientTo={
                                                    tier.level == inviteLevelId ? "#9D47FF" : undefined
                                                }
                                                borderRadius={8}
                                                borderWidth={1}
                                                className="h-full"
                                            >
                                                <div className="w-full p-4 flex flex-col items-center h-full">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-sm lg:text-base !font-light unbounded tracking-wider">
                                                            {tier.name}
                                                        </h3>
                                                        <Tooltip
                                                            classNames={{
                                                                content: "!p-0",
                                                            }}
                                                            content={
                                                                <>
                                                                    <GradientBorderCard className="p-4 flex flex-col gap-1 w-[12.5rem]">
                                                                        <>
                                                                            <div className="w-full flex items-center justify-between text-sm teacher !normal-case">
                                                                                Levelup Rewards
                                                                            </div>
                                                                            <div className="w-full flex items-center justify-between text-sm teacher !normal-case">
                                                                                <div className="!text-sub w-20">
                                                                                    Rebate Rate
                                                                                </div>
                                                                                <div>+{tier.rebateRate} %</div>
                                                                            </div>
                                                                            <div className="w-full flex items-center justify-between text-sm teacher !normal-case">
                                                                                <div className="!text-sub w-20">
                                                                                    Multiplier
                                                                                </div>
                                                                                <div>+{tier.multiplier} 🔥FIRE</div>
                                                                            </div>
                                                                        </>
                                                                    </GradientBorderCard>
                                                                </>
                                                            }
                                                        >
                                                            <div className="flex items-center">
                                                                <CircleHelp width={12} height={12} />
                                                            </div>
                                                        </Tooltip>
                                                    </div>

                                                    {/* 宝石图标 */}
                                                    <div className="relative h-24 w-full flex items-center justify-center">
                                                        <img
                                                            src={getTierIcon(tier.name)}
                                                            alt={tier.name}
                                                            className="h-full object-contain"
                                                        />
                                                    </div>

                                                    {inviteLevelId == tier.level ? (
                                                        <>
                                                            <div className="mt-4 flex-1 flex flex-col items-center justify-end gap-2">
                                                                <div className="unbounded-16-300 text-center">
                                                                    {tier.level}
                                                                </div>
                                                                <div className="unbounded-12-300 text-center">
                                                                    Current Level
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : null}
                                                    {Number(inviteLevelId) >= tier.level ? (
                                                        <></>
                                                    ) : (
                                                        <>
                                                            <div className="mt-4 flex items-center flex-col gap-1">
                                                                <svg
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                                                                        stroke="white"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M18 21C18 19.1362 17.2625 17.3487 15.9497 16.0485C14.637 14.7482 12.8326 14 11 14C9.16737 14 7.36302 14.7482 6.05025 16.0485C4.73748 17.3487 4 19.1362 4 21"
                                                                        stroke="white"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span className="unbounded-16-300">
                                                                    {tiers[index - 1]?.needInviteCnt || 0}
                                                                </span>

                                                                <div className="unbounded-12-300 text-center">
                                                                    Invites Required
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </GradientBorderCard>

                                            {/* 连接线 - 除了最后一个项目外的所有项目都有 */}
                                            {index < tiers.length - 1 && (
                                                <div
                                                    style={{
                                                        width: isMobile
                                                            ? "1.2rem"
                                                            : `calc(calc(100% / ${tiers.length - 1})`,
                                                    }}
                                                    className={cn(
                                                        "absolute left-full top-1/2 h-px bg-white  -translate-y-1/2 z-[1]",
                                                        // (100% - 10rem*tiers.length )/tiers.length
                                                        isMobile
                                                            ? " translate-x-[calc(calc(2rem-1.2rem)/2)] "
                                                            : `translate-x-1/2`
                                                    )}
                                                />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* 团队领导表格 */}
                        {leaderData && (
                            <div className="mt-4">
                                <h2 className="unbounded-16-300 mb-4">My Address</h2>
                                <CysicTable
                                    data={[leaderData]}
                                    columns={leaderColumns}
                                    keyExtractor={() => "leader"}
                                />
                            </div>
                        )}

                        {/* 团队列表表格 */}
                        {memberData.length > 0 && (
                            <div className="mt-4">
                                <h2 className="unbounded-16-300 mb-4">TEAM MEMBERS</h2>
                                <CysicTable
                                    data={memberData}
                                    columns={memberColumns}
                                    keyExtractor={(member) => member.address}
                                    loading={teamLoading}
                                />

                                {total > commonPageSize && (
                                    <div className="flex justify-center mb-4">
                                        <Pagination
                                            total={Math.ceil(total / commonPageSize)}
                                            initialPage={1}
                                            page={currentPage}
                                            onChange={setCurrentPage}
                                            color="primary"
                                            size="sm"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {teamLoading && (
                            <div className="text-center py-4">Loading team data...</div>
                        )}

                        {!teamLoading && memberData.length === 0 && (
                            <div className="text-center py-4 text-gray-400">
                                No team members
                            </div>
                        )}
                    </div>
                </GradientBorderCard>
            </div>
        </>
    );
};

export default InvitePage;
