import React, { useState, useRef, useEffect, useMemo, forwardRef } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Textarea,
    ScrollShadow,
    cn,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import {
    motion,
    AnimatePresence,
    useDragControls,
} from "framer-motion";
import { X, ArrowUp, Loader2 } from "lucide-react";
import Button from "@/components/Button";
import GradientBorderCard from "@/components/GradientBorderCard";
import dayjs from "dayjs";
import { renderMarkdown } from "@/utils/markdown";
import { useChatHealth } from "@/components/chat/hooks/useChatHealth";
import { EHealth, useAiChatStore } from "@/components/chat/models/chat";
import { useEventListener } from "ahooks";
import { chat } from "@/components/chat/service";
import { useAction } from "@/components/chat/hooks/useAction";
import { presetQuestions } from "@/components/chat/contants";
import { TooltipClamped } from "@/components/TooltipClamped";
import { Link, useLocation } from "react-router-dom";
import { appUrl, isNewYear } from "@/config";

type PresetHintItem = {
    content: string;
    link?: string;
    action?: () => void;
};

const presetHint: PresetHintItem[] = [
    {
        content: "Start earning with your device",
        link: appUrl,
    },
    {
        content: "Run your first node",
        link: `${appUrl}/verifier`,
    },
    {
        content: "Check your CYS balance",
        link: `${appUrl}/hub`,
    },
    {
        content: "Ask anything",
        action: () =>
            dispatchEvent(
                new CustomEvent("ai_chat_modal_visible", { detail: { visible: true } }),
            ),
    },
];

/** 规范化用于比较的 URL：去掉末尾 '/'，app.cysic.xyz 与 app.cysic.xyz/ 视为相同 */
function normalizeUrlKey(link: string, origin: string): string {
    if (link.startsWith("http")) {
        try {
            const u = new URL(link);
            const p = u.pathname.replace(/\/$/, "") || "/";
            return u.origin + p;
        } catch {
            return origin + "/";
        }
    }
    const p = link.replace(/\/$/, "") || "/";
    return origin + p;
}

/** 筛掉与当前 URL 相同的项（用于轮播的候选列表） */
function filterPresetHintsByCurrentUrl(
    locationPathname: string,
    origin: string
): PresetHintItem[] {
    const currentKey = origin + (locationPathname.replace(/\/$/, "") || "/");
    return presetHint.filter((item) => {
        if (!item.link) return true;
        return normalizeUrlKey(item.link, origin) !== currentKey;
    });
}

const HINT_DELAY_MS = 1500;
const HINT_ROTATE_MS = 4500;

const animationDefinition = {
    whileHover: { scale: 1.1, opacity: 1 },
    whileTap: { scale: 0.9 },
};

const basicMessage = `Welcome to Cysic!  I'm Cyan 👋\n
We're the full-stack ComputeFi network, turning GPUs, ASICs & compute into liquid, yield-bearing assets for fast, cheap ZK proofs, verifiable AI, and more.  \n
Mainnet is live. What would you like to explore today?  `;

type PresetQuestion = {
    id: string;
    question: string;
    [key: string]: unknown;
};

type localMessage = {
    id?: string;
    role: "user" | "assistant" | "system";
    content: string;
    type: "welcome" | "pure" | "md";
    timestamp?: number;
    status?: string;
};

export const QuestionTable = ({
    questions,
}: {
    questions: PresetQuestion[];
}) => {
    const handlePresetQuestion = (question: PresetQuestion) => {
        console.log(question);
        dispatchEvent(new CustomEvent("ai_chat_send_chat", { detail: question }));
    };
    return (
        <div className="flex flex-wrap gap-2 items-center justify-center w-full">
            {questions.map((question) => (
                <Button
                    key={question.id}
                    type="light"
                    className="truncate text-xs !px-2 !py-1"
                    onClick={() => handlePresetQuestion(question)}
                >
                    {question.question}
                </Button>
            ))}
        </div>
    );
};

