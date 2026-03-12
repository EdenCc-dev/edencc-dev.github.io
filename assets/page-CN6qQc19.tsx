
import Button from "@/components/Button";
import { getImageUrl } from "@/utils/tools";
import { ArrowRight, Check } from "lucide-react";
import GradientBorderCard from "@/components/GradientBorderCard";
import { cn, Divider, Tab, Tabs } from "@nextui-org/react";
import { downloadLink } from "@/config";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs"; // 选择一个你喜欢的主题
import copy from "copy-to-clipboard";
import { Multiplier } from "@/routes/components/Multiplier";
import { useVerifierStatus } from "@/routes/components/ZkVerifierStatus";
import DownloadQRCodeTooltip from "@/routes/components/DownloadQRCodeTooltip";
import { useState } from "react";


const androidGuide = {
    ["Android"]: {
        totalStep: 3,
        steps: [
            {
                title: "Install The APP",
                desc: (
                    <div className="flex flex-col gap-6">
                        <span>Download the official Cysic Verifier App</span>

                        <div className={cn("flex gap-4 items-center", "flex-col lg:flex-row")}>
                            <GradientBorderCard className=" p-6 bg-[#FFFFFF0D]">
                                <div className="flex items-center gap-1">
                                    <img
                                        className="size-8"
                                        src={getImageUrl(
                                            "@/assets/images/tutorial/android_bot.svg"
                                        )}
                                    />
                                    <a href={downloadLink.andorid} className="flex items-center gap-1 text-sub text-sm teacher text-sm tracking-widest ml-auto">
                                        <span>Download</span>
                                        <ArrowRight width={16} height={16} />
                                    </a>

                                </div>
                                <div className="flex items-center gap-4 justify-between mt-4">
                                    <div className="unbounded text-xl font-light flex-1">
                                        Download the APK Android
                                    </div>
                                    <DownloadQRCodeTooltip>
                                        <div className="p-2 rounded-[12px] cursor-pointer hover:bg-[#2A313B]">
                                            <img
                                                className="size-8"
                                                src={getImageUrl(
                                                    "@/assets/images/tutorial/qrcode_trigger.svg"
                                                )}
                                            />
                                        </div>
                                    </DownloadQRCodeTooltip>
                                </div>
                            </GradientBorderCard>

                            <GradientBorderCard className=" p-6 bg-[#FFFFFF0D]">
                                <div className="flex items-center gap-1">
                                    <img
                                        className="size-8"
                                        src={getImageUrl(
                                            "@/assets/images/download/google-play_icon_white.svg"
                                        )}
                                    />
                                    <a href={downloadLink.googlePlay} className="flex items-center gap-1 text-sub text-sm teacher text-sm tracking-widest ml-auto">
                                        <span>Google Play </span>
                                        <ArrowRight width={16} height={16} />
                                    </a>

                                </div>

                                <div className="flex items-center gap-4 justify-between mt-4">
                                    <div className="unbounded text-xl font-light flex-1">
                                        Download from Google Play
                                    </div>
                                    <div
                                        onClick={() =>
                                            window.open(downloadLink.googlePlay, "_blank")
                                        }
                                        className="flex items-center cursor-pointer"
                                    >
                                        <img
                                            className="w-[9.25rem]"
                                            src={getImageUrl(
                                                "@/assets/images/download/google-play.svg"
                                            )}
                                        />
                                    </div>
                                </div>
                            </GradientBorderCard>
                        </div>
                    </div>
                ),
            },
            {
                title: "Import Your Wallet",
                desc: <p className="text-left teacher text-sm !normal-case">
                    Import your wallet seed phrase.
                    <br />
                    Cysic does not store any seed phrases or private keys.
                    <br />
                    Please ensure the security of your wallet information.
                </p>
            },
            {
                title: "Start VerifIcation",
                desc: <p className="text-left teacher text-sm !normal-case">
                    Click the Start Verification button on the main interface to begin the Verifier process.
                    <br />
                    After starting verifier, Cysic App can switch to backstage operating.
                    <br />
                    You can start or stop the verification work at any time.
                </p>
            },
        ],
    },
}

