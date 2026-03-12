import Button from "@/components/Button";
import GradientBorderCard from "@/components/GradientBorderCard";
import { isMobile } from "react-device-detect";
import { cn, Pagination } from "@nextui-org/react";
import CysicTable, { CysicTableColumn } from "@/components/Table";
import Modal from "@/components/Modal";
import useModalState from "@/hooks/useModalState";
import { useRequest } from "ahooks";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { shortStr } from "@/utils/tools";
import { ArrowRight } from "lucide-react";
import { commonPageSize, TaskStatus as TaskStatusText } from "@/config";
import { TaskReward, TaskStatus } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import { Avatar } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import usePagnation from "@/hooks/usePagnation";

interface ITask {
    taskId: number;
    taskHash: string;
    rewardCYS: string;
    rewardCGT: string;
    timeBounds: number;
    status: number;
    "rewardDetail": {
        distributedCYS: string,
        distributedCGT: string,
        planningCYS: string,
        planningCGT: string,
        multiplier: string
    },

    hardwareRequirement: string;
    latency: string;
    proofType: string;

}

interface IProjectDetail {
    avatar: string;
    id: number;
    name: string;
    proofCategory: string;
    proofSize: string;
    timeBounds: number;
    taskCount: number;
    hardwareRequirement: string;
    description: string;
    status: number;
    totalTask: number;
}



const ProjectDetailPage = () => {
    const { id } = useParams();
    const [projectDetail, setProjectDetail] = useState<IProjectDetail>({} as IProjectDetail);
    // const [taskList, setTaskList] = useState<ITask[]>([]);
    useRequest(() => {
        // /zkTask/project/detail
        return axios.get(`/api/v1/zkTask/dashboard/project/detail/${id}`);
    }, {
        ready: !!id,
        refreshDeps: [id],
        onSuccess: (res) => {
            setProjectDetail(res.data as IProjectDetail);
        }
    });

    // useRequest(() => {
    //     return axios.get(`/api/v1/zkTask/dashboard/project/taskList/${id}`);
    // }, {
    //     ready: !!id,
    //     refreshDeps: [id],
    //     onSuccess: (res) => {
    //         setTaskList(res.data?.list as ITask[]);
    //     }
    // });



    const {
        data: listData,
        currentPage,
        total,
        setCurrentPage,
    } = usePagnation(
        (page: number) => {
            return axios.get(
                `/api/v1/zkTask/dashboard/project/taskList/${id}`,
                {
                    params: {
                        pageNum: page,
                        pageSize: commonPageSize,
                    },
                }
            );
        },
        {
            ready: !!id,
            refreshDeps: [id],
            staleTime: 10_000,
        }
    );

    const taskList = listData?.data?.list || []




    const projectColumns: CysicTableColumn<ITask>[] = [
        {
            key: "taskID",
            label: "Task ID",
            width: "33%",
            renderCell: (project) => <span>{project.taskId}</span>,
        },
        {
            key: "taskHash",
            label: "Task Hash",
            width: "33%",
            renderCell: (project) => (
                <div className="flex items-center">
                    {shortStr(project.taskHash, 14)}
                </div>
            ),
        },
        {
            key: "rewards",
            label: "Reward",
            renderCell: (task: any) => <TaskReward rewardCYS={task?.rewardCYS || '-'} rewardCGT={task?.rewardCGT || '-'} />
        },
        {
            key: "latency",
            label: "Latency",
            width: "33%",
            renderCell: (project) => <span>{project?.latency || '-'}</span>,
        },
        {
            key: "proofType",
            label: "Proof Type",
            width: "33%",
            renderCell: (project) => <span>{project?.proofType || '-'}</span>,
        },
        {
            key: "status",
            label: "Status",
            width: "33%",
            renderCell: (project) => <TaskStatus status={project.status} />,
        },
        {
            key: "detail",
            label: "Detail",
            width: "33%",
            renderCell: (project) => <Link className="flex items-center gap-2 justify-end" to={`/zk/dashboard/task/${project.taskId}`}>
                Detail
                <ArrowRight size={16} />
            </Link>,
        },
    ];

    const { visible, setVisible } = useModalState({
        eventName: "modal_project_pause_visible",
    });

    const handleClose = () => {
        setVisible(false);
    };

    const handlePause = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <div className="min-h-screen w-full pb-12 overflow-hidden mx-auto">
                {/* 主标题 */}
                <div className="pt-12 flex flex-col items-center gap-6 relative z-[2]">
                    <div className="flex flex-col items-center gap-4">
                        <span className="unbounded-36-300 text-white text-center">
                            Project Details
                        </span>
                    </div>
                </div>

                {/* 主要内容部分 */}
                <div className="mx-auto mt-12 relative z-[2]">
                    <GradientBorderCard borderRadius={8} className="mb-4">
                        <div className={cn("w-full", isMobile ? "px-6 py-4" : "px-6 py-4")}>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar avatar={projectDetail?.avatar} name={projectDetail?.name} className="size-8" />
                                        <h2
                                            className={cn(
                                                "unbounded-16-20-300 mt-2",
                                            )}
                                        >
                                            {projectDetail?.name || '-'}
                                        </h2>
                                    </div>
                                </div>

                                <div className="flex flex-col lg:flex-row items-start gap-2 lg:gap-4">
                                    <div className="flex flex-col gap-1 flex-1 w-full lg:w-auto">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sub flex-1 lg:flex-none">Proof Category</div>
                                            <div className="flex-1 lg:flex-none">{projectDetail?.proofCategory || '-'}</div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-sub flex-1 lg:flex-none">Proof Size</div>
                                            <div className="flex-1 lg:flex-none">{projectDetail?.proofSize || '-'}</div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-sub flex-1 lg:flex-none">Time Bounds</div>
                                            <div className="flex-1 lg:flex-none">{projectDetail?.timeBounds || '-'}</div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-sub flex-1 lg:flex-none">Task Count</div>
                                            <div className="flex-1 lg:flex-none">{projectDetail?.totalTask || '-'}</div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-2 lg:mt-0 gap-1 lg:gap-0">
                                            <div className="text-sub flex-1 lg:flex-none">Hardware Requirements</div>
                                            <div className="break-words flex-1 lg:flex-none text-left">{projectDetail.hardwareRequirement || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between lg:justify-start w-full lg:w-auto gap-1 text-sm flex-1">
                                        <div className="text-sub">Description</div>
                                        <div className="break-words">{projectDetail.description || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GradientBorderCard>

                    <GradientBorderCard borderRadius={8}>
                        <div className={cn("w-full", isMobile ? "px-6 py-4" : "px-6 py-4")}>
                            <h2
                                className={cn(
                                    "unbounded-16-20-300 mt-2 mb-4",
                                )}
                            >
                                Task List
                            </h2>
                            <CysicTable
                                data={taskList || []}
                                columns={projectColumns}
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
                    </GradientBorderCard>
                </div>
            </div>

            <Modal
                isOpen={visible}
                onClose={handleClose}
                title={"Please COnfirm"}
                className="max-w-[600px]"
            >
                <div className="flex flex-col gap-6">
                    <div className="text-base">
                        Are you sure to pause this project?
                        <br />
                        Please contact our Admin to start this project anytime.
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            needLoading
                            type="light"
                            className="w-full py-4 rounded-lg text-base font-medium"
                            onClick={() => {
                                setVisible(false);
                            }}
                        >
                            CONFIRM
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProjectDetailPage;
