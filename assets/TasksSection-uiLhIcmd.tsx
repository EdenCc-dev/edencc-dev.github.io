import GradientBorderCard from "@/components/GradientBorderCard";
import Button from "@/components/Button";
import { getImageUrl, sleep } from "@/utils/tools";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import dayjs from "dayjs";
import { ETaskType, EUserTaskStatus } from "@/routes/pages/Admin/interface";
import { TASK_TYPE_LABELS } from "@/routes/pages/Admin/components/TaskManagement";
import useKrActivity from "@/models/kr";
import { useTranslation } from "react-i18next";
import { taskApi } from "@/routes/pages/Kr/krApi";
import { toast } from "react-toastify";

interface Task {
  id: number;
  title: string;
  description: string;
  imgUrl: string;
  taskType: string;
  RewardPoints: number;
  RewardStampId: number;
  startAt: number;
  endAt: number;
  forceLocked: boolean;
  currentStatus: number;
  taskResult: string;
  createdAt: number;
  updatedAt: number;
}

interface TasksSectionProps {
  taskList: Task[];
  loading: boolean;
  ifActive: boolean;
}

const getTaskStatusText = (status: number, startString?: string, t?: any) => {
  switch (status) {
    case EUserTaskStatus.UserTaskCompletionStatusIncomplete:
      return startString || t("start");
    case EUserTaskStatus.UserTaskCompletionStatusPending:
      return t("pending");
    case EUserTaskStatus.UserTaskCompletionStatusWaitClaim:
      return t("claim");
    case EUserTaskStatus.UserTaskCompletionStatusCompleted:
      return t("completed");
    case EUserTaskStatus.UserTaskCompletionStatusRejected:
      return t("rejected");
    default:
      return t("start");
  }
};

