import { blockTime, cosmosCysicTestnet } from "@/config"
import useCosmos from "@/models/_global/cosmos"
import { useEventListener, useRequest } from "ahooks"
import BigNumber from "bignumber.js"
import { setupDepositExtension } from "@/utils/cysic-query"
import { QueryClient } from "@cosmjs/stargate"
import { connectComet } from "@cosmjs/tendermint-rpc";
import { useRef } from "react"

const basicDecimaal = 18

const useCosmosBalance = () => {
    const { address, connector, unmatchedAddressWithEVM, setState } = useCosmos()

    const depositExtension = useRef<any>(null)
    const initDepositExtension = async () => {
        if (depositExtension.current) return depositExtension.current;
        const tmClient = await connectComet(cosmosCysicTestnet.rpc);
        const client = new QueryClient(tmClient);
        const _depositExtension = setupDepositExtension(client);
        depositExtension.current = _depositExtension

        return _depositExtension
    }

    // 获取余额信息
    const { run } = useRequest(() => {
        if (unmatchedAddressWithEVM) {
            setState({
                balanceMap: undefined,
                depositMap: undefined // 同时清空存款信息
            })

            throw new Error('Unmatched Address')
        }

        fetchDepositInfo()
        return connector?.['getAllBalances']?.(address)
    }, {
        ready: !!connector && !!address,
        refreshDeps: [address],
        pollingInterval: blockTime.long,
        onSuccess(e: any) {
            const res = e?.reduce((prev: any, next: any) => {
                if (!prev?.[next?.denom]) {
                    prev[next?.denom] = {}
                }

                prev[next?.denom].amount = next?.amount
                prev[next?.denom].denom = next?.denom
                prev[next?.denom].decimal = basicDecimaal
                prev[next?.denom].hm_amount = BigNumber(next?.amount).div(10 ** basicDecimaal).toString()

                return prev
            }, {})

            setState({
                balanceMap: res
            })
        }
    })

    // 获取存款信息
    const fetchDepositInfo = async () => {
        if (!connector || !address) return;

        try {
            // 创建扩展
            // const tmClient = await Tendermint34Client.connect(cysicTestnet.rpc);

            const depositExtension = await initDepositExtension()

            if (!depositExtension) return;
            // 获取验证者和证明者的存款
            const [proverResult, exchangeableResult] = await Promise.allSettled([
                depositExtension?.distribution?.prover(address),
                depositExtension?.distribution?.exchangeableCGT(address)
                // depositExtension.distribution.verifier(address)
            ]);

            // 处理存款结果
            const depositMap: any = {};
            const exchangeableMap: any = {};

            // 处理验证者存款
            if (proverResult.status === 'fulfilled' && proverResult.value) {
                const proverAmount = proverResult.value.deposit_amount || "0";
                depositMap.proverAmount = proverAmount;
                depositMap.proverHmAmount = BigNumber(proverAmount).div(10 ** basicDecimaal).toString();
            }

            if (exchangeableResult.status === 'fulfilled' && exchangeableResult.value) {
                const exchangeableAmount = exchangeableResult.value.deposit_amount || "0";
                exchangeableMap.amount = exchangeableAmount;
                exchangeableMap.hm_amount = BigNumber(exchangeableAmount).div(10 ** basicDecimaal).toString();
            }

            // 更新状态
            setState({
                depositMap,
                exchangeableMap
            });

            console.log("Deposit info updated:", depositMap);
        } catch (error) {
            console.error("Failed to fetch deposit info:", error);
        }
    };

    // 监听刷新事件
    useEventListener('refresh_cosmosBalance' as string, () => {
        run()
    })

    // 增加监听刷新存款信息的事件
    useEventListener('refresh_depositInfo' as string, () => {
        fetchDepositInfo()
    })
}

export default useCosmosBalance