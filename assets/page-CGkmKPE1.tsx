import GradientBorderCard from "@/components/GradientBorderCard";
import Button from "@/components/Button";
import { ReactNode, useState } from "react";
import axios from "@/service";
import { useEventListener, useRequest } from "ahooks";
import { isMobile } from "react-device-detect";
import { cn } from "@nextui-org/react";
import usePagnation from "@/hooks/usePagnation";
import Spinner from "@/components/spinner";
import useAccount from "@/hooks/useAccount";
import { IUserProileResponseInSocialTask } from "@/models/user";
import { toast } from "react-toastify";

interface ITaskGroup {
  id: number;
  name: string;
  sort: number;
  description: string;
}

export interface ITask {
  id: number;
  title: string;
  description: string;
  status: number; // 0: 未开始, 1: 进行中, 2: 已完成
  actionText?: string;

  action: number; // 0 - check, 1 - link
  link: string; // url
  relatedTaskId: string; // '1&&2&&3'

  rewardFire: number;
  rewardCYS: string;
  rewardCGT: string;
  rewardRebeatRate: number;

}

export interface IClaimResponse {
  taskList: ITask[];
  userProfile: IUserProileResponseInSocialTask;
  relatedTaskId: string;
  success: boolean;
  taskId: number;
}
interface TaskCardProps {
  title: string;
  status: number; // 0: 未开始, 1: 已完成, 2: 进行中
  buttonText: "CLAIM" | "CHECK" | string;
  description: string;
  onClick?: () => Promise<void>;
  hideBtn?: boolean;

  action: number; // 0 - check, 1 - link
  link: string; // url
  relatedTaskId: string; // '1&&2&&3'
}

interface TaskSectionProps {
  title: string;
  children: ReactNode;
  rightAction?: ReactNode;
  description?: string;
}

const TaskCard = ({
  title,
  status,
  buttonText,
  description,
  onClick,
  hideBtn,
  action,
  link,
  relatedTaskId,
}: TaskCardProps) => (
  <GradientBorderCard
    borderRadius={8}
    className="mb-4 hover:bg-gradient-to-r from-[#19ffe07f] to-[#4d00ff7f]"
  >
    <div className="py-4 px-4 lg:px-6 w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
      <div className="flex flex-col">
        <div className="text-sm teacher !normal-case text-sub">{title}</div>
        <div className="text-xl teacher !normal-case text-white">
          {description}
        </div>
      </div>
      {!hideBtn && (
        <Button
          needLoading
          type="light"
          onClick={onClick}
          className="min-w-[90px] py-2 px-3 text-sm rounded-md [&_.loading]:size-4 w-full lg:w-auto"
          disabled={status == 2}
        >
          {status == 1 ? buttonText : "CLAIMED"}
        </Button>
      )}
    </div>
  </GradientBorderCard>
);

const TaskSection = ({
  title,
  children,
  rightAction,
  description,
}: TaskSectionProps) => (
  <div className="mb-12">
    <div
      className={cn(
        "flex mb-6 gap-4",
        isMobile ? "flex-col" : " justify-between items-center"
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className={cn("unbounded font-light text-2xl ")}>{title}</h2>
        {description && (
          <div className="text-sub text-sm teacher !normal-case">
            {description}
          </div>
        )}
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
    {children}
  </div>
);

const TaskGroup = ({ taskGroup }: { taskGroup: ITaskGroup }) => {
  const { isSigned, updateUserProfile, address } = useAccount();
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const {
    loading: _loading,
    run,
  } = usePagnation(
    () =>
      axios.get("/api/v1/social/task/list", {
        params: {
          groupId: taskGroup.id,
        },
      }),
    {
      ready: !!taskGroup.id,
      refreshDeps: [taskGroup.id, isSigned, address],
      onSuccess: (res) => {
        setTaskList(res.data.taskList);
      },
    }
  );

  const tasks = taskList as ITask[];
  const loading = !tasks?.length && _loading;

  // 处理任务认领和检查
  const handleClaim = async (task: ITask, groupId: number) => {
    try {
      if (!isSigned || !address) return;
      const res = await axios.post("/api/v1/social/task/claim", {
        taskId: task.id,
      });

      const response = res.data as IClaimResponse;

      const currentTaskId = response?.taskId
      const status = response?.taskList?.find(item => item.id == currentTaskId)?.status

      if(status != 2){
        // if()
        toast.error('Claim failed, please try again later')
      }else{
        toast.success('Claim success')
      }


      if(response?.userProfile){
        updateUserProfile(address, response?.userProfile);
      }

      if(response?.taskList?.length){
        setTaskList(response?.taskList);
      }
      dispatchEvent(
        new CustomEvent("update_groupTask", {
          detail: {
            groupId,
            taskList: response?.taskList,
          },
        })
      );
    } catch (error) {
      console.log(error);
    }

    // run();
  };

  return (
    <TaskSection
      key={taskGroup.id}
      title={taskGroup.name}
      description={taskGroup.description}
    >
      {loading ? (
        <Spinner />
      ) : tasks?.length === 0 ? (
        <GradientBorderCard className="text-center py-12 text-gray-400">
          No task data...
        </GradientBorderCard>
      ) : (
        tasks?.map((task: ITask) => (
          <TaskCard
            key={task.id}
            title={task.title}
            status={task.status}
            description={task.description}
            buttonText={task?.actionText || (task.action == 0 ? "CHECK" : "VIEW")}
            onClick={async () => {
              if(task.action == 0){
                await handleClaim(task, taskGroup.id);
              }else{
                window.open(task.link, '_blank');
              }
            }}
            hideBtn={!isSigned}
            action={task.action}
            link={task.link}
            relatedTaskId={task.relatedTaskId}
          />
        ))
      )}
    </TaskSection>
  );
};
// 社交任务页面组件
const SocialTaskPage = () => {
  // 状态管理
  const [taskGroups, setTaskGroups] = useState<ITaskGroup[]>([]);

  const { loading: _loading } = useRequest(
    () => axios.get("/api/v1/social/task/group/list"),
    {
      onSuccess: (res) => {
        setTaskGroups(res.data.taskGroupList);
      },
    }
  );

  const loading = !taskGroups?.length && _loading;

  useEventListener("update_groupTask", (event: Event) => {
    const customEvent = event as CustomEvent<{ groupId: number; taskList: ITask[] }>;
    const { groupId, taskList } = customEvent.detail;
    if (taskList?.length && groupId) {
      setTaskGroups(prev => {
        const updatedGroups = prev.map((group) => {
          if (group.id == groupId) {
            return { ...group, taskList };
          }
          return group;
        });

        return updatedGroups;
      });
    }
  }
  );


  return (
    <>
      {/* content */}
      <div
        className={cn(
          "mx-auto mb-auto relative z-10 pt-20 pb-16 w-full break-words",
        )}
      >
        {/* title */}
        <h1
          className={cn(
            "unbounded font-[200] mb-24 text-center text-[48px] lg:text-[8rem]",
          )}
        >
          SOCIAL TASKS
        </h1>

        {/* 根据API数据渲染任务组 */}
        {loading ? (
          <Spinner />
        ) : (
          // 按sort排序并渲染每个任务组
          taskGroups
            .sort((a, b) => a.sort - b.sort)
            .map((group) => <TaskGroup key={group.id} taskGroup={group} />)
        )}
      </div>
    </>
  );
};

export default SocialTaskPage;
