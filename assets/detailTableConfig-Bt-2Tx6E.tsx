import StatusIcon from "@/components/StatusIcon";
import CysicTable from "@/components/Table";
import { TaskStatus, mediasLink, rewardStatus } from "@/config";
import { getImageUrl, shortStr } from "@/utils/tools";

import { BrowserView, MobileView, isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import { Tooltip } from "@nextui-org/react";
import { ArrowUpRightIcon } from "lucide-react";
const formatRankImg = (v: any) => {
    switch (v.toString()) {
        case '1':
            return getImageUrl('@/assets/images/leadingboard/rank1.svg')
        case '2':
            return getImageUrl('@/assets/images/leadingboard/rank2.svg')
        case '3':
            return getImageUrl('@/assets/images/leadingboard/rank3.svg')
    }
}

// 支持自定义render函数的renderCell
export const renderCell = (item: any, columnKey: any, columnConfig?: any) => {
    if (!item) return "-";
    
    // 检查是否提供了自定义render函数，优先使用
    if (columnConfig?.renderCell) {
        return columnConfig.renderCell(item, columnKey);
    }
    
    switch (columnKey) {
        case "proofHash": {
            const hash = item?.[columnKey]
            return hash || '-'
        }

        case "commitTx": {
            const tx = item?.[columnKey]
            return tx || '-'
        }

        case "verifierName": {
            const list = Object.entries(item?.['verifyResult']) || [];
            return (
                <Link
                    to={"/zk/dashboard/verifier/" + item?.id?.toString()}
                    className="flex items-center gap-1"
                >
                    <BrowserView className="flex items-center gap-1">
                        <span >{item?.name}</span>
                        <ArrowUpRightIcon className="size-3" />
                    </BrowserView>
                    <MobileView className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                            <span >{item?.name}</span>
                            <ArrowUpRightIcon className="size-3" />
                        </div>
                        <div className="flex items-center gap-1">
                            {list?.map((i: any, index: number) => {
                                return (
                                    <Tooltip content={i?.[0]} key={index}>
                                        <div>
                                            <StatusIcon status={i?.[1]} />
                                        </div>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </MobileView>
                </Link>
            );
        }
        case '#':
            if (item?.['hasReward'] != 1) {
                return <div className="flex items-center font-semibold text-white w-8">-</div>;
            }
            // return <div className="flex items-center font-semibold text-[#00F0FF] w-8">{formatRank(item?.[columnKey])}</div>;
            return <div className="flex items-center font-semibold text-[#00F0FF] w-8">
                <img className="size-5" src={formatRankImg(item?.[columnKey])} />
            </div>;
        case "proverName":
            return (
                <Link
                    to={"/zk/dashboard/prover/" + item?.id?.toString()}
                    className="flex items-center gap-1"
                >
                    <span >{item?.name}</span>
                    <ArrowUpRightIcon className="size-3" />
                </Link>
            );
        // return BigNumber(getKeyValue(item, columnKey)).div(1e0).toString();
        case "verifyResult": {
            const _list = Object.entries(item?.[columnKey]) || [];
            return (
                <div className="flex items-center gap-1">
                    {_list?.map((i: any, index: number) => {
                        return (
                            // i?.[0]
                            <Tooltip content={index + 1} key={index}>
                                <div>
                                    <StatusIcon status={i?.[1]} />
                                </div>
                            </Tooltip>
                        );
                    })}
                </div>
            );
        }

        case "createBlock":
            // jump to explorer
            return (
                <div className="flex items-center gap-1">
                    <span>{item?.[columnKey]}</span>
                    <a target="_blank" href={mediasLink.cosmosExplorer + `/blocks/${item?.[columnKey]}`}>
                        <ArrowUpRightIcon className="size-3" />
                    </a>
                </div>
            );
        case "claimRewardBlock": {
            // jump to explorer
            const blocks = item?.[columnKey]
            return (
                <div className="flex items-center gap-1">
                    <span>{blocks > 0 ? blocks : '-'}</span>
                    {
                        +blocks > 0 ? <a target="_blank" href={mediasLink.cosmosExplorer + `/blocks/${blocks}`}>
                            <ArrowUpRightIcon className="size-3" />
                        </a> : null
                    }

                </div>
            );
        }
        case "taskStatus":
            return (
                <div className="flex items-center gap-1">
                    <span>{TaskStatus[item?.[columnKey]]}</span>
                </div>
            );
        case "projectName":
            return (
                <Link
                    to={`/zk/dashboard/project/${item?.projectId}`}
                    className="flex items-center gap-1 cursor-pointer"
                >
                    <span>{item?.[columnKey]}</span>
                    <ArrowUpRightIcon className="size-3" />
                </Link>
            );

        case 'rewardStatus':
            return (
                <div className="flex items-center gap-1">
                    <StatusIcon status={item?.['has_reward']} />
                    <span>{rewardStatus[item?.['has_reward']]}</span>
                </div>
            )
        case "provider": {
            const _providerList = item?.providerResultList?.length ? item?.providerResultList?.map((i: any, index: number) => {
                return {
                    ...i,
                    '#': index + 1
                }
            }) : []

            return (
                <CysicTable
                    className="[&>div]:!p-0"
                    columns={[
                        {
                            key: "#",
                            label: "#",
                        },
                        {
                            key: "proverName",
                            label: "proverName",
                        },
                        {
                            key: "rewardStatus",
                            label: "Reward Status",
                        },
                        {
                            key: "proofHash",
                            label: "proof_hash",
                        },
                        {
                            key: "commitTx",
                            label: "commitHash",
                        },
                    ]}
                    data={_providerList}
                />
            );
        }

        case "proofList": {
            const columns = [
                {
                    key: "name",
                    label: "Prover Name",
                    renderCell: (item: any) => {
                        return <span className="break-all">{item?.name}</span>
                    }
                },
                {
                    key: "proofHash",
                    label: "Hash",
                    renderCell: (item: any) => {
                        return <span className="break-all">{item?.proofHash}</span>
                    }
                },
                {
                    key: "commitHash",
                    label: "Commit Hash",
                    renderCell: (item: any) => {
                        return <span className="break-all">{item?.commitHash}</span>
                    }
                }
            ]
            return (
                <CysicTable
                    columns={columns}
                    data={item?.proofList || []}
                    className="[&>div]:!p-0"
                />
            )
        }

        case "verifier": {

            const columns = [
                {
                    key: "name",
                    label: "Verifier Name",
                    renderCell: (item: any) => {
                        return <span className="break-all">{item?.name}</span>
                    }
                },
                {
                    key: "verifyResult",
                    label: "Verify Result",
                    renderCell: (row: any) => {
                        return (<div className="flex itmes-center gap-2">
                            {
                                Object.entries(row?.verifyResult).map(([key, value], index) => {
                                    return (
                                        <div key={index}>
                                            <StatusIcon status={value} />
                                        </div>
                                    )
                                })
                            }
                        </div>)
                    }
                },
                {
                    key: "commitHash",
                    label: "Commit Hash",
                    renderCell: (item: any) => {
                        return <span className="break-all">{item?.commitHash}</span>
                    }
                },
            ]

            return (
                <CysicTable
                    columns={columns}
                    data={item?.verifyResultList || []}
                    className="[&>div]:!p-0"
                />
            );
        }

        case "inputData":
            return (
                <div className="break-all	flex items-center gap-1 text-sm border border-[#FFFFFF33] rounded-[16px] p-3 bg-[transparent]">
                    <span>{item?.[columnKey]}</span>
                </div>
            );
        default:
            return item?.[columnKey] || '-';
    }
};