
import Button from "@/components/Button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import GradientBorderCard from "@/components/GradientBorderCard";
import axios from "@/service";
import { useRequest } from "ahooks";
import NFTProverCard from "@/components/NFTCard";
import { useNavigate } from "react-router-dom";
import useAccount from "@/hooks/useAccount";
import { cn } from "@nextui-org/react";
import { Multiplier } from "@/routes/components/Multiplier";
import { useVerifierStatus } from "@/routes/components/ZkVerifierStatus";
import { useProverStatus } from "@/routes/components/ZkProverStatus";
import { handleReserveModal } from "@/utils/tools";

// SELF Prover 的步骤组件
const SelfProverStepCard = ({ showLink, step, title, description, buttonText, children, onClick }: {
    showLink?: boolean,
    step: number,
    title: string,
    description?: string | React.ReactNode,
    buttonText?: string,
    children?: React.ReactNode,
    onClick?: () => void
}) => {
    return (
        <div className="mb-8">
            <div className="flex flex-col items-start">
                <div className={cn("w-full flex ", "flex-col lg:flex-row lg:justify-between lg:items-start")}>
                    <div className="flex flex-col">
                        <div className="unbounded-16-300">Step {step}/2</div>
                        <h3 className={cn("unbounded uppercase font-light mb-2", "text-2xl lg:text-[36px]")}>{title}</h3>
                    </div>
                    {buttonText ? <Button
                        disabled={!onClick}
                        onClick={onClick}
                        type="light"
                        className="rounded-lg h-[4.1875rem] w-[12.5rem] !p-0 min-h-fit !text-base !font-[400]"
                    >
                        {buttonText}
                    </Button> : null}
                </div>

                <div className="flex-1 mt-4">
                    <p className="text-sub text-sm mb-4 teacher !normal-case">{description}</p>
                </div>

                {/* {
                    showLink ? (<div className="flex items-center gap-2 teacher tracking-widest text-sm !font-[400] text-sub cursor-pointer hover:text-white transition-colors">
                        <span>Click here to know how to earn CYS</span>
                        <ArrowRight width={16} height={16} />
                    </div>) : null
                } */}
            </div>
            {children || <div className="border-b border-white/10 mt-6"></div>}
        </div>
    );
};

const ProverPage = () => {
    const [selectedTab, setSelectedTab] = useState("self");

    const { address, isRegistered } = useAccount()

    // 获取ZK任务概览信息
    const { data: zkTaskOverview, loading: zkTaskLoading } = useRequest(
        () => axios.get('/api/v1/zkTask/overview'),
        {
            onSuccess: (res) => {
                console.log('ZK任务概览数据:', res?.data);
            },
            ready: !!address && !!isRegistered,
            refreshDeps: [address, isRegistered],
        }
    );

    // 从API获取状态
    const proverStatus = zkTaskOverview?.data?.proverStatus || {
        nftActive: 0,
        selfActive: 0
    };

    const navigate = useNavigate()

    const { ProverCardListComponent } = useProverStatus()
    const { ProverCardListComponent: ProverStatusCardListComponent } = useVerifierStatus()

    return (
        <div className="min-h-screen w-full overflow-hidden">

            {/* 主标题 */}
            <div className="pt-12 flex flex-col items-center gap-6 relative z-[2]">
                <div className="flex flex-col items-center">
                    <span className="unbounded-36-300 text-white text-center">PROVER</span>
                </div>
            </div>

            {/* 主要内容部分 */}
            <div className="mx-auto mt-12 relative z-[2]">
                {/* 第一部分：成为 Prover */}
                <GradientBorderCard
                    borderRadius={8}
                    className="mb-4"
                >
                    <div className={cn("w-full px-4 lg:px-6 py-4")}>
                        <div className="flex flex-col gap-2 mb-6 ">
                            <h1 className={cn("unbounded font-light", "text-2xl lg:text-4xl")}>BECOME A CYSIC PROVER</h1>
                            <h1 className={cn("unbounded font-light", "text-2xl lg:text-4xl")}>AND EARN CYS & CGT</h1>
                            <h2 className={cn("unbounded font-light mt-2", "text-base lg:text-xl")}>EASIER THAN EVER BEFORE!</h2>
                        </div>

                        <p className="text-white !font-[400] text-base">
                            Contribute your own computational power or purchase a Digital Harvester to support ZK proofs and earn rewards now!
                            <br />
                            You can also boost your earnings by increasing your Multiplier. A higher Multiplier enhances task acquisition speed, maximizing your rewards!
                        </p>
                    </div>
                </GradientBorderCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* ZK VERIFIER STATUS */}
                    <ProverStatusCardListComponent />

                    {/* MULTIPLIER */}
                    <Multiplier actionPlacement="top" />
                </div>

                <div className={cn("text-center unbounded text-[36px] font-light", "my-6 lg:my-12")}>Becoming a Cysic ZK Prover</div>

                <div className="w-full">
                    {/* 当前选中 Tab 的内容 */}
                    <div className="px-4 lg:px-6 py-4">
                        {selectedTab === 'nft' && (
                            <>
                                {zkTaskLoading ? (
                                    <div className="text-center py-6">正在加载Prover状态...</div>
                                ) : proverStatus.nftActive ? (
                                    <NFTProverCard status={{ nft: Boolean(proverStatus.nftActive) }} className={cn("w-full", "lg:w-1/2")} />
                                ) : (
                                    <div className="flex flex-col items-center gap-4 py-6">
                                        <h3 className="unbounded-20-300">NFT INACTIVE</h3>
                                        <p className="text-center max-w-xl text-sub text-base mb-4">
                                            Purchase a Digital Harvester to become a Prover on the Cysic Network. No technical setup required.
                                        </p>
                                        <Button
                                            type="light"
                                            className="rounded-lg px-12 py-6"
                                            onClick={() => { navigate('/nft') }}
                                        >
                                            <div className="flex items-center gap-2 text-base !font-[400]">
                                                <span>PURCHASE A DIGITAL HARVESTER</span>
                                                <ArrowRight size={16} />
                                            </div>
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}

                        {selectedTab === 'self' && (
                            <div className="flex flex-col">
                                <SelfProverStepCard
                                    showLink
                                    step={1}
                                    title="RESERVE 100 CYS"
                                    description={<>
                                    To become a self Prover on Cysic ZK, you need to reserve at least 100 CYS as collateral. <br/>
                                    Cysic will oversee Prover actions, retaining this collateral if any irregular behavior occurs to protect Cysic ZK's operation. 
                                    </>}
                                    buttonText="TIME LIMITED FREE"
                                    // onClick={handleReserveModal}
                                />

                                <SelfProverStepCard
                                    showLink
                                    step={2}
                                    title="PROVIDE YOUR OWN COMPUTATIONAL POWER"
                                    description={
                                        <>
                                            To become a self Prover on Cysic ZK, you need to reserve at least 100 CYS as collateral. <br />
                                            Cysic will oversee Prover actions, retaining this collateral if any irregular behavior occurs to protect Cysic ZK's operation.
                                        </>
                                    }
                                >
                                    <div className="flex flex-col gap-5 mt-4">
                                        <ProverCardListComponent />
                                    </div>
                                </SelfProverStepCard>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProverPage;