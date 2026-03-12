import { cosmosToEthAddress } from "@/utils/cosmos";
import { DepositType } from "@/utils/cysic-msg";
import { createProtobufRpcClient, ProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Writer, Reader } from "protobufjs/minimal";

function createMsg(
  typeUrl: string,
  fields: Record<string, any>,
  options?: any
) {
  return {
    typeUrl,
    encode(message: any, writer: Writer = Writer.create()): Writer {
      Object.keys(fields).forEach((key, index) => {
        const fnc = options?.encode?.[key] ? "int32" : "string";

        writer.uint32(
          options?.encode?.[key] || (index == 0 ? 10 : 10 + index * 8)
        );

        const encodeFunction = writer[fnc as keyof Writer] as Function;
        if (typeof encodeFunction === "function") {
          encodeFunction.call(writer, message[key]);
        }
      });

      return writer;
    },
    decode(input: Uint8Array | Reader, length?: number) {
      const reader = input instanceof Uint8Array ? new Reader(input) : input;
      let end = length === undefined ? reader.len : reader.pos + length;
      const _fields = options?.decode?.fields || fields;
      const message: Record<string, any> = _fields;
      while (reader.pos < end) {
        const tag = reader.uint32();
        const fieldIndex = 0;

        const fieldName = Object.keys(_fields)?.[fieldIndex];
        if (!fieldName) {
          reader.skipType(tag & 7);
          continue;
        }

        message[fieldName] = reader.string();
      }

      return message;
    },
    fromPartial(object: any) {
      const message: Record<string, any> = fields;
      Object.keys(fields).forEach((key) => {
        message[key] = object[key] ?? "";
      });
      return message;
    },
  };
}

const MsgDepositRequest = createMsg(
  "/cysicmint.cysic.v1.QueryDepositRequest",
  {
    address: "",
    depositType: "",
  },
  {
    encode: {
      depositType: 16,
    },
    decode: {
      fields: {
        deposit_amount: "",
      },
    },
  }
);

class QueryDepositClient {
  rpc: ProtobufRpcClient;
  constructor(rpc: ProtobufRpcClient) {
    this.rpc = rpc;
    this.Deposit = this.Deposit.bind(this);
  }
  ExchangeableAmount(request: { address: string }) {
    const data = MsgDepositRequest.encode(request).finish();
    const promise = this.rpc.request(
      "cysicmint.govtoken.v1.Query",
      "ExchangeableAmount",
      data
    );
    return promise.then((data: any) => {
      const r = MsgDepositRequest.decode(new Reader(data));
      return r;
    });
  }
  Deposit(request: { address: string; depositType: string | number }) {

    const data = MsgDepositRequest.encode(request).finish();
    const promise = this.rpc.request(
      "cysicmint.cysic.v1.Query",
      "Deposit",
      data
    );
    return promise.then((data: any) => {
      const r = MsgDepositRequest.decode(new Reader(data));
      return r;
    });
  }
}


export function setupDepositExtension(base: QueryClient) {
  const rpc = createProtobufRpcClient(base);
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification

  const queryService = new QueryDepositClient(rpc);
  return {
    distribution: {
      exchangeableCGT: async (address: string) => {
        const response = await queryService.ExchangeableAmount({ address });
        return response;
      },
      prover: async (address: string) => {
        const response = await queryService.Deposit({
          address: cosmosToEthAddress(address) as string,
          depositType: DepositType.PROVER_DEPOSIT_TYPE,
        });

        return response;
      },
      verifier: async (address: string) => {
        const response = await queryService.Deposit({
          address: cosmosToEthAddress(address) as string,
          depositType: DepositType.VERIFIER_DEPOSIT_TYPE,
        });

        return response;
      },
      deposit: async (address: string, depositType: string | number) => {
        const response = await queryService.Deposit({
          address: cosmosToEthAddress(address) as string,
          depositType: depositType,
        });

        return response;
      },
    },
  };
}