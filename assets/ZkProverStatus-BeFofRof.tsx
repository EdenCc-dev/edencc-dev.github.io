import GradientBorderCard from "@/components/GradientBorderCard";
import useAccount from "@/hooks/useAccount";
import useStatic from "@/models/_global";
import { cn } from "@nextui-org/react";
import { useRequest } from "ahooks";
import axios from "axios";
import { ArrowRight } from "lucide-react";


// {
//     "multiplier": 60,
//     "stakeStatus": 1,
//     "zkProverStatus": 1, z
//     "aleoProverStatus": 0
//   }
// /zkTask/prover/status

export const useProverStatus = () => {
    const { zkPart, isSigned, walletAddress } = useAccount();
    const { proofTypeList } = useStatic();

    const { data } = useRequest(() => {
        return axios.get('/api/v1/zkTask/prover/status')
    }, {
        ready: !!walletAddress && isSigned,
        refreshDeps: [isSigned, walletAddress]
    });

    const proverStatusData = {
        zkSync: data?.data?.proverStatus || 0,
        aleo: data?.data?.proverStatus || 0,
        ethProve: data?.data?.proverStatus || 0
    };

    // 返回组件函数而不是组件实例
    const ProverCardListComponent = () => (
        <div className={cn("flex gap-4 flex-wrap flex-col lg:flex-row w-full lg:w-auto")}>
            {proofTypeList?.map(i => {
                return <ProverCard
                    className="lg:max-w-[calc(50%-1rem)]"
                    icon={<img src={i.logo} alt={i.name} />}
                    name={i?.name + ' Prover'}
                    description={i?.description}
                    isActive={!!proverStatusData.zkSync}
                    btnText={`Become a ${i?.name} Prover`}
                    link={i?.jumpURL}
                />
            })}
        </div>
    );

    const VerifierCardListComponent = () => (
        <GradientBorderCard borderRadius={8}>
            <div className={cn("w-full px-6 py-4 flex justify-between items-center", "flex-col gap-4 lg:flex-row lg:gap-0")}>
                <div className="flex flex-col gap-4 w-full">
                    <h3 className="unbounded-16-300">ZK PROVER STATUS</h3>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${data?.data?.proverStatus ? 'bg-lightBrand' : 'bg-gray-500'}`}></div>
                        <span className="unbounded-14-300">ZKSYNC PROVER {data?.data?.proverStatus ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${data?.data?.proverStatus ? 'bg-lightBrand' : 'bg-error'}`}></div>
                        <span className="unbounded-14-300">ETHProve {data?.data?.proverStatus ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>
                </div>
            </div>
        </GradientBorderCard>
    );

    return {
        ProverCardListComponent,
        VerifierCardListComponent,
        proverStatusData
    };
};

interface ProverCardProps {
    icon: React.ReactNode;
    name: string;
    description: string;
    isActive: boolean;
    btnText: string;
    className?: string;
    link?: string;
}

export const ProverCard = ({ icon, name, description, isActive, btnText, className, link }: ProverCardProps) => {
    return (
        <GradientBorderCard
            borderRadius={8}
            className={cn("", className)}
        >
            <div className="w-full p-4 lg:p-6 h-full flex flex-col">
                <div className="flex flex-col items-start gap-4 flex-1">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-0 lg:gap-4 justify-between w-full">
                        <div className="flex items-center gap-4">

                            <div className={cn("rounded-full bg-[#111] flex items-center justify-center text-white", "h-8 w-8 lg:w-12 lg:h-12" )}>
                                {icon}
                            </div>
                            <h3 className={cn("unbounded-24-300", "lg:mb-2" )}>{name}</h3>
                        </div>
                        <div className="flex items-center gap-2 ">
                            <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-lightBrand' : 'bg-error'}`}></div>
                            <span className="unbounded-14-300">{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                        </div>

                    </div>

                    <div className="flex-1 h-full flex flex-col">

                        <p className="flex-1 text-sm  mb-6 text-sub teacher !normal-case">{description}</p>
                        <a href={link} target="_blank" className="flex items-center gap-2 teacher tracking-widest text-sm text-sub cursor-pointer hover:text-white transition-colors">
                            <span>{btnText}</span>
                            <ArrowRight width={16} height={16} />
                        </a>
                    </div>
                </div>
            </div>
        </GradientBorderCard>
    );
};

