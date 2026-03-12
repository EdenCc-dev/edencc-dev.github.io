import { useState, useEffect } from "react";
import useModalState from "@/hooks/useModalState";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { mediasLink } from "@/config";
import { Check, Loader2, AlertCircle } from "lucide-react";

// 状态类型枚举
export enum StatusType {
  SUCCESS = "success",
  LOADING = "loading",
  ERROR = "error"
}

export interface StatusModalProps {
  type?: StatusType;
  title?: string;
  message?: string;
  chainName?: string;
  txHash?: string;
  onClose?: () => void;
  onRetry?: () => void;
}

const StatusModal = () => {
  // 获取模态框状态
  const { visible, setVisible, data }: any = useModalState({
    eventName: "modal_status_visible",
  });

  // 状态管理
  const [status, setStatus] = useState<StatusType>(StatusType.LOADING);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [chainName, setChainName] = useState<string>("XXX CHAIN");
  const [txHash, setTxHash] = useState<string>("");

  // 在弹窗打开时初始化状态
  useEffect(() => {
    if (visible && data) {
      setStatus(data?.type || StatusType.LOADING);
      setTitle(data?.title || getDefaultTitle(data.type));
      setMessage(data?.message || "");
      setChainName(data?.chainName || "XXX CHAIN");
      setTxHash(data?.txHash?.hash || "");
    }
  }, [visible, data]);

  // 获取默认标题
  const getDefaultTitle = (type?: StatusType) => {
    switch (type) {
      case StatusType.SUCCESS:
        return "Transaction Submitted";
      case StatusType.LOADING:
        return "Waiting for signature";
      case StatusType.ERROR:
        return "User Cancel Signature";
      default:
        return "Waiting for signature";
    }
  };

  // 关闭模态框
  const handleClose = () => {
    setVisible(false);
    // 如果有自定义关闭回调，则执行
    if (data?.onClose) data.onClose();
  };

  // 重试
  const handleRetry = () => {
    // 如果有自定义重试回调，则执行
    if (data?.onRetry) {
      data?.onRetry?.();
    }
    // setVisible(false);
  };

  // 查看交易
  const handleViewOnChain = () => {
    if (!txHash) return;

    const explorerUrl = mediasLink.cosmosExplorer + '/tx/' + txHash;
    window.open(explorerUrl, "_blank");
  };

  // 渲染状态图标
  const renderStatusIcon = () => {
    switch (status) {
      case StatusType.SUCCESS:
        return (
            <svg width="121" height="120" viewBox="0 0 121 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-30 h-30">
              <g filter="url(#filter0_d_2777_1031)">
                <circle cx="60.5" cy="60" r="40" fill="url(#paint0_linear_2777_1031)" />
                <circle cx="60.5" cy="60" r="38" stroke="#090A09" strokeOpacity="0.5" strokeWidth="4" />
                <path d="M56.1539 74C55.8461 73.999 55.5419 73.9324 55.2601 73.8044C54.9782 73.6764 54.7248 73.4898 54.5155 73.2561L43.6083 61.2366C43.2006 60.7865 42.9822 60.1871 43.0011 59.5702C43.0201 58.9532 43.2748 58.3694 43.7093 57.947C44.1438 57.5246 44.7225 57.2984 45.3181 57.318C45.9136 57.3376 46.4773 57.6015 46.885 58.0516L56.1314 68.2577L75.0058 46.8692C75.1974 46.6221 75.4357 46.4182 75.706 46.27C75.9764 46.1217 76.2732 46.0324 76.5782 46.0073C76.8831 45.9822 77.1898 46.022 77.4793 46.1242C77.7689 46.2263 78.0353 46.3888 78.262 46.6014C78.4888 46.8141 78.6712 47.0726 78.798 47.361C78.9249 47.6493 78.9934 47.9615 78.9995 48.2783C79.0057 48.5951 78.9492 48.9099 78.8336 49.2033C78.718 49.4967 78.5457 49.7625 78.3274 49.9844L57.8146 73.2328C57.6074 73.4708 57.3548 73.6618 57.0729 73.7938C56.7909 73.9258 56.4857 73.996 56.1763 74H56.1539Z" fill="#090A09" />
              </g>
              <defs>
                <filter id="filter0_d_2777_1031" x="0.5" y="0" width="120" height="120" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="10" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 0.866667 0 0 0 0.5 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2777_1031" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2777_1031" result="shape" />
                </filter>
                <linearGradient id="paint0_linear_2777_1031" x1="77.4811" y1="8.30189" x2="71.7827" y2="117.438" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#19FFE0" />
                  <stop offset="1" stopColor="#47FF6F" />
                </linearGradient>
              </defs>
            </svg>
        );
      case StatusType.LOADING:
        return (
          <div className="mb-6">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        );
      case StatusType.ERROR:
        return (
            <svg width="121" height="120" viewBox="0 0 121 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-30 h-30">
              <g filter="url(#filter0_d_2778_1038)">
                <circle cx="60.5" cy="60" r="40" fill="url(#paint0_linear_2778_1038)" />
                <circle cx="60.5" cy="60" r="38" stroke="#090A09" strokeOpacity="0.5" strokeWidth="4" />
                <path fillRule="evenodd" clipRule="evenodd" d="M63.1738 44.5869C63.1738 43.1581 62.0156 41.9999 60.5869 41.9999C59.1582 41.9999 58 43.1581 58 44.5869V64.9346C58 66.3633 59.1582 67.5215 60.5869 67.5215C62.0156 67.5215 63.1738 66.3633 63.1738 64.9346V44.5869ZM60.5871 72.1113C59.1584 72.1113 58.0002 73.2695 58.0002 74.6983C58.0002 76.127 59.1584 77.2852 60.5871 77.2852H60.613C62.0417 77.2852 63.1999 76.127 63.1999 74.6983C63.1999 73.2695 62.0417 72.1113 60.613 72.1113H60.5871Z" fill="#090A09" />
              </g>
              <defs>
                <filter id="filter0_d_2778_1038" x="0.5" y="0" width="120" height="120" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="10" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0.0166667 0 0 0 0.5 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2778_1038" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2778_1038" result="shape" />
                </filter>
                <linearGradient id="paint0_linear_2778_1038" x1="77.4811" y1="8.30189" x2="71.7827" y2="117.438" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF9019" />
                  <stop offset="1" stopColor="#FF4A4A" />
                </linearGradient>
              </defs>
            </svg>

          // </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={visible}
      onClose={handleClose}
      hideCloseButton={status === StatusType.LOADING}
      className="max-w-[600px]"
      isDismissable={status === StatusType.SUCCESS}
    >
      <div className={`flex flex-col items-center justify-center pb-12 pt-0 ${status === StatusType.LOADING ? "pt-12" : ""}`}>
        {renderStatusIcon()}

        <h2 className="text-2xl font-light text-white text-center mb-4">{title}</h2>

        {message && (
          <p className="text-gray-300 text-center text-base mb-8">{message}</p>
        )}

        {status === StatusType.SUCCESS && txHash && (
          <Button
            type="light"
            className="w-full py-4 text-base font-normal"
            onClick={handleViewOnChain}
          >
            VIEW ON {chainName}
          </Button>
        )}

        {status === StatusType.ERROR && (
          <Button
            type="light"
            className="w-full py-4 text-base font-normal"
            onClick={handleRetry}
          >
            TRY AGAIN
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default StatusModal;