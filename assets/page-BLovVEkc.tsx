import { getImageUrl } from "@/utils/tools";
import { useNavigate } from "react-router-dom";
import useAccount from "@/hooks/useAccount";
import { cn } from "@nextui-org/react";
import SocialAccount from "@/routes/components/SocialAccount";
import Profile from "@/routes/components/Profile";
import {InviteCard} from "@/routes/components/usePortal/cards/InviteCard";
import ZkBalanceCard from "@/routes/components/usePortal/cards/ZkBalanceCard";
import CysicBalance from "@/routes/components/usePortal/cards/CysicBalance";
import VoucherInfo from "@/routes/components/usePortal/cards/VoucherInfo";
import JoinZkPhase3 from "@/routes/components/JoinZkPhase3";
import useStatic from "@/models/_global";
import { getTierIcon } from "@/routes/pages/Zk/invite/page";
import { CompletionTasksCard, VerifierCard, ProverCard, ProjectCard } from "@/routes/components/usePortal/cards/TasksCard";
import { MyTask } from "@/components/myTask";

// 主要组件
const UserPortal = () => {
    const navigate = useNavigate();

    const { currentRebateRate, inviteLevelId } = useAccount();
    const { referralLevelList } = useStatic();
    const levelName = referralLevelList?.find(
        (item: any) => item.level == inviteLevelId
    )?.name;
    const levelLogo = getTierIcon(levelName);

    return (
        <>
            {/* content */}
            <div className="main-container mx-auto relative z-10 pt-6 pb-12 w-full  ">


                {/* GENERAL 部分 */}
                <div className="mb-4">
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
                </div>

                <div className="mb-12 flex flex-wrap gap-4">
                    <div className="flex-[5]">
                        <Profile />
                    </div>
                    <div className="flex-[4] flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <SocialAccount />
                        </div>
                        <div className="flex-1">
                            <InviteCard />
                        </div>
                    </div>

                </div>

                <div className="mb-12 relative">
                    <h2
                        className={cn(
                            "unbounded font-light mb-12 text-center text-2xl lg:text-4xl",
                        )}
                    >
                        DETAILS
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex-[5]"><CompletionTasksCard /></div>
                        <div className="flex flex-col gap-4 flex-[4]">
                        <VerifierCard />
                        <ProverCard />
                        <ProjectCard />
                        </div>
                    </div>
                </div>
                <MyTask />

            </div>


            <div className="relative h-[36.25rem] lg:h-screen w-full">
                <div
                    className="absolute brightness-50 inset-0 size-full z-0"
                    style={{
                        backgroundImage: `url(${getImageUrl(
                            "@/assets/images/_global/zk_landing_bg_3.png"
                        )})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                />
                <JoinZkPhase3 slogen="Join Cysic Network " title="Phase III: Ignition" />
            </div>
        </>
    );
};

export default UserPortal;
