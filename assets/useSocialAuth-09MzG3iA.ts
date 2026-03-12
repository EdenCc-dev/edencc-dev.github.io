import { useCallback } from "react";

// 社交媒体配置接口
interface MediaConfig {
    authUrl: string;       // 基础OAuth URL
    clientId: string;      // 应用ID
    scope: string;         // 权限范围
    responseType: string;  // 响应类型，通常为"code"
    codeChallengeMethod?: string; // PKCE方法，通常为"S256"
    extraParams?: Record<string, string>; // 额外参数
}

// 社交媒体配置表
const mediaBindLinkConfig: Record<string, MediaConfig> = {
    discord: {
        authUrl: "https://discord.com/oauth2/authorize",
        clientId: "1373507512204132352", // 从URL中提取的Discord ID
        scope: "identify email",
        responseType: "code",
        codeChallengeMethod: "S256"
    },
    twitter: {
        authUrl: "https://x.com/i/oauth2/authorize",
        clientId: "", // 从URL中提取的Twitter ID
        scope: "users.read tweet.read offline.access",
        responseType: "code",
        codeChallengeMethod: "S256"
    },
    google: {
        authUrl: "https://accounts.google.com/o/oauth2/auth",
        clientId: "", // 需要您填入Google Client ID
        scope: "email profile",
        responseType: "code"
    }
};


// 构建社交媒体认证URL
async function buildAuthUrl(provider: string, redirectUri: string): Promise<string> {
    const config = mediaBindLinkConfig[provider];
    if (!config) {
        throw new Error(`不支持的社交媒体平台: ${provider}`);
    }

    // 生成随机state参数
    const state = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

    // 基础URL参数
    let url = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${config.responseType}&scope=${encodeURIComponent(config.scope)}&state=${state}`;

    // 添加PKCE参数（如果需要）
    if (config.codeChallengeMethod) {
        // TOOD
    }

    // 添加额外参数
    if (config.extraParams) {
        Object.entries(config.extraParams).forEach(([key, value]) => {
            url += `&${key}=${encodeURIComponent(value)}`;
        });
    }

    return url;
}

// 钩子参数接口 - 移除provider
interface SocialAuthProps {
    redirectUri?: string;   // 回调URL，默认使用Privy的回调
    onSuccess?: (data: any, provider: string) => void;
    onError?: (error: string, provider: string) => void;
}

// openAuthWindow方法参数
interface OpenAuthWindowParams {
    provider: 'discord' | 'twitter' | 'google' | string;
    customRedirectUri?: string; // 可选的自定义重定向URI，覆盖hook中的默认值
}

/**
 * 社交认证钩子 - provider参数移至openAuthWindow
 */
export function useSocialAuth({
    redirectUri = "https://auth.privy.io/api/v1/oauth/callback",
    onSuccess,
    onError
}: SocialAuthProps = {}) {
    // 打开认证窗口并返回Promise
    const openAuthWindow = useCallback(async ({
        provider,
        customRedirectUri
    }: OpenAuthWindowParams) => {
        // 使用自定义重定向URI或默认值
        const finalRedirectUri = customRedirectUri || redirectUri;

        try {
            // 构建认证URL
            const authUrl = await buildAuthUrl(provider, finalRedirectUri);

            // 计算窗口位置
            const width = 600;
            const height = 700;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            // 使用时间戳创建窗口名称
            const windowName = `${provider}-auth-${Date.now()}`;

            // 打开认证窗口
            const authWindow = window.open(
                authUrl,
                windowName,
                `width=${width},height=${height},left=${left},top=${top},toolbar=0`
            );

            if (!authWindow) {
                throw new Error("Verification failed");
            }

            // 等待认证结果
            const result = await new Promise((resolve, reject) => {
                // 创建一次性消息监听器
                const messageHandler = (event: MessageEvent) => {
                    if (event.origin !== window.location.origin) return;

                    const data = event.data;
                    if (data && (data.success || data.error)) {
                        window.removeEventListener("message", messageHandler);
                        if (data.success) {
                            resolve(data.data);
                        } else {
                            reject(new Error(data.error || "Verification failed"));
                        }
                    }
                };

                window.addEventListener("message", messageHandler);

                // 监控窗口关闭
                const checkClosed = setInterval(() => {
                    if (authWindow.closed) {
                        clearInterval(checkClosed);
                        window.removeEventListener("message", messageHandler);
                        reject(new Error("Verification failed"));
                    }
                }, 500);
            });

            // 调用成功回调
            if (onSuccess) {
                onSuccess(result, provider);
            }

            return result;

        } catch (error) {
            // 调用错误回调
            if (onError) {
                onError(error.message, provider);
            }
            throw error;
        }
    }, [redirectUri, onSuccess, onError]);

    return {
        openAuthWindow
    };
}