export const PresetQuestions = ({
    questions,
}: {
    questions: PresetQuestion[];
}) => {
    const handlePresetQuestion = (question: PresetQuestion) => {
        console.log(question);
        dispatchEvent(new CustomEvent("ai_chat_send_chat", { detail: question }));
    };
    const handlePresetQuestionList = (keys: unknown) => {
        const key = Array.from((keys as Set<React.Key>) || [])?.[0];
        const question = questions.find((question) => question.id === key);

        if (question) {
            handlePresetQuestion(question);
        }
    };

    return (
        <div className="flex gap-2 items-center justify-end w-full">
            {questions.slice(0, 3).map((question) => (
                <Button
                    key={question.id}
                    type="light"
                    className="truncate text-xs !px-2 !py-1"
                    onClick={() => handlePresetQuestion(question)}
                >
                    {question.question}
                </Button>
            ))}
            <Dropdown>
                <DropdownTrigger className="text-xs !px-2 !py-1 bg-white rounded-[4px] leading-[1.1] text-black cursor-pointer hover:opacity-80">
                    All
                </DropdownTrigger>
                <DropdownMenu
                    selectionMode="single"
                    onSelectionChange={handlePresetQuestionList}
                >
                    {questions.map((question) => (
                        <DropdownItem key={question.id} className="truncate">
                            {question.question}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export const Watermark = () => {
    return (
        <div className="relative">
            <svg
                width="148"
                height="148"
                viewBox="0 0 148 148"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <clipPath id="clip0_7819_26938">
                        <rect width="148" height="148" fill="white" />
                    </clipPath>

                    {/* 渐变：微弱的白光，控制在 0.1 左右 */}
                    <linearGradient id="skeleton-gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>

                    {/* 蒙版：控制流光上下移动 */}
                    <mask id="skeleton-mask">
                        <rect
                            width="100%"
                            height="100%"
                            fill="url(#skeleton-gradient)"
                            className="shimmer-rect"
                        />
                    </mask>
                </defs>

                <g clipPath="url(#clip0_7819_26938)" opacity="0.05">
                    <path
                        d="M132 0H16C7.16344 0 0 7.16344 0 16V132C0 140.837 7.16344 148 16 148H132C140.837 148 148 140.837 148 132V16C148 7.16344 140.837 0 132 0Z"
                        fill="black"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M33.6316 68.1834L33.6339 68.1667C36.0157 50.4045 51.2295 36.707 69.6433 36.707H93.0504C93.7707 35.025 95.4409 33.8457 97.3875 33.8457C99.9925 33.8457 102.104 35.9574 102.104 38.5622C102.104 41.167 99.9925 43.2787 97.3875 43.2787C95.3999 43.2787 93.7002 42.0491 93.0059 40.31H69.6433C53.0155 40.31 39.2829 52.7095 37.1891 68.7662C37.0981 69.5906 36.3926 70.3017 35.4057 70.3017C34.4669 70.3017 33.6958 69.5842 33.6115 68.6673L33.6316 68.1834ZM99.2866 38.5653C99.2866 39.6165 98.4345 40.4687 97.3834 40.4687C96.3318 40.4687 95.4797 39.6165 95.4797 38.5653C95.4797 37.514 96.3318 36.6618 97.3834 36.6618C98.4345 36.6618 99.2866 37.514 99.2866 38.5653Z"
                        fill="white"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M33.7509 80.6687C33.4135 78.6534 34.11 77.0057 35.2188 75.6679C36.3147 74.3457 37.8313 73.3016 39.1948 72.4535C39.3583 72.3518 39.5521 72.2419 39.7535 72.1281L39.7605 72.124C41.083 71.3765 42.9996 70.2671 43.4771 68.0621C43.4979 67.9667 43.5192 67.8707 43.5409 67.7754C43.6192 67.4314 43.7039 67.0903 43.7947 66.7515C47.0172 54.752 58.0496 46.2013 70.6122 46.2013L102.483 46.2005C103.203 44.5178 104.873 43.3379 106.821 43.3379C109.425 43.3379 111.537 45.4495 111.537 48.0544C111.537 50.6592 109.425 52.7708 106.821 52.7708C104.83 52.7708 103.128 51.5374 102.436 49.7939L86.5373 49.7943V49.7929H70.6122C59.8221 49.7929 50.3245 57.0422 47.3795 67.2666C47.2759 67.6262 47.1804 67.9898 47.0933 68.3564C47.0695 68.457 47.0463 68.557 47.0238 68.6581C46.2108 72.2876 42.8381 74.1665 40.6494 75.3858L40.5422 75.4459C39.9655 75.7668 39.0408 76.3761 38.3138 77.1861C37.5837 78.0001 37.115 78.9424 37.2726 79.9634C39.3797 93.6193 50.9259 107.613 70.6122 107.613H86.5373V107.61H93.0383C93.7523 105.914 95.43 104.722 97.3875 104.722C99.9925 104.722 102.104 106.833 102.104 109.438C102.104 112.042 99.9925 114.154 97.3875 114.154C95.4069 114.154 93.7118 112.933 93.0134 111.204H88.6179V111.205H70.6122C49.2431 111.205 36.2776 95.9913 33.7509 80.6687ZM108.724 48.0524C108.724 49.1037 107.872 49.9559 106.821 49.9559C105.77 49.9559 104.918 49.1037 104.918 48.0524C104.918 47.0012 105.77 46.149 106.821 46.149C107.872 46.149 108.724 47.0012 108.724 48.0524ZM99.2936 109.449C99.2936 110.5 98.4414 111.352 97.3898 111.352C96.3388 111.352 95.4866 110.5 95.4866 109.449C95.4866 108.398 96.3388 107.545 97.3898 107.545C98.4414 107.545 99.2936 108.398 99.2936 109.449Z"
                        fill="white"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M86.5372 101.73V101.729H70.6121C56.7087 101.729 44.8736 91.3491 43.0817 77.5811C42.953 76.5977 43.6466 75.6976 44.6285 75.5681C45.611 75.4345 46.5155 76.1369 46.6438 77.1174C48.2029 89.0991 58.5079 98.1369 70.6121 98.1369L102.46 98.1363C103.168 96.4256 104.853 95.2214 106.821 95.2214C109.425 95.2214 111.537 97.3327 111.537 99.9378C111.537 102.543 109.425 104.654 106.821 104.654C104.849 104.654 103.162 103.445 102.456 101.73H86.5372ZM108.724 99.947C108.724 100.999 107.872 101.851 106.821 101.851C105.77 101.851 104.918 100.999 104.918 99.947C104.918 98.896 105.77 98.0438 106.821 98.0438C107.872 98.0438 108.724 98.896 108.724 99.947Z"
                        fill="white"
                    />
                </g>

                <g clipPath="url(#clip0_7819_26938)" mask="url(#skeleton-mask)">
                    <path
                        d="M132 0H16C7.16344 0 0 7.16344 0 16V132C0 140.837 7.16344 148 16 148H132C140.837 148 148 140.837 148 132V16C148 7.16344 140.837 0 132 0Z"
                        fill="black"
                    />
                    <path
                        fillOpacity={0.7}
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M33.6316 68.1834L33.6339 68.1667C36.0157 50.4045 51.2295 36.707 69.6433 36.707H93.0504C93.7707 35.025 95.4409 33.8457 97.3875 33.8457C99.9925 33.8457 102.104 35.9574 102.104 38.5622C102.104 41.167 99.9925 43.2787 97.3875 43.2787C95.3999 43.2787 93.7002 42.0491 93.0059 40.31H69.6433C53.0155 40.31 39.2829 52.7095 37.1891 68.7662C37.0981 69.5906 36.3926 70.3017 35.4057 70.3017C34.4669 70.3017 33.6958 69.5842 33.6115 68.6673L33.6316 68.1834ZM99.2866 38.5653C99.2866 39.6165 98.4345 40.4687 97.3834 40.4687C96.3318 40.4687 95.4797 39.6165 95.4797 38.5653C95.4797 37.514 96.3318 36.6618 97.3834 36.6618C98.4345 36.6618 99.2866 37.514 99.2866 38.5653Z"
                        fill="white"
                    />
                    <path
                        fillOpacity={0.7}
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M33.7509 80.6687C33.4135 78.6534 34.11 77.0057 35.2188 75.6679C36.3147 74.3457 37.8313 73.3016 39.1948 72.4535C39.3583 72.3518 39.5521 72.2419 39.7535 72.1281L39.7605 72.124C41.083 71.3765 42.9996 70.2671 43.4771 68.0621C43.4979 67.9667 43.5192 67.8707 43.5409 67.7754C43.6192 67.4314 43.7039 67.0903 43.7947 66.7515C47.0172 54.752 58.0496 46.2013 70.6122 46.2013L102.483 46.2005C103.203 44.5178 104.873 43.3379 106.821 43.3379C109.425 43.3379 111.537 45.4495 111.537 48.0544C111.537 50.6592 109.425 52.7708 106.821 52.7708C104.83 52.7708 103.128 51.5374 102.436 49.7939L86.5373 49.7943V49.7929H70.6122C59.8221 49.7929 50.3245 57.0422 47.3795 67.2666C47.2759 67.6262 47.1804 67.9898 47.0933 68.3564C47.0695 68.457 47.0463 68.557 47.0238 68.6581C46.2108 72.2876 42.8381 74.1665 40.6494 75.3858L40.5422 75.4459C39.9655 75.7668 39.0408 76.3761 38.3138 77.1861C37.5837 78.0001 37.115 78.9424 37.2726 79.9634C39.3797 93.6193 50.9259 107.613 70.6122 107.613H86.5373V107.61H93.0383C93.7523 105.914 95.43 104.722 97.3875 104.722C99.9925 104.722 102.104 106.833 102.104 109.438C102.104 112.042 99.9925 114.154 97.3875 114.154C95.4069 114.154 93.7118 112.933 93.0134 111.204H88.6179V111.205H70.6122C49.2431 111.205 36.2776 95.9913 33.7509 80.6687ZM108.724 48.0524C108.724 49.1037 107.872 49.9559 106.821 49.9559C105.77 49.9559 104.918 49.1037 104.918 48.0524C104.918 47.0012 105.77 46.149 106.821 46.149C107.872 46.149 108.724 47.0012 108.724 48.0524ZM99.2936 109.449C99.2936 110.5 98.4414 111.352 97.3898 111.352C96.3388 111.352 95.4866 110.5 95.4866 109.449C95.4866 108.398 96.3388 107.545 97.3898 107.545C98.4414 107.545 99.2936 108.398 99.2936 109.449Z"
                        fill="white"
                    />
                    <path
                        fillOpacity={0.7}
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M86.5372 101.73V101.729H70.6121C56.7087 101.729 44.8736 91.3491 43.0817 77.5811C42.953 76.5977 43.6466 75.6976 44.6285 75.5681C45.611 75.4345 46.5155 76.1369 46.6438 77.1174C48.2029 89.0991 58.5079 98.1369 70.6121 98.1369L102.46 98.1363C103.168 96.4256 104.853 95.2214 106.821 95.2214C109.425 95.2214 111.537 97.3327 111.537 99.9378C111.537 102.543 109.425 104.654 106.821 104.654C104.849 104.654 103.162 103.445 102.456 101.73H86.5372ZM108.724 99.947C108.724 100.999 107.872 101.851 106.821 101.851C105.77 101.851 104.918 100.999 104.918 99.947C104.918 98.896 105.77 98.0438 106.821 98.0438C107.872 98.0438 108.724 98.896 108.724 99.947Z"
                        fill="white"
                    />
                </g>
            </svg>

            <style>{`
          .shimmer-rect {
            y: -100%;
            height: 100%;
            animation: shimmer 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
      
          @keyframes shimmer {
            0% { y: -120%; }
            60% { y: 120%; } 
            100% { y: 120%; }
          }
        `}</style>
        </div>
    );
};

export const generateMessageKey = (msg: localMessage) => {
    return `${msg.role}_${msg.content}_${msg.timestamp || ""}`;
};

const deDuplicateMessages = (prev: localMessage[], next: localMessage[]) => {
    const all = [...prev, ...next];
    const uniqueMap = new Map();

    all.forEach((msg) => {
        const key = generateMessageKey(msg);
        uniqueMap.set(key, msg);
    });

    return Array.from(uniqueMap.values());
};

const ThreeBarLoader = (props: { className?: string }) => {
    return (
        <div className={cn("flex items-center gap-1.5", props.className)}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-2 bg-white/80 rounded-full"
                    initial={{ height: 12 }}
                    animate={{
                        height: [12, 6, 12],
                        opacity: [1, 0.4, 1],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15,
                    }}
                />
            ))}
        </div>
    );
};

const ThinkingDots = (props: { className?: string }) => {
    return (
        <div
            className={cn(
                "flex items-center justify-center gap-1 text-white/70",
                props.className,
            )}
        >
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="inline-block size-1.5 rounded-full bg-white/70"
                    initial={{ opacity: 0.3, y: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15,
                    }}
                />
            ))}
        </div>
    );
};

