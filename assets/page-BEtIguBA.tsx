import Button from "@/components/Button";
import { formatReward, getImageUrl, handlePurchaseNftModal, handleSignIn } from "@/utils/tools";
import { ArrowRight } from "lucide-react";
import GradientBorderCard from "@/components/GradientBorderCard";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseHref, purchaseChainId, purchaseNftContract } from "@/config";
import { useReadContracts } from "wagmi";
import { purchaseNftAbi } from "@/config/abi/purchase";
import useNftPurchase from "@/models/nft";
import { BigNumber } from "bignumber.js";
import { nftProducts } from "@/config/nft";
import { cn } from "@nextui-org/react";
import { isMobile } from "react-device-detect";
// NFT 卡片组件
interface NFTCardProps {
    id: string;
    name: string;
    rewards: string;
    image?: string;
}

const NFTCard = ({ id, name, rewards, image }: NFTCardProps) => {
    const { levelInfos } = useNftPurchase()
    // 由于 levelInfos 的类型 ValidatorResponse 没有字符串索引签名，这里需要确保 id 是有效的键
    const levelInfo = levelInfos ? levelInfos[id as keyof typeof levelInfos] : undefined
    const price = levelInfo?.price ? BigNumber(levelInfo.price.toString()).shiftedBy(-6).toString() : '0'
    // 修复类型错误，确保 levelInfo.id 存在且为数字类型
    const levelId = levelInfo?.id ? Number(levelInfo.id) : 0
    // 修复类型错误，使用类型断言确保访问合法
    const ready = levelId > 0 ? levelInfos?.[(levelId - 1).toString() as keyof typeof levelInfos]?.soldOut : true
    const sold = levelInfo?.soldOut

    return (
        <GradientBorderCard borderRadius={8}>
            <div className="p-6 w-full h-full">
                <div className={cn("flex gap-6", isMobile ? 'items-center flex-col' : 'flex-row')}>
                    {/* 左侧：图片 + 供应信息的上下结构 */}
                    <div className={cn("shrink-0 flex flex-col items-center", isMobile ? 'w-full' : 'w-[12.1875rem]')}>
                        {/* 产品图片 */}
                        <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden w-[12.1875rem]">
                            {image ? (
                                <img src={image} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 rounded-lg"></div>
                            )}
                        </div>

                        {/* 供应信息 */}
                        <div className="mt-4 flex justify-between items-center w-full">
                            <div className="text-sm text-sub">Supply</div>
                            <div className="text-sm text-white">
                                {levelInfo?.soldAmount?.toString() || '0'}/{levelInfo?.maxSupply?.toString() || '0'}
                            </div>
                        </div>

                        <div className="mt-2 flex justify-between items-center w-full">
                            <div className="text-sm text-sub">ID</div>
                            <div className="text-sm text-white">{id}</div>
                        </div>


                    </div>

                    {/* 右侧：详细信息 */}
                    <div className="flex-1">
                        <div className={cn("unbounded-32-30-300")}>{name}</div>

                        {/* 参数详情链接 */}
                        <a href="#" className="text-xs text-sub flex items-center mt-1">
                            View parameter details <ArrowRight size={12} className="ml-1" />
                        </a>

                        {/* 奖励和锁定信息 */}
                        <div className="mt-4">
                            <div className={
                                cn("!font-[600] sub-title !tracking-normal",
                                    isMobile ? "!text-base " : "!text-[32px]  text-right "
                                )
                            }>{rewards}</div>
                            {/* <div className="text-sm text-sub mt-1">{lock}</div> */}
                            <div className="text-sm text-sub mt-1">BENEFIT</div>
                            <div className="text-sm ">Cysic Pre-order Voucher – usable as credit and early access to hardware purchase.</div>
                        </div>

                        {/* 价格信息 */}
                        <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-sub">Price</div>
                            <div className="text-2xl !font-[400] font-medium">
                                {formatReward(price, 2)} USDC
                            </div>
                        </div>

                        {/* 按钮区域 */}
                        <div className="mt-4">
                            <Button
                                onClick={() => handlePurchaseNftModal({
                                    nft: {
                                        id: id,
                                        name: name,
                                        rewards: rewards.split(' ')[0], // 只取数字部分
                                        price: price, // 只取数字部分
                                        chip: "Intel", // 可以从外部传入或设为默认值
                                        computingPower: "50 TH", // 可以从外部传入或设为默认值
                                        image: image
                                    }
                                })}
                                type="light"
                                className="w-full py-6 min-h-fit h-fit rounded-lg"
                                disabled={!ready || !!sold}
                            >
                                {!ready ? 'NOT START' : sold ? 'SOLD OUT' : 'PURCHASE'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </GradientBorderCard>
    );
};

// 功能卡片组件
interface FeatureCardProps {
    title: string;
    imageSrc: string;
    href?: string;
}

const FeatureCard = ({ title, imageSrc, href }: FeatureCardProps) => {
    const navigate = useNavigate()
    return (
        <GradientBorderCard borderRadius={8} className="h-64 overflow-hidden">
            <div className="relative h-full w-full group cursor-pointer overflow-hidden">
                {/* 绝对定位的图片 - 修改缩放方式 */}
                <img
                    src={imageSrc}
                    alt={title}
                    className={
                        cn("hover: absolute inset-0 w-full h-full object-cover transition-transform duration-500 ",
                            isMobile ? "" : "group-hover:scale-105 group-hover:grayscale-0 grayscale"
                        )
                    }
                />

                {/* 叠加的半透明层 */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* 内容区域，上下分布 */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 z-10" onClick={() => { navigate(href || '/') }}>
                    <h3 className="unbounded-30-300">{title}</h3>

                    <div className="self-end">
                        <ArrowRight size={20} className="text-white" />
                    </div>
                </div>
            </div>
        </GradientBorderCard>
    );
};

// 章节容器组件
interface SectionProps {
    children: ReactNode;
    className?: string;
}

const Section = ({ children, className = "" }: SectionProps) => {
    return (
        <div className={`w-full py-24 ${className}`}>
            <div className={cn("container mx-auto ", isMobile ? '' : "px-8")}>
                {children}
            </div>
        </div>
    );
};



// 功能板块
const featureBlocks = [
    {
        id: "zk",
        title: "CYSIC ZK",
        image: getImageUrl("@/assets/images/nft/preset1.png"),
        href: '/zk/serviceHub'
    },
    {
        id: "ai",
        title: "CYSIC AI",
        image: getImageUrl("@/assets/images/nft/preset2.png"),
        href: '/ai'
    }
];


const STEP = 6

const levelCalls = nftProducts?.map(i => {
    return {
        address: purchaseNftContract[purchaseChainId],
        abi: purchaseNftAbi,
        functionName: 'levelInfo',
        args: [i.id],
        chainId: purchaseChainId
    }
})

const NftLanding = () => {

    const { levelInfos, setState } = useNftPurchase()
    const [showCount, setShowCount] = useState(STEP); // 初始显示4个NFT产品
    const handleShowMore = () => {
        if (showCount >= nftProducts.length) {
            setShowCount(STEP)
        } else {
            setShowCount(prev => prev + STEP); // 每次点击增加4个产品
        }
    };

    const { data: levelInfosMulticallData } = useReadContracts({
        contracts: levelCalls as any,
        query: {
            enabled: !!levelCalls.length,
            refetchInterval: 20_000
        }
    })

    const temp = useMemo(() => {
        const result: any = {}
        levelInfosMulticallData?.forEach((i, index) => {
            if (!result?.[levelCalls?.[index]?.args?.[0]]) {
                result[levelCalls?.[index]?.args?.[0]] = {}
            }
            const levelId = levelCalls?.[index]?.args?.[0];
            if (levelId && i?.result) {
                result[levelId] = {
                    price: i?.result?.[0] || '0',
                    maxSupply: i?.result?.[1] || '0',
                    soldAmount: i?.result?.[2] || '0',
                    soldOut: i?.result?.[3] || false,

                    id: levelId
                }
            }
        })
        // setState({ levelInfos: result })
        return result
    }, [levelInfosMulticallData])

    useEffect(() => {
        if (temp) {
            setState({ levelInfos: temp })
        }
    }, [temp])

    return (
        <>
            {/* 第一屏 - 考虑header高度的全屏效果 */}
            <div className="h-[90vh] w-full flex flex-col items-center justify-center">
                {/* 居中内容，向上偏移一些 */}
                <div className="z-10 flex flex-col items-center px-4 text-center -mt-[7.5rem]">
                    <span className="text-2xl !font-[400] sub-title">INTRODUCING</span>
                    <h1 className="unbounded-96-200 text-center">CYSIC NFTS</h1>
                    <p className="mt-4 !font-[400] text-base max-w-[55rem] text-sub">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin consequat neque a sodales. Nulla vitae elementum urna. Quisque et ullamcorper ipsum. Maecenas dignissim lacus urna, facilisis porta mauris blandit nec. Mauris quis tincidunt est, sit amet pharetra odio.
                    </p>
                </div>
            </div>

            {/* 第二屏 - 购买区域 */}
            <Section>
                <h2 className="unbounded-96-200 text-center">PURCHASE</h2>
                <p className="text-center text-sub text-base mb-6">Trade Compute Box on MagicEden</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {nftProducts.slice(0, showCount).map((nft) => (
                        <NFTCard
                            key={nft.id}
                            name={nft.name}
                            rewards={nft.rewards}
                            image={nft.image}
                            id={nft.id}
                        />
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    <Button
                        onClick={handleShowMore}
                        type="light"
                        className="px-8 py-4 rounded-lg"
                    >
                        {showCount >= nftProducts.length ? 'SHOW LESS' : 'SHOW MORE'}
                    </Button>
                </div>
            </Section>

            {/* 第三屏 - 收益区域 */}
            <Section>
                <div className="text-center mb-6">
                    <p className="text-2xl text-sub mb-2">Explore Cysic Space and use your NFTs to</p>
                    <h2 className="unbounded-96-200 text-center">EARN NOW</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featureBlocks.map((block) => (
                        <FeatureCard
                            key={block.id}
                            title={block.title}
                            imageSrc={block.image}
                            href={block.href}
                        />
                    ))}
                </div>
            </Section>
        </>
    );
};

export default NftLanding;