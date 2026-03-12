// 管理员 API 服务层

export const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
// export const API_BASE_URL = "";

interface ApiResponse {
  code: string;
  msg: string;
  [key: string]: unknown;
}

interface ListResponse<T> extends ApiResponse {
  list: T[];
  total: string;
}

// 获取存储的 token
const getStoredToken = (): string | null => {
  return localStorage.getItem('cysic-auth-token');
};

// 存储 token
const setStoredToken = (token: string): void => {
  localStorage.setItem('cysic-auth-token', token);
};

// 清除 token
const clearStoredToken = (): void => {
  localStorage.removeItem('cysic-auth-token');
};

// 通用请求函数
async function request<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // 如果有 token，添加到 header
  if (token) {
    headers['x-cysic-auth'] = token;
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

// 系统设置相关接口
export const settingsApi = {
  // 获取系统设置
  getSettings: (): Promise<ApiResponse & { enableInviteCode: boolean; firstTaskId: number }> =>
    request('/socialtask/api/v1/admin/setting'),

  // 更新邀请码启用状态
  updateEnableInviteCode: (enableInviteCode: boolean): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/setting/updateEnableInviteCode', {
      method: 'POST',
      body: JSON.stringify({ enableInviteCode }),
    }),

  // 更新第一个任务ID
  updateFirstTaskId: (firstTaskId: number): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/setting/updateFirstTaskId', {
      method: 'POST',
      body: JSON.stringify({ firstTaskId }),
    }),
};

// 邀请码管理相关接口
export const inviteCodeApi = {
  // 获取邀请码列表
  getList: (page?: number, pageSize?: number): Promise<ListResponse<{
    id: number;
    code: string;
    available: boolean;
    createdAt: number;
    updatedAt: number;
  }>> =>
    request(`/socialtask/api/v1/admin/inviteCode/list?${new URLSearchParams({
      ...(page && { page: page.toString() }),
      ...(pageSize && { pageSize: pageSize.toString() }),
    })}`),

  // 生成邀请码
  generate: (num: number, code?: string): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/inviteCode/generate', {
      method: 'POST',
      body: JSON.stringify({ num, ...(code && { code }) }),
    }),

  // 更新邀请码状态
  update: (id: number, available: boolean): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/inviteCode/update', {
      method: 'POST',
      body: JSON.stringify({ id, available }),
    }),
};

// 徽章管理相关接口
export const stampApi = {
  // 获取徽章列表
  getList: (page?: number, pageSize?: number): Promise<ListResponse<{
    id: number;
    name: string;
    stampType: string;
    description: string;
    imgUrl: string;
    sorted: number;
    disabled: boolean;
    createdAt: number;
    updatedAt: number;
  }>> =>
    request(`/socialtask/api/v1/admin/stamp/list?${new URLSearchParams({
      ...(page && { page: page.toString() }),
      ...(pageSize && { pageSize: pageSize.toString() }),
    })}`),

  // 创建徽章
  create: (data: {
    name: string;
    stampType: string;
    description: string;
    imgUrl: string;
    sorted: number;
    disabled: number;
  }): Promise<ApiResponse> => {
    const token = getStoredToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    
    // 添加鉴权 token
    if (token) {
      headers['x-cysic-auth'] = token;
    }
    
    return request('/socialtask/api/v1/admin/stamp/create', {
      method: 'POST',
      headers,
      // body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      body: JSON.stringify({...data, disabled: Boolean(data.disabled)})
    });
  },

  // 更新徽章
  update: (id: number, data: {
    name: string;
    stampType: string;
    description: string;
    imgUrl: string;
    sorted: number;
    disabled: number;
  }): Promise<ApiResponse> => {
    const token = getStoredToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    
    // 添加鉴权 token
    if (token) {
      headers['x-cysic-auth'] = token;
    }
    
    return request('/socialtask/api/v1/admin/stamp/update', {
      method: 'POST',
      headers,
      // body: new URLSearchParams({ id: id.toString(), ...data } as unknown as Record<string, string>).toString(),
      body: JSON.stringify({ id: Number(id), ...data, disabled: Boolean(data.disabled)})
    });
  },

  // 删除徽章
  delete: (id: number): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/stamp/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
};

