import { useRequest } from "ahooks";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GradientBorderCard from "@/components/GradientBorderCard";
import { cn, Pagination } from "@nextui-org/react";
import { renderCell } from "@/routes/pages/Zk/dashboard/components/detailTableConfig";
import { shortStr } from "@/utils/tools";
import { commonPageSize, mediasLink } from "@/config";
import usePagnation from "@/hooks/usePagnation";
import CysicTable from "@/components/Table";
import { ArrowRight, ArrowUpRightIcon } from "lucide-react";
import { ProverStatus, TaskReward, TaskStatus } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import { DashboardDetailMainWrapper } from "@/routes/pages/Zk/components/template";
import { Avatar } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import Copy from "@/components/Copy";
import dayjs from "dayjs";



const ProverDetail = () => {
    const { t } = useTranslation();
    const params = useParams();

    const { data } = useRequest(
        () => {
            // return Promise.resolve(mock);

            return axios.get(`/api/v1/zkTask/dashboard/prover/detail/${params?.id}`);
        },
        {
            ready: !!params?.id,
            refreshDeps: [params?.id],
        }
    );

    const rows = data?.data || {};

    const columns = [
        {
            key: "name",
            label: "Prover Name",
        },
        {
            key: "address",
            label: "Address",
            renderCell: (item: any) => {
                return <div className="flex flex-col gap-2">
                    <Copy value={item?.address} >{item?.address}</Copy>
                    <Copy value={item?.cysicAddress} >{item?.cysicAddress}</Copy>
                    {/* <a target="_blank" href={mediasLink.cosmosExplorer + `/address/${item?.address}`}
                        className="flex items-center gap-2">
                        <span className="flex-1 lg:flex-none">{item?.address}</span>
                        <ArrowUpRightIcon className="size-3" />
                    </a>
                    <a target="_blank" href={mediasLink.cosmosExplorer + `/address/${item?.cysicAddress}`}
                        className="flex items-center gap-2 text-[#737373]">
                        <span className="flex-1 lg:flex-none">{item?.cysicAddress}</span>
                        <ArrowUpRightIcon className="size-3" />
                    </a> */}
                </div>
            }
        },
        {
            key: "totalTask",
            label: "Task Amount",
            renderCell: (item: any) => {
                return <span>{item?.totalTask || 0}</span>
            }
        },
        {
            key: "finishTask",
            label: "Task Finished Amount",
            renderCell: (item: any) => {
                return <span>{item?.finishTask || 0}</span>
            }
        },
        {
            key: "status",
            label: "Status",
            renderCell: (item: any) => {
                return <ProverStatus status={item?.status} />
            }
        },
        {
            key: "rewards",
            label: "Distributed Rewards",
            renderCell: (task: any) => <TaskReward rewardCYS={task?.rewardDetail?.distributedCYS || '0'} rewardCGT={task?.rewardDetail?.distributedCGT || '0'} />
        },
    ];



    const { data: listData, currentPage, total, setCurrentPage } = usePagnation(
        (page: number) => {
            return axios.get(`/api/v1/zkTask/dashboard/prover/taskList/${params?.id}`, {
                params: {
                    pageNum: page,
                    pageSize: commonPageSize
                }
            });
        },
        {
            ready: !!params?.id,
            refreshDeps: [params?.id],
            staleTime: 10_000,
        }
    );

    const listColumns = [
        {
            key: "taskId",
            label: "Task ID",
        },
        {
            key: "taskHash",
            label: "Task Hash",
            renderCell: (item: any) => {
                return shortStr(item?.taskHash, 10)
            }
        },
        {
            key: "proofType",
            label: "Proof Type",
        },
        {
            key: "status",
            label: "Status",
            renderCell: (item: any) => {
                return <TaskStatus status={item?.status} />
            }
        },
        {
            key: "startAt",
            label: "Start Time",
            renderCell: (item: any) => {
                // return <VerifierTaskStatus status={item?.verifyResult} />
                return dayjs(item?.startAt * 1000).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            key: "finishAt",
            label: "End Time",
            renderCell: (item: any) => {
                // return <VerifierTaskStatus status={item?.verifyResult} />
                return item?.finishAt ? dayjs(item?.finishAt * 1000).format('YYYY-MM-DD HH:mm:ss') : '-';
            },
        },
        {
            key: "detail",
            label: "Task Detail",
            renderCell: (item: any) => {
                return <Link to={`/zk/dashboard/task/${item?.taskId}`} className="flex items-center justify-end gap-2">
                    <span>View</span>
                    <ArrowRight className="size-3" />
                </Link>
            }
        },

    ]

    return (
        <DashboardDetailMainWrapper title="Prover Detail" detail={
            <GradientBorderCard >
                <Avatar className="!size-14" avatar={rows?.avatar} name={rows?.name} />
                <div >
                    {columns?.map((i, index) => {
                        return (
                            <div key={i?.key || index}
                                className={cn(
                                    ["verifier", "provider", "inputData"].includes(i?.key) &&
                                    "flex-col lg:flex-row !items-start",
                                    "gap-2 flex-wrap lg:gap-10",
                                    "flex items-start"
                                )}>
                                <div className="text-[#A3A3A3] w-[10rem] flex-1 lg:flex-none">{t(i?.label)}</div>
                                <div className={cn("break-words flex-wrap flex-1")}>{renderCell(rows, i?.key, i)}</div>
                            </div>
                        );
                    })}
                </div>
            </GradientBorderCard>
        } table={
            <GradientBorderCard >
                <CysicTable className="[&>div]:!p-0" columns={listColumns} data={listData?.data?.list || []} />

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
        } />


    );
};

export default ProverDetail;