const guide = {
    
    ["Linux"]: {
        totalStep: 3,
        steps: [
            {
                title: "Setup",
                desc: <p className="text-left teacher text-sm !normal-case">
                    Start your terminal program on Linux. Copy the code below.<br />
                    Replace the address placeholder with your reward address, then run it in your terminal.
                </p>,
                code: `# replace 0x-Fill-in-your-reward-address-here with your reward address below
            
curl -L https://github.com/cysic-labs/cysic-phase3/releases/download/v1.0.0/setup_linux.sh > ~/setup_linux.sh && bash ~/setup_linux.sh 0x-Fill-in-your-reward-address-here`,
            },
            {
                title: "Start the verifier program",
                desc: (
                    <p className="text-left teacher text-sm !normal-case">
                        Wait a while for the setup process script to run. Then copy and paste the below code, press enter to run.
                        <br />
                        · If you see “err: rpc error”, don’t worry—just wait a few minutes for the verifier to connect.
                        <br />
                        · Once connected, you’ll see a message like “start sync data from server,” indicating it’s running successfully.
                    </p>
                ),
                code: `cd ~/cysic-verifier/ && bash start.sh`,
            },
            {
                title: "Success",
                desc: (
                    <p className="text-left teacher text-sm !normal-case">
                        If you need to reconnect the verifier, please execute Step 2 again.
                        <br />
                        *The verifier program will create mnemonic files for you.
                        <br />
                        Your submitted address mnemonic file is in: ～/.cysic/keys/ folder, please keep it or you can not run the verifier program again.
                    </p>
                ),
            },
        ],
    },
    ["Windows"]: {
        totalStep: 3,
        steps: [
            {
                title: "Setup",
                desc: (
                    <p className="text-left teacher text-sm !normal-case">
                        Start your terminal program on Windows. <br />
                        Copy the code below, replacing the address placeholder with your reward address, paste the code in your terminal, then press enter to run.
                    </p>
                ),
                code: `# replace 0x-Fill-in-your-reward-address-here with your reward address below

cd $env:USERPROFILE

Invoke-WebRequest -Uri "https://github.com/cysic-labs/cysic-phase3/releases/download/v1.0.0/setup.ps1" -OutFile "setup_win.ps1"

.\\setup_win.ps1 -CLAIM_REWARD_ADDRESS "0x-Fill-in-your-reward-address-here"`,
            },
            {
                title: "Start the verifier program",
                desc: (
                    <p className="text-left teacher text-sm !normal-case">
                        Wait a while for the setup process script to run. Then copy and paste the below code, press enter to run.
                        <br />
                        · If you see “err: rpc error”, don’t worry—just wait a few minutes for the verifier to connect.
                        <br />
                        · Once connected, you’ll see a message like “start sync data from server,” indicating it’s running successfully.
                    </p>
                ),
                code: `# run the verifier

cd $env:USERPROFILE\\cysic-verifier

.\\start.ps1`,
            },
            {
                title: "Success",
                desc: (
                    <p className="text-left teacher text-sm !normal-case">
                        If you need to reconnect the verifier, please execute Step 2
                        again.
                        <br />
                        *The verifier program will create mnemonic files for you.
                        <br />
                        Your submitted address mnemonic file is in: ～/.cysic/keys/ folder,
                        please keep it or you can not run the verifier program again.
                    </p>
                ),
            },
        ],
    },
    ["MacOS"]: {
        totalStep: 3,
        steps: [
            {
                title: "Setup",
                desc: (
                    <p className="text-left teacher text-sm !normal-case">
                        Open your terminal first. <br />
                        Copy the code below, replacing the address placeholder with your reward address, then press to run.
                    </p>
                ),
                code: `# replace 0x-Fill-in-your-reward-address-here with your reward address below

curl -L https://github.com/cysic-labs/cysic-phase3/releases/download/v1.0.0/setup_mac.sh && bash ~/setup_mac.sh 0x-Fill-in-your-reward-address-here`,
            },
            {
                title: "Start the verifier program",
                desc: (
                    <p className="text-left teacher text-sm !normal-case">
                        Wait a while for the setup process script to run. Then copy and paste the below code, press enter to run.
                        <br />
                        · If you see “err: network error”, don’t worry—just wait a few minutes for the verifier to connect.
                        <br />
                        · Once connected, you’ll see a message like “start sync data from server,” indicating it’s running successfully.
                    </p>

                ),
                code: `cd ~/cysic-verifier/ && bash start.sh`,
            },
            {
                title: "Success",
                desc: (
                    <p className="text-left teacher text-sm !normal-case">
                        If you need to reconnect the verifier, please execute Step 2
                        again.
                        <br />
                        *The verifier program will create mnemonic files for you.
                        <br />
                        Your submitted address mnemonic file is in: ～/.cysic/keys/ folder,
                        please keep it or you can not run the verifier program again.
                    </p>

                ),
            },
        ],
    },
};