// 签到奖励管理相关接口
export const signInRewardApi = {
  // 获取签到奖励列表
  getList: (page?: number, pageSize?: number): Promise<ListResponse<{
    id: number;
    description: string;
    requiredConsecutiveDays: number;
    rewardPoints: number;
    rewardStampId: number;
    createdAt: number;
    updatedAt: number;
  }>> =>
    request(`/socialtask/api/v1/admin/signInTaskReward/list?${new URLSearchParams({
      ...(page && { page: page.toString() }),
      ...(pageSize && { pageSize: pageSize.toString() }),
    })}`),

  // 创建签到奖励
  create: (data: {
    description: string;
    requiredConsecutiveDays: number;
    rewardPoints: number;
    rewardStampId: number;
  }): Promise<ApiResponse> => {
    const token = getStoredToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    
    // 添加鉴权 token
    if (token) {
      headers['x-cysic-auth'] = token;
    }
    
    return request('/socialtask/api/v1/admin/signInTaskReward/create', {
      method: 'POST',
      headers,
      // body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      body: JSON.stringify(data)
    });
  },

  // 更新签到奖励
  update: (id: number, data: {
    description: string;
    requiredConsecutiveDays: number;
    rewardPoints: number;
    rewardStampId: number;
  }): Promise<ApiResponse> => {
    const token = getStoredToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    
    // 添加鉴权 token
    if (token) {
      headers['x-cysic-auth'] = token;
    }
    
    return request('/socialtask/api/v1/admin/signInTaskReward/update', {
      method: 'POST',
      headers,
      // body: new URLSearchParams({ id: id.toString(), ...data } as unknown as Record<string, string>).toString(),
      body: JSON.stringify({ id: id.toString(), ...data })
    });
  },

  // 删除签到奖励
  delete: (id: number): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/signInTaskReward/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
};

// 任务管理相关接口
export const taskApi = {
  // 获取任务组列表
  getTaskGroupList: (page?: number, pageSize?: number): Promise<ListResponse<{
    id: number;
    title: string;
    description: string;
    imgUrl: string;
    startAt: number;
    endAt: number;
    taskList: unknown[];
    createdAt: number;
    updatedAt: number;
  }>> =>
    request(`/socialtask/api/v1/admin/taskGroup/list?${new URLSearchParams({
      ...(page && { page: page.toString() }),
      ...(pageSize && { pageSize: pageSize.toString() }),
    })}`),

  // 创建任务组
  createTaskGroup: (data: {
    title: string;
    description: string;
    imgUrl: string;
    startAt: number;
    endAt: number;
  }): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/taskGroup/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 更新任务组
  updateTaskGroup: (id: number, data: {
    title: string;
    description: string;
    imgUrl: string;
    startAt: number;
    endAt: number;
  }): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/taskGroup/update', {
      method: 'POST',
      body: JSON.stringify({ id, ...data }),
    }),

  // 删除任务组
  deleteTaskGroup: (id: number): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/taskGroup/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  // 获取任务列表
  getTaskList: (groupId: number, page?: number, pageSize?: number): Promise<ListResponse<unknown>> =>
    request(`/socialtask/api/v1/admin/task/list?${new URLSearchParams({
      groupId: groupId.toString(),
      ...(page && { page: page.toString() }),
      ...(pageSize && { pageSize: pageSize.toString() }),
    })}`),

  // 创建任务
  createTask: (data: any): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/task/create', {
      method: 'POST',
      body: JSON.stringify({...data, forceLocked: Boolean(data.forceLocked)}),
    }),

  // 更新任务
  updateTask: (data: any): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/task/update', {
      method: 'POST',
      body: JSON.stringify({...data, forceLocked: Boolean(data.forceLocked)}),
    }),

  // 删除任务
  deleteTask: (id: number): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/task/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  // 审核任务
  approveTask: (id: number): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/task/approve', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  rejectTask: (id: number): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/task/reject', {
      method: 'POST',
      body: JSON.stringify({ id, reason: 'Invalid Content' }),
    }),

  // 获取待审核的 Twitter 任务
  getPendingPostTwitterTasks: (params?: {
    page?: number;
    pageSize?: number;
    taskType?: string;
    taskStatus?: number;
    taskGroupId?: number;
    taskId?: number;
    fromTime?: number;
    toTime?: number;
    userId?: number;
  }): Promise<ListResponse<unknown>> =>
    request(`/socialtask/api/v1/admin/task/pendingPostTwitter?${new URLSearchParams({
      ...(params?.page && { page: params.page.toString() }),
      ...(params?.pageSize && { pageSize: params.pageSize.toString() }),
      ...(params?.taskType && { taskType: params.taskType }),
      ...(params?.taskStatus && { taskStatus: params.taskStatus.toString() }),
      ...(params?.taskGroupId && { taskGroupId: params.taskGroupId.toString() }),
      ...(params?.taskId && { taskId: params.taskId.toString() }),
      ...(params?.fromTime && { fromTime: params.fromTime.toString() }),
      ...(params?.toTime && { toTime: params.toTime.toString() }),
      ...(params?.userId && { userId: params.userId.toString() }),
    })}`),
};

