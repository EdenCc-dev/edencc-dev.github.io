import GradientBorderCard from "@/components/GradientBorderCard"
import useAccount from "@/hooks/useAccount"
import { useProverStatus } from "@/routes/components/ZkProverStatus"
import { useVerifierStatus } from "@/routes/components/ZkVerifierStatus"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export const CompletionTasksCard = () => {
    const { zkPart } = useAccount()
    const totalCompleted = (zkPart?.proverTaskCompletedCnt || 0) + (zkPart?.verifierTaskCompletedCnt || 0);

    return (
        <GradientBorderCard borderRadius={8} className="px-4 lg:px-6 py-4 flex-1 w-full h-full flex flex-col gap-4">

            <div className="unbounded-16-300 flex-1">
                My<br />
                Task<br />
                Completion
            </div>

            <div className="unbounded-24-400 ml-auto">{totalCompleted}</div>

            <div className="flex flex-col gap-1 text-sm teacher !normal-case">
                <div className="flex items-center justify-between">
                    <div>Prover</div>
                    <div>{zkPart?.proverTaskCompletedCnt}</div>
                </div>
                <div className="flex items-center justify-between">
                    <div>Verifier</div>
                    <div>{zkPart?.verifierTaskCompletedCnt}</div>
                </div>
            </div>
        </GradientBorderCard>
    )
}

const BaseCard = ({ title, linkContent, to, children }: { title: string, linkContent: string, to: string, children: React.ReactNode }) => {
    return (
        <GradientBorderCard borderRadius={8} className="px-4 lg:px-6 py-4 flex-1 w-full h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="unbounded-16-300">{title}</div>
                <Link to={to} className="text-sub text-sm teacher hover:text-white flex items-center gap-2">
                    {linkContent}
                    <ArrowRight size={12} />
                </Link>
            </div>

            {children}
        </GradientBorderCard>
    )
}



export const VerifierCard = () => {
    const { zkPart } = useAccount()

    const status = [
        { label: "STANDARD", key: "standardActive" },
        { label: "MOBILE", key: "mobileActive" }
    ] as const
    return (
        <BaseCard title="ZK Verifier" linkContent="More about ZK Verifier" to="/zk/verifier">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-12 gap-y-4 flex-wrap">
                {status.map((item) => (
                    <>
                        <div className="flex items-center gap-2 unbounded-14-300">
                            <div className={`h-2 w-2 rounded-full ${zkPart?.verifierStatus?.[item.key] == 1 ? 'bg-lightBrand' : 'bg-error'}`}></div>
                            {item.label}&nbsp;
                            {zkPart?.verifierStatus?.[item.key] == 1 ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                    </>
                ))}
            </div>
        </BaseCard>
    )
}

export const ProverCard = () => {

    const { ProverCardListComponent } = useVerifierStatus()

    // const { zkPart } = useAccount()
    // const status = [
    //     { label: "NFT", key: "nftActive" },
    //     { label: "SELF", key: "selfActive" }
    // ] as const
    return <ProverCardListComponent
        linkContent="More about ZK Prover"
        to="/zk/prover"
        className="[&_.indicator]:w-2 [&_.indicator]:h-2 [&_.prover-status-list]:flex-row [&_.prover-status-list]:flex-wrap " />
}

export const ProjectCard = () => {
    const { zkPart } = useAccount()
    const status = [
        { label: "ONGOING PROJECTS", key: "ongoingCnt" },
        { label: "PROJECTS UNDER REVIEW", key: "underReviewCnt" }
    ] as const
    return (
        <BaseCard title="ZK Project" linkContent="More about ZK Project" to="/zk/project">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-12 gap-y-4 flex-wrap">
                {status.map((item) => (
                    <div className="flex items-center gap-2 unbounded-14-300">
                        <div className={`h-2 w-2 rounded-full ${item.key == 'underReviewCnt' ? 'bg-lightBrand' : 'bg-warning'}`}></div>
                        {zkPart?.projectStatus?.[item.key] || '0'}&nbsp;
                        {item.label}
                    </div>
                ))}
            </div>
        </BaseCard>
    )
}