import { useAiChatStore } from '@/components/chat/models/chat';
import { isProd } from '@/config';
import axios, { AxiosResponse } from 'axios';

export interface BaseResponse<T> {
    status?: string;
    success?: boolean;
    msg?: string;
    data: T;
}

export interface BaseErrorResponse {
    detail: [
        {
            loc: string[];
            msg: string;
            type: string;
        }
    ]
}

export type SessionResponse = string;

export interface HistoryRequest {
    userId: string;
    limit: number;
}
export interface HistoryResponse {
    messages: {
        role: "user" | "assistant";
        content: string;
        type: "welcome" | "pure" | "md";
        timestamp: string;
    }[];
}
export type SessionRateLimitResponse = string;
export type SessionStatsResponse = string;

export interface ChatRequest {
    question: string;
    session_id: string;
}
export interface ChatResponse {
    success: boolean;
    answer: string;
    sources: string[];
    question: string;
    timestamp: string;
}

export interface FaqResponse {
    success: boolean;
    total: number;
    items: {
        id: string;
        question: string;
        answer: string;
        aliases: string[];
    }[];
}

export const chatAxios = axios.create({
    // https://143.198.211.250:9998
    baseURL: `https://${isProd ? 'api.cysic.xyz' : 'api-dev.prover.xyz'}/ai`,
    timeout: 120_000,
    headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=120',
    },
});

chatAxios.interceptors.request.use((config) => {
    if(config.url?.includes('requestSessionId') || config.url?.includes('proxy')){
        config.headers['X-Session-Id'] = useAiChatStore.getState().sessionId;
    }
    return config;
});

chatAxios.interceptors.response.use(
    (response: AxiosResponse<BaseResponse<any>>) => {
        const res = response.data;

        if ('status' in res && res.status !== undefined && !['healthy'].includes(res.status as string)) {
            throw res;
        }

        if ('success' in res && !res.success) {
            throw res;
        }

        return response;
    },
    (error) => {
        if(error?.status == 403){
            useAiChatStore.getState().setSessionId(undefined);
            dispatchEvent(new CustomEvent('ai_chat_refresh_session'));
        }
        return Promise.reject(error);
    }
);

export const getSessionId = async ()=>{
    const res = await chatAxios.get(`/requestSessionId`);
    console.log('res', res)
    return res.data;
}

export const healthCheck = async () => {
    const res = await chatAxios.get('/proxy/health');
    return res.data;
};

// 获取用户会话信息
// EVM地址: 0x开头的地址
export const getSession = async (userId: string) => {
    const res = await chatAxios.get<BaseResponse<SessionResponse>>(`/proxy/api/session/${userId}`);
    return res.data;
};

// 获取用户对话历史
// Args: user_id: 用户ID limit: 限制返回的消息数量
export const getSessionHistory = async (request: HistoryRequest) => {
    const res = await chatAxios.get<HistoryResponse>(`/proxy/api/session/${request.userId}/history`, {
        params: {
            limit: request.limit,
        },
    });
    return res.data;
};

// 获取会话的速率限制统计信息
export const getSessionRateLimit = async (sessionId: string) => {
    const res = await chatAxios.get<BaseResponse<SessionRateLimitResponse>>(`/proxy/api/rate-limit/stats/${sessionId}`);
    return res.data;
};

// 获取会话统计信息
export const getSessionStats = async (sessionId: string) => {
    const res = await chatAxios.get<BaseResponse<SessionStatsResponse>>(`/proxy/api/session/${sessionId}/stats`);
    return res.data;
}


// 接收用户问题，返回AI回答 速率限制：每个会话1分钟内最多5次请求
export const chat = async (request: ChatRequest) => {
    const res = await chatAxios.post<ChatResponse>('/proxy/api/chat', request);
    return res.data;
};

// 列出全部固定问答
export const getFaq = async () => {
    const res = await chatAxios.get<BaseResponse<FaqResponse>>('/proxy/api/faq');
    return res.data;
};