import Button from "@/components/Button";
import GradientBorderCard from "@/components/GradientBorderCard";
import { investors1, investors2 } from "@/config/investor";
import SignInButton from "@/routes/components/SignInButton";
import { getImageUrl } from "@/utils/tools";
import { cn } from "@nextui-org/react";
import { ArrowRight, Search } from "lucide-react";
import { useState, ReactNode } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";

const ShadowCardContainer = ({ children, className }: { children: ReactNode, className?: string }) => {
    return (
        <div className="relative ">
            <div className="absolute rounded-xl inset-0 bg-white -translate-y-[1px] z-[1] scale-x-[0.999]"></div>
            <div className={cn(className, "relative z-[2] rounded-xl bg-[#090A09]")}>
                {children}
            </div>
        </div>
    )
}

// 项目服务分类
const serviceCategories = [
    { id: "all", name: "ALL" },
    { id: "chat", name: "CHAT" },
    { id: "image", name: "IMAGE" },
    { id: "vision", name: "VISION" },
    { id: "audio", name: "AUDIO" },
    { id: "language", name: "LANGUAGE" },
    { id: "code", name: "CODE" },
    { id: "embeddings", name: "EMBEDDINGS" },
    { id: "rerank", name: "RERANK" },
];

// 项目卡片数据
const projectCards = [
    {
        id: 1,
        name: "DEEPSEEK R1",
        category: "chat",
        tag: "chat",
        tagColor: "bg-blue-500/30 border border-blue-500/60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in tempor mi. Mauris justo arcu, tempus in porta hendrerit, egestas eget tellus. In tristique amet in sagittis eget id volutpat. Blandit in ultrices vel et nulla vel pulvinar. Nulla eget eros, accumsan in felis eu, eleifend adipiscing dolor. Nulla pharetra non, el malesuada vel, rutrum id."
    },
    {
        id: 2,
        name: "DEEPSEEK R1",
        category: "embeddings",
        tag: "embeddings",
        tagColor: "bg-yellow-600/30 border border-yellow-600/60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in tempor mi. Mauris justo arcu, tempus in porta hendrerit, egestas eget tellus. In tristique amet in sagittis eget id volutpat. Blandit in ultrices vel et nulla vel pulvinar. Nulla eget eros, accumsan in felis eu, eleifend adipiscing dolor. Nulla pharetra non, el malesuada vel, rutrum id."
    },
    {
        id: 3,
        name: "DEEPSEEK R1",
        category: "vision",
        tag: "vision",
        tagColor: "bg-purple-600/30 border border-purple-600/60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in tempor mi. Mauris justo arcu, tempus in porta hendrerit, egestas eget tellus. In tristique amet in sagittis eget id volutpat. Blandit in ultrices vel et nulla vel pulvinar. Nulla eget eros, accumsan in felis eu, eleifend adipiscing dolor. Nulla pharetra non, el malesuada vel, rutrum id."
    },
    {
        id: 4,
        name: "DEEPSEEK R1",
        category: "code",
        tag: "code",
        tagColor: "bg-lightBrand/30 border border-lightBrand/60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in tempor mi. Mauris justo arcu, tempus in porta hendrerit, egestas eget tellus. In tristique amet in sagittis eget id volutpat. Blandit in ultrices vel et nulla vel pulvinar. Nulla eget eros, accumsan in felis eu, eleifend adipiscing dolor. Nulla pharetra non, el malesuada vel, rutrum id."
    },
    {
        id: 5,
        name: "DEEPSEEK R1",
        category: "image",
        tag: "image",
        tagColor: "bg-[#FF13A599]/30 border border-[#FF13A599]/60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in tempor mi. Mauris justo arcu, tempus in porta hendrerit, egestas eget tellus. In tristique amet in sagittis eget id volutpat. Blandit in ultrices vel et nulla vel pulvinar. Nulla eget eros, accumsan in felis eu, eleifend adipiscing dolor. Nulla pharetra non, el malesuada vel, rutrum id."
    },
    {
        id: 6,
        name: "DEEPSEEK R1",
        category: "code",
        tag: "code",
        tagColor: "bg-cyan-500/30 border border-cyan-500/60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in tempor mi. Mauris justo arcu, tempus in porta hendrerit, egestas eget tellus. In tristique amet in sagittis eget id volutpat. Blandit in ultrices vel et nulla vel pulvinar. Nulla eget eros, accumsan in felis eu, eleifend adipiscing dolor. Nulla pharetra non, el malesuada vel, rutrum id."
    },
    {
        id: 7,
        name: "DEEPSEEK R1",
        category: "audio",
        tag: "audio",
        tagColor: "bg-[#FFFF134D]/30 border border-[#FFFF134D]/60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in tempor mi. Mauris justo arcu, tempus in porta hendrerit, egestas eget tellus. In tristique amet in sagittis eget id volutpat. Blandit in ultrices vel et nulla vel pulvinar. Nulla eget eros, accumsan in felis eu, eleifend adipiscing dolor. Nulla pharetra non, el malesuada vel, rutrum id."
    },
    {
        id: 8,
        name: "DEEPSEEK R1",
        category: "language",
        tag: "language",
        tagColor: "bg-[#1362FF4D]/30 border border-[#1362FF4D]/60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in tempor mi. Mauris justo arcu, tempus in porta hendrerit, egestas eget tellus. In tristique amet in sagittis eget id volutpat. Blandit in ultrices vel et nulla vel pulvinar. Nulla eget eros, accumsan in felis eu, eleifend adipiscing dolor. Nulla pharetra non, el malesuada vel, rutrum id."
    },
];