const Chatbox = forwardRef<
    HTMLDivElement,
    { onReachTop: () => void; messages: localMessage[]; isLoading: boolean }
>(({ onReachTop, messages, isLoading }, ref) => {
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;

        if (el.scrollTop <= 10) {
            onReachTop();
        }
    };

    return (
        <ScrollShadow
            ref={ref}
            onScroll={handleScroll}
            className="h-full p-3 space-y-1 pt-0"
        >
            {messages?.map((msg, i) => {
                const isUser = msg.role === "user";
                const isSystem = msg.role === "system";
                const isPure = msg.type === "pure";
                return (
                    <div
                        key={i}
                        className={cn(
                            "w-full flex gap-2",
                            isUser ? "flex-row-reverse" : "flex-row",
                        )}
                    >
                        <div
                            className={cn(
                                "flex flex-col w-full",
                                isUser ? "items-end" : "items-start",
                            )}
                        >
                            {msg.timestamp && isUser && (
                                <div className="text-[10px] text-white/60 mb-1 px-1">
                                    {dayjs(msg.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                                </div>
                            )}

                            <div
                                className={cn(
                                    "px-3 py-2 text-sm leading-relaxed shadow-sm transition-all",
                                    isUser
                                        ? "bg-white text-black rounded-lg"
                                        : "bg-transparent text-white rounded-lg w-full",
                                )}
                            >
                                {isSystem ? (
                                    <div className="whitespace-pre-wrap break-words text-xs opacity-60 mx-auto text-center">
                                        {msg.content}
                                    </div>
                                ) : isPure || isUser ? (
                                    <div className="whitespace-pre-wrap break-words">
                                        {msg.content}
                                    </div>
                                ) : (
                                    <div
                                        className="[&_*]:leading-[1.3] prose prose-invert prose-chat prose-sm max-w-none prose-p:my-0 prose-pre:my-2 prose-ol:my-1 prose-ul:my-1"
                                        dangerouslySetInnerHTML={{
                                            __html: renderMarkdown(msg.content),
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            {isLoading && (
                <div className="w-full py-2 flex items-center justify-center">
                    <ThinkingDots />
                </div>
            )}
        </ScrollShadow>
    );
});

const BotAvatar = (props: { className?: string; src?: string }) => {
    // return <Bot {...props} className={cn("size-6 text-black", props.className)} />
    return (
        <img
            src={props.src || "/ai-bot/avatar.jpeg"}
            className={cn(
                "size-full rounded-full pointer-events-none",
                props.className,
            )}
        />
    );
};

const HealthIndicator = ({ className }: { className?: string }) => {
    const { health, healthLoading } = useAiChatStore();

    return (
        <div className={className}>
            <div
                className={cn(
                    "size-2 rounded-full",
                    healthLoading && "animate-pulse animation-duration-20",
                    health === EHealth.HEALTH
                        ? "bg-green-500"
                        : health === EHealth.UNHEALTH
                            ? "bg-red-500"
                            : "bg-gray-500",
                )}
            />
        </div>
    );
};

const ChatInput = ({
    inputValue,
    setInputValue,
    setIsComposing,
    isComposing,
    handleSend,
    isLoading,
}: {
    inputValue: string;
    setInputValue: (value: string) => void;
    setIsComposing: (value: boolean) => void;
    isComposing: boolean;
    handleSend: () => void;
    isLoading: boolean;
}) => {
    const { health, sessionLoading } = useAiChatStore();
    return health !== EHealth.HEALTH ? (
        <div className="flex-1 flex items-center justify-center gap-2 w-full opacity-60">
            Not Available
        </div>
    ) : (
        <Textarea
            classNames={{
                inputWrapper: cn(
                    "rounded-md",
                    health !== EHealth.HEALTH && "border border-red-500",
                ),
                input: "!normal-case teachers-14 text-sm",
            }}
            fullWidth
            minRows={3}
            maxRows={3}
            value={inputValue}
            errorMessage={
                health !== EHealth.HEALTH
                    ? "System is busy, please try again later."
                    : undefined
            }
            isInvalid={health !== EHealth.HEALTH}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    if (isComposing) return;
                    if (sessionLoading) return;
                    e.preventDefault();
                    handleSend();
                }
            }}
            placeholder="Ask, searching, or make anything..."
            endContent={
                isLoading ? (
                    <ThinkingDots className="mt-auto mb-1" />
                ) : (
                    <ArrowUp
                        size={16}
                        className={cn(
                            "mt-auto cursor-pointer",
                            (!inputValue || isComposing || sessionLoading) &&
                            "opacity-60 pointer-events-none",
                            health !== EHealth.HEALTH && "opacity-60 text-red-500",
                        )}
                        onClick={() => {
                            if (isComposing) return;
                            if (sessionLoading) return;
                            handleSend();
                        }}
                    />
                )
            }
        />
    );
};

export const BotAvatarWithStatus = ({
    className,
    sessionLoading,
    healthLoading,
    isLoading,
    hasUnread,
}: {
    className?: string;
    sessionLoading: boolean;
    healthLoading: boolean;
    isLoading: boolean;
    hasUnread: boolean;
}) => {
    return sessionLoading || healthLoading ? (
        <BotAvatar src="/ai-bot/thinking.png" className={className} />
    ) : isLoading ? (
        <>
            <BotAvatar src="/ai-bot/typing.png" className={className} />
        </>
    ) : hasUnread ? (
        <BotAvatar src="/ai-bot/cheer.png" className={className} />
    ) : (
        <BotAvatar src="/ai-bot/greet.png" className={className} />
    );
};

export default function DraggableAIChat() {
    useChatHealth();
    useAction();
    const {
        sessionId,
        health,
        sessionLoading,
        healthLoading,
        modalOpen: isOpen,
        setModalOpen: setIsOpen,
    } = useAiChatStore();

    useEventListener("ai_chat_modal_visible", (e: unknown) => {
        const ev = e as CustomEvent<{ visible?: boolean }> | undefined;
        setIsOpen(!!ev?.detail?.visible);
    });

    const isDragging = useRef(false);
    const controls = useDragControls();
    const [isComposing, setIsComposing] = useState(false);
    const [messages, setMessages] = useState<localMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const constraintsRef = useRef(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const welcomeInjectedRef = useRef(false);

    const location = useLocation();
    const origin =
        typeof window !== "undefined" ? window.location.origin : "";
    const presetHintList = useMemo(
        () => filterPresetHintsByCurrentUrl(location.pathname, origin),
        [location.pathname, origin]
    );

    const [tooltipDelayedShow, setTooltipDelayedShow] = useState(false);
    const [hintIndex, setHintIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setTooltipDelayedShow(false);
            return;
        }
        const t = setTimeout(() => setTooltipDelayedShow(true), HINT_DELAY_MS);
        return () => clearTimeout(t);
    }, [isOpen]);

    const [hintTransitioning, setHintTransitioning] = useState(false);
    const EXIT_DURATION_MS = 220;

    useEffect(() => {
        if (!tooltipDelayedShow || presetHintList.length <= 1) return;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        const id = setInterval(() => {
            setHintTransitioning(true);
            timeoutId = setTimeout(() => {
                setHintIndex((i) => (i + 1) % presetHintList.length);
                setHintTransitioning(false);
            }, EXIT_DURATION_MS);
        }, HINT_ROTATE_MS);
        return () => {
            clearInterval(id);
            if (timeoutId != null) clearTimeout(timeoutId);
        };
    }, [tooltipDelayedShow, presetHintList.length]);

    const currentHint =
        presetHintList.length > 0
            ? presetHintList[hintIndex % presetHintList.length]
            : null;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    // 打开弹窗时注入一条默认欢迎信息，避免“空态快捷按钮”和默认文案冲突
    useEffect(() => {
        if (!isOpen) return;
        if (health !== EHealth.HEALTH) return;
        if (sessionLoading) return;
        if (welcomeInjectedRef.current) return;

        setMessages((prev) => {
            if (prev?.length) return prev;
            const welcome: localMessage = {
                role: "assistant",
                content: basicMessage,
                type: "pure",
                timestamp: Date.now(),
                status: "success",
            };
            welcomeInjectedRef.current = true;
            return [{ ...welcome, id: generateMessageKey(welcome) }];
        });
    }, [isOpen, health, sessionLoading]);

    // 打开弹窗即视为已读
    useEffect(() => {
        if (isOpen) setHasUnread(false);
    }, [isOpen]);

    const appendMessage = (message: localMessage) => {
        const isOpen = useAiChatStore.getState().modalOpen;
        if (!isOpen && message?.role === "assistant") {
            setHasUnread(true);
        }
        setMessages((prev) => {
            const newMessages = deDuplicateMessages(prev, [message]);
            return newMessages?.map((i) => {
                return {
                    ...i,
                    id: i?.id || generateMessageKey(i),
                };
            });
        });
    };

    const appendMessageList = (messages: localMessage[]) => {
        const isOpen = useAiChatStore.getState().modalOpen;
        if (!isOpen && messages?.some((m) => m?.role === "assistant")) {
            setHasUnread(true);
        }
        setMessages((prev) => {
            const newMessages = deDuplicateMessages(prev, messages);
            return newMessages?.map((i) => {
                return {
                    ...i,
                    id: i?.id || generateMessageKey(i),
                };
            });
        });
    };

    const handleSend = async (forceValue?: string) => {
        if (isLoading || (!inputValue && !forceValue)) return;
        if (health !== EHealth.HEALTH) return;

        const userMessage = forceValue || inputValue;
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: userMessage,
                type: "pure",
                timestamp: Number(dayjs()),
            },
        ]);
        setInputValue("");
        setIsLoading(true);

        try {
            const chatResp = await chat({
                session_id: sessionId,
                question: userMessage,
            });

            const aiReply = chatResp?.answer;
            const timestamp = Number(dayjs(chatResp?.timestamp));
            const status = chatResp?.success ? "success" : "unknown";
            appendMessage({
                role: "assistant",
                content: aiReply,
                type: "md",
                timestamp: timestamp,
                status,
            });
        } catch (error) {
            // TODO
            // appendMessage({ role: "assistant", content: "网络繁忙，请稍后再试。", type: "pure", timestamp: dayjs().format('HH:mm:ss'), status: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEventListener("ai_chat_message", (e: unknown) => {
        const detail = (e as CustomEvent<{ message?: localMessage }> | undefined)
            ?.detail;
        if (!detail?.message) return;
        appendMessage(detail.message);
    });

    useEventListener("ai_chat_message_list", (e: unknown) => {
        const detail = (e as CustomEvent<{ messages?: localMessage[] }> | undefined)
            ?.detail;
        if (!detail?.messages?.length) return;
        appendMessageList(detail.messages);
    });

    useEventListener("ai_chat_message_list_reset", (e: unknown) => {
        const detail = (e as CustomEvent<{ messages?: localMessage[] }> | undefined)
            ?.detail;
        if (!detail?.messages?.length) return;
        const messages = (detail?.messages || [])?.map((i: localMessage) => {
            return {
                ...i,
                id: i?.id || generateMessageKey(i),
            };
        });
        welcomeInjectedRef.current = Boolean(messages?.length);
        setMessages(messages);
    });

    useEventListener("ai_chat_send_chat", (e: unknown) => {
        console.log("ai_chat_send_chat", e);
        const detail = (e as CustomEvent<{ question?: string }> | undefined)
            ?.detail;
        if (!detail?.question) return;
        handleSend(detail.question);
    });

    const onReachTop = async () => {
        console.log("load more");
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            <div
                ref={constraintsRef}
                className="absolute pointer-events-none"
                style={{ left: -2000, top: -2000, width: 4000, height: 4000 }}
                aria-hidden
            />
            <motion.div
                drag
                dragControls={controls}
                dragListener={false}
                dragMomentum={false}
                dragConstraints={constraintsRef}
                onDragStart={() => (isDragging.current = true)}
                onDragEnd={() => {
                    setTimeout(() => (isDragging.current = false), 100);
                }}
                className="pointer-events-auto absolute bottom-12 right-12 "
                style={{ touchAction: "none" }}
            >
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            style={{
                                transformOrigin: "bottom right",
                                touchAction: "none",
                            }}
                            className="absolute bottom-0 right-0 backdrop-blur-sm "
                            initial={{ opacity: 0, scale: 0.2, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.2, y: 20, filter: "blur(10px)" }}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <GradientBorderCard
                                className="p-px overflow-hidden bg-transparent"
                                borderRadius={8}
                            >
                                <Card className="w-[92vw] h-[70vh] lg:w-[35vw] lg:h-[66vh] border-none bg-black rounded-md flex flex-col shadow-2xl">
                                    <CardHeader className="flex justify-between text-white p-3 shrink-0 pb-0">
                                        <div className="flex items-center gap-2">
                                            <HealthIndicator />
                                            <BotAvatar className="size-7 text-white" />
                                            <span className="text-white text-sm">Cyan</span>

                                            {healthLoading ||
                                                sessionLoading ||
                                                health == EHealth.UNHEALTH ? (
                                                <Loader2
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (healthLoading || sessionLoading) return;
                                                        dispatchEvent(new CustomEvent("ai_chat_refresh"));
                                                    }}
                                                    className={cn(
                                                        "size-4 text-white",
                                                        healthLoading || sessionLoading
                                                            ? "animate-spin"
                                                            : "cursor-pointer",
                                                    )}
                                                />
                                            ) : null}
                                        </div>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsOpen(false);
                                            }}
                                            className="text-white hover:opacity-70 cursor-pointer p-1"
                                        >
                                            <X size={16} />
                                        </div>
                                    </CardHeader>

                                    <CardBody className="p-0 flex-grow overflow-hidden relative flex-1">
                                        <>
                                            <div className="flex items-center justify-center skeleton-container pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[50%]">
                                                {(health !== EHealth.HEALTH && healthLoading) ||
                                                    sessionLoading ||
                                                    isLoading ? (
                                                    <Watermark />
                                                ) : (
                                                    <img
                                                        src="/mediakits/symbol_white.svg"
                                                        className=" opacity-5"
                                                    />
                                                )}
                                            </div>

                                            {messages?.length ? (
                                                <Chatbox
                                                    ref={scrollRef}
                                                    onReachTop={onReachTop}
                                                    messages={messages}
                                                    isLoading={isLoading}
                                                />
                                            ) : (
                                                <div className="size-full flex items-center justify-center">
                                                    <QuestionTable
                                                        questions={presetQuestions}
                                                    ></QuestionTable>
                                                </div>
                                            )}
                                        </>
                                    </CardBody>

                                    {health == EHealth.UNKNOWN ? null : (
                                        <CardFooter className="border-t border-white/10 flex flex-col gap-3">
                                            {health == EHealth.HEALTH &&
                                                !sessionLoading &&
                                                messages?.length ? (
                                                <PresetQuestions questions={presetQuestions} />
                                            ) : null}
                                            <ChatInput
                                                isLoading={isLoading}
                                                inputValue={inputValue}
                                                setInputValue={setInputValue}
                                                setIsComposing={setIsComposing}
                                                isComposing={isComposing}
                                                handleSend={handleSend}
                                            />
                                        </CardFooter>
                                    )}
                                </Card>
                            </GradientBorderCard>
                        </motion.div>
                    )}
                </AnimatePresence>


                {!isOpen && currentHint && (
                    <TooltipClamped
                        isVisible={tooltipDelayedShow && !hintTransitioning}
                        content={
                            currentHint.link ? (
                                currentHint.link.startsWith("http") ? (
                                    <a
                                        href={currentHint.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group"
                                    >
                                        <div
                                            className={cn(
                                                "group-hover:underline rounded-lg px-3 py-2 bg-gradient-to-r from-new-year-1 to-new-year-2",
                                                "text-sm font-medium",
                                                isNewYear ? "text-[#B12D08]" : "text-white",
                                            )}
                                        >
                                            {currentHint.content}
                                        </div>
                                    </a>
                                ) : (
                                    <Link to={currentHint.link} className="group">
                                        <div
                                            className={cn(
                                                "group-hover:underline rounded-lg px-3 py-2 bg-gradient-to-r from-new-year-1 to-new-year-2",
                                                "text-sm font-medium",
                                                isNewYear ? "text-[#B12D08]" : "text-white",
                                            )}
                                        >
                                            {currentHint.content}
                                        </div>
                                    </Link>
                                )
                            ) : currentHint.action ? (
                                <button
                                    type="button"
                                    onClick={currentHint.action}
                                    className={cn(
                                        "w-full text-left rounded-lg px-3 py-2 bg-gradient-to-r from-new-year-1 to-new-year-2",
                                        "text-sm font-medium hover:underline",
                                        isNewYear ? "text-[#B12D08]" : "text-white",
                                    )}
                                >
                                    {currentHint.content}
                                </button>
                            ) : null
                        }
                        gap={48}
                    >
                        <div style={{ display: "none" }} />
                    </TooltipClamped>
                )}

                <AnimatePresence mode="wait">
                    {!isOpen && (
                        <>
                            <motion.div
                                key="chat-button"
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 0.8, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                onPointerDown={(e) => controls.start(e)}
                                className="cursor-grab active:cursor-grabbing absolute inset-0 flex items-center justify-center"
                                whileHover={animationDefinition.whileHover}
                                whileTap={animationDefinition.whileTap}
                            >
                                <Button
                                    type="light"
                                    className={cn(
                                        "relative !rounded-full shadow-xl hover:!opacity-100 !p-0.5 bg-transparent backdrop-blur-md border border-white/10",
                                        "bg-gradient-to-br from-new-year-1 to-new-year-2",
                                        " w-12 h-12 min-w-12 min-h-12 max-w-12 max-h-12 lg:w-16 lg:h-16 lg:min-w-16 lg:min-h-16 lg:max-w-16 lg:max-h-16 ",
                                    )}
                                    onClick={() => !isDragging.current && setIsOpen(true)}
                                >
                                    {hasUnread && (
                                        <span className="absolute top-1.5 right-0 size-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-red-500 " />
                                    )}
                                    {isLoading ? (
                                        <div className="absolute -top-3 left-0 flex items-center gap-1 -translate-x-[90%]">
                                            <div className="w-16 h-8 rounded-full flex items-center justify-center bg-white -mt-4">
                                                <ThreeBarLoader className="[&_div]:!bg-black" />
                                            </div>
                                            <div className="rounded-full aspect-[1/1] w-4 bg-white"></div>
                                        </div>
                                    ) : null}

                                    <BotAvatarWithStatus
                                        sessionLoading={sessionLoading}
                                        healthLoading={healthLoading}
                                        isLoading={isLoading}
                                        hasUnread={hasUnread}
                                    />
                                    <HealthIndicator className="absolute bottom-0 right-0 [&>div]:!size-2.5 -translate-x-1/2 -translate-y-1/2 mt-1 -mr-1" />
                                </Button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
