import axios from "@/service";
import { isMobile } from "react-device-detect";
import { cn, Pagination } from "@nextui-org/react";
import GradientBorderCard from "@/components/GradientBorderCard";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { shortStr } from "@/utils/tools";
import CysicTable, { CysicTableColumn } from "@/components/Table";
import usePagnation from "@/hooks/usePagnation";
import { commonPageSize } from "@/config";
import { TaskReward, TaskStatus } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import dayjs from "dayjs";

interface ITask {
    "id": number,
    "taskHash": string,
    "createBlock": number,
    "createAt": string,
    "reward": string,
    "rewardCYS": string,
    "rewardCGT": string,
    "rewardDetail": {
        distributedCYS: string,
        distributedCGT: string,
        planningCYS: string,
        planningCGT: string,
        multiplier: string
    },
    "status": number
}


const status = 0
const TaskPage = () => {
    const { data: taskListData, total, currentPage, setCurrentPage } = usePagnation((currentPage: number) => {
        return axios.get('/api/v1/zkTask/dashboard/task/list', {
            params: {
                pageNum: currentPage,
                pageSize: commonPageSize,
                status: status
            }
        })
    }, {
        staleTime: 10_000
    })

    const taskList = taskListData?.data?.list || [] as ITask[]

    const taskListColumns: CysicTableColumn<ITask>[] = [
        {
            key: "taskHash",
            label: "Task Hash",
            renderCell: (task) => (shortStr(task.taskHash, 12))
        },
        {
            key: "createBlock",
            label: "Create Block",
            renderCell: (task) => (task.createBlock)
        },
        {
            key: "planningReward",
            label: "Planning Reward",
            renderCell: (task: any) => <TaskReward rewardCYS={task?.rewardDetail?.planningCYS || '-'} rewardCGT={task?.rewardDetail?.planningCYS || '-'} />
        },
        {
            key: "distributedReward",
            label: "Distributed Reward",
            renderCell: (task: any) => <TaskReward rewardCYS={task?.rewardDetail?.distributedCYS || '-'} rewardCGT={task?.rewardDetail?.distributedCGT || '-'} />
        },
        {
            key: "createAt",
            label: "Created at",
            renderCell: (task) => (dayjs.unix(Number(task.createAt)).format("YYYY/MM/DD HH:mm"))
        },
        {
            key: "status",
            label: "Status",
            renderCell: (task) => (<TaskStatus status={task.status} />)
        },
        {
            key: "view",
            label: "View",
            renderCell: (task) => (
                <Link to={`/zk/dashboard/task/${task.id}`} className="flex gap-1 items-center justify-end">
                    <span>View</span>
                    <ArrowRightIcon className="size-3" />
                </Link>
            )
        }
    ];


    return (
        <>

            {/* content */}
            <div className={cn("mx-auto mb-auto relative z-10 pt-20 pb-16 w-full", isMobile ? "break-words" : "")}>
                {/* title */}
                <h1 className={cn("unbounded-36-300 mb-12 text-center")}>Task</h1>

                {/* s3 */}
                <GradientBorderCard className="mt-8 flex flex-col px-6 py-4">
                    <CysicTable
                        data={taskList}
                        columns={taskListColumns}
                        className="[&>div]:!pt-0"
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
                </GradientBorderCard>





            </div>
        </>
    );
};

export default TaskPage;