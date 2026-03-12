import { useRequest } from "ahooks";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GradientBorderCard from "@/components/GradientBorderCard";
import { cn, Pagination } from "@nextui-org/react";
import { renderCell } from "@/routes/pages/Zk/dashboard/components/detailTableConfig";
import { shortStr } from "@/utils/tools";
import {
  commonPageSize,
} from "@/config";
import usePagnation from "@/hooks/usePagnation";
import CysicTable from "@/components/Table";
import { TaskReward, TaskStatus, VerifierTaskStatus } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { DashboardDetailMainWrapper } from "@/routes/pages/Zk/components/template";
import { Avatar } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import Copy from "@/components/Copy";
import dayjs from "dayjs";

const VerifierDetail = () => {
  const { t } = useTranslation();
  const params = useParams();

  const { data } = useRequest(
    () => {
      // return Promise.resolve(mock);

      return axios.get(
        `/api/v1/zkTask/dashboard/verifier/detail/${params?.id}`
      );
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
      label: "Verifier Name",
    },
    {
      key: "address",
      label: "Address",
      renderCell: (item: any) => {
        return (

          <div className="flex flex-col gap-2">
            <Copy value={item?.address} >{item?.address}</Copy>
            <Copy value={item?.cysicAddress} >{item?.cysicAddress}</Copy>
          </div>
        );
      },
    },
    {
      key: "rewards",
      label: "Distributed Rewards",
      renderCell: (task: any) => <TaskReward rewardCYS={task?.rewardDetail?.distributedCYS || '0'} rewardCGT={task?.rewardDetail?.distributedCGT || '0'} />
    },
    {
      key: "totalTask",
      label: "Task Amount",
      renderCell: (item: any) => {
        return <span>{item?.totalTask || 0}</span>
      }
    },
  ];

  const {
    data: listData,
    currentPage,
    total,
    setCurrentPage,
  } = usePagnation(
    (page: number) => {
      return axios.get(
        `/api/v1/zkTask/dashboard/verifier/taskList/${params?.id}`,
        {
          params: {
            pageNum: page,
            pageSize: commonPageSize,
          },
        }
      );
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
      key: "planningReward",
      label: "Planning Reward",
      renderCell: (task: any) => <TaskReward rewardCYS={task?.rewardDetail?.planningCYS || '-'} rewardCGT={task?.rewardDetail?.planningCYS || '-'} />
    },
    {
      key: "distributedReward",
      label: "Distributed Reward",
      renderCell: (task: any) => <TaskReward rewardCYS={task?.rewardDetail?.distributedCYS || '-'} rewardCGT={task?.rewardDetail?.distributedCGT || '-'} />
    },
    // {
    //   key: "prover",
    //   label: "Prover",
    //   renderCell: (item: any) => {
    //     return shortStr(item?.prover, 16);
    //   },
    // },
    {
      key: "result",
      label: "Result",
      renderCell: (item: any) => {
        // return <VerifierTaskStatus status={item?.verifyResult} />
        return <TaskStatus status={item?.taskResult} />
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
            to={`/zk/dashboard/task/${item?.taskId || item?.task_id}`}
            className="flex items-center justify-end gap-2"
          >
            <span>View</span>
            <ArrowRightIcon className="size-3" />
          </Link>
        );
      },
    },
  ];

  return (
    <DashboardDetailMainWrapper

      title="Verifier Detail"
      detail={<GradientBorderCard >
        <Avatar className="!size-14" avatar={rows?.avatar} name={rows?.name} />
        <div className="lg:!flex-row">
          <div className="flex flex-col gap-2 flex-1">
            {columns?.map((i, index) => {
              return (
                <div
                  key={i?.key || index}
                  className={cn(
                    ["verifier", "provider", "inputData"].includes(i?.key) && "lg:!flex-row flex-col",
                    "gap-2 lg:gap-10 flex-wrap",
                    "flex items-start"
                  )}
                >
                  <div className="text-[#A3A3A3] w-[10rem] flex-1 lg:flex-none">{t(i?.label)}</div>
                  <div
                    className={cn(
                      "break-all flex-wrap flex-1",
                    )}
                  >
                    {renderCell(rows, i?.key, i)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 flex-1 flex-col lg:flex-row">
            <div className="flex-1 lg:flex-none text-[#A3A3A3] w-[10rem]">Description</div>
            <div className="flex-1 break-words">{rows?.description || '-'}</div>
          </div>
        </div>
      </GradientBorderCard>}
      table={
        <GradientBorderCard >
          <CysicTable
            className="[&>div]:!p-0"
            columns={listColumns}
            data={listData?.data?.list || []}
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
      }
    />


  );
};

export default VerifierDetail;
