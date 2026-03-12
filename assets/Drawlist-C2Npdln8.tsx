import GradientBorderCard from "@/components/GradientBorderCard";

import { getImageUrl } from "@/utils/tools";
import { cn } from "@nextui-org/react";

import { useRef, useEffect, useState } from "react";

const drawerCardList = [
    {
        className:
            "w-full lg:w-[62rem] top-0 z-1 bg-gradient-to-b from-[#0DA591] to-[#0DA59100] ",
        borderGradientFrom: "#44FF3E",
        title: "product layer",
        subTitle: (
            <>
                Where decentralized compute meets real-world impact.
            </>
        ),
        desc: [
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/zk_proof_market.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "ZK Proof Market",
            },
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/interence.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "AI Inference/Training",
            },
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/ai_agent.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "Agent Platform",
            },
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/digital_compute.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "Digital Compute",
            },
        ],
    },
    {
        className:
            "w-[96%] lg:w-[59rem] top-[5.625rem] z-[2] bg-gradient-to-b from-[#196DFF] to-[#196DFF00] ",
        borderGradientFrom: "#6AD8FF",
        title: "COMPUTE INFRASTRUCTURE LAYER",
        subTitle: (
            <>
                Hardware that power up the protocol.
            </>
        ),
        desc: [
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/zk.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "ZK ASIC",
            },
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/ai.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "GPU SERVER",
            },
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/mining.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "MINING RIG",
            },
        ],
    },
    {
        className:
            "w-[93%] lg:w-[56rem] top-[11.25rem] z-[3] bg-gradient-to-b from-[#3C19FF] to-[#3C19FF00] ",
        borderGradientFrom: "#85BCFF",
        title: "EXECUTION LAYER",
        subTitle: (
            <>
                Logic that runs the system.
            </>
        ),
        desc: [
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/bridge.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "Bridge",
            },
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/voting.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "Voting",
            },
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/swapping.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "Swapping",
            },
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/smart_contracts.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "More Functions",
            },
        ],
    },
    {
        className:
            "w-[90%] lg:w-[52rem] top-[16.875rem] z-[4] bg-gradient-to-b from-[#5B0995] to-[#5B099500] ",
        borderGradientFrom: "#D1A9FF",
        title: "CONSENSUS LAYER",
        subTitle: (
            <>
                The foundation of trust.
            </>
        ),
        desc: [
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/cosmos_sdk.png")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "Cosmos CDK Blockchain",
            },
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/validators.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "Validators",
            },
            {
                icon: (
                    <img
                        src={getImageUrl("@/assets/images/icon/miners.svg")}
                        className="size-6 lg:size-12"
                    />
                ),
                title: "Miners",
            },
        ],
    },
];

export const DrawerCard = ({
    borderGradientFrom,
    title,
    subTitle,
    className,
    children,
    index,
}: {
    borderGradientFrom: string;
    title: string | React.ReactNode;
    subTitle: string | React.ReactNode;
    children: React.ReactNode;
    className?: string;
    index: number;
}) => {
    return (
        <GradientBorderCard
            gradientTo="rgba(255, 255, 255, 0)"
            gradientFrom={borderGradientFrom}
            direction="180deg"
            className={cn(
                "p-6 flex flex-col items-center text-center gap-4 transition-all duration-300",
                className
            )}
        >
            <div className="flex flex-col gap-2">
                <h1 className="unbounded-20-500 text-white">{title}</h1>
                <h2 className="teacher normal-case text-white text-base font-normal">
                    {subTitle}
                </h2>
            </div>
            <div className="flex flex-col lg:flex-row flex-wrap gap-4 w-full">{children}</div>
        </GradientBorderCard>
    );
};

export const DrawCardList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [dynamicStyles, setDynamicStyles] = useState("");
    const [containerHeight, setContainerHeight] = useState("40rem");
    
    useEffect(() => {
        const calculateOffsets = () => {
            const heights = cardRefs.current.map(ref => ref?.offsetHeight || 0);
            
            // 计算合适的容器高度
            // 获取最后一个卡片的位置和高度，加上适当的底部边距
            const lastCardIndex = drawerCardList.length - 1;
            const lastCardElement = cardRefs.current[lastCardIndex];
            if (lastCardElement) {
                // 计算最后一个卡片底部的位置
                const lastCardBottom = lastCardElement.offsetTop + lastCardElement.offsetHeight;
                // 添加一些底部间距 (如50px)
                const newHeight = `${lastCardBottom + 50}px`;
                setContainerHeight(newHeight);
            }
            
            let styles = "";
            heights.forEach((height, index) => {
                // 为每个卡片计算其他卡片的位移
                for (let i = 0; i < index; i++) {
                    // 添加一个小的偏移量(20px)作为卡片间的间距，确保卡片不会完全重叠
                    styles += `
                    @media (max-width: 768px) {
                        .cards-container[data-hover="${i}"] .card-layer:nth-child(${index + 1}) {
                            transform: translate(-50%, ${height * 0.72}px);
                        }
                    }`;
                }
            });
            
            setDynamicStyles(styles);
        };
        
        // 在组件挂载后和窗口大小变化时重新计算
        // 使用setTimeout确保DOM已完全渲染
        const timer = setTimeout(() => {
            calculateOffsets();
        }, 100);
        
        window.addEventListener('resize', calculateOffsets);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculateOffsets);
        };
    }, []);

    return (
        <>
            <style>{`
          .cards-container[data-hover="0"] .card-layer:nth-child(2),
          .cards-container[data-hover="0"] .card-layer:nth-child(3),
          .cards-container[data-hover="0"] .card-layer:nth-child(4){
            transform: translate(-50%, 60%);
          }
  
          .cards-container[data-hover="1"] .card-layer:nth-child(3), 
          .cards-container[data-hover="1"] .card-layer:nth-child(4)
          {
            transform: translate(-50%, 60%);
          }
  
          .cards-container[data-hover="2"] .card-layer:nth-child(4)
          {
            transform: translate(-50%, 60%);
          }
          
          ${dynamicStyles}
          `}</style>

            <div
                ref={containerRef}
                className="relative w-full hover-group cards-container"
                style={{ height: containerHeight }}
                onMouseLeave={() => {
                    containerRef.current?.removeAttribute("data-hover");
                }}
            >
                {drawerCardList.map((i, index) => {
                    return (
                        <div
                            ref={el => cardRefs.current[index] = el}
                            data-card-index={index}
                            key={i.title}
                            className={cn(
                                "card-layer absolute w-full flex justify-center left-1/2 -translate-x-1/2 translate-y-0 backdrop-blur-sm rounded-lg transition-all duration-300",
                                i?.className
                            )}
                            onMouseEnter={() => {
                                containerRef.current?.setAttribute(
                                    "data-hover",
                                    index.toString()
                                );
                            }}
                        >
                            <DrawerCard
                                borderGradientFrom={i.borderGradientFrom}
                                title={i.title}
                                subTitle={i.subTitle}
                                index={index}
                            >
                                <>
                                    {i.desc.map((j) => {
                                        return (
                                            <div
                                                className="flex-1 flex flex-row lg:flex-col items-center gap-4"
                                                key={j.title}
                                            >
                                                {j.icon}
                                                <span className="teachers-20-400 !normal-case text-white">
                                                    {j.title}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </>
                            </DrawerCard>
                        </div>
                    );
                })}
            </div>
        </>
    );
};