import Button, { BtnType } from "@/components/Button";
import { formatReward, handleStakeModal, handleUnstakeModal } from "@/utils/tools";
import { History, Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import GradientBorderCard from "@/components/GradientBorderCard";
import CysicTable, { CysicTableColumn } from "@/components/Table";
import { useRequest } from "ahooks";
import useCosmos from "@/models/_global/cosmos";
import useStake from "@/models/stake"; // 引入stake store
import { blockTime, cosmosFee } from "@/config";

import {
  QueryClient,
  setupDistributionExtension,
} from "@cosmjs/stargate";
import * as tx_1 from "cosmjs-types/cosmos/distribution/v1beta1/tx"
import {
  checkkTx,
  connectWallet,
  signAndBroadcastDirect,
} from "@/utils/cosmos";
import BigNumber from "bignumber.js";
import { showStatusModal } from "@/utils/tools";
import { StatusType } from "@/routes/components/modal/statusModal";
import { cosmosCysicTestnet } from "@/config";
import { cn, Input } from "@nextui-org/react";
import { TableAvatar } from "@/routes/pages/Zk/dashboard/components/tableComponents";
import { ValidatorResponse } from "@/hooks/useStakeList";
// import Input from "@/components/Input";

interface Validator {
  id: string;
  abbr: string;
  name: string;
  color: string;
  votingPower: string;
  votingPercentage: string;
  commissionRate: string;
}


const sliceFormat = (value: string, decimal: number = 18) => {
  if (value.length <= decimal) return value;

  const decimalPosition = value.length - decimal; // 小数点前 18 位

  const formattedValue =
    value.slice(0, decimalPosition) + "." + value.slice(decimalPosition);
  return formattedValue;
};


const StakePage = () => {
  const { queryActiveListLoading, queryStakeListLoading, stakeList, activeList: activeListData, stakeAmount, unstakeAmount } = useStake();
  const activeLoading = queryActiveListLoading
  const stakeListData = stakeList
  const stakeLoading = queryStakeListLoading
  const activeList = activeListData

  const [rewardsAmount, setRewardsAmount] = useState("0");

  const apr = useMemo(() => {
    // 检查数据是否都已加载
    if (!stakeList?.data?.validatorList || !activeList?.data?.validatorList) {
      return "0";
    }

    const userValidators = stakeList.data.validatorList;
    const networkValidators = activeList.data.validatorList;

    // 创建网络验证者映射，便于查找
    const networkValidatorMap: any = {};
    networkValidators.forEach(validator => {
      networkValidatorMap[validator.validatorName] = validator;
    });

    // 计算用户质押的加权 APR
    let totalUserStake = 0;
    let totalWeightedApr = 0;

    userValidators.forEach(validator => {
      if (validator.stake) {
        const userStakeAmount = parseFloat(validator.stake.amount) || 0;
        totalUserStake += userStakeAmount;

        // 找到对应的网络验证者
        const networkValidator = networkValidatorMap[validator.validatorName];

        if (networkValidator && networkValidator.apr) {
          const aprValue = parseFloat(networkValidator.apr.replace('%', '')) || 0;
          totalWeightedApr += (userStakeAmount * aprValue);
        } else if (validator.apr) {
          // 如果找不到网络数据，使用用户数据中的 APR
          const aprValue = parseFloat(validator.apr.replace('%', '')) || 0;
          totalWeightedApr += (userStakeAmount * aprValue);
        }
      }
    });

    // 计算加权平均 APR
    if (totalUserStake > 0) {
      return (totalWeightedApr / totalUserStake).toFixed(2);
    }

    // 如果用户没有质押，返回 0
    return "0";
  }, [stakeList, activeList]);


  // 转换API数据为表格数据
  const transformValidators = (validatorList: ValidatorResponse[] = []): Validator[] => {
    return validatorList.map((v, index) => ({
      ...v,
      id: `validator-${index}`,
      abbr: v.validatorName.substring(0, 2).toUpperCase(),
      name: v.validatorName,
      color: index % 2 === 0 ? "bg-blue-500" : "bg-purple-500",
      votingPower: v.votingPower.amount,
      votingPercentage: v.votingPowerPercent.replace('%', ''),
      commissionRate: v.commissionRate.replace('%', ''),
    }));
  };

  // 获取验证者数据 - 优先使用store中的数据
  const myValidators = (stakeList?.data?.validatorList || stakeListData?.data?.validatorList)
    ? transformValidators(stakeList?.data?.validatorList || stakeListData?.data?.validatorList)
    : [];

  // 获取活跃验证者数据 - 优先使用store中的数据
  const activeValidators = (activeList?.data?.validatorList || activeListData?.data?.validatorList)
    ? transformValidators(activeList?.data?.validatorList || activeListData?.data?.validatorList)
    : [];

  // 判断用户是否已质押
  const hasStaked = myValidators.length > 0 && parseFloat(stakeAmount.replace(/,/g, '')) > 0;

  // 定义验证者表格列
  const myValidatorsColumns: CysicTableColumn<Validator>[] = [
    {
      key: "validator",
      label: "Validator",
      renderCell: (validator) => (
        <TableAvatar switchColor name={validator.name} />
      )
    },
    {
      key: "myStakes",
      label: "My Stakes",
      renderCell: (validator) => <>{validator?.stake?.amount || 0} <span className='text-sm text-sub'>CGT</span></>
    },
    {
      key: "votingPower",
      label: "Voting Power",
      renderCell: (validator) => (
        <div>
          <div>{formatReward(validator.votingPower || '0', 4, true)} <span className="text-sm text-sub">CGT</span></div>
          <div className="text-sm text-sub">{validator.votingPercentage * 100}%</div>
        </div>
      )
    },
    {
      key: "commissionRate",
      label: "Commission Rate",
      renderCell: (validator) => `${validator.commissionRate * 100 || 0}%`
    },
    {
      key: "expectedAPR",
      label: "Expected APR",
      renderCell: () => <span className="text-sub">{apr}%</span>
    },
    {
      key: "action",
      label: "Action",
      renderCell: (validator) => (
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => handleStakeModal({ validator: validator.name })}
            type={BtnType.light}
            className="rounded-lg w-[6.5rem] py-3 text-sm"
          >
            STAKE
          </Button>
          <Button
            onClick={() => handleUnstakeModal({ validator: validator.name })}
            type={BtnType.solid}
            className="rounded-lg w-[6.5rem] py-3 text-sm"
          >
            UNSTAKE
          </Button>
        </div>
      )
    }
  ];

  // 活跃验证者表格列
  const activeValidatorsColumns: CysicTableColumn<Validator>[] = [
    {
      key: "validator",
      label: "Validator",
      renderCell: (validator) => (
        <TableAvatar switchColor name={validator.name} />
      )
    },
    {
      key: "votingPower",
      label: "Voting Power",
      renderCell: (validator) => (
        <div>
          <div>{formatReward(validator.votingPower || '0', 4, true)} <span className="text-sm text-sub">CGT</span></div>
          <div className="text-sm text-sub">{validator.votingPercentage * 100}%</div>
        </div>
      )
    },
    {
      key: "commissionRate",
      label: "Commission Rate",
      renderCell: (validator) => <span className="text-sub">{(validator?.commissionRate * 100) || 0}%</span>
    },
    {
      key: "action",
      label: "Action",
      renderCell: (validator) => (
        <Button
          onClick={() => handleStakeModal({ validator: validator.name })}
          type={BtnType.light}
          className="rounded-lg px-6 py-3 w-full text-base"
        >
          STAKE
        </Button>
      )
    }
  ];


  const { address, connector } = useCosmos()
  const handleClaim = async () => {
    try {
      showStatusModal({
        type: StatusType.LOADING,
        message: `Claiming rewards, please confirm this transaction in your wallet`
      });
      const queryClient = QueryClient.withExtensions(
        connector?.getQueryClient(),
        setupDistributionExtension
      );
      const result = await queryClient.distribution.delegatorValidators(
        address
      );
      console.log("Delegator's Validators:", result);
      const withdrawMsgs = [];
      for (const validator of result.validators) {
        const withdrawMsg = {
          typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
          value: tx_1.MsgWithdrawDelegatorReward.encode(
            tx_1.MsgWithdrawDelegatorReward.fromPartial({
              delegatorAddress: address,
              validatorAddress: validator,
            })
          ).finish(),
        };
        withdrawMsgs.push(withdrawMsg);
      }

      const result2 = await signAndBroadcastDirect(
        address,
        withdrawMsgs,
        { ...cosmosFee, gas: (+cosmosFee.gas * 1.5)?.toString() },
        connector
      );

      const tx = await checkkTx(connector, result2?.transactionHash);
      console.log('tx', tx);

      // 显示成功状态
      showStatusModal({
        type: StatusType.SUCCESS,
        title: "Rewards Claimed Successfully",
        chainName: cosmosCysicTestnet.chainName,
        txHash: tx
      });

      // 刷新奖励数据
      queryRewards();

    } catch (error) {
      console.error("Error claiming rewards:", error);

      if (error?.message !== 'Keplr Wallet is not available') {
        // 显示错误状态
        showStatusModal({
          type: StatusType.ERROR,
          title: "Transaction Failed",
          message: "Failed to claim rewards. Please try again.",
          onRetry: () => handleClaim()
        });
      }
    }
  };



// delegatorWithdrawAddress
const queryWithdrawAddress = async () => {
  const queryClient = QueryClient.withExtensions(
    connector?.getQueryClient(),
    setupDistributionExtension
  );
  const result_ = await queryClient.distribution.delegatorWithdrawAddress(
    address
  );

  console.log('result_', result_)
}


  const queryRewards = async () => {
    const queryClient = QueryClient.withExtensions(
      connector?.getQueryClient(),
      setupDistributionExtension
    );
    const result_ = await queryClient.distribution.delegationTotalRewards(
      address
    );

    const result = {
      rewards: result_.rewards.map((reward) => {
        return {
          validatorAddress: reward.validatorAddress,
          reward: reward.reward.map((r) => ({
            denom: r.denom,
            amount: sliceFormat(r.amount, 18),
            amount_hm: BigNumber(sliceFormat(r.amount, 18))
              .div(1e18)
              .toString(),
          })),
        };
      }),
      total: result_.total.map((t) => ({
        denom: t.denom,
        amount: sliceFormat(t.amount, 18),
      })),
    };

    const res = result?.total
      ?.reduce((prev, next) => {
        return BigNumber(next?.amount).plus(prev);
      }, BigNumber(0))
      .div(1e18)
      .toString();

    setRewardsAmount(res)
    return res
  };


  useEffect(() => {
    if (!address && rewardsAmount) {
      setRewardsAmount("0")
    }
  }, [address, rewardsAmount])

  useRequest(
    () => queryRewards(),
    {
      ready: !!address && !!connector,
      refreshDeps: [address, connector],
      pollingInterval: blockTime.long,
      onError(e) {
        console.log("error", e);
      },
    }
  );

  const [search, setSearch] = useState('')
  const filteredValidators = useMemo(() => {
    return activeValidators.filter((validator) => validator.name.toLowerCase().includes(search.toLowerCase()))
  }, [search, activeValidators])

  return (
    <>
      {/* 主标题 */}
      <div className="pt-12 flex flex-col items-center gap-6 relative z-[2]">
        <div className="flex flex-col items-center">
          <span className={cn("unbounded font-light text-white text-center", "text-[32px] lg:text-[2.25rem]")}>STAKE CGTS</span>
        </div>
      </div>

      {/* 主要内容部分 */}
      <div className="w-full mx-auto mt-8 relative z-[2]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧 - 质押信息 */}
          <GradientBorderCard
            className="lg:col-span-3"
            borderRadius={8}
          >
            <div className="w-full py-4 px-4 lg:px-6 h-full flex flex-col justify-between">
              <div className={cn("flex gap-4", "flex-col lg:flex-row lg:justify-between")}>
                <h2 className="unbounded-20-300">STAKE CGTS</h2>
                <Button
                  onClick={handleStakeModal}
                  type={BtnType.light}
                  className="rounded-lg px-8 py-2 text-base"
                >
                  STAKE
                </Button>
              </div>

              <div className={cn("grid ", "grid-cols-1 mt-4 lg:grid-cols-3" )}>
                <div className={cn("col-span-1 border-white ", "border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-6")}>
                  <div className="unbounded text-base mb-2 font-light">STAKING AMOUNT</div>
                  <div className={cn("text-2xl unbounded ", "text-left lg:text-right")}>{stakeAmount} CGT</div>
                </div>
                <div className={cn("col-span-1 border-white ",  "border-b py-4 lg:py-0 lg:px-6 lg:border-r lg:border-b-0")}>
                  <div className="unbounded text-base mb-2 font-light">UNSTAKING AMOUNT</div>
                  <div className={cn("text-2xl unbounded ", "text-left lg:text-right")}>{unstakeAmount} CGT</div>
                </div>
                <div className={cn("col-span-1 ", "pt-4 lg:pt-0 lg:pl-4")}>
                  <div className="unbounded text-base mb-2 font-light">APR</div>
                  <div className={cn("text-2xl unbounded ", "text-left lg:text-right")}>{apr}%</div>
                </div>
              </div>
            </div>
          </GradientBorderCard>

          {/* 右侧 - 领取奖励 */}
          <GradientBorderCard
            borderRadius={8}
          >
            <div className="w-full py-4 px-4 lg:px-6">
              <h2 className="unbounded-20-300 mb-4">CLAIM REWARDS</h2>
              <div className={cn("unbounded-24-400 mb-4", "text-left lg:text-right")}>{formatReward(rewardsAmount, 4)} CYS</div>
              <Button
                needLoading
                // disabled={!Number(rewardsAmount) || !address}
                onClick={address ? handleClaim : connectWallet}
                type={BtnType.light}
                className="rounded-lg w-full py-3 text-base"
              >
                {!address ? 'CONNECT KEPLR' : 'CLAIM ALL'}
              </Button>
            </div>
          </GradientBorderCard>
        </div>

        {/* 我的验证者 or 开始质押提示 */}
        {hasStaked ? (
          <GradientBorderCard
            className="mt-6"
            borderRadius={8}
          >
            <div className="w-full py-4 px-4 lg:px-6">
              <div className={cn("flex mb-4", "flex-col gap-4 lg:flex-row lg:justify-between lg:items-center" )}>
                <h2 className="unbounded-20-400">MY STAKE</h2>
                {/* <div className="flex items-center gap-2">
                  <History size={16} />
                  <span className="!text-sm text-sub">Daily update at 2PM UTC</span>
                </div> */}
              </div>

              {stakeLoading ? (
                <div className="text-center py-6">loading validators...</div>
              ) : (
                <CysicTable
                  data={myValidators}
                  columns={myValidatorsColumns}
                  keyExtractor={(validator) => validator.id}
                />
              )}
            </div>
          </GradientBorderCard>
        ) : (
          <GradientBorderCard
            className="mt-6"
            borderRadius={8}
          >
            <div className="w-full py-4 px-4 lg:px-6">
              <h2 className="unbounded-20-300 mb-2">YOUR VALIDATORS</h2>
              <div className="flex gap-2 items-start mb-3 ">
                <div className="w-full">
                  <p className="text-sub text-base mb-4">
                    Your currently don't stake to any validators. Start staking now to select from the list of active validators below.
                  </p>
                </div>
              </div>
            </div>
          </GradientBorderCard>
        )}

        {/* 活跃验证者列表 */}
        <GradientBorderCard
          className="mt-6"
          borderRadius={8}
        >
          <div className="w-full py-4 px-4 lg:px-6">
            <div className={cn("flex mb-4", "flex-col gap-4 lg:flex-row lg:justify-between lg:items-center")}>
              <h2 className="unbounded-20-300">ACTIVE VALIDATORS</h2>
              <Input startContent={<Search size={16} />} classNames={{ base: 'max-w-[12.5rem]'}} variant="bordered" value={search} onValueChange={setSearch} placeholder="Search by validator name" />
            </div>

            {activeLoading ? (
              <div className="text-center py-6">loading active validators...</div>
            ) : (
              <CysicTable
                data={filteredValidators}
                columns={activeValidatorsColumns}
                keyExtractor={(validator) => validator.id}
              />
            )}
          </div>
        </GradientBorderCard>
      </div>
    </>
  );
};

export default StakePage;