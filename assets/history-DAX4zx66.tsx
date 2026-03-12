/* eslint-disable no-case-declarations */
import axios from "@/service";

import { useState } from "react";
import Copy from "@/components/Copy";
import {
    Tabs,
    Tab,
} from "@nextui-org/react";
import usePagnation from "@/hooks/usePagnation";
import { commonPageSize } from "@/config";
import { shortStr } from "@/utils/tools";
import ConnectButton from "@/components/connectButton";
import dayjs from "dayjs";
import GradientBorderCard from "@/components/GradientBorderCard";
import { Avatar } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import useAccount from "@/hooks/useAccount";
import CysicTable from "@/components/Table";
import { Pagination } from "@nextui-org/react";

const TxStatus: any = {
    init: "Pending",
    waitFinish: "Pending",
    finish: "Finish",
    failed: "Failed",
};

const TxStatusColor: any = {
    init: "#737373",
    waitFinish: "#737373",
    finish: "#11D473",
    failed: "#FF401A",
};


const HistoryC = () => {
    const { address, avatarUrl } = useAccount();
    const [selected, setSelected] = useState<any>("deposit");

    // const [dataList, setDataList] = useState<any>()
    // useRequest(() => {
    //     return axios.get(`/api/v1/bridge/history/${address}?pageNum=0&pageSize=100`)
    // }, {
    //     ready: !!address && !!selected,
    //     refreshDeps: [address, selected],
    //     onSuccess(e) {
    //         console.log('res', e?.data?.list)
    //         setDataList(e?.data?.list)
    //     },
    // })

    const {
        data: dataList,
        total,
        currentPage,
        setCurrentPage,
        loading: isLoading,
    } = usePagnation(
        (page: number) => {
            // return Promise.resolve(mock);

            return axios.get(`/api/v1/bridge/history/${address}`, {
                params: {
                    event: selected,
                    pageNum: page,
                    pageSize: commonPageSize,
                },
            });
        },
        {
            ready: !!address,
            refreshDeps: [address, selected, selected],
        }
    );

    const depositColumns = [
        {
            key: "createdAt",
            label: "Time",
            renderCell: (item: any) => {
                return <div>{dayjs.unix(Number(item?.createdAt)).format("YYYY/MM/DD HH:mm") || "-"}</div>;
            },
        },
        {
            key: "amount",
            label: "Amount",
        },
        {
            key: "sourceTxHash",
            label: "TX1",
            renderCell: (item: any) => {
                return <div>{shortStr(item?.sourceTxHash, 14) || "-"}</div>;
            },
        },
        {
            key: "targetTxHash",
            label: "TX2",
            renderCell: (item: any) => {
                return <div>{shortStr(item?.targetTxHash, 14) || "-"}</div>;
            },
        },
        {
            key: "status",
            label: "Status",
            renderCell: (item: any) => {
                return <div className="flex items-center gap-1 justify-end">
                    <div
                        className="size-3 rounded-full"
                        style={{ background: TxStatusColor[item?.status] }}
                    />
                    <span>{TxStatus[item?.status]}</span>
                </div>
            },
        },
    ];

    const withdrawColumns = [
        {
            key: "createdAt",
            label: "Time",
            renderCell: (item: any) => {
                return <div>{dayjs.unix(Number(item?.createdAt)).format("YYYY/MM/DD HH:mm") || "-"}</div>;
            },
        },
        {
            key: "amount",
            label: "Amount",
        },
        {
            key: "sourceTxHash",
            label: "TX1",
            renderCell: (item: any) => {
                return <div>{shortStr(item?.sourceTxHash, 14) || "-"}</div>;
            },
        },
        {
            key: "targetTxHash",
            label: "TX2",
            renderCell: (item: any) => {
                return <div>{shortStr(item?.targetTxHash, 14) || "-"}</div>;
            },
        },
        {
            key: "status",
            label: "Status",
            renderCell: (item: any) => {
                return <div className="flex items-center gap-1 justify-end">
                    <div
                        className="size-3 rounded-full"
                        style={{ background: TxStatusColor[item?.status] }}
                    />
                    <span>{TxStatus[item?.status]}</span>
                </div>
            }
        },
    ];

    const tabs = [
        {
            id: "deposit",
            label: "Deposit",
            content: (
                <CysicTable
                    //   type="deposit"
                    columns={depositColumns}
                    data={dataList?.data?.events || []}
                    loading={isLoading}
                />
            ),
        },
        {
            id: "withdraw",
            label: "Withdraw",
            content: (
                <CysicTable
                    //   type="withdraw"
                    columns={withdrawColumns}
                    data={dataList?.data?.events || []}
                    loading={isLoading}
                />
            ),
        },
    ];

    return (
        <div className="main-container">
            <div className="flex flex-col gap-4">
                <GradientBorderCard className="flex items-center gap-6 px-6 py-4">
                    <Avatar
                        className="!size-12"
                        avatar={avatarUrl || ""}
                        name={address || ""}
                    />
                    <div className="flex gap-12">
                        <span className="text-sm teacher !normal-case">Account</span>
                        <Copy value={address}>
                            <span className="text-sm teacher !normal-case">{address}</span>
                        </Copy>
                    </div>
                </GradientBorderCard>
                <GradientBorderCard className="px-6 py-4">
                    <Tabs
                        selectedKey={selected}
                        onSelectionChange={(v) => {
                            setSelected(v);
                            setCurrentPage(0);
                        }}
                        classNames={{
                            base: "pb-4",
                            tabList: "w-full border-b border-white/30 !p-0 !gap-0",
                            cursor: "h-px w-full",
                            tab: "!p-0 w-[8.75rem]",
                            panel: "!p-0",
                            tabContent: "teacher text-base font-medium !normal-case",
                        }}
                        className="w-full"
                        variant={"underlined"}
                        aria-label="Dynamic tabs"
                        items={tabs}
                    >
                        {(item) => (
                            <Tab key={item.id} title={item.label}>
                                {item.content}
                            </Tab>
                        )}
                    </Tabs>
                    <Pagination
                        total={Math.ceil(total / commonPageSize)}
                        initialPage={1}
                        page={currentPage}
                        onChange={setCurrentPage}
                        color="primary"
                        size="sm"
                    />

                    {!address ? <ConnectButton className="mx-auto" /> : null}
                </GradientBorderCard>
            </div>
        </div>
    );
};

export default HistoryC;
