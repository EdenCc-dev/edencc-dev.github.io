// @ts-nocheck
import Button from "@/components/Button";
import { ArrowRight } from "lucide-react";
import GradientBorderCard from "@/components/GradientBorderCard";
import { isMobile } from "react-device-detect";
import { cn } from "@nextui-org/react";
import CysicTable from "@/components/Table";
import { Link } from "react-router-dom";
import useAccount from "@/hooks/useAccount";
import usePagnation from "@/hooks/usePagnation";
import axios from "axios";
import { shortStr } from "@/utils/tools";

export interface IProject {
    id: number;
    name: string;
    domain: string;
    workerAddress: string;
    status: number;
    avatar: string;
}



const ProjectPage = () => {
    const { address, isSigned } = useAccount();

    const { data } =
        usePagnation(() => {
            return axios.get(`/api/v1/zkTask/dashboard/project/list`);
        });

    const { data: myData } =
        usePagnation(() => {
            return axios.get(`/api/v1/zkTask/project/list`);
        }, {
            refreshDeps: [isSigned],
            ready: isSigned
        });

    const myDataData = myData?.data?.list || [];
    const memberData = data?.data?.list || [];

    const projectColumns: CysicTableColumn<IProject>[] = [
        {
            key: "projectName",
            label: "Project Name",
            width: "33%",
            renderCell: (project) => (
                <div className="flex items-center gap-2">
                    {project.avatar ? (
                        <img
                            src={project.avatar}
                            alt="avatar"
                            className="size-6 rounded-full"
                        />
                    ) : (
                        <div className="size-6 bg-gradient-to-b from-[#2744FF] to-[#589EFF] rounded-full flex items-center justify-center">
                            {project.name.slice(0, 2)}
                        </div>
                    )}
                    {/* <div className="size-6 bg-sub rounded-full"></div> */}
                    <span>{project.name}</span>
                </div>
            ),
        },
        {
            key: "domain",
            label: "Domain",
            width: "33%",
            renderCell: (project) => (
                <a href={project.domain} target="_blank" className="flex items-center">
                    <span>{project.domain}</span>
                </a>
            ),
        },
        {
            key: "workerAddress",
            label: <div className="text-right">Worker Address</div>,
            width: "33%",
            renderCell: (project) => (
                <div className="text-right">{shortStr(project.workerAddress, 99)}</div>
            ),
        },
        {
            key: "action",
            label: "",
            width: "10%",
            renderCell: (project) => (
                <Link
                    to={`/zk/project/${project.id}`}
                    className="flex items-center gap-2 text-sm justify-end"
                >
                    <span>VIEW</span>
                    <ArrowRight size={16} />
                </Link>
            ),
        },
    ];

    return (
        <div className="min-h-screen w-full pb-12 overflow-hidden">
            {/* 主标题 */}
            <div className="pt-12 flex flex-col items-center gap-6 relative z-[2]">
                <div className="flex flex-col items-center gap-4">
                    <span className="unbounded-36-300 text-white text-center">
                        PROJECT
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="font-light unbounded text-center">
                            learn about Cysic ZK Project and how to fully utilize it
                        </span>
                        <ArrowRight size={16} />
                    </div>

                    <a target="_blank" href="https://docs.google.com/forms/d/1_AbdPw6vPzlnOFjptblMOZJKqo9d9-LcZTxucp7vI-E/edit">
                        <Button
                            type="solid"
                            className="uppercase !p-6 text-base flex gap-2 items-center "
                        >
                            <span>apply</span>
                            <ArrowRight size={16} />
                        </Button>
                    </a>
                </div>
            </div>

            {/* 主要内容部分 */}
            <div className="mx-auto mt-12 relative z-[2]">
                {/* 第一部分：成为 Prover */}
                {address ? (
                    <GradientBorderCard borderRadius={8} className="mb-4 px-6 py-4">
                        <div className={cn("w-full ")}>
                            <div className="flex items-center justify-between gap-2 mb-6 ">
                                <h2
                                    className={cn(
                                        "unbounded-16-20-300",
                                    )}
                                >
                                    My projects
                                </h2>

                                <Link
                                    to="/zk/project/my"
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <span className="uppercase">see all</span>
                                    <ArrowRight size={16} />
                                </Link>
                            </div>

                            <p className="unbounded-32-300 text-right">{myDataData?.data?.total || 0}</p>
                        </div>
                    </GradientBorderCard>
                ) : null}

                <GradientBorderCard borderRadius={8} className="px-6 py-4">
                    <div className={cn("w-full")}>
                        <h2
                            className={cn(
                                "unbounded-16-20-300 mb-4",
                            )}
                        >
                            All projects
                        </h2>
                        <CysicTable
                            data={memberData}
                            columns={projectColumns}
                            keyExtractor={(member) => member.id}
                        />
                    </div>
                </GradientBorderCard>
            </div>
        </div>
    );
};

export default ProjectPage;