const GuideStepCard = ({
    step,
    totalStep,
    title,
    description,
    code,
}: // children,
    {
        step: number;
        totalStep: number;
        title: string;
        description?: string | React.ReactNode;
        code?: string;
        // children?: React.ReactNode;
    }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = (v: string) => {
        copy(v);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
                <div className="teachers-12-14-500 bg-[#FFFFFF1A] rounded-full px-2 lg:px-4 py-2 border">Step {step}/{totalStep}</div>
                <h3 className={cn("unbounded-16-24-400 flex-1")}>
                    {title}
                </h3>
            </div>
            {description ? (
                <>
                    <p className="text-sub text-sm font-[400]">{description}</p>
                </>
            ) : null}

            {/* {children} */}
            {code ? (
                <div className={
                    cn("relative bg-[#FFFFFF0D] rounded-[16px] p-4 flex items-center justify-between ", "flex-col lg:flex-row gap-6 lg:gap-10")
                }>
                    <SyntaxHighlighter
                        language="bash"
                        style={github}
                        className="flex-1 w-full break-words rounded-md !bg-[transparent] !text-white [&>code]:!whitespace-break-spaces  [&>code]:leading-4"
                    >
                        {code}
                    </SyntaxHighlighter>
                    <Button
                        type="solid"
                        className="cursor-pointer px-6 py-2 text-base max-h-10 h-10 flex items-center justify-center"
                        onClick={() => handleCopy(code)}
                    >
                        {copied ? <div className="px-[0.625rem] mx-auto"><Check className="w-4 h-4 text-lightBrand" /></div> : "Copy"}
                    </Button>
                </div>
            ) : null}
        </div>
    );
};

const SelfProverStepCard = ({
    linkContent,
    step,
    title,
    description,
    buttonText,
    children,
    onClick,
    linkHref,
}: {
    linkContent?: string | React.ReactNode;
    step: number;
    title: string | React.ReactNode;
    description?: string | React.ReactNode;
    buttonText?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    linkHref?: string;
}) => {
    return (
        <>
            <div className="flex flex-col items-start">
                <div
                    className={cn(
                        "w-full flex ",
                        "flex-col lg:flex-row lg:justify-between lg:items-start"
                    )}
                >
                    <div className="flex gap-4 items-start lg:items-center ">
                        <div className="teachers-12-14-500 bg-[#FFFFFF1A] rounded-full px-2 lg:px-4 py-2 border">Step {step}/2</div>
                        <h3 className={cn("unbounded-16-24-400 flex-1")}>
                            {title}
                        </h3>
                    </div>
                    {buttonText ? (
                        <Button
                            disabled={!onClick}
                            onClick={onClick}
                            type="light"
                            className="my-2 lg:my-0 rounded-lg h-[4.1875rem] w-[12.5rem] !p-0 min-h-fit !text-base !font-[400]"
                        >
                            {buttonText}
                        </Button>
                    ) : null}
                </div>

                <div className="flex-1 ">
                    <p className="text-sub text-sm mb-4 teacher !normal-case">{description}</p>
                </div>



                {
                    linkContent ? (<a href={linkHref} target="_blank" className="flex items-center gap-2 teacher tracking-widest text-sm !font-[400] text-sub cursor-pointer hover:text-white transition-colors">
                        <span>{linkContent}</span>
                        <ArrowRight width={16} height={16} />
                    </a>) : null
                }

            </div>
            {children}
        </>
    );
};

