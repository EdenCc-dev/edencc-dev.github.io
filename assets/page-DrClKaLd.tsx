import GradientBorderCard from "@/components/GradientBorderCard";
import { getImageUrl } from "@/utils/tools";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAccount from "@/hooks/useAccount";
import { cn } from "@nextui-org/react";
import { Multiplier } from "@/routes/components/Multiplier";
import SocialAccount from "@/routes/components/SocialAccount";
import Profile from "@/routes/components/Profile";
import InviteCardWithStatus from "@/routes/components/usePortal/cards/InviteCard";
import ZkBalanceCard from "@/routes/components/usePortal/cards/ZkBalanceCard";
import CysicBalance from "@/routes/components/usePortal/cards/CysicBalance";
import VoucherInfo from "@/routes/components/usePortal/cards/VoucherInfo";
import JoinZkPhase3 from "@/routes/components/JoinZkPhase3";
import AdCard from "@/routes/components/AdCard";
import useStatic from "@/models/_global";
import { getTierIcon } from "@/routes/pages/Zk/invite/page";
import { ArrowRight } from "lucide-react";

// 主要组件
const UserPortal = () => {
  const navigate = useNavigate();

  const { currentRebateRate, inviteLevelId } = useAccount();
  const { referralLevelList } = useStatic();
  const levelName = referralLevelList?.find(
    (item: any) => item.level == inviteLevelId
  )?.name;
  const levelLogo = getTierIcon(levelName);

  const pathname = useLocation().pathname;


  return (
    <>
      {/* content */}
      <div className="main-container mx-auto relative z-10 pt-20 pb-12 w-full">
        {/* title */}
        <h1 className="unbounded-72-120-200 mb-24 text-center">
          USER PORTAL
        </h1>

        {/* GENERAL 部分 */}
        <div className="mb-4 lg:mb-12">
          <h2
            className={cn("unbounded-24-36-300 text-center mb-6 lg:mb-12")}
          >
            GENERAL
          </h2>

          <div className="flex flex-wrap gap-4  ">
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

        <div className="mb-12 flex flex-col lg:flex-row flex-wrap gap-4  ">
          <div className="flex-[2]">
            <Profile />
          </div>
          <div className="flex-[1]">
            <SocialAccount />
          </div>
          <div className="flex-[2]">
            <Multiplier />
          </div>
        </div>

        <div className="mb-12 relative">

          <h2
            className={cn(
              "unbounded font-light text-center text-2xl lg:text-4xl mb-4 lg:mb-12",
            )}
          >
            INVITE
          </h2>

          <Link
            to={'/zk/invite'}
            className="mb-6 lg:mb-0 static lg:absolute justify-center top-2 right-0 teacher text-sm flex items-center text-sub text-sm hover:text-white"
          >
            check invite details <ArrowRight size={12} className="ml-1" />
          </Link>

          <div className="flex flex-col lg:flex-row flex-wrap gap-4  ">
            <InviteCardWithStatus />
            <GradientBorderCard
              borderRadius={8}
              className="flex-1 w-full h-full"
            >
              <div className={cn("w-full px-4 lg:px-6 py-4 h-full flex flex-col gap-4")}>
                <div className="unbounded-16-300">
                  rebate rate
                </div>
                <div className="flex items-center gap-2 self-end text-2xl unbounded">
                  {currentRebateRate || "0"}%
                </div>
              </div>
            </GradientBorderCard>
            <GradientBorderCard
              borderRadius={8}
              className="flex-1 w-full h-full"
            >
              <div className={cn("w-full px-4 lg:px-6 py-4 h-full flex flex-col gap-4")}>
                <div className="unbounded-16-300">
                  Invite level{" "}
                </div>
                <div className="flex items-center gap-2 self-end text-2xl unbounded">
                  <>
                    {levelName ? (
                      <img src={levelLogo} className="w-6 h-6" />
                    ) : null}
                    {levelName || "-"}
                  </>
                </div>
              </div>
            </GradientBorderCard>
          </div>
        </div>

        {/* SERVICE HUB 部分 */}
        <div className=" ">
          <h2 className="unbounded-36-300 text-center mb-6 lg:mb-12">
            SERVICE HUB
          </h2>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <AdCard
                title="CYSIC ZK"
                imageSrc={getImageUrl("@/assets/images/nft/preset1.png")}
                onClick={() => {
                  navigate(pathname.includes("/zk") ? "/zk/userPortal/serviceHub" : "/userPortal/serviceHub");
                }}
              />
            </div>

            <div className="flex-1 min-w-[300px]">
              <AdCard
                title={
                  <>
                    CYSIC AI
                    <div className="mt-3 !normal-case w-fit text-sm font-[500] teacher px-4 py-1 rounded-full border border-white bg-[#FFFFFF1A] backdrop-blur-sm">
                      Coming Soon
                    </div>
                  </>
                }
                imageSrc={getImageUrl("@/assets/images/nft/preset2.png")}
              />
            </div>

            <div className="flex-1 min-w-[300px]">
              <AdCard
                title={
                  <>
                    CYSIC MINING
                    <div className="mt-3 !normal-case w-fit text-sm font-[500] teacher px-4 py-1 rounded-full border border-white bg-[#FFFFFF1A] backdrop-blur-sm">
                      Coming Soon
                    </div>
                  </>
                }
                imageSrc={getImageUrl("@/assets/images/nft/preset1.png")}
              />
            </div>
          </div>
        </div>
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
