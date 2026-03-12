import GradientBorderCard from "@/components/GradientBorderCard";
import CysicTable from "@/components/Table";
import { appUrl, commonPageSize } from "@/config";
import useAccount from "@/hooks/useAccount";
import usePagnation from "@/hooks/usePagnation";
import { TaskReward, TaskStatus } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import { shortStr } from "@/utils/tools";
import { Pagination } from "@nextui-org/react";
// import Tab, { TabItem } from "@/routes/components/Tab";
import { Tabs, Tab } from "@nextui-org/tabs";
import axios from "axios";
import dayjs from "dayjs";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface IVerifier {
    "taskId": number
    "taskHash": string
    "prover": string
    "rewardCYS": string
    "rewardCGT": string
    "verifyResult": number
    "taskResult": number
    "startAt": string
    "finishAt": string
}

interface IProver {
    "taskId": number
    "taskHash": string
    "proofType": string
    "status": number
    "startAt": string
    "finishAt": string
}

const verifierListColumns = [
    {
        key: "taskId",
        label: "Task ID",
        renderCell: (item: any) => {
            return item?.taskId || item?.task_id;
        },
    },
    {
        key: "taskHash",
        label: "Task Hash",
        renderCell: (item: any) => {
            return shortStr(item?.taskHash || item?.task_hash, 16);
        },
    },
    {
        key: "result",
        label: "Result",
        renderCell: (item: any) => {
            // return <VerifierTaskStatus status={item?.verifyResult} />
            return <TaskStatus status={item?.taskResult} />;
        },
    },
    {
        key: "reward",
        label: "Multiplied Rewards",
        renderCell: (item: any) => {
            // return <VerifierTaskStatus status={item?.verifyResult} />
            return <TaskReward rewardCGT={item?.rewardCGT || '-'} rewardCYS={item?.rewardCYS || '-'} />;
        },
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
            return (
                <Link
                    to={`${appUrl}/dashboard/task/${item?.taskId || item?.task_id}`}
                    className="flex items-center justify-end gap-2"
                >
                    <span>View</span>
                    <ArrowRightIcon className="size-3" />
                </Link>
            );
        },
    },
];

const proverListColumns = [
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

const MyVerifierTaskList = ({ removeData }: { removeData: boolean }) => {
    const { isSigned } = useAccount()
    const { data: listData, loading, total, currentPage, setCurrentPage } = usePagnation(
        (currentPage: number) => {
            return axios.get(`/api/v1/zkTask/verifier/taskList`, {
                params: {
                    pageNum: currentPage,
                    pageSize: commonPageSize,
                },
            });
        },
        {
            ready: !!isSigned,
            staleTime: 10_000,
            refreshDeps: [isSigned],
        }
    );
    const list = removeData ? [] : listData?.data?.list || [] as IVerifier[]


    return (
        <>
            <CysicTable
                columns={verifierListColumns}
                data={(list || [])}
                loading={loading}
            />

            {!removeData && total > commonPageSize && (
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
        </>
    );
};

const MyProverTaskList = ({ removeData }: { removeData: boolean }) => {
    const { isSigned } = useAccount()
    const { data: listData, loading, total, currentPage, setCurrentPage } = usePagnation(
        (currentPage: number) => {
            return axios.get(`/api/v1/zkTask/prover/taskList`, {
                params: {
                    pageNum: currentPage,
                    pageSize: commonPageSize,
                },
            });
        },
        {
            ready: !!isSigned,
            staleTime: 10_000,
            refreshDeps: [isSigned],
        }
    );
    const list = removeData ? [] : listData?.data?.list || [] as IProver[]

    return (
        <>
            <CysicTable
                columns={proverListColumns}
                data={(list || [])}
                loading={loading}
            />

            {!removeData && total > commonPageSize && (
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
        </>
    );
};

const tabs = [
    {
        name: "My Task List - Verifier",
        value: 0,
    },
    {
        name: "My Task List - Prover",
        value: 1,
    },
];

export const MyTask = () => {
    const { address } = useAccount()
    const [tab, setTab] = useState<any>(tabs[0].value);

    return (
        <>
            <GradientBorderCard borderRadius={8} className="px-6 py-4 relative">
                <>
                    <Tabs
                        key={"underlined"}
                        aria-label="Tabs variants"
                        variant={"underlined"}
                        classNames={{
                            base: "pb-4",
                            tabList: "w-full  !p-0 !gap-0",
                            cursor: "h-px w-full",
                            tab: "!px-0 !py-4 h-fit w-[12.75rem]",
                            panel: "!p-0",
                            tabContent: "teachers-16 font-medium",
                        }}
                        className="w-full"
                        selectedKey={tab}
                        onSelectionChange={(v) => {
                            setTab(v);
                        }}
                    >
                        {tabs.map((tab) => (
                            <Tab key={tab.value} title={tab.name} />
                        ))}
                    </Tabs>

                    {tab == tabs?.[0]?.value ? (
                        <MyVerifierTaskList removeData={!address} />
                    ) : (
                        <MyProverTaskList removeData={!address} />
                    )}
                </>
            </GradientBorderCard>
        </>
    );
};
