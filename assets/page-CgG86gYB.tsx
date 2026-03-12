import axios from "@/service";
import { isMobile } from "react-device-detect";
import { cn, Input, Pagination } from "@nextui-org/react";
import GradientBorderCard from "@/components/GradientBorderCard";
import { Link } from "react-router-dom";
import { ArrowRight, Search, ShareIcon } from "lucide-react";
import { getImageUrl, shortStr } from "@/utils/tools";
import CysicTable, { CysicTableColumn } from "@/components/Table";
import usePagnation from "@/hooks/usePagnation";
import { commonPageSize } from "@/config";
import { TableAvatar, TaskStatus, VerifierStatus } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import { useState } from "react";
import { useDebounce } from "ahooks";

interface IVerifier {
    "id": number,
    "task_id": number,
    "taskId": number,
    "name": string,
    "address": string,
    "status": number,
    "avatar": string,
}

const ProjectPage = () => {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, { wait: 500 })
    const { data, loading, total, currentPage, setCurrentPage } = usePagnation((currentPage: number) => {
        return axios.get('/api/v1/zkTask/dashboard/verifier/list', {
            params: {
                pageNum: currentPage,
                pageSize: commonPageSize,
                keyword: debouncedSearch
            }
        })
    }, {
        staleTime: 10_000,
        refreshDeps: [debouncedSearch]
    })

    const taskList = data?.data?.list || [] as IVerifier[]

    const taskListColumns: CysicTableColumn<IVerifier>[] = [
        // {
        //     key: "id",
        //     label: "ID",
        //     renderCell: (row) => (row?.id || row?.task_id || row?.taskId)
        // },
        {
            key: "name",
            label: "Name",
            renderCell: (row) => <TableAvatar avatar={row?.avatar} name={row?.name} />
        },
        {
            key: "address",
            label: "Address",
            renderCell: (row) => (shortStr(row.address, 10))
        },
        {
            key: "status",
            label: "Status",
            renderCell: (row) => <VerifierStatus status={row.status} />
        },
        {
            key: "view",
            label: "View",
            renderCell: (row) => (
                <Link to={`/zk/dashboard/verifier/${row.id || row.task_id || row.taskId}`} className="flex gap-1 items-center justify-end">
                    <span>View</span>
                    <ArrowRight className="size-3" />
                </Link>
            )
        }
    ];


    return (
        <>


            {/* content */}
            <div className={cn("mx-auto mb-auto relative z-10 pt-20 pb-16 w-full", isMobile ? "break-words" : "")}>
                {/* title */}
                <h1 className={cn("unbounded-36-300 mb-24 text-center")}>Verifier</h1>

                {/* s3 */}
                <Input variant="bordered" classNames={{
                    inputWrapper: "!py-4 min-h-fit"
                }} startContent={<Search />} placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                <GradientBorderCard className="mt-4 flex flex-col px-6 py-4">
                    <CysicTable
                        className="[&>div]:!pt-0"
                        data={taskList}
                        columns={taskListColumns}
                        loading={loading}
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

export default ProjectPage;