import Button from "@/components/Button";
import GradientBorderCard from "@/components/GradientBorderCard";
import { investors1, investors2 } from "@/config/investor";
import AdCard from "@/routes/components/AdCard";
import { JoinTestnetPhaseIIIButton, CysicHardwareStackButton, SeeWhatsComingButton } from "@/routes/components/JoinTestnetPhaseIIIButtonGroups";
import ScrollingText from "@/routes/components/ScrollingText";
import { academyConfigShowInHome, otherArticleShowInHome } from "@/routes/pages/Academy/config";
import { AcademyCard } from "@/routes/pages/Academy/page";
import { ecosystemProjectsShowInHome } from "@/routes/pages/Ecosystem/config";
import { EcosystemCard } from "@/routes/pages/Ecosystem/page";
import { getImageUrl } from "@/utils/tools";
import { cn, Divider, Tooltip } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import HorizontalScroll from "./HorizontalScroll";
import { DrawCardList } from "@/routes/pages/Home/Drawlist";
import { appUrl, isNewYear } from "@/config";
import { Airdrop } from "@/routes/pages/Home/Airdrop";



const asSeenOnList = [
  {
    name: "TechCrunch",
    img: getImageUrl("@/assets/images/investors/tech_crunch.png"),
  },
  {
    name: "CoinDesk",
    img: getImageUrl("@/assets/images/investors/coindesk.png"),
  },
  {
    name: "The Block",
    img: getImageUrl("@/assets/images/investors/the_block.png"),
  },
  {
    name: "Yahoo",
    img: getImageUrl("@/assets/images/investors/yahoo.png"),
  },
  {
    name: "Decrypt",
    img: getImageUrl("@/assets/images/investors/decrypt.png"),
  },
];

const navScreenList = [
  {
    background:
      "bg-[url('@/assets/images/_global/zk_ecosystem_bg.png')] bg-cover bg-center brightness-[0.2]",
    subTitle: "Decentralized Prover and Verifier NetworK for ZK",
    title: "Cysic Network",
    slogen: (
      <div className="text-center">
        <div className="text-center unbounded-16-20-300">
          <span className="unbounded-16-20-500">
            all-in-one solution
          </span>
          &nbsp;for
        </div>
        <p className="unbounded-16-24-500 text-gradient">
          zero-knowledge proof generation and verification.
        </p>
      </div>
    ),
    action: (
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
        <Button type="solid" className="backdrop-blur-sm teacher py-4 lg:py-6 px-6 lg:px-8">
          <div className="flex items-center gap-2 justify-between lg:justify-start">
            <span>About Cysic Network</span>
            <ArrowRight width={16} height={16} />
          </div>
        </Button>
        {/* <JoinTestnetPhaseIIIButton className="w-full lg:w-auto" /> */}
      </div>
    ),
  },
  {
    background:
      "bg-[url('@/assets/images/_global/zk_hardware_bg.png')] bg-cover bg-center",
    subTitle: "we build hardcore, play long-term, shape the future",
    title: "Cysic Hardware",
    slogen: (
      <div className="text-center">
        <div className="text-center unbounded-16-20-300">
          Purpose-built hardware and GPUs optimized
        </div>
        <p className="unbounded-16-24-500 text-gradient">
          for ZK acceleration and beyond.
        </p>
      </div>
    ),
    action: (
      <Link to="/hardware" className="flex items-center gap-6">
        <Button type="solid" className="backdrop-blur-sm teacher py-4 lg:py-6 px-6 lg:px-8">
          <div className="flex items-center gap-2 justify-between lg:justify-start">
            <span>About Cysic Hardware</span>
            <ArrowRight width={16} height={16} />
          </div>
        </Button>
      </Link>
    ),
  },
  {
    background:
      "bg-[url('@/assets/images/_global/ai_landing_bg.png')] bg-cover bg-center brightness-[0.2]",
    subTitle: "Built to power agents and AI workflows at scale",
    title: "Cysic AI",
    slogen: (
      <div className="text-center">
        <p className="text-center unbounded-16-20-300">
          low-cost, high-performance
        </p>
        <p className="unbounded-16-24-500 text-gradient">
          for ZK acceleration and beyond.
        </p>
        <p className="text-center unbounded-16-20-300">
          with seamless API access.
        </p>
      </div>
    ),
    // 
    action: (
      <a href="https://ai.cysic.xyz/" target="_blank" className="flex items-center gap-6">
        <Button type="solid" className="backdrop-blur-sm teacher py-4 lg:py-6 px-6 lg:px-8">
          <div className="flex items-center gap-2 justify-between lg:justify-start">
            <span>About Cysic AI</span>
            <ArrowRight width={16} height={16} />
          </div>
        </Button>
      </a>
    ),
  },
  {
    background:
      "bg-[url('@/assets/images/_global/socialTask_landing_bg.png')] bg-cover bg-center green-landing",
    subTitle: "compute power as liquid, yield-bearing assets",
    title: "Digital Compute",
    slogen: (
      <div className="text-center">
        <p className="font-light text-base lg:text-xl text-center unbounded">
          Unlocking the value of compute
        </p>
        <p className="font-medium text-base lg:text-2xl text-gradient unbounded text-center w-full">
          as capital.
        </p>
      </div>
    ),
    action: (
      <Button
        type="light"
        disabled
        className="py-2 px-4 unbounded font-medium !bg-white !text-black !opacity-100"
      >
        coming soon
      </Button>
    ),
  },
];