// 管理员用户管理相关接口
export const adminUserApi = {
  // 获取管理员用户列表
  getList: (page?: number, pageSize?: number): Promise<ListResponse<{
    id: number;
    address: string;
    name: string;
    status: number;
    createdAt: number;
    updatedAt: number;
  }>> =>
    request(`/socialtask/api/v1/admin/adminUser/list?${new URLSearchParams({
      ...(page && { page: page.toString() }),
      ...(pageSize && { pageSize: pageSize.toString() }),
    })}`),

  // 创建管理员用户
  create: (data: {
    address: string;
    name: string;
    status: number;
    sign: string;
  }): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/adminUser/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 更新管理员用户状态
  updateStatus: (id: number, status: number): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/adminUser/updateStatus', {
      method: 'POST',
      body: JSON.stringify({ id, status }),
    }),

  // 删除管理员用户
  delete: (id: number): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/adminUser/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

    deleteUser: (id: number): Promise<ApiResponse> =>
    request('/socialtask/api/v1/admin/user/delete', {
      method: 'POST',
      body: JSON.stringify({ userId: id }),
    }),
};

// 用户管理相关接口
export const userApi = {
  // 获取用户列表
  getList: (page?: number, pageSize?: number): Promise<ListResponse<{
    id: number;
    twitterName: string;
    points: number;
    relatedURL?: string;
    createdAt: number;
    updatedAt: number;
  }>> =>
    request(`/socialtask/api/v1/admin/user/list?${new URLSearchParams({
      ...(page && { page: page.toString() }),
      ...(pageSize && { pageSize: pageSize.toString() }),
    })}`),
};

// 管理员认证相关接口
export const authApi = {
  // 管理员登录
  login: async (address: string, sign: string): Promise<ApiResponse & { userId: number, token: string }> => {
    const response = await request<ApiResponse & { userId: number, token: string }>('/socialtask/api/v1/admin/login', {
      method: 'POST',
      body: JSON.stringify({ address, sign }),
    });
    
    // 登录成功后存储 token
    if (response.code === '200' && response.token) {
      setStoredToken(response.token);
    }
    
    return response;
  },

  // 登出
  logout: (): void => {
    clearStoredToken();
  },

  // 检查是否已登录
  isLoggedIn: (): boolean => {
    return getStoredToken() !== null;
  },

  // 获取当前 token
  getToken: (): string | null => {
    return getStoredToken();
  },
};

// 文件上传接口
export const uploadApi = {
  upload: (file: File): Promise<ApiResponse & {
    fileName: string;
    filePath: string;
    fileSize: number;
    fileUrl: string;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return request('/socialtask/api/v1/upload', {
      method: 'POST',
      headers: {}, // 让浏览器设置 Content-Type
      body: formData,
    });
  },
};
