import Button from "@/components/Button";
import { Button as NButton } from "@nextui-org/react";
import Copy from "@/components/Copy";
import GradientBorderCard from "@/components/GradientBorderCard";
import Modal from "@/components/Modal";
import useAccount from "@/hooks/useAccount";
import useModalState from "@/hooks/useModalState";
import { getTierIcon } from "@/routes/pages/Zk/invite/page";
import { handleStakeModal } from "@/utils/tools";
import { cn, Tooltip } from "@nextui-org/react";
import { ArrowRight, Check, CircleHelp } from "lucide-react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import { MultiplierPercentBar } from "@/routes/components/Multiplier";
import useStatic from "@/models/_global";
import { enableSocialTask } from "@/config";
import Tab, { TabItem } from "@/routes/components/Tab";
import { useRequest } from "ahooks";
import axios from "axios";
import useTasksInMultiplierModal from "@/models/multiplier";
import { useEffect } from "react";
import Spinner from "@/components/spinner";
import { toast } from "react-toastify";
import { IClaimResponse, ITask } from "@/routes/pages/Nft/socialTask/page";

const stakeGroupId = 2
const baseGroupId = 1

const StatusButton = ({
  taskId,
  status,
  children,
  onSuccess,
}: {
  taskId: number;
  status: number;
  children: React.ReactNode;
  onSuccess: (task: ITask[]) => void;
}) => {

  const { isSigned, address, updateUserProfile } = useAccount();

  const handleClaim = async () => {
    try {
      if (!isSigned || !address) return;
      const res = await axios.post("/api/v1/social/task/claim", {
        taskId: taskId,
      });

      const response = res.data as IClaimResponse;

      const currentTaskId = response?.taskId
      const status = response?.taskList?.find(item => item.id == currentTaskId)?.status

      if(status != 2){
        toast.error('Claim failed, please try again later')
      }else{
        toast.success('Claim success')
      }


      if(response?.userProfile){
        updateUserProfile(address, response?.userProfile);
      }

      if(response?.taskList?.length){
        onSuccess(response?.taskList);
      }
    } catch (error) {
      console.log(error);
    }
  };




  if (status == 2) {
    return (
      <Button
        type="dark"
        disabled
        className="opacity-[1] disabled:[--tw-text-opacity:1] disabled:[--tw-bg-opacity:1] 
                        bg-[#FFFFFF12] border border-[#FFFFFF1A]
                        rounded-full text-sm flex items-center gap-1"
      >
        {children}
      </Button>
    );
  }
  if (status == 1) {
    return (
      <Button onClick={handleClaim} needLoading type="light" className="rounded-full text-sm">
        {children}
      </Button>
    );
  }
  return (
    <Button type="solid" className="!rounded-full text-sm">
      {children}
    </Button>
  );
};

const InviteTabItem = () => {
  const { inviteCode, inviteLevelId } = useAccount();
  const { referralLevelList: tiers } = useStatic();
  return (
    <div className="flex flex-col gap-4">
      <GradientBorderCard
        borderRadius={8}
        className="py-4 px-6 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <h2 className="unbounded-16-300">Invite Code</h2>
          {/* 推荐码显示 */}
          <div className="flex items-center justify-end">
            <Copy value={inviteCode} className="unbounded-24-300">
              {inviteCode || "-"}
            </Copy>
          </div>
          <Link
            to="/zk/invite"
            onClick={() => {
              dispatchEvent(
                new CustomEvent("modal_multiplier_visible", {
                  detail: { visible: false },
                })
              );
            }}
            className="flex items-center gap-2 justify-end"
          >
            <span className="text-sm uppercase !font-[400]">
              Check my Invites
            </span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </GradientBorderCard>

      <div
        className={cn(
          "grid grid-cols-5 overflow-x-scroll",
          isMobile ? "gap-[9rem]" : "gap-[11.25rem]"
        )}
      >
        {tiers
          .sort((a, b) => a.level - b.level)
          .map((tier, index) => (
            <div key={tier.id} className="relative h-full min-w-[9.5rem]">
              <GradientBorderCard
                borderRadius={8}
                borderWidth={1}
                className="h-full"
                gradientFrom={
                  tier.level == inviteLevelId ? "#19FFE0" : undefined
                }
                gradientTo={tier.level == inviteLevelId ? "#9D47FF" : undefined}
              >
                <div className="w-full p-4 flex flex-col items-center h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="unbounded-16-300 tracking-wider">
                      {tier.name}
                    </h3>
                    <Tooltip
                      classNames={{
                        content: "!p-0",
                      }}
                      content={
                        <>
                          <GradientBorderCard className="p-4 flex flex-col gap-1">
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
                                <div className="!text-sub w-20">Multiplier</div>
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
                  {tier.level == inviteLevelId && (
                    <div className="flex-1 flex flex-col items-center justify-end gap-2">
                      <div className="unbounded-16-300 text-center">
                        {tier.level}
                      </div>
                      <div className="unbounded-12-300 text-center">
                        Current Level
                      </div>
                    </div>
                  )}
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
                  className={cn(
                    "absolute left-full top-1/2 h-px bg-white  -translate-y-1/2 z-[1]",

                    isMobile
                      ? "w-[1.2rem] translate-x-[calc(calc(2rem-1.2rem)/2)] "
                      : "w-[1rem] translate-x-[calc(calc(1rem)/2)]"
                  )}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

const StakeTabItem = () => {
  const { stakeTaskList, loading, setStakeTaskList } = useTasksInMultiplierModal()

  const handleStakeSuccess = (taskList: ITask[]) => {
    setStakeTaskList(taskList)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-base">
        Staking more CGT unlocks additional Boosts and a higher Multiplier.
      </div>
      <Button
        type="light"
        className="py-4 flex items-center justify-center gap-2"
        onClick={handleStakeModal}
      >
        <span>STAKE</span>
        <ArrowRight className="w-3 h-3" />
      </Button>
      {
        loading ? <Spinner /> : (
          <div className="flex flex-col gap-2">
            {stakeTaskList?.map((task: ITask) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-2 p-4 border border-[#FFFFFF80] rounded-md"
              >
                <div>{task.description}</div>
                <StatusButton taskId={task.id} status={task.status} onSuccess={handleStakeSuccess}>
                  {task.status == 2 ? (
                    <>
                      <Check className="w-3 h-3 text-lightBrand" />
                      <span>Claimed</span>
                    </>
                  ) : task.status == 1 ? (
                    <span>Claim {task?.rewardFire || 0} 🔥Fire</span>
                  ) : (
                    <span>+{task?.rewardFire || 0} 🔥Fire</span>
                  )}
                </StatusButton>
              </div>
            ))}
          </div>
        )
      }

    </div>
  );
};

const SocialTaskTabItem = () => {
  const { baseTaskList, loading, setBaseTaskList } = useTasksInMultiplierModal()

  const handleBaseTaskSuccess = (taskList: ITask[]) => {
    setBaseTaskList(taskList)
  }

  return loading ? <Spinner /> : (
    <div className="flex flex-col gap-4">
      {baseTaskList.map((task: ITask) => (
        <div
          key={task.id}
          className="flex items-center justify-between gap-2 p-4 border border-[#FFFFFF80] rounded-md"
        >
          <div className="flex-1">{task.description}</div>
          <StatusButton taskId={task.id} status={task.status} onSuccess={handleBaseTaskSuccess}>
            {task.status == 2 ? (
              <>
                <Check className="w-3 h-3 text-lightBrand" />
                <span>Claimed</span>
              </>
            ) : task.status == 1 ? (
              <span>Claim {task?.rewardFire || 0} 🔥Fire</span>
            ) : (
              <span>+{task?.rewardFire || 0} 🔥Fire</span>
            )}
          </StatusButton>
        </div>
      ))}
    </div>
  );
};
const BoostingList = () => {

  const tabs: TabItem[] = enableSocialTask ? [
    {
      key: "stake",
      label: "STAKE",
      content: <StakeTabItem />,
    },
    {
      key: "tasks",
      label: "TASKS",
      content: <SocialTaskTabItem />,
    },
    {
      key: "invites",
      label: "INVITES",
      content: <InviteTabItem />,
    },
  ] : [
    {
      key: "stake",
      label: "STAKE",
      content: <StakeTabItem />,
    },
    {
      key: "invites",
      label: "INVITES",
      content: <InviteTabItem />,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="uppercase text-[32px] !font-normal">
        Level up your Boosting
      </div>
      <Tab
        // classNames={{
        //   panel: "!p-0",
        //   tabList:
        //     "w-full p-0 gap-0 rounded-md overflow-hidden border border-[#FFFFFF80]",
        //   tab: 'py-6 [&:not(:last-child)]:border-r  [&:not(:last-child)]:border-r-[#FFFFFF80] !rounded-none px-0 [data-selected="true"]:text-black [data-selected="true"]:bg-white [data-selected="true"]:border-black bg-[#FFFFFF1A] text-[#FFFFFF80]',
        //   cursor: "rounded-none",
        // }}
        // className="w-full"

        items={tabs}
        defaultActiveKey="stake"
        tabClassName="w-full"
        renderMode="hidden"
      />
    </div>
  );
};

const MoreFire = () => {
  const { inviteCode } = useAccount();
  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="teacher text-[2rem]">
          Earn more <span className="font-bold">🔥Fire</span>
        </p>

        {enableSocialTask ? (
          <NButton
            onPress={() => {
              dispatchEvent(
                new CustomEvent("modal_multiplier_visible", {
                  detail: { visible: false },
                })
              );
            }}
            as={Link}
            to={"/socialTask"}
            className="rounded-full text-base !bg-lightBrand !text-black !rounded-lg flex items-center justify-center !py-6 !min-h-fit"
          >
            <>
              <span className="teacher text-base font-normal text-black tracking-widest">
                social tasks
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          </NButton>
        ) : null}
        <NButton
          onPress={() => {
            dispatchEvent(
              new CustomEvent("modal_multiplier_visible", {
                detail: { visible: false },
              })
            );
          }}
          as={Link}
          to={"/zk/invite"}
          className="rounded-full text-base !bg-white !text-black flex items-center justify-center !py-6 !rounded-lg !min-h-fit"
        >
          <>
            <span className="teacher text-base font-normal tracking-widest">
              invites
            </span>
            <ArrowRight className="w-4 h-4" />
          </>
        </NButton>
      </div>

      <GradientBorderCard className="py-4 px-6 flex flex-col gap-4">
        <>
          <div className="unbounded-16-300">Invite code</div>
          <div className="mt-8 ml-auto ">
            <Copy value={inviteCode}>
              <span className="unbounded-24-300">{inviteCode || "-"}</span>
            </Copy>
          </div>
        </>
      </GradientBorderCard>
    </>
  );
};

const MultiplierModal = () => {
  const { visible, setVisible } = useModalState({
    eventName: "modal_multiplier_visible",
  });

  const { multiplierLevelList } = useStatic();
  const { zkPart, isSigned, walletAddress } = useAccount();

  const handleClose = () => {
    setVisible(false);
  };

  const { setBaseTaskList, setStakeTaskList, setLoading } = useTasksInMultiplierModal()

  const { loading } = useRequest(
    () => Promise.allSettled([
      axios.get("/api/v1/social/task/list", {
        params: {
          groupId: baseGroupId,
        },
      }),
      axios.get("/api/v1/social/task/list", {
        params: {
          groupId: stakeGroupId,
        },
      })
    ]),
    {
      ready: enableSocialTask && visible && isSigned && !!walletAddress,
      refreshDeps: [visible, isSigned, walletAddress],
      onSuccess: (res: any) => {
        setBaseTaskList(res?.[0]?.value?.data?.taskList)
        setStakeTaskList(res?.[1]?.value?.data?.taskList)
      }
    }
  );

  useEffect(() => {
    setLoading(loading)
  }, [loading])

  const currentMultiplier =
    multiplierLevelList?.find(
      (item: { level: number | undefined }) =>
        item.level == zkPart?.multiplierLevel
    ) || multiplierLevelList?.[0];

  const nextLevelMultiplier =
    multiplierLevelList?.find(
      (item: { level: number | undefined }) =>
        item.level == Number(zkPart?.multiplierLevel) + 1
    ) || multiplierLevelList?.[multiplierLevelList.length - 1];

  const nextLevelMultiplierRequire =
    currentMultiplier?.nextLevelRequire - (zkPart?.multiplierFire || 0);

  const hasNextLevel = multiplierLevelList?.find(
    (item: { level: number | undefined }) =>
      item.level == Number(zkPart?.multiplierLevel) + 1
  );

  return (
    <Modal
      title="MULTIPLIER"
      className="max-w-[33.75rem]"
      isOpen={visible}
      onClose={handleClose}
    >
      <div className="flex flex-col gap-8">
        <span className="text-base">
          Multiplier can be applied to boost the rewards you earn through Cysic
          ZK Prover/Verifier.
        </span>
        <GradientBorderCard className="py-4 px-6 flex flex-col gap-4">
          <>
            <div className="unbounded-16-300">
              {currentMultiplier?.name || "-"} Boosting
              <br /> in Progress
            </div>
            <MultiplierPercentBar />
            {!walletAddress || !isSigned ? (
              <span className="text-sub text-sm ml-auto teacher">
                Connect your wallet to earn more 🔥Fire
              </span>
            ) : hasNextLevel ? (
              <span className="text-sub text-sm ml-auto teacher">
                Earn {nextLevelMultiplierRequire} more{" "}
                <span className="text-[#22D3EE] font-bold">🔥FIRE</span> to
                become {nextLevelMultiplier?.name}
              </span>
            ) : (
              <span className="text-sub text-sm ml-auto teacher">
                <span className="text-[#22D3EE] font-bold">Highest</span>{" "}
                Multiplier Level ({currentMultiplier?.name}) Reached.
              </span>
            )}
          </>
        </GradientBorderCard>

        {/* <MoreFire /> */}
        <BoostingList />
      </div>
    </Modal>
  );
};

export default MultiplierModal;