const VerifierPage = () => {
    const { VerifierCardListComponent, ProverCardListComponent } = useVerifierStatus()

    return (
        <div className="min-h-screen w-full pb-12 overflow-hidden">
            {/* 主标题 */}
            <div className="pt-12 flex flex-col items-center gap-6 relative z-[2]">
                <div className="flex flex-col items-center">
                    <span className="unbounded-36-300 text-white text-center">
                        VERIFIER
                    </span>
                </div>
            </div>

            {/* 主要内容部分 */}
            <div className="mx-auto mt-12 relative z-[2]">
                {/* 第一部分：成为 Prover */}
                <GradientBorderCard borderRadius={8} className="mb-4  relative ">
                    <>
                        <div className="absolute purple-landing bg-[url('@/assets/images/_global/dashboard_verifier_landing_bg.png')] bg-cover bg-center w-[calc(100%-2px)] h-[calc(100%-2px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg" />
                        <div className={cn("w-full px-4 lg:px-6 py-4 relative z-1")}>
                            <div className="flex flex-col gap-2 mb-6 ">
                                <h1
                                    className={cn(
                                        "unbounded font-light",
                                        "text-2xl lg:text-4xl"
                                    )}
                                >
                                    Scale Up,<br /> Verify More,<br /> Earn More
                                </h1>
                                <h2
                                    className={cn(
                                        "unbounded font-light mt-2",
                                        "text-base lg:!text-xl"
                                    )}
                                >
                                    Run a lightweight node to support proof verification,<br />
                                    strengthening the network's security and scalability
                                </h2>
                            </div>

                            <p className="teacher text-white !normal-case text-base">
                                You can also maximize your earnings as a Cysic ZK Verifier by
                                running multiple devices-pC, servers, and Cysic official Android
                                App.<br /> You can also boost your rewards by increasing your
                                Multiplier, The more you verify, the more you earn.
                            </p>
                        </div>
                    </>

                </GradientBorderCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* ZK VERIFIER STATUS */}
                    <VerifierCardListComponent />

                    {/* MULTIPLIER */}
                    <Multiplier actionPlacement="top" />
                </div>

                <div
                    className={cn(
                        "unbounded text-center text-[36px] font-light",
                        "my-6 mt-12 lg:my-12"
                    )}
                >
                    Becoming a Cysic ZK verifier
                </div>

                <div className="flex flex-col">
                    <GradientBorderCard borderRadius={8} className="mb-4 relative px-4 lg:px-6 py-4">
                        <SelfProverStepCard
                            step={1}
                            // linkContent="Click here to know how to earn CYS"
                            title="RESERVE 100 CYS"
                            description={
                                <>
                                    To become a Verifier on Cysic ZK, you need to reserve at least
                                    100 CYS as collateral. <br /> Cysic will oversee Verifier
                                    actions, retaining this collateral if any irregular behavior
                                    occurs to protect Cysic ZK's operation.
                                </>
                            }
                            buttonText="TIME LIMITED FREE"
                            // onClick={handleReserveModal}
                        />
                    </GradientBorderCard>

                    <GradientBorderCard
                        borderRadius={8}
                        className="flex flex-col gap-4 py-4 px-4 lg:px-6"
                    >
                        <SelfProverStepCard
                            step={2}
                            linkContent="For more details, see the full Verifier Tutorial Doc"
                            linkHref="https://docs.cysic.xyz/how-to-run-a-verifier-node"
                            // buttonText="TIME LIMITED FREE"
                            // onClick={handleReserveModal}
                            title={
                                <>
                                    <span className="unbounded-14-24-400 break-words" style={{ wordBreak: 'break-word' }}>Follow the corresponding tutorials</span> <br />
                                    <span className="unbounded-14-16-300 ">based on your terminal machine</span>
                                </>
                            }
                        >

                            <Divider className="bg-[#FFFFFF4D] " />

                            <div className="flex gap-4 items-start lg:items-center">
                                <div className="text-sm font-medium teacher bg-[#FFFFFF1A] rounded-full px-2 lg:px-4 py-2 border">TUTORIAL</div>
                                <h3 className={cn("unbounded text-2xl ")}>
                                    <>
                                        <span className="unbounded-16-24-400">Run Cysic Verifier Node</span> <br />
                                        <span className="unbounded-14-16-300">in 2 simple steps</span>
                                    </>
                                </h3>
                            </div>

                            <a href="https://docs.cysic.xyz/how-to-run-a-verifier-node" target="_blank" className="flex items-center gap-2 teacher tracking-widest text-sm !font-[400] text-sub cursor-pointer hover:text-white transition-colors">
                                <span>For more details, see the full Verifier Tutorial Doc</span>
                                <ArrowRight width={16} height={16} />
                            </a>

                            <div className="flex flex-col gap-4 mt-4">
                                <Tabs
                                    key={"underlined"}
                                    aria-label="Tabs variants"
                                    variant={"underlined"}
                                    classNames={{
                                        tabList: "w-full border-b border-white/30 !p-0 !gap-0",
                                        cursor: "h-px w-full",
                                        tab: "!p-0 ",
                                        panel: "!p-0",
                                        tabContent: "teacher text-base font-medium !normal-case"
                                    }}
                                    className="w-full"
                                >
                                    {/* <Tab key="Android" title="Android">
                                        <div className={cn("bg-[#FFFFFF0D] w-full p-4 flex gap-6", "flex-col lg:flex-row")}>
                                            <div className="flex-1">

                                                <GuideStepCard
                                                    step={1}
                                                    totalStep={3}
                                                    title={guide["Android"].steps[0].title}
                                                    description={guide["Android"].steps[0].desc}
                                                    code={guide["Android"].steps[0].code}
                                                />
                                                <Divider className="bg-[#FFFFFF4D] my-6" />
                                                <GuideStepCard
                                                    step={2}
                                                    totalStep={3}
                                                    title={guide["Android"].steps[1].title}
                                                    description={guide["Android"].steps[1].desc}
                                                    code={guide["Android"].steps[1].code}
                                                />
                                                <Divider className="bg-[#FFFFFF4D] my-6" />
                                                <GuideStepCard
                                                    step={3}
                                                    totalStep={3}
                                                    title={guide["Android"].steps[2].title}
                                                    description={guide["Android"].steps[2].desc}
                                                    code={guide["Android"].steps[2].code}
                                                />
                                            </div>

                                            <div className="flex flex-col items-center gap-2 ">
                                                <div className="text-base text-sub">Cysic Verifier App Video Guide</div>

                                                <div className=" self-center mx-auto aspect-[240/520] min-w-[15rem] max-w-[16rem]">
                                                    <div className="rounded-[12px] p-3 bg-[#FFFFFF33]">
                                                        <video controls preload="auto" className="aspect-[240/520]" poster="https://testnet.prover.xyz/m/tutorial_poster.png" muted>
                                                            <source src="https://statics.prover.xyz/tutorial/video.mp4" type="video/mp4" />
                                                        </video>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </Tab> */}
                                    <Tab key="Linux" title="Linux">
                                        <div className="bg-[#FFFFFF0D] w-full p-4">
                                            <GuideStepCard
                                                step={1}
                                                totalStep={3}
                                                title={guide["Linux"].steps[0].title}
                                                description={guide["Linux"].steps[0].desc}
                                                code={guide["Linux"].steps[0].code}
                                            />
                                            <Divider className="bg-[#FFFFFF4D] my-6" />
                                            <GuideStepCard
                                                step={2}
                                                totalStep={3}
                                                title={guide["Linux"].steps[1].title}
                                                description={guide["Linux"].steps[1].desc}
                                                code={guide["Linux"].steps[1].code}
                                            />
                                            <Divider className="bg-[#FFFFFF4D] my-6" />
                                            <GuideStepCard
                                                step={3}
                                                totalStep={3}
                                                title={guide["Linux"].steps[2].title}
                                                description={guide["Linux"].steps[2].desc}
                                                code={guide["Linux"].steps[2].code}
                                            />
                                        </div>
                                    </Tab>
                                    <Tab key="Windows" title="Windows">
                                        <div className="bg-[#FFFFFF0D] w-full p-4">
                                            <GuideStepCard
                                                step={1}
                                                totalStep={3}
                                                title={guide["Windows"].steps[0].title}
                                                description={guide["Windows"].steps[0].desc}
                                                code={guide["Windows"].steps[0].code}
                                            />
                                            <Divider className="bg-[#FFFFFF4D] my-6" />
                                            <GuideStepCard
                                                step={2}
                                                totalStep={3}
                                                title={guide["Windows"].steps[1].title}
                                                description={guide["Windows"].steps[1].desc}
                                                code={guide["Windows"].steps[1].code}
                                            />
                                            <Divider className="bg-[#FFFFFF4D] my-6" />
                                            <GuideStepCard
                                                step={3}
                                                totalStep={3}
                                                title={guide["Windows"].steps[2].title}
                                                description={guide["Windows"].steps[2].desc}
                                                code={guide["Windows"].steps[2].code}
                                            />
                                        </div>
                                    </Tab>
                                    <Tab key="MacOS" title="MacOS">
                                        <div className="bg-[#FFFFFF0D] w-full p-4">
                                            <GuideStepCard
                                                step={1}
                                                totalStep={3}
                                                title={guide["MacOS"].steps[0].title}
                                                description={guide["MacOS"].steps[0].desc}
                                                code={guide["MacOS"].steps[0].code}
                                            />
                                            <Divider className="bg-[#FFFFFF4D] my-6" />
                                            <GuideStepCard
                                                step={2}
                                                totalStep={3}
                                                title={guide["MacOS"].steps[1].title}
                                                description={guide["MacOS"].steps[1].desc}
                                                code={guide["MacOS"].steps[1].code}
                                            />
                                            <Divider className="bg-[#FFFFFF4D] my-6" />
                                            <GuideStepCard
                                                step={3}
                                                totalStep={3}
                                                title={guide["MacOS"].steps[2].title}
                                                description={guide["MacOS"].steps[2].desc}
                                                code={guide["MacOS"].steps[2].code}
                                            />
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </SelfProverStepCard>
                    </GradientBorderCard>

                </div>
            </div>
        </div>
    );
};

export default VerifierPage;
