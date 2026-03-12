// Kr模块API服务层
import useKrActivity from "@/models/kr";
import { ETaskStatus } from "@/routes/pages/Admin/interface";
import dayjs from "dayjs";

const API_BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://api.prover.xyz";
export interface SignInReward {
  createdAt: number;
  description: string;
  id: number;
  requiredConsecutiveDays: number;
  rewardPoints: number;
  rewardStampId: number;
  updatedAt: number;
}

// 用户徽章类型
export interface Stamp {
  id: number;
  name: string;
  stampType: string;
  description: string;
  imgUrl: string;
  sorted: number;
  disabled: boolean;
  earnedAt: number; // 获得时间
  createdAt: number;
  updatedAt: number;
}
// 通用响应类型
interface ApiResponse {
  code: string;
  msg: string;
  [key: string]: unknown;
}

// 系统设置类型
interface SystemSetting {
  enableInviteCode: boolean;
  [key: string]: unknown;
}

// 用户概览类型
interface UserOverview {
  id: number;
  twitterName: string;
  relatedURL: string;
  avatarURL: string;
  points: number;
  createdAt: number;
  updatedAt: number;
}

interface InviteCode {
  id: number;
  code: string;
  available: boolean;
  createdAt: number;
  updatedAt: number;
}

// 第一个任务类型
interface FirstTask {
  id: number;
  title: string;
  description: string;
  imgUrl: string;
  taskType: string;
  quizTaskConfig: {
    quiz: string;
    answer: string;
  };
  inviteTaskConfig: {
    requestInviteNum: number;
  };
  postTwitterTaskConfig: {
    content: string;
  };
  quoteTwitterTaskConfig: {
    content: string;
  };
  RewardPoints: number;
  RewardStampId: number;
  startAt: number;
  endAt: number;
  forceLocked: boolean;
  createdAt: number;
  updatedAt: number;
  taskResult: ETaskStatus;
}

// 获取存储的认证token
const getAuthToken = (): string | null => {
  return useKrActivity.getState().getAuthToken();
};

// 设置认证token
const setAuthToken = (token: string): void => {
  useKrActivity.getState().setAuthToken(token);
};

// 清除认证token
const clearAuthToken = (): void => {
  useKrActivity.getState().clearAuthToken();
};