const otherScreenList = [
  {
    subTitle: "Growing with the Builders in the industry",
    title: "ecosystem",
    slogen: (
      <Link to="/ecosystem" className="w-full lg:w-auto">
        <Button type="solid" className="backdrop-blur-sm teacher py-4 lg:py-6 px-6 lg:px-8 w-full lg:w-auto">
          <div className="flex items-center gap-2 justify-between lg:justify-start">
            <span>Explore Cysic Partners</span>
            <ArrowRight width={16} height={16} />
          </div>
        </Button>
      </Link>
    ),
    action: (
      <div className="flex flex-wrap gap-4 main-container">
        {ecosystemProjectsShowInHome.map((project) => {
          return <EcosystemCard key={project.projectName} project={project} />;
        })}
      </div>
    ),
  },
  {
    background:
      "bg-[url('@/assets/images/_global/zk_academy_bg.png')] bg-cover bg-center brightness-[0.4]",
    subTitle: "learn with cysic",
    title: "cysic academy",
    slogen: (
      <Link to="/academy" className="w-full lg:w-auto">
        <Button type="solid" className="backdrop-blur-sm teacher py-4 lg:py-6 px-6 lg:px-8 w-full lg:w-auto">
          <div className="flex items-center gap-2 justify-between lg:justify-start">
            <span>View All Articles</span>
            <ArrowRight width={16} height={16} />
          </div>
        </Button>
      </Link>
    ),
    action: (
      <div className="flex flex-wrap gap-4 main-container w-full ">
        {academyConfigShowInHome.map((item) => {
          return <AcademyCard key={item.title} item={item} />;
        })}
      </div>
    ),
  },
  {
    title: "investors",
    action: (
      <div className="mt-10 flex flex-wrap gap-10 justify-center main-container">
        <div className="flex flex-wrap gap-10 justify-center">
          {investors1?.map((i) => {
            return (
              <div className="min-w-12 h-8" key={i.name}>
                <img
                  src={i.img}
                  className="object-contain h-full"
                  alt={i.name}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-10 justify-center">
          {investors2?.map((i) => {
            return (
              <div className="min-w-12 h-8" key={i.name}>
                <img
                  src={i.img}
                  className="object-contain h-full"
                  alt={i.name}
                />
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
]

const ScreenNavCard = ({
  background,
  subTitle,
  title,
  slogen,
  action,
  className,
  autoHeight,
  classNames
}: {
  background?: string;
  subTitle?: string;
  title: string;
  slogen?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  autoHeight?: boolean;
  classNames?: { slogen?: string, action?: string }
}) => {
  return (
    <div
      className={cn(
        "relative w-full flex flex-col items-center justify-center ",
        autoHeight ? "py-16 lg:min-h-screen" : "min-h-screen",
        className
      )}
    >
      <div className={cn("absolute inset-0 -z-[1]", background)} />
      <div className="flex flex-col">

        {subTitle ? (
          <span className="teachers-16-24-400 tracking-[0.3em] text-center">{subTitle}</span>
        ) : null}
        <span className="mt-2 unbounded-36-64-300 text-center">{title}</span>
      </div>
      {slogen ? <div className={cn("mt-6 ", classNames?.slogen)}>{slogen}</div> : null}
      {action ? <div className={cn("mt-6 ", classNames?.action)}>{action}</div> : null}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className={cn(
          "flex flex-col justify-between items-center main-container",
        )}
      >
        <div className={cn("flex flex-col items-center justify-center gap-6 relative z-[2] h-[calc(100vh-90px)] md:h-screen",
        )}>
          <div className={cn("flex flex-col items-center", isNewYear ? " -mt-0" : " -mt-40")}>
            <span
              className={cn(
                "unbounded text-[36px] lg:text-[80px] font-[200] !text-white text-center p-4 lg:p-0",
              )}
            >
              The First Full-Stack
              <br />
              Compute Network

            </span>
            <span className="teachers-16-24-400 tracking-widest lg:tracking-[8.88px] font-normal mt-6 desc text-center">
              Own the growth of on-chain compute, powered by Cysic.
            </span>
          </div>

          {/* <div className="flex items-center lg:items-start gap-4 flex-wrap flex-col lg:flex-row mx-auto text-base w-full lg:w-auto"> */}
          {/* <JoinTestnetPhaseIIIButton className="w-full lg:w-auto" /> */}
          {/* <CysicHardwareStackButton className="w-full lg:w-auto" /> */}
          {/* <SeeWhatsComingButton className="w-full lg:w-auto" /> */}
          {/* </div> */}
        </div>
      </div>


      <Airdrop />

      <div
        className={cn(
          "flex flex-col items-center gap-4 lg:gap-12 relative z-[2] -translate-y-[0px]",
          "py-6 lg:py-12"
        )}
      >
        <span
          className={cn(
            "unbounded-24-64-200 text-center text-md"
          )}
        >
          Backed by Industry Leaders
        </span>

        <div className="flex flex-wrap items-center gap-4 lg:gap-12">
          <img
            src={getImageUrl("@/assets/images/investors/polychain.svg")}
            className="h-[2.25rem] lg:h-[5.5rem]"
          />
          <img
            src={getImageUrl("@/assets/images/investors/okx.svg")}
            className="h-[2.25rem] lg:h-[5.5rem]"
          />
          <img
            src={getImageUrl("@/assets/images/investors/hashkey.svg")}
            className="h-[2.25rem] lg:h-[5.5rem]"
          />
        </div>
      </div>

      <div className="w-full px-4 py-6 lg:px-12 lg:py-16 bg-white text-center unbounded-16-24-300 text-black">
        From silicon to protocol, Cysic is building
        <br />
        the full-stack infrastructure for
        <br />
        <span className="unbounded text-gradient-v1 font-medium">
          trustless, scalable
        </span>
        , and{" "}
        <span className="unbounded text-gradient-v1 font-medium">
          monetizable computation.
        </span>
      </div>

      <div className="min-h-[640px] w-full main-container flex flex-col items-center gap-12 py-12 lg:py-16">
        <div className="text-center">
          <div className="teachers-16-24-400 mb-2 lg:mb-0">What we are</div>
          <div className="unbounded-36-64-300">Building</div>
        </div>

        <DrawCardList />
      </div>

      <div className="main-container py-16 flex flex-col lg:flex-row gap-12 w-full">
        <div className="flex flex-col gap-6 flex-1">
          <div className="unbounded-32-40-500 text-center">
            LIVE NOW
          </div>
          <div className="flex flex-col gap-4">
            <AdCard
              title="Cysic Network"
              desc="Verifiable compute network"
              className="translate-x-[30%] -translate-y-[20%]"
              imageSrc={getImageUrl("@/assets/images/nft/preset3.png")}
              onClick={() => {
                window.open(appUrl, '_blank')
              }}
            />
            <AdCard
              title="Cysic hardware"
              desc="ZK accelerators & beyond"
              imageSrc={getImageUrl("@/assets/images/nft/preset4.png")}
              onClick={() => {
                navigate("/hardware");
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 flex-1">
          <div className="unbounded-32-40-500 text-center">
            coming soon
          </div>
          <div className="flex flex-col gap-4">
            <AdCard
              title="Cysic AI"
              desc="Low-cost AI infra for custom models"
              imageSrc={getImageUrl("@/assets/images/nft/preset1.png")}
              onClick={() => {
                window.open("https://ai.cysic.xyz/", "_blank")
              }}
            />
            <Tooltip content={<div className="max-w-[16.625rem] px-4 py-2 text-sub !normal-case teachers-16-300">The protocol you told your parents not to worry about</div>}>
              <div><AdCard
                title="Cysic digital mining"
                desc="Compute-backed digital assets"
                imageSrc={getImageUrl("@/assets/images/nft/preset2.png")}
              /></div>
            </Tooltip>
          </div>
        </div>
      </div>

      <HorizontalScroll>
        {navScreenList.map((i) => {
          return (
            <ScreenNavCard
              background={i.background}
              subTitle={i.subTitle}
              title={i.title}
              slogen={i.slogen}
              action={i.action}
              className="px-4 py-12 justify-between lg:justify-center lg:py-0 lg:px-0"
            />
          );
        })}
      </HorizontalScroll>

      {
        otherScreenList.map((i) => {
          return (
            <ScreenNavCard
              autoHeight
              background={i.background}
              subTitle={i.subTitle}
              title={i.title}
              slogen={i.slogen}
              action={i.action}
              className="my-12 lg:my-0 "
            />
          );
        })}


      <a href="https://medium.com/@cysic/zero-knowledge-zk-hardware-acceleration-startup-cysic-raises-12m-in-pre-a-round-to-advance-the-4d8eb7fc611c" target="_blank" className="w-full">
        <div className="relative h-4 lg:h-12 bg-gradient-to-r from-lightBrand to-[#009C87]">
          <ScrollingText isBackground direction="right"><div className="h-full w-full bg-[url('@/assets/images/icon/arrow_right_sm.svg')] lg:bg-[url('@/assets/images/icon/arrow_right.svg')] bg-repeat-x bg-[3rem]" /></ScrollingText>
        </div>
        <div className="bg-white text-black py-6 text-center unbounded-16-32-300">
          Cysic Raises <span className="unbounded-16-32-500">$12M</span> in<span className="unbounded-16-32-500"> Pre-A Round</span> <br />
          To Advance the ZK Revolution

        </div>
        <div className="h-4 lg:h-12 bg-gradient-to-r from-[#3500E5] to-[#BCA7FF]">
          <ScrollingText isBackground direction="right"><div className="h-full w-full bg-[url('@/assets/images/icon/arrow_right_sm.svg')] lg:bg-[url('@/assets/images/icon/arrow_right.svg')] bg-repeat-x bg-[3rem]" /></ScrollingText>
        </div>
      </a>

      <ScreenNavCard
        title="As seen on"
        className="py-10"
        classNames={{ action: " w-full" }}
        action={
          <div className="flex flex-col gap-4 main-container py-10">
            <div className="flex flex-wrap gap-x-4 lg:gap-x-0 gap-y-12 flex-row justify-center lg:justify-start">
              {otherArticleShowInHome.map(i => (
                <a href={i.href} target="_blank" className="lg:w-[33%] px-0 lg:px-6 h-auto flex justify-center items-center " key={i.title} >
                  <GradientBorderCard className="h-full flex flex-col max-w-[20.625rem] ">
                    <>
                      <div className="py-2 px-24 mx-auto">
                        <img src={i.media.img} alt={i.media.name} className="h-12 object-contain" />
                      </div>
                      <Divider />
                      <div className="flex flex-col justify-between py-4 flex-1 gap-10">
                        <div className="px-6 text-lg teacher tracking-widest flex-1">
                          {i.title}
                        </div>

                        <div className="self-end px-6">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>


                    </>
                  </GradientBorderCard>
                </a>
              ))}
            </div>

            {/* <div className="mt-10 main-container w-full flex items-center gap-[3.25rem]">
              {asSeenOnList.map((i) => {
                return (
                  <div className="h-12 flex-1" key={i.name}>
                    <img
                      src={i.img}
                      className="object-contain h-full"
                      alt={i.name}
                    />
                  </div>
                );
              })}
            </div> */}

            {/* {
              otherArticleShowInHome.map(item => {
                return <AcademyCard key={item.title} item={item} />;
              })
            } */}

          </div>
        }
      />
    </>
  );
};

export default Home;
