import { useState, useEffect } from "react";
import useModalState from "@/hooks/useModalState";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { getImageUrl, handleConvertModal } from "@/utils/tools";
import axios from "axios";
import { Pagination } from "@nextui-org/react";
import dayjs from "dayjs";

// 转换记录类型
interface ConvertRecord {
  fromCoin: string;
  toCoin: string;
  amount: string;
  convertTime: string;
}

// 排序方向
enum SortDirection {
  ASC = "asc",
  DESC = "desc"
}

const ConvertHistoryModal = () => {
  // 获取模态框状态
  const { visible, setVisible } = useModalState({
    eventName: "modal_convert_history_visible",
  });

  // 状态管理
  const [convertRecords, setConvertRecords] = useState<ConvertRecord[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // 在弹窗打开时加载转换历史
  useEffect(() => {
    if (visible) {
      loadConvertHistory();
    }
  }, [visible, page, sortDirection]);

  // 加载转换历史数据
  const loadConvertHistory = async () => {
    setIsLoading(true);
    
    try {
      // 调用API获取数据
      const response = await axios.get('/api/v1/zkTask/convertHistory', {
        params: {
          page,
          pageSize
        }
      });
      
      // 获取历史记录列表和总数
      const { historyList, total } = response.data;
      setTotal(total || historyList.length);

      // 根据当前排序方向排序
      const sortedRecords = [...historyList].sort((a, b) => {
        const dateA = new Date(a.convertTime * 1000).getTime();
        const dateB = new Date(b.convertTime * 1000).getTime();
        
        if (sortDirection === SortDirection.ASC) {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
      
      setConvertRecords(sortedRecords);
    } catch (error) {
      console.error("Failed to load convert history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理排序
  const handleSort = () => {
    const newDirection = sortDirection === SortDirection.DESC 
      ? SortDirection.ASC 
      : SortDirection.DESC;
    
    setSortDirection(newDirection);
  };

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 关闭模态框
  const handleClose = () => {
    setVisible(false);
  };

  // 返回上一页
  const handleBack = () => {
    setVisible(false);
    // 触发打开转换弹窗的事件
    handleConvertModal()
  };

  return (
    <Modal
      isOpen={visible}
      onClose={handleClose}
      title="CONVERT HISTORY"
      className="max-w-[600px]"
    >
      {/* 表头 */}
      <div className="bg-[#111] rounded-lg p-4 mb-2 grid grid-cols-3 text-[#777]">
        <div>Token</div>
        <div className="flex items-center justify-center cursor-pointer" onClick={handleSort}>
          Convert Time 
          {/* <img 
            src={getImageUrl(`@/assets/images/icons/${sortDirection === SortDirection.DESC ? 'down' : 'up'}.svg`)} 
            alt="sort" 
            className="w-4 h-4 ml-1"
          /> */}
        </div>
        <div className="text-right">Amount</div>
      </div>

      {/* 转换记录列表 */}
      {isLoading ? (
        <div className="py-8 text-center text-[#777]">Loading...</div>
      ) : convertRecords.length === 0 ? (
        <div className="py-8 text-center text-[#777]">No convert history found</div>
      ) : (
        <div className="space-y-1 mb-6 max-h-[400px] overflow-y-auto">
          {convertRecords.map((record, index) => (
            <div key={index} className="grid grid-cols-3 py-4 items-center ">
              <div className="flex items-center">
                <img 
                  src={getImageUrl(`@/assets/images/tokens/${record.fromCoin}.svg`)} 
                  alt={record.fromCoin} 
                  className="lg:w-6 lg:h-6 w-4 h-4"
                />
                <span className="hidden lg:block mx-1 text-white unbounded-14-500">{record.fromCoin}</span>
                <span className="mx-1">→</span>
                <img 
                  src={getImageUrl(`@/assets/images/tokens/${record.toCoin}.svg`)} 
                  alt={record.toCoin} 
                  className="lg:w-6 lg:h-6 w-4 h-4"
                />
                <span className="hidden lg:block ml-1 text-white unbounded-14-500">{record.toCoin}</span>
              </div>
              <div className="text-center text-sub text-sm">{dayjs.unix(Number(record.convertTime)).format("YYYY/MM/DD HH:mm")}</div>
              <div className="text-right text-sub text-sm">{record.amount}</div>
            </div>
          ))}
        </div>
      )}

      {/* 添加 NextUI 分页组件 */}
      {total > pageSize && (
        <div className="flex justify-center mb-4">
          <Pagination
            total={Math.ceil(total / pageSize)}
            initialPage={1}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="sm"
          />
        </div>
      )}

      {/* 底部按钮 */}
      <div className="mt-auto">
        <Button
          type="solid"
          className="w-full py-4 rounded-lg text-base font-medium"
          onClick={handleBack}
        >
          BACK
        </Button>
      </div>
    </Modal>
  );
};

export default ConvertHistoryModal;