// 通用请求函数
async function request<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // 如果有 token，添加到 header
  if (token) {
    headers["x-cysic-auth"] = token;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// 签到相关接口
export const signInApi = {
  // 签到
  signIn: (): Promise<ApiResponse> =>
    request("/socialtask/api/v1/signIn/sign", {
      method: "POST",
    }),

  // YYYY-MM-DD
  getSignInHistory: (
    startDate: number,
    endDate: number
  ): Promise<ApiResponse & { signInDates: string[] }> =>
    request(
      `/socialtask/api/v1/signIn/history?${new URLSearchParams({
        ...(startDate && { startDate: dayjs(startDate).format("YYYY-MM-DD") }),
        ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
      })}`
    ),

  // /socialtask/api/v1/signIn/rewardList
  getSignInRewardList: (
    page?: number,
    pageSize?: number
  ): Promise<ApiResponse & { list: SignInReward[] }> =>
    request(
      `/socialtask/api/v1/signIn/rewardList?${new URLSearchParams({
        ...(page && { page: page.toString() }),
        ...(pageSize && { pageSize: pageSize.toString() }),
      })}`
    ),
};

// 系统设置相关接口
export const systemApi = {
  // 获取系统设置
  getSettings: (): Promise<ApiResponse & { data: SystemSetting }> =>
    request("/socialtask/api/v1/systemSetting"),
};

// 社交媒体相关接口
export const socialMediaApi = {
  // 绑定Twitter
  bindTwitter: (): Promise<ApiResponse> =>
    request("/socialtask/api/v1/socialMedia/bindTwitter", {
      method: "POST",
      body: JSON.stringify({
        redirectURL: window.location.origin + window.location.pathname,
      }),
    }),
};

// 邀请码相关接口
export const inviteCodeApi = {
  // 绑定邀请码
  bindInviteCode: (code: string, socialName: string): Promise<ApiResponse> =>
    request("/socialtask/api/v1/inviteCode/bind", {
      method: "POST",
      body: JSON.stringify({ code, socialName }),
    }),

  // 检查邀请码是否有效
  checkInviteCode: (code: string): Promise<ApiResponse & { valid: boolean }> =>
    request("/socialtask/api/v1/inviteCode/check", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
};

// 用户相关接口
export const userApi = {
  // 获取用户概览
  getOverview: (): Promise<
    ApiResponse & { user: UserOverview; inviteCodes: InviteCode[] }
  > => request("/socialtask/api/v1/user/overview"),

  // 获取用户列表
  getUserList: (
    num: number
  ): Promise<
    ApiResponse & {
      list: { avatar: string; username: string; relatedUrl: string }[];
    }
  > => request(`/socialtask/api/v1/user/list?num=${num}`),


  bindAddress: (address: string): Promise<ApiResponse> =>
    request("/socialtask/api/v1/user/bindAddress", {
      method: "POST",
      body: JSON.stringify({ address }),
    }),
};

// 任务类型定义
export interface Task {
  id: number;
  title: string;
  description: string;
  imgUrl: string;
  taskType: string;
  RewardPoints: number;
  RewardStampId: number;
  startAt: number;
  endAt: number;
  forceLocked: boolean;
  currentStatus: number; // 0: 未完成, 1: 待审核, 2: 待领取, 3: 已完成
  taskResult: string;
  createdAt: number;
  updatedAt: number;
  inviteTaskConfig?: {
    requestInviteNum: number;
  };
  postTwitterTaskConfig?: {
    content: string;
  };
  quizTaskConfig?: {
    quiz: string;
    answer: string;
  };
  quoteTwitterTaskConfig?: {
    content: string;
  };
  retweetAndLikeTwitterTaskConfig?: {
    content: string;
  };
  interactionNicknameTwitterTaskConfig?: {
    content: string;
  };
}

// 任务相关接口
export const taskApi = {
  // 获取第一个任务
  getFirstTask: (): Promise<ApiResponse & { task: FirstTask }> =>
    request("/socialtask/api/v1/firstTask"),

  // 获取任务列表
  getTaskList: (
    id?: number,
    groupId?: string
  ): Promise<
    ApiResponse & {
      list: Task[];
      total: number;
      totalWithoutForceLocked: number;
    }
  > =>
    request(
      `/socialtask/api/v1/task/list?${new URLSearchParams({
        ...(id && { taskId: id.toString() }),
        ...(groupId && {
          groupId: (+groupId + 2).toString()
        }),
      })}`
    ),

  // 提交任务
  submitTask: (taskId: number, result: string, relatedUrl?: string): Promise<ApiResponse> =>
    request("/socialtask/api/v1/task/submit", {
      method: "POST",
      body: JSON.stringify({ taskId, result, relatedUrl }),
    }),

  // 领取任务奖励
  claimTask: (taskId: number): Promise<ApiResponse> =>
    request("/socialtask/api/v1/task/claim", {
      method: "POST",
      body: JSON.stringify({ id: taskId }),
    }),
};

// 徽章相关接口
export const stampApi = {
  // 获取用户徽章列表
  getStampList: (
    page?: number,
    pageSize?: number
  ): Promise<ApiResponse & { list: UserStamp[]; total: string }> =>
    request(
      `/socialtask/api/v1/stamp/list?${new URLSearchParams({
        ...(page && { page: page.toString() }),
        ...(pageSize && { pageSize: pageSize.toString() }),
      })}`
    ),
};

// 认证相关工具函数
export const authUtils = {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  isAuthenticated: (): boolean => useKrActivity.getState().isAuthenticated(),
};

export default {
  systemApi,
  socialMediaApi,
  inviteCodeApi,
  userApi,
  taskApi,
  stampApi,
  signInApi,
  authUtils,
};