const AiLanding = () => {
    const navigate = useNavigate()
    // 状态管理
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // 过滤项目卡片
    const filteredProjects = projectCards.filter(project => {
        // 如果搜索框有内容，过滤名称中包含搜索内容的项目
        const matchesSearch = searchQuery === "" ||
            project.name.toLowerCase().includes(searchQuery.toLowerCase());

        // 如果选择了特定分类，过滤该分类的项目
        const matchesCategory = activeCategory === "all" || project.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <>
            {/* 主标题部分 */}
            <div className="flex flex-col items-center justify-center gap-6 relative z-[2] h-[90vh]">
                <div className="flex flex-col items-center">
                    <span className="sub-title text-center mb-2">INTELLIGENCE SIMPLIFIED, POTENTIAL UNLEASHED</span>
                    <span className="unbounded-180-200 text-white text-center">CYSIC AI</span>
                </div>

                <SignInButton className="backdrop-blur-sm mt-[3.25rem] mb-[4rem]"/>
            </div>

            {/* 投资者部分 */}
            <div className="flex flex-col items-center gap-12 relative z-[2]">
                <span className="unbounded-36-300 text-center">investors</span>
                <div className="flex flex-wrap gap-10 justify-center">
                    <div className="flex flex-wrap gap-10 justify-center">
                        {
                            investors1?.map(i => {
                                return (
                                    <div className="min-w-12 h-8" key={i.name}>
                                        <img src={i.img} className="object-contain h-full" alt={i.name} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="flex flex-wrap gap-10 justify-center">
                        {
                            investors2?.map(i => {
                                return (
                                    <div className="min-w-12 h-8" key={i.name}>
                                        <img src={i.img} className="object-contain h-full" alt={i.name} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            {/* SERVICE标题 */}
            <div className="mt-[20vh] flex flex-col items-center gap-6 relative z-[2]">
                <span className="unbounded-72-300 text-center">SERVICE</span>
            </div>

            {/* Project Based Service 部分 */}
            <div className="mt-12 relative z-[2] container mx-auto w-full">
                <ShadowCardContainer className="pt-12">
                    <>
                        <h2 className={cn("unbounded-32-30-300 text-center")}>PROJECT BASED SERVICE</h2>
                        <p className="text-gray-300 text-center text-sm mt-2 mb-8">
                            Access 700+ AI Agents & Models directly through our Playground or integrate via API calls.
                        </p>

                        <div className={cn("flex mb-12 gap-6", isMobile ? "flex-col" : " items-center justify-between")}>
                            {/* 分类标签 */}
                            <div className="flex overflow-x-auto pb-4 gap-6 text-center border-b border-sub flex-1">
                                {serviceCategories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`text-sm uppercase ${activeCategory === category.id ? 'text-white' : 'text-gray-500'} min-w-max`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            {/* 搜索框 */}
                            <div className={cn("relative ", isMobile ? "w-full" : "w-[18rem]")}>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search size={16} className="text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="bg-transparent border border-gray-700 rounded-md py-2 pl-10 pr-4 w-full text-sm"
                                    placeholder="SEARCH"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                        </div>

                        {/* 项目卡片列表 */}
                        <div className={cn(isMobile ? "grid grid-rows-1 gap-4" : "grid grid-cols-2 gap-4")}>
                            {filteredProjects.map(project => (
                                <GradientBorderCard key={project.id} className="relative flex flex-col gap-4 p-4 !bg-[#090A09]">
                                    <>

                                        <div className="w-full flex gap-4">
                                            <img src={getImageUrl('@/assets/images/icon/deepseek.png')} alt="Provider" className="w-[3.75rem] h-[3.75rem]" />

                                            <div className="flex flex-col gap-2 w-full">
                                                <div className="flex items-center gap-2 justify-between w-full">
                                                    <div className="unbounded-16-300">{project.name}</div>

                                                    <div className={`text-xs px-2 py-1 rounded ${project.tagColor}`}>
                                                        {project.tag}
                                                    </div>

                                                </div>
                                                <div className="flex items-center gap-1 text-sub">
                                                    <div className="text-sm text-sub">TRY</div>
                                                    <ArrowRight size={12} />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="text-base line-clamp-6">
                                            {project.description}
                                        </div>


                                    </>
                                </GradientBorderCard>
                            ))}
                        </div>
                    </>
                </ShadowCardContainer>
            </div>

            {/* 计算力服务部分 */}
            <div className="mx-auto mt-20 mb-10 w-full">
                <ShadowCardContainer className="relative z-[2] ">
                    <div className={cn("relative py-20 overflow-hidden ", isMobile ? "" : "aspect-[1344/640]")}>
                        {/* 紫色背景光晕 */}
                        <div className="absolute z-[4] inset-0 shadow-[inset_0px_0px_100px_100px_rgba(9,10,9,1)] rounded-xl"></div>

                        <div
                            className="absolute inset-0 z-[0] rounded-xl overflow-hidden -bottom-[50%]"
                        >
                            <img
                                src={getImageUrl('@/assets/images/_global/ai_landing_bg_bottom.png')}
                                alt="Computational Power Background"
                                className="w-full h-full object-cover"
                            />

                        </div>


                        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 w-full">
                            <h2 className={cn("unbounded-32-36-300 mb-4")}>COMPUTATIONAL POWER SERVICE</h2>
                            <p className="mb-6 max-w-3xl mx-auto text-base">
                                Share in the profits generated from Cysic AI's computing power by purchasing Cysic AI Compute Boxes!
                                <br />No coding required — Just buy and start EARNING immediately!
                            </p>

                            <Button type="solid" className="!p-6" onClick={() => { navigate('/nft') }}>
                                <div className="flex items-center gap-2 uppercase">
                                    <span>PURCHASE COMPUTE BOX NOW</span>
                                    <ArrowRight width={12} height={12} />
                                </div>
                            </Button>
                        </div>
                    </div>
                </ShadowCardContainer>
            </div>
        </>
    );
};

export default AiLanding;