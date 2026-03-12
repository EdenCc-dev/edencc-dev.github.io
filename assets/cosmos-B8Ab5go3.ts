import useCosmos from "@/models/_global/cosmos";
import { Registry, GeneratedType } from "@cosmjs/proto-signing";
import { SigningStargateClient, defaultRegistryTypes } from "@cosmjs/stargate";
import {
    MsgExchangeToPlatformToken,
    MsgExchangeToGovToken,
    MsgDelegate,
} from "./cysic-msg";
import { cosmosCysicTestnet } from "@/config";
import * as bech32 from "bech32";
import { toast } from "react-toastify";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import {
    AuthInfo,
    TxBody,
    Fee,
    TxRaw,
} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import { Buffer } from "buffer";
import { checksumAddress } from "viem";
import { handleCheckKeplrModal } from "@/utils/tools";

declare global {
    interface Window {
        keplr?: any;
    }
}

let provider = !window?.keplr?.isOkxWallet && window?.keplr;
export const updateProvider = () => {
    
    if(!window?.keplr?.isOkxWallet && window?.keplr){
        provider = window?.keplr;
    }

    return provider;
};

const set = useCosmos.getState().setState;
// const rpc = 'http://dev-node-1.prover.xyz'

const chain = cosmosCysicTestnet.chainId;
const cosmosConfig = {
    [cosmosCysicTestnet.chainId]: cosmosCysicTestnet,
};

// soft - 尝试链接，不处理任何报错
// hard - 尝试链接，处理所有报错
async function connectWallet(props?: {mode?: 'soft' | 'hard'}) {
    const {mode = 'hard'} = props || {}
    const chainId = cosmosConfig[chain]?.chainId;
    const rpc = cosmosConfig[chain]?.rpc;

    const provider = updateProvider()

    // 检查是否安装了 Keplr
    if (!provider) {
        if(mode === 'soft'){
            return;
        }
        checkKeplrWallet();
        throw { message: "Keplr Wallet is not available" };
    }
    set({ isConnecting: true });

    try {
        await provider.experimentalSuggestChain(cosmosConfig[chain]);

        // 请求用户授权
        await provider?.enable(chainId);

        // 创建签名客户端
        const offlineSigner = provider.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();

        // register cysic msgs
        const cysicRegistryTypes = [
            [
                "/cysicmint.govtoken.v1.MsgExchangeToGovToken",
                MsgExchangeToGovToken,
            ] as [string, GeneratedType],
            [
                "/cysicmint.govtoken.v1.MsgExchangeToPlatformToken",
                MsgExchangeToPlatformToken,
            ] as [string, GeneratedType],
            ["/cysicmint.delegate.v1.MsgDelegate", MsgDelegate] as [
                string,
                GeneratedType
            ],
        ];
        const registry = new Registry(
            defaultRegistryTypes.concat(cysicRegistryTypes)
        );
        const client: any = await SigningStargateClient.connectWithSigner(
            rpc,
            offlineSigner,
            { registry }
        );

        client.disable = () => {
            client?.signer?.keplr?.disable?.();
            useCosmos.getState().init();
        };
        useCosmos.getState().setState({
            address: accounts[0].address,
            client,
            chainId,
            connector: client,
            isConnected: true,
            isConnecting: false,
            hasConnectedWithKeplr: true,
        });

        // @ts-ignore
        window.__dangerous_cysic_keplr_client = client

        return client;
    } catch (e) {
        useCosmos.getState().setState({
            isConnecting: false,
            hasConnectedWithKeplr: false
        });
    }
}

export function cosmosToEthAddress(cosmosAddress: string) {
    try {
        const decoded = bech32.decode(cosmosAddress);
        const data = bech32.fromWords(decoded.words);
        const ethAddress = "0x" + Buffer.from(data).toString("hex");
        return checksumAddress(ethAddress as `0x${string}`);
    } catch (error) {
        console.error("Incorrect Cosmos Address:", error);
        return null;
    }
}

// const cosmosAddress = 'cysic1qdr7yshldxank3nx54lv59gzz9p5uztpq4vhnh';
// console.log('cosmosToEthAddress', cosmosAddress, cosmosToEthAddress(cosmosAddress));

