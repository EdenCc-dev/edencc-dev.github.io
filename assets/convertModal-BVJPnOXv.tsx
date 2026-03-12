import { useState, useEffect } from "react";
import useModalState from "@/hooks/useModalState";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { formatReward, getImageUrl, handleConvertHistoryModal } from "@/utils/tools";
import { Settings, Wallet } from "lucide-react";
import Input from "@/components/Input";
import {
  cosmosFee,
  cosmosReservedValue,
  cysicBaseCoin,
  cysicStCoin,
  supTokens,
} from "@/config";
import useCosmos from "@/models/_global/cosmos";
import { useEventListener } from "ahooks";
import { MsgExchangeToGovToken, MsgExchangeToPlatformToken } from "@/utils/cysic-msg";
import BigNumber from "bignumber.js";
import { toast } from "react-toastify";
import { calculateTransactionFee, format, sleep } from "@/utils/tools";
import { checkKeplrWallet, checkkTx, signAndBroadcastDirect } from "@/utils/cosmos";
import GradientBorderCard from "@/components/GradientBorderCard";

// 代币类型枚举
enum TokenType {
  CYS = "CYS",
  CGT = "CGT"
}

const ConvertModal = () => {
  const { balanceMap, connector, address, exchangeableMap } = useCosmos();
  const { visible, setVisible, data } = useModalState({
    eventName: "modal_convert_visible",
  });
  const { dispatch }: any = useModalState({
    eventName: "modal_slippage_visible",
  });

  // 状态管理
  const [fromToken, setFromToken] = useState<TokenType>(TokenType.CYS);
  const [toToken, setToToken] = useState<TokenType>(TokenType.CGT);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [rate, setRate] = useState<number>(1);

  useEventListener("modal_convert_visible", (e: any) => {
    const eventFromToken = e?.detail?.fromToken;
    const eventToToken = e?.detail?.toToken;
    if (eventFromToken) {
      setFromToken(eventFromToken === "CYS" ? TokenType.CYS : TokenType.CGT);
    }
    if (eventToToken) {
      setToToken(eventToToken === "CYS" ? TokenType.CYS : TokenType.CGT);
    }
  });

  // 在弹窗打开时初始化状态
  useEffect(() => {
    if (visible) {
      // 如果有指定的初始代币
      if (data?.fromToken) {
        setFromToken(data.fromToken === "CYS" ? TokenType.CYS : TokenType.CGT);
        setToToken(data.fromToken === "CYS" ? TokenType.CGT : TokenType.CYS);
      }

      // 如果有指定的初始金额
      if (data?.amount) {
        const formattedAmount = typeof data.amount === 'number' ?
          data.amount.toLocaleString() :
          parseFloat(data.amount).toLocaleString();
        setFromAmount(formattedAmount);
        calculateToAmount(parseFloat(data.amount));
      } else {
        // 重置金额
        setFromAmount("");
        setToAmount("");
      }
    }
  }, [visible, data]);

  const calculateToAmount = (amount: number | string) => {
    const convertedAmount = BigNumber(amount).multipliedBy(rate);
    setToAmount(convertedAmount.toString());
  };

  const precision = 4
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!/^(\d*\.?\d*)$/.test(rawValue)) {
      return;
    }

    const currentValue = fromAmount;
    const parts = rawValue.split('.');
    
    if (rawValue.length < currentValue.length) {
      setFromAmount(rawValue);
      if (rawValue === '') {
        setToAmount('');
      } else if (!rawValue.endsWith('.') && !isNaN(+rawValue)) {
        calculateToAmount(rawValue);
      }
      return;
    }

    if (parts.length > 1 && parts[1].length > precision) {
      return;
    }

    setFromAmount(rawValue);

    if (rawValue.endsWith('.')) {
      return;
    } else if (rawValue === '') {
      setToAmount('');
    } else {
      if (!isNaN(+rawValue)) {
        calculateToAmount(rawValue);
        setFromAmount(rawValue.toString());
      }
    }
  };

  // 切换代币方向
  const handleSwapTokens = () => {
    setFromToken(fromToken === TokenType.CYS ? TokenType.CGT : TokenType.CYS);
    setToToken(toToken === TokenType.CYS ? TokenType.CGT : TokenType.CYS);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // 处理转换操作
  const handleConvert = async (closeLoading?: any) => {
    try {
      checkKeplrWallet();

      // 确保金额有效
      if (!fromAmount || parseFloat(fromAmount.replace(/,/g, "")) <= 0) {
        throw { message: "Please enter a valid amount" };
      }

      if (fromToken === TokenType.CYS) {
        await exchangeToGovToken(connector, address);
      } else {
        await exchangeToPlatformToken(connector, address);
      }
      setFromAmount('');
      setToAmount('');
    } catch (e: any) {
      console.log("error", e);
      if (e?.message !== 'Invalid Cosmos Wallet') {
        toast.error(e?.message || e?.msg || e);
      }
    } finally {
      await sleep(1000);
      dispatchEvent(new CustomEvent('refresh_cosmosBalance'));
      closeLoading?.();
    }
  };

  const exchangeToPlatformToken = async (client: any, address: string) => {
    const cleanAmount = fromAmount.replace(/,/g, "");
    const amount = {
      denom: "CGT",
      amount: BigNumber(cleanAmount).multipliedBy(1e18).toString(),
    };
    const msg = {
      typeUrl: MsgExchangeToPlatformToken.typeUrl,
      value: MsgExchangeToPlatformToken.encode(MsgExchangeToPlatformToken.fromPartial({
        sender: address,
        amount: amount.amount,
      })).finish(),
    };

    const result = await signAndBroadcastDirect(address, msg, cosmosFee, client);
    const tx = await checkkTx(connector, result?.transactionHash);

    toast.success(`Submit Success at ${result?.transactionHash}`);
  };

  const exchangeToGovToken = async (client: any, address: string) => {
    const cleanAmount = fromAmount.replace(/,/g, "");

    if (
      BigNumber(balanceMap?.[cysicBaseCoin]?.hm_amount || 0)
        .minus(cleanAmount)
        .lt(cosmosReservedValue)
    ) {
      throw { message: `Reserved Balance < ${cosmosReservedValue}` };
    }

    // 构建交易参数
    const amount = {
      denom: "CYS",
      amount: BigNumber(cleanAmount).multipliedBy(1e18).toString(),
    };

    const msg: any = {
      typeUrl: MsgExchangeToGovToken.typeUrl,
      value: MsgExchangeToGovToken.encode(MsgExchangeToGovToken.fromPartial({
        sender: address,
        amount: amount.amount,
      })).finish(),
    };

    const result = await signAndBroadcastDirect(address, msg, cosmosFee, client);
    const tx = await checkkTx(connector, result?.transactionHash);
    toast.success(`Submit Success at ${result?.transactionHash}`);
  };

  // 获取代币余额
  const getTokenBalance = (token: TokenType) => {
    const tokenKey = token === TokenType.CYS ? cysicBaseCoin : cysicStCoin;
    return format(balanceMap?.[tokenKey]?.hm_amount || 0, 3);
  };

  const cysBalance = balanceMap?.[cysicBaseCoin]?.hm_amount || 0;


  const cgtBalance = Math.min(exchangeableMap?.hm_amount || 0, balanceMap?.[cysicStCoin]?.hm_amount || 0);

  // 查看转换历史
  const handleViewHistory = () => {
    handleConvertHistoryModal();
  };

  // 调整滑点设置
  const handleSlippageAdjust = () => {
    dispatch({ visible: true });
  };

  // 关闭模态框
  const handleClose = () => {
    setVisible(false);
  };

  // 获取代币图标
  const getTokenIcon = (token: TokenType) => {
    const tokenKey = token === TokenType.CYS ? cysicBaseCoin : cysicStCoin;
    return supTokens?.[tokenKey]?.icon || getImageUrl(`@/assets/images/tokens/${token}.svg`);
  };

  return (
    <Modal
      isOpen={visible}
      onClose={handleClose}
      title="CONVERT"
      className="max-w-[600px]"
    >
      {/* 提示信息 */}
      <ul className="mb-6 text-white list-disc list-inside space-y-2">
        <li>Only Rewards from the current Phase III: Ignition is available to convert</li>
        <li>Only CGT converted from CYS can be reconverted to CYS.</li>
      </ul>

      {/* 转换区域 - From */}
      <GradientBorderCard borderRadius={8} className="p-4 mb-1">
        <div className="text-sub mb-2">Convert</div>
        <div className="flex justify-between items-center gap-6">
          <input
            type="text"
            value={fromAmount}
            onChange={handleFromAmountChange}
            className="bg-transparent border-none outline-none w-full flex-1 unbounded-30-300 text-white"
            placeholder="0.00"
          />
          <div className="flex items-center bg-[#222] rounded-full p-2">
            <img
              src={getTokenIcon(fromToken)}
              alt={fromToken}
              className="w-6 h-6 mr-2"
            />
            <span className="unbounded-16-500 !normal-case">{fromToken}</span>
          </div>
        </div>
        <div className="flex items-center justify-end mt-1 text-base text-sub hover:text-white cursor-pointer">
          <Wallet className="w-4 h-4 mr-1" />
          <span onClick={() => {
            const balance = fromToken === TokenType.CYS ? cysBalance : cgtBalance
            setFromAmount(balance);
            calculateToAmount(balance);
          }}
            className="text-sm teacher"
          >
            {formatReward(fromToken === TokenType.CYS ? cysBalance : cgtBalance, 4)}
          </span>
        </div>
      </GradientBorderCard>

      {/* 切换按钮 */}
      <div className="relative flex justify-center">
        <div
          className="absolute -translate-y-1/2 w-12 h-12 bg-black border border-[#2B2B2B] rounded-full flex justify-center items-center cursor-pointer z-10"
          onClick={handleSwapTokens}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="23" fill="white" stroke="white" strokeWidth="2" />
            <path fillRule="evenodd" clipRule="evenodd" d="M28.1164 29.5562V15.1112C28.1164 14.8165 28.2404 14.5338 28.461 14.3254C28.6816 14.1171 28.9808 14 29.2929 14C29.6049 14 29.9041 14.1171 30.1247 14.3254C30.3454 14.5338 30.4693 14.8165 30.4693 15.1112V29.645L31.8928 27.9005C32.0847 27.6677 32.3666 27.5164 32.6766 27.48C32.9866 27.4435 33.2992 27.5248 33.5457 27.7061C33.7922 27.8873 33.9524 28.1536 33.991 28.4464C34.0296 28.7392 33.9435 29.0344 33.7516 29.2673L30.2222 33.5563C30.1125 33.6922 29.9709 33.8024 29.8087 33.8782C29.6465 33.954 29.468 33.9934 29.287 33.9934C29.106 33.9934 28.9274 33.954 28.7652 33.8782C28.603 33.8024 28.4615 33.6922 28.3517 33.5563L24.8224 29.1117C24.6696 28.9194 24.5871 28.6854 24.5871 28.445C24.5871 28.2725 24.6296 28.1024 24.7113 27.9481C24.793 27.7938 24.9116 27.6596 25.0577 27.5561C25.1813 27.4685 25.3219 27.4048 25.4716 27.3686C25.6212 27.3324 25.777 27.3244 25.9299 27.345C26.0828 27.3656 26.23 27.4145 26.3629 27.4889C26.4959 27.5632 26.612 27.6616 26.7047 27.7783L28.1164 29.5562ZM19.8822 18.4443V32.8893C19.8822 33.184 19.7583 33.4666 19.5376 33.675C19.317 33.8834 19.0178 34.0005 18.7058 34.0005C18.3938 34.0005 18.0945 33.8834 17.8739 33.675C17.6533 33.4666 17.5293 33.184 17.5293 32.8893V18.3554L16.1058 20.0999C15.9134 20.3306 15.6322 20.4799 15.3236 20.5153C15.015 20.5507 14.7041 20.4693 14.4588 20.2888C14.3164 20.1853 14.2011 20.0524 14.1215 19.9002C14.042 19.7481 14.0004 19.5807 14 19.411C14.0008 19.1655 14.0877 18.9272 14.2471 18.7332L17.7764 14.4442C17.8862 14.3083 18.0277 14.1981 18.1899 14.1223C18.3521 14.0465 18.5307 14.0071 18.7117 14.0071C18.8926 14.0071 19.0712 14.0465 19.2334 14.1223C19.3956 14.1981 19.5371 14.3083 19.6469 14.4442L23.1763 18.8888C23.3635 19.1245 23.4438 19.4209 23.3997 19.7126C23.3556 20.0044 23.1906 20.2676 22.941 20.4444C22.6914 20.6212 22.3776 20.6971 22.0687 20.6555C21.7599 20.6138 21.4812 20.4579 21.2939 20.2222L19.8822 18.4443Z" fill="#090A09" />
          </svg>
        </div>
      </div>

      {/* 转换区域 - To */}
      <GradientBorderCard borderRadius={8} className="p-4 mb-6">
        <div className="text-sub mb-2">To</div>
        <div className="flex justify-between items-center gap-6">
          <span className="unbounded-30-300 text-white flex-1 overflow-auto">{toAmount || "0.00"}</span>
          <div className="flex items-center bg-[#222] rounded-full p-2">
            <img
              src={getTokenIcon(toToken)}
              alt={toToken}
              className="w-6 h-6 mr-2"
            />
            <span className="unbounded-16-500 !normal-case">{toToken}</span>
          </div>
        </div>
        <div className="flex items-center justify-end mt-1 text-base text-sub hover:text-white cursor-pointer">
          <Wallet className="w-4 h-4 mr-1" />
          <span className="text-sm teacher">{formatReward(toToken === TokenType.CYS ? cysBalance : cgtBalance, 4)}</span>
        </div>
      </GradientBorderCard>

      {/* 转换信息 */}
      <div className="space-y-2 mb-6">
        <span className="text-sub text-sm">1 {fromToken} = {rate} {toToken}</span>
        <div className="flex justify-between items-center text-sm">
          <span className="text-sub">Receive at least</span>
          <span>{fromAmount ? toAmount : "0.00"} {toToken}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-sub">Network cost</span>
          <div className="flex items-center">
            <img
              src={getImageUrl('@/assets/images/icon/flash.svg')}
              alt="network"
              className="w-4 h-4 mr-1"
            />
            <span>{calculateTransactionFee()} CYS</span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <Button
        type="light"
        needLoading
        className="w-full py-4 rounded-lg text-base font-medium mb-4"
        onClick={handleConvert}
      // disabled={!fromAmount}
      >
        CONVERT
      </Button>

      {/* 查看历史 */}
      <div className="flex justify-center">
        <Button
          type="text"
          className="text-white flex items-center"
          onClick={handleViewHistory}
        >
          CONVERT HISTORY <span className="ml-1">→</span>
        </Button>
      </div>
    </Modal>
  );
};

export default ConvertModal;