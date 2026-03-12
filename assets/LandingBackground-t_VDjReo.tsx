import { backgroundImageList } from "@/router";
import { Link, useLocation } from "react-router-dom";
import React, { useMemo } from "react";
import { cn } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { isNewYear, NO_CONTAINER_PATHS } from "@/config";
import { getImageUrl } from "@/utils/tools";
import { isMobile } from "react-device-detect";

interface BackgroundConfig {
    img: string;
    height?: string;
    gradient?: string;
    maxWidth?: string;
    className?: string;
    needShadow?: boolean;
    needBack?: boolean;
    backTo?: string;
    backContent?: string;
    style?: React.CSSProperties;
    mainClassName?: string;
}

export const LandingBackground: React.FC<{ children?: React.ReactNode }> =
    React.memo(({ children }) => {
        const location = useLocation();
        const path = location.pathname;

        // 处理 /m 前缀路径
        const normalizedPath = useMemo(() => {
            if (path.startsWith('/m/')) {
                return path.replace(/^\/m/, '');
            }
            return path === '/m' ? '/' : path;
        }, [path]);

        // 使用useMemo缓存背景配置
        const backgroundConfig = useMemo<BackgroundConfig | undefined>(() => {
            // 直接检查是否有完全匹配的路径
            const config =
                backgroundImageList[normalizedPath as keyof typeof backgroundImageList];
            if (config) {
                return config;
            }

            // 如果路径中没有找到匹配项，检查是否有适用的动态路由
            // 只在没有直接匹配时处理动态路由逻辑
            for (const key in backgroundImageList) {
                // 只处理包含':' 的动态路由键
                if (key.includes(":")) {
                    // 将路由模式转换为正则表达式
                    const pattern = key.replace(/:[^/]+/g, "[^/]+");
                    const regex = new RegExp(`^${pattern}$`);

                    // 检查当前路径是否匹配此模式
                    if (regex.test(normalizedPath)) {
                        return backgroundImageList[key as keyof typeof backgroundImageList];
                    }
                }
            }

            return undefined;
        }, [normalizedPath]);

        const needBack = backgroundConfig?.needBack ?? false;

        const backPath = useMemo(() => {
            if (needBack) {
                // 保持同样的路径前缀（如果是以 /m 开头则保留）
                const prefix = path.startsWith('/m') ? '/m' : '';
                const backTo = backgroundConfig?.backTo ?? normalizedPath.split("/").slice(0, -1).join("/");
                // 如果 backTo 以 / 开头，则不添加 prefix
                return backTo.startsWith('/') ?
                    (prefix + backTo) :
                    (prefix + '/' + backTo);
            }
            return path;
        }, [needBack, path, normalizedPath, backgroundConfig?.backTo]);

        const noContainer = normalizedPath === "/" || NO_CONTAINER_PATHS.includes(normalizedPath);

        if (!backgroundConfig?.img) {
            return (
                <main
                    className={cn(
                        "relative min-h-screen w-full z-10 mx-auto",
                        noContainer ? "!pb-0" : "main-container lg:pb-12 px-3 lg:px-0",
                        "pb-6"
                    )}
                >
                    {children}
                </main>
            );
        }

        const {
            img,
            height = "100vh",
            gradient = "",
            maxWidth = "",
            className = "",
            style = {},
            needShadow = false,
            mainClassName = "",
        } = backgroundConfig;

        // 组合背景
        const backgroundImage = gradient
            ? `${gradient}, url(${img})`
            : `url(${img})`;

        return (
            <>
                {/* 背景层 */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {(isNewYear && !isMobile) ? (
                        <video autoPlay loop muted className=" -translate-y-[16.7%] object-fill opacity-40">
                            <source src={getImageUrl("@/assets/images/_global/2026_new_year.mp4")} />
                        </video>
                    ) : <div
                        className={cn("w-full h-full mx-auto", className)}
                        style={{
                            backgroundImage: backgroundImage,
                            backgroundSize: "cover",
                            backgroundPosition: "top center",
                            backgroundRepeat: "no-repeat",
                            maxWidth: maxWidth,
                            ...style,
                        }}
                    />}

                    {needShadow ? (
                        <div
                            className={cn(
                                "absolute w-full z-1 top-0 shadow-[#090A09_0_-50px_200px_100px_inset]",
                                className
                            )}
                        />
                    ) : null}
                </div>

                {/* 主体内容层 */}
                <div className="relative w-full" style={{ minHeight: height }}>
                    <main
                        className={cn(
                            normalizedPath.includes('/zk') ? "lg:pt-[calc(8rem+65px)]" : normalizedPath == '/' ? "" : " lg:pt-[8rem]",
                            "relative min-h-screen w-full z-10 mx-auto flex flex-col items-center justify-start]",
                            noContainer ? "!pb-0" : "px-3 lg:px-0 main-container lg:pb-12",
                            "pb-6 ",
                            mainClassName
                        )}
                    >
                        <>
                            {needBack ? (
                                <div className={cn("relative w-full", noContainer ? "main-container" : "")}>
                                    <Link
                                        to={backPath}
                                        className="z-[11] flex items-center gap-2 unbounded-16-300"
                                    >
                                        <ArrowLeft className="size-5" />
                                        <span>{backgroundConfig?.backContent ?? "Back"}</span>
                                    </Link>
                                </div>
                            ) : null}
                            {children}
                        </>
                    </main>
                </div>
            </>
        );
    });

export default LandingBackground;