export const TasksSection = ({
  taskList,
  loading,
  ifActive,
}: TasksSectionProps) => {
  const { t } = useTranslation();
  const { totalWeeks, week, setState } = useKrActivity();

  // [{key, label}]
  const weekSelects = Array.from({ length: totalWeeks }, (_, index) => ({
    key: (index + 1)?.toString(),
    label: index + 1 >= 5 ? 'Bonus Week' : `${t("week")} ${index + 1}`,
  }));

  // 根据startAt分类
  const formattedTaskMap = taskList
    ?.sort((a, b) => {
      return b.startAt - a.startAt;
    })
    .reduce((acc: Record<string, Task[]>, task: Task) => {
      const startAt = (task.startAt * 1000).toString();
      if (!acc[startAt]) {
        acc[startAt] = [];
      }
      acc[startAt].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

  const formattedTaskList = Object.values(formattedTaskMap);
  return (
    <div className="flex-1 py-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 unbounded-24-200">
          {t("tasks")}
        </div>

        <Select
          items={weekSelects}
          classNames={{
            value: "!unbounded-24-200 ",
            innerWrapper: "w-fit",
            trigger: "w-fit !pr-10",
          }}
          className="[&_button]:p-0 w-[160px] flex items-center gap-1 [&_button]:!bg-transparent"
          defaultSelectedKeys={[week?.toString()]}
          value={[week?.toString()]}
          onChange={(e) => {
            setState({ week: e.target.value.toString() });
            dispatchEvent(new CustomEvent("cysic_kr_tasks_change_week"));
          }}
        >
          {(week) => <SelectItem>{week.label}</SelectItem>}
        </Select>
      </div>

      <div className="relative mt-4 flex flex-col gap-6">
        {loading && taskList?.length ? (
          <div className="z-[10] absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2 flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : null}
        {loading && !taskList?.length ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : formattedTaskList.length > 0 ? (
          (formattedTaskList as Task[][]).map((tasks: Task[], idx: number) => {
            const day = dayjs(tasks[0].startAt * 1000).format("dddd");
            const startAt = dayjs(tasks[0].startAt * 1000).format("YYYY-MM-DD");
            return (
              <div key={idx} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="">
                    <span className="unbounded-18-200">{day}</span>{" "}
                    <span className="text-white/60 text-sm">({startAt})</span>
                  </div>
                </div>
                {tasks.map((task: Task) => (
                  <GradientBorderCard
                    key={task.id}
                    borderRadius={8}
                    className="px-4 py-4 flex flex-row justify-between items-center"
                  >
                    <>
                      <div className="flex items-start gap-3">
                        <img
                          src={
                            task.imgUrl ||
                            getImageUrl(
                              "@/assets/images/_global/stake_landing_bg.png"
                            )
                          }
                          alt={task.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="unbounded-18-400">{task.title}</p>
                            <div
                              className="bg-white text-black px-1 uppercase scale-75 font-semibold origin-left rounded-[4px]"
                              children={
                                TASK_TYPE_LABELS[
                                  task.taskType as keyof typeof TASK_TYPE_LABELS
                                ]
                              }
                            />
                          </div>
                          <div className="teachers-14-200 !normal-case text-white/80 mt-1">
                            {task.description}
                          </div>
                          <div className="flex items-center justify-between mt-4 text-sm">
                            <div className="flex flex-col items-start gap-1">
                              <div>
                                <span className="text-white/60">
                                  {t("reward")}
                                </span>{" "}
                                {task.RewardPoints} {t("points")}
                              </div>
                              <div>
                                <span className="text-white/60">
                                  {t("expireAt")}
                                </span>{" "}
                                {dayjs(task.endAt * 1000).format(
                                  "MMM DD, YYYY"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        disabled={
                          (task.currentStatus == EUserTaskStatus.UserTaskCompletionStatusWaitClaim && task.taskType === ETaskType.TaskTypeQuoteTwitter) ? false :
                          (task.currentStatus == EUserTaskStatus.UserTaskCompletionStatusWaitClaim || task.currentStatus == EUserTaskStatus.UserTaskCompletionStatusCompleted) && task.taskType === ETaskType.TaskTypeQuiz
                            ? false
                            : !ifActive ||
                              dayjs().isBefore(dayjs(task.startAt * 1000)) ||
                              dayjs(task.endAt * 1000).isBefore(dayjs()) ||
                              task.currentStatus ==
                                EUserTaskStatus.UserTaskCompletionStatusCompleted ||
                              task.currentStatus ==
                                EUserTaskStatus.UserTaskCompletionStatusPending
                        }
                        className="min-h-fit h-fit"
                        type="light"
                        onClick={async () => {
                          if (
                            task.currentStatus ==
                            EUserTaskStatus.UserTaskCompletionStatusWaitClaim
                          ) {
                            const res = await taskApi.claimTask(task.id);
                            dispatchEvent(
                              new CustomEvent("cysic_kr_tasks_refresh")
                            );

                            await sleep(1_000);

                            if (res.code == "200") {
                              toast.success(res.msg);
                              return;
                            }
                            toast.error(res.msg);
                          } else {
                            dispatchEvent(
                              new CustomEvent("cysic_kr_tasks_action", {
                                detail: task,
                              })
                            );
                          }
                        }}
                      >
                        {task.taskType === ETaskType.TaskTypeQuiz &&
                        (task.currentStatus == EUserTaskStatus.UserTaskCompletionStatusCompleted || dayjs().isAfter(dayjs(task.endAt * 1000)))
                          ? "정답확인"
                          : getTaskStatusText(
                              task.currentStatus,
                              task.taskType === ETaskType.TaskTypeQuoteTwitter
                                ? t("comment")
                                : task.taskType ===
                                  ETaskType.TaskTypeQuoteTwitter
                                ? "Intergration"
                                : task.taskType ===
                                  ETaskType.TaskTypePostTwitter
                                ? t("post")
                                : undefined,
                              t
                            )}
                      </Button>
                    </>
                  </GradientBorderCard>
                ))}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-white/60">
            {t("noTasksAvailable")}
          </div>
        )}
      </div>
    </div>
  );
};
