import Button from "@/components/Button";
import ConnectButton from "@/components/connectButton";
import Input from "@/components/Input";
import {
  bridgeConfig,
  bridgeToken,
  cysicChain,
  EVM_CHAIN_LOGO,
  fromCysAbi,
  toCysAbi,
} from "@/config";
import useBridge from "@/models/bridge";
import ChainSelectModal from "./modal/chainSelectModal";
import TokenSelectModal from "./modal/tokenSelectModal";
import { getImageUrl, handleSignIn, txAwait } from "@/utils/tools";
import BigNumber from "bignumber.js";
import { useState } from "react";
import { toast } from "react-toastify";
import { erc20Abi, maxInt256 } from "viem";
import {
  useAccount,
  useReadContracts,
  useSwitchChain,
} from "wagmi";
import GradientBorderCard from "@/components/GradientBorderCard";
import { IconTriangleDown } from "@/components/Icon";
import { useWriteContract } from "@/hooks/useWriteContract";

const BridgeC = () => {
  // 0 - deposit, 1 - withdraw
  const { bridgeDir, fromChainId, toChainId, fromTokenAddress, setState } =
    useBridge();
  const fromChain = bridgeConfig?.[fromChainId]?.chain;
  const toChain = cysicChain;
  const [bridgeAmount, setBridgeAmount] = useState<string | undefined>();
  const { address, chainId, chain } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const handleSwitch = () => {
    setState({
      bridgeDir: bridgeDir ? 0 : 1,
    });
  };

  const functionName = !bridgeDir ? "deposit" : "withdraw";
  const bridgeAbi = !bridgeDir ? toCysAbi : fromCysAbi;
  const topDir = !bridgeDir ? fromChain : toChain;
  const bottomDir = !bridgeDir ? toChain : fromChain;
  const topChainId = !bridgeDir ? fromChainId : toChainId;
  const bottomChainId = !bridgeDir ? toChainId : fromChainId;


  const topToken = bridgeToken?.[topChainId]?.[fromTokenAddress];
  const fromToken = bridgeToken?.[fromChainId]?.[fromTokenAddress];
  const spender = !bridgeDir
    ? fromToken?.toCysBridge
    : fromToken?.fromCysBridge;

  const { data: fromTokenData, refetch: fromTokenRefetch }: any =
    useReadContracts({
      contracts: [
        {
          address: fromTokenAddress,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address as any],
          chainId: fromChainId,
        },
        {
          address: fromTokenAddress,
          abi: erc20Abi,
          functionName: "decimals",
          chainId: fromChainId,
        },
        {
          address: fromTokenAddress,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address as any, spender as any],
          chainId: fromChainId,
        },
      ],
    });

  const { data: cysicTokenData, refetch: cysicTokenRefetch }: any =
    useReadContracts({
      contracts: [
        {
          address: fromToken?.underlyingAddress,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address as any],
          chainId: toChainId,
        },
        {
          address: fromToken?.underlyingAddress,
          abi: erc20Abi,
          functionName: "decimals",
          chainId: toChainId,
        },
        {
          address: fromToken?.underlyingAddress,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address as any, spender as any],
          chainId: toChainId,
        },
      ],
    });

  const topTokenData = !bridgeDir ? fromTokenData : cysicTokenData;

  const topTokenBalance_hm =
    BigNumber(topTokenData?.[0]?.result)
      .div(10 ** topTokenData?.[1]?.result)
      .toString() || "0";
  const topNeedApprove = BigNumber(bridgeAmount || 0).gt(
    topTokenData?.[2]?.result
  );

  const handleClick = async () => {
    try {
      const tokenAddress = !bridgeDir
        ? fromToken?.address
        : fromToken?.underlyingAddress;
      const decimal = !bridgeDir ? fromToken?.decimal : fromToken?.decimal;
      if (topNeedApprove) {
        const hash = await writeContractAsync({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [spender as any, maxInt256],
          chainId: +topChainId,
        });

        toast.success("Approve Successfully");
        return;
      }

      const args = bridgeDir
        ? [
            fromToken?.address,
            BigNumber(bridgeAmount || "0")
              .multipliedBy(10 ** decimal)
              .toString(),
            bottomDir?.id,
            address,
          ]
        : [
            tokenAddress,
            BigNumber(bridgeAmount || "0")
              .multipliedBy(10 ** decimal)
              .toString(),
            address,
          ];

      const hash = await writeContractAsync({
        address: spender,
        abi: bridgeAbi,
        functionName: functionName,
        args: args,
        chainId: +topChainId,
      });
      toast.success("Bridge Successfully");
    } catch (e: any) {
      console.log("error", e);
      toast.error(e?.msg || e?.shortMessage || e?.message || "Failed");
    } finally {
      fromTokenRefetch?.();
      cysicTokenRefetch?.();
    }
  };

  return (
    <>
      <GradientBorderCard className="rounded-[20px] p-8 w-full max-w-[40.625rem] mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 relative">
            <GradientBorderCard className="rounded-[12px] p-4 flex flex-col gap-4 justify-between">
              <div className="text-sub teacher !normal-case">From</div>
              <div
                className="cursor-pointer flex items-center gap-2 justify-end"
                onClick={() => {
                  dispatchEvent(
                    new CustomEvent("modal_chain_select_visible", {
                      detail: { visible: true },
                    })
                  );
                }}
              >
                <img
                  className="size-6 rounded-full"
                  src={EVM_CHAIN_LOGO?.[topChainId]}
                />
                <span className="unbounded-16-500 !normal-case">
                  {topDir?.name}
                </span>
                {!bridgeDir ? <IconTriangleDown className="size-4" /> : null}
              </div>
            </GradientBorderCard>

            <svg
              className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] cursor-pointer"
              onClick={handleSwitch}
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="24"
                cy="24"
                r="23"
                fill="white"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M23.1755 18.8887C23.3627 19.1244 23.4433 19.4212 23.3992 19.7129C23.355 20.0044 23.1905 20.2676 22.9412 20.4443C22.6915 20.6212 22.377 20.6969 22.0681 20.6553C21.7595 20.6135 21.4808 20.4581 21.2937 20.2227L19.8816 18.4443V32.8896C19.8815 33.1841 19.7582 33.4665 19.5378 33.6748C19.3173 33.8831 19.0177 33.9999 18.7058 34C18.3938 34 18.0944 33.8832 17.8738 33.6748C17.6533 33.4665 17.5291 33.1842 17.529 32.8896V18.3555L16.1052 20.0996C15.9128 20.3302 15.6316 20.4802 15.323 20.5156C15.0146 20.5509 14.7038 20.4693 14.4587 20.2891C14.3164 20.1855 14.2004 20.0526 14.1208 19.9004C14.0413 19.7483 14.0002 19.5808 13.9997 19.4111C14.0006 19.1657 14.0875 18.9273 14.2468 18.7334L17.7761 14.4443C17.8858 14.3085 18.0271 14.1979 18.1892 14.1221C18.3514 14.0463 18.5307 14.0068 18.7117 14.0068C18.8925 14.0069 19.071 14.0463 19.2331 14.1221C19.3953 14.1979 19.5365 14.3085 19.6462 14.4443L23.1755 18.8887ZM33.991 28.4463C34.0296 28.7391 33.9436 29.0348 33.7517 29.2676L30.2224 33.5566C30.1126 33.6925 29.9706 33.8021 29.8083 33.8779C29.6462 33.9537 29.4678 33.9931 29.2869 33.9932C29.106 33.9932 28.9275 33.9537 28.7654 33.8779C28.6032 33.8021 28.4611 33.6925 28.3513 33.5566L24.822 29.1113C24.6695 28.9191 24.5867 28.6855 24.5867 28.4453C24.5867 28.2729 24.6291 28.1025 24.7107 27.9482C24.7924 27.794 24.9113 27.6592 25.0574 27.5557C25.1809 27.4682 25.3218 27.4044 25.4714 27.3682C25.6209 27.332 25.7766 27.3241 25.9294 27.3447C26.0824 27.3654 26.2301 27.4149 26.363 27.4893C26.4958 27.5636 26.6122 27.6617 26.7048 27.7783L28.116 29.5557V15.1113C28.116 14.8166 28.2401 14.5336 28.4607 14.3252C28.6813 14.1169 28.9807 14 29.2927 14C29.6047 14 29.9041 14.1168 30.1247 14.3252C30.3454 14.5336 30.4695 14.8166 30.4695 15.1113V29.6455L31.8923 27.9004C32.0842 27.6676 32.3665 27.516 32.6765 27.4795C32.9864 27.4431 33.2992 27.5249 33.5456 27.7061C33.792 27.8873 33.9523 28.1536 33.991 28.4463Z"
                fill="#090A09"
              />
            </svg>

            <GradientBorderCard className="rounded-[12px] p-4 flex flex-col gap-4 justify-between">
              <div className="text-sub teacher !normal-case">To</div>
              <div
                className="cursor-pointer flex items-center gap-2 justify-end"
                onClick={() => {
                  if (!bridgeDir) return;
                  dispatchEvent(
                    new CustomEvent("modal_chain_select_visible", {
                      detail: { visible: true },
                    })
                  );
                }}
              >
                <img
                  className="size-6 rounded-full"
                  src={EVM_CHAIN_LOGO?.[bottomChainId]}
                />
                <span className="unbounded-16-500 !normal-case">
                  {bottomDir?.name}
                </span>
                {bridgeDir ? <IconTriangleDown className="size-4" /> : null}
              </div>
            </GradientBorderCard>
          </div>

          <div className="flex flex-col gap-4">
            <GradientBorderCard className="rounded-[12px] p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="text-sub teacher !normal-case">Amount</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-sub teacher !normal-case">
                    Balance: {+topTokenBalance_hm ? topTokenBalance_hm : "-"}
                  </span>
                  <Button
                    onClick={() => {
                      setBridgeAmount(topTokenBalance_hm);
                    }}
                    type="ghost"
                    className="!p-0 teacher text-sm text-sub hover:text-white"
                  >
                    Max
                  </Button>
                </div>
              </div>

              <Input
                value={bridgeAmount}
                onChange={setBridgeAmount}
                type="text"
                suffix={
                  <div
                    className="cursor-pointer flex items-center gap-2 p-2 rounded-full bg-[#FFFFFF0D]"
                    onClick={() => {
                      dispatchEvent(
                        new CustomEvent("modal_token_select_visible", {
                          detail: { visible: true },
                        })
                      );
                    }}
                  >
                    <img
                      className="size-6 rounded-full"
                      src={fromToken?.icon}
                    />
                    <span className="unbounded-16-500 !normal-case">
                      {fromToken?.symbol}
                    </span>
                    <IconTriangleDown className="size-4" />
                  </div>
                }
                placeholder="0"
                className="!text-[36px] p-0 [&_input]:flex-1"
                classNames={{
                  input: "unbounded",
                }}
              />
            </GradientBorderCard>
            <div className="flex items-center justify-between teacher">
              <div>You will receive:</div>
              <div>{bridgeAmount || "-"}</div>
            </div>
          </div>

          <Button
            className="py-6 text-base mt-6"
            onClick={async () => {
              if (!address) {
                handleSignIn();
              } else {
                await handleClick();
              }
            }}
            type="light"
            needLoading
          >
            {!address
              ? "Connect Wallet"
              : topNeedApprove
              ? "Approve"
              : "Bridge"}
          </Button>
        </div>
      </GradientBorderCard>

      <ChainSelectModal />
      <TokenSelectModal />
    </>
  );
};

export default BridgeC;
