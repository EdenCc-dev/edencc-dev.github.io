
import { Writer, Reader } from "protobufjs/minimal";

export interface IMsgExchangeToGovToken {
    sender: string;
    amount: string;
}

export const MsgExchangeToGovToken = {
    typeUrl: "/cysicmint.govtoken.v1.MsgExchangeToGovToken",
    encode(message: any, writer: Writer = Writer.create()): Writer {
        writer.uint32(10).string(message.sender);
        writer.uint32(18).string(message.amount);
        return writer;
    },
    decode(input: Uint8Array | Reader, length?: number) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { sender: "", amount: "" } as IMsgExchangeToGovToken;
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.amount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: any) {
        const message = { sender: "", amount: "" };
        message.sender = object.sender ?? "";
        message.amount = object.amount ?? "";
        return message;
    },
};

export interface IMsgExchangeToPlatformToken {
    sender: string;
    amount: string;
}

export const MsgExchangeToPlatformToken = {
    typeUrl: "/cysicmint.govtoken.v1.MsgExchangeToPlatformToken",
    encode(message: any, writer: Writer = Writer.create()): Writer {
        writer.uint32(10).string(message.sender);
        writer.uint32(18).string(message.amount);
        return writer;
    },
    decode(input: Uint8Array | Reader, length?: number): IMsgExchangeToPlatformToken {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { sender: "", amount: "" } as IMsgExchangeToPlatformToken;
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.amount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: IMsgExchangeToPlatformToken): IMsgExchangeToPlatformToken {
        const message = { sender: "", amount: "" } as IMsgExchangeToPlatformToken;
        message.sender = object.sender ?? "";
        message.amount = object.amount ?? "";
        return message;
    },
};

export interface IMsgDelegate {
    worker: string;
    validator: string;
    token: string;
    amount: string;
}

export const MsgDelegate = {
    typeUrl: "/cysicmint.delegate.v1.MsgDelegate",
    encode(message: IMsgDelegate, writer: Writer = Writer.create()): Writer {
        writer.uint32(10).string(message.worker);
        writer.uint32(18).string(message.validator);
        writer.uint32(26).string(message.token);
        writer.uint32(34).string(message.amount);
        return writer;
    },
    decode(input: Uint8Array | Reader, length?: number): IMsgDelegate {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { worker: "", validator: "", token: "", amount: "" } as IMsgDelegate;
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.worker = reader.string();
                    break;
                case 2:
                    message.validator = reader.string();
                    break;
                case 3:
                    message.token = reader.string();
                    break;
                case 4:
                    message.amount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromPartial(object: IMsgDelegate): IMsgDelegate {
        const message = { worker: "", validator: "", token: "", amount: "" } as IMsgDelegate;
        message.worker = object.worker ?? "";
        message.validator = object.validator ?? "";
        message.token = object.token ?? "";
        message.amount = object.amount ?? "";
        return message;
    },
};



function createMsg(
    typeUrl: string,
    fields: Record<string, any>,
    options?: any
) {
    return {
        typeUrl,
        encode(message: any, writer: Writer = Writer.create()): Writer {
            Object.keys(fields).forEach((key, index) => {
                const fnc = options?.encodeConfig?.[key] || "string";

                writer.uint32(
                    options?.wireTypeConfig?.[key] || (index == 0 ? 10 : 10 + index * 8)
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
            const message: Record<string, any> = fields;
            while (reader.pos < end) {
                const tag = reader.uint32();
                const fieldIndex = tag >>> 3;

                const fieldName = Object.keys(fields)?.[fieldIndex];
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

export enum DepositType {
    UNKNOWN_DEPOSIT_TYPE = 0,
    PROJECT_DEPOSIT_TYPE = 1,
    PROVER_DEPOSIT_TYPE = 2,
    VERIFIER_DEPOSIT_TYPE = 3,
    TASK_REWARD_DEPOSIT_TYPE = 4,
}



export const MsgDeposit = createMsg(
    "/cysicmint.cysic.v1.MsgDeposit",
    {
        depositType: "",
        amount: "",
        sender: "",
    },
    {
        wireTypeConfig: {
            depositType: 8,
        },
        encodeConfig: {
            depositType: "int32",
        },
    }
);

export const MsgWithdraw = createMsg(
    "/cysicmint.cysic.v1.MsgWithdraw",
    {
        depositType: "",
        amount: "",
        sender: "",
    },
    {
        wireTypeConfig: {
            depositType: 8,
        },
        encodeConfig: {
            depositType: "int32",
        },
    }
);

export const MsgRegisterProver = createMsg(
    "/cysicmint.cysic.v1.MsgProver",
    {
        id: "",
        name: "",
        domain: "",
        logo: "",
        description: "",
        prover: "",
        sender: "",
        report: "",
        reward_address: "",
    },
    {
        wireTypeConfig: {
            id: 8,
        },
    }
);

export const MsgRegisterVerifier = createMsg(
    "/cysicmint.cysic.v1.MsgVerifier",
    {
        id: "",
        name: "",
        reward_address: "",
        logo: "",
        description: "",
        verifier: "",
        sender: "",
    },
    {
        wireTypeConfig: {
            id: 8,
        },
    }
);