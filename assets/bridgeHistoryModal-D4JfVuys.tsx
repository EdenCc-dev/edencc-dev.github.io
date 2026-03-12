import useModalState from "@/hooks/useModalState";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { getImageUrl, shortStr } from "@/utils/tools";
import axios from "axios";
import { Pagination } from "@nextui-org/react";
import useAccount from "@/hooks/useAccount";
import { commonPageSize, enableBridge, mediasLink } from "@/config";
import usePagnation from "@/hooks/usePagnation";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

interface IBridgeHistoryItem {
  ID: string; // 记录ID
  createdAt: string; // 创建时间
  amount: string | number; // 金额
  sourceTxHash: string; // 源链交易哈希
  targetTxHash: string; // 目标链交易哈希
  status: "init" | "waitFinish" | "finish" | "failed"; // 交易状态
  sourceChainId: number; // 源链ID
  targetChainId: number; // 目标链ID
  TxHash?: string; // 交易哈希（可选）
}


const BridgeHistoryModal = () => {
  const { address, isSigned } = useAccount();
  // 获取模态框状态
  const { visible, setVisible } = useModalState({
    eventName: "modal_bridge_history_visible",
  });

  const { data, loading, total, totalPage, currentPage, setCurrentPage } =
    usePagnation(
      (page: number) => {
        return axios.get(`/api/v1/bridge/history/${address}`, {
          params: {
            event: "deposit",
            pageNum: page,
            pageSize: commonPageSize,
          },
        });
      },
      {
        ready: !!address && visible && isSigned,
        refreshDeps: [address, visible, isSigned],
      }
    );

  const dataList = data?.data?.events as IBridgeHistoryItem[];

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Modal
      isOpen={visible}
      onClose={handleClose}
      title="BRIDGE HISTORY"
      className="max-w-[600px]"
    >
      {/* 表头 */}
      <div className="bg-[#111] rounded-lg p-4 mb-2 grid grid-cols-4 text-[#777]">
        <div>Token</div>
        <div>Amount</div>
        <div>Time</div>
        <div className="text-right">Txs</div>
      </div>

      {/* 转换记录列表 */}
      {loading ? (
        <div className="py-8 text-center text-[#777]">Loading...</div>
      ) : !dataList?.length ? (
        <div className="py-8 text-center text-[#777]">
          No bridge history found
        </div>
      ) : (
        <div className="space-y-1 mb-6 max-h-[400px] overflow-y-auto px-4">
          {dataList?.map((record, index) => (
            <div key={index} className="grid grid-cols-4 py-4 items-center ">
              <div className="flex items-center gap-1">
                <img
                  src={getImageUrl(`@/assets/images/tokens/USDC.svg`)}
                  alt="USDC"
                  className="w-5 h-5"
                />
                USDC
              </div>
              <div className=" text-sub text-sm">{record.amount}</div>
              <div className="text-sub text-sm">
                {record.createdAt ? dayjs.unix(Number(record.createdAt)).format("YYYY/MM/DD HH:mm") : "-"}
              </div>

              <a
                className="text-right"
                target="_blank"
                href={mediasLink.evmExplorer + "/tx/" + record?.targetTxHash}
              >
                <div className="cursor-pointer underline text-[#00F0FF]">
                  {shortStr(record?.targetTxHash, 10) || "-"}
                </div>
              </a>
            </div>
          ))}
        </div>
      )}

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

     {enableBridge ? <div className="mt-auto">
        <Link to={'/bridge'} target="_blank">
          <Button
            type="light"
            className="w-full py-4 rounded-lg text-base font-medium"
          >
            BRIDGE
          </Button>
        </Link>
      </div> : null}
    </Modal>
  );
};

export default BridgeHistoryModal;