export const checkkTx = async (client: any, txHash: string) => {
    // 查询交易状态
    const result = await client.getTx(txHash);
    console.log("tx res", result);

    if (result && result.code === 0) {
        return result;
    } else {
        throw { message: `Tx Failed at ${result?.hash}` };
    }

    
};

// @ts-ignore
window.__dangerous_cysic_keplr_checkTx = checkkTx;

export async function signAndBroadcastDirect(
    address: any,
    msg: any,
    cosmosFee: any,
    client: any
) {
    if (!window?.keplr) {
        throw new Error("Keplr is not installed");
    }

    const chainId = cosmosCysicTestnet.chainId; // 替换为实际的 chainId

    // 启用 Keplr 与链的交互
    await window?.keplr.enable(chainId);

    // 获取离线签名器
    const offlineSigner = window?.keplr.getOfflineSigner(chainId);

    // 获取账户信息
    const accounts = await offlineSigner.getAccounts();

    // 获取链上账户数据，例如 accountNumber 和 sequence
    const account = await client.getAccount(address);

    const { pubKey } = await window?.keplr.getKey(chainId);
    const signDoc = {
        bodyBytes: TxBody.encode(
            TxBody.fromPartial({
                messages: Array.isArray(msg) ? msg : [msg],
                memo: "",
            })
        ).finish(),
        authInfoBytes: AuthInfo.encode({
            signerInfos: [
                {
                    publicKey: {
                        typeUrl: "/cysicmint.crypto.v1.ethsecp256k1.PubKey", // "/cosmos.crypto.secp256k1.PubKey",
                        value: PubKey.encode({
                            key: pubKey,
                        }).finish(),
                    },
                    modeInfo: {
                        single: {
                            mode: SignMode.SIGN_MODE_DIRECT,
                        },
                        multi: undefined,
                    },
                    sequence: account?.sequence,
                },
            ],
            fee: Fee.fromPartial({
                amount: cosmosFee.amount.map((coin: any) => {
                    return {
                        denom: coin.denom,
                        amount: coin.amount.toString(),
                    };
                }),
                gasLimit: cosmosFee.gas,
            }),
        }).finish(),
        chainId: chainId,
        accountNumber: account.accountNumber,
    };

    console.log("signDoc", signDoc);

    const signed = await window?.keplr.signDirect(chainId, address, signDoc);

    const signedTx = {
        tx: TxRaw.encode({
            bodyBytes: signed.signed.bodyBytes,
            authInfoBytes: signed.signed.authInfoBytes,
            signatures: [Buffer.from(signed.signature.signature, "base64")],
        }).finish(),
        signDoc: signed.signed,
    };

    console.log("signedTx", signedTx, "signDoc", signDoc);

    // 广播签名后的交易
    // const result = await window?.keplr.sendTx(chainId,  signedTx.tx, "sync")
    const result = await client.broadcastTx(signedTx.tx);
    console.log("result", result);
    return result;
}

export const checkKeplrWallet = (onlyClient?: boolean) => {
    const status = !!useCosmos.getState().address && !!useCosmos.getState().client;

    const unmatchedAddressWithEVM = useCosmos.getState().unmatchedAddressWithEVM == true

    if (!status) {
        handleCheckKeplrModal()
        throw { message: "Keplr Wallet is not available" };
        // return;
    }

    if(onlyClient) return;

    if(unmatchedAddressWithEVM){
        if(!document.querySelectorAll('#unmathedAddressToast')?.[0]){
            unmatchToastError()
        }
                     
        dispatchEvent(new CustomEvent('modal_download_keplr_visible', {detail:{
            type: 'unmathedAddress',
            visible: true
        }}))
        throw { message: "Unmatched Cosmos/EVM Address" };
    }
};

export const convertAddrByProvider = async ({ client }: { client: any }) => {
    checkKeplrWallet(true);

    const chainId = cosmosCysicTestnet.chainId; // 替换为实际的 chainId
    const accounts = await client?.signer?.keplr?.getKey(chainId)

    return {
        ethereumHexAddress: accounts?.ethereumHexAddress,
        bech32Address: accounts?.bech32Address
    }
};

export const unmatchToastError = ()=>{
    toast.error(`Your Keplr and EVM addresses don’t match. Align them to access this page.`, {
        hideProgressBar: true,
        closeOnClick: false,
        autoClose: false,
        closeButton: false,
        toastId: 'unmathedAddressToast'
    })
}

export { connectWallet };
