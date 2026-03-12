import Button from "@/components/Button";
import GradientBorderCard from "@/components/GradientBorderCard";
import { easterEggVisible } from "@/config";
import InViewFlip from "@/routes/components/InViewFlip";
import { hardwareAcademyConfig } from "@/routes/pages/Academy/config";
import { getImageUrl, scrollIntoView } from "@/utils/tools";
import { cn } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const container = "main-container";
const HardwarePage = () => {

  const [easterEggTextVisible, setEasterEggVisible] = useState(false);

  return (
    <>
      {/* section-1 */}
      <div className="main-container flex flex-col items-center justify-center gap-4 relative z-[2] h-[calc(100vh-5.625rem)] lg:h-[100vh-8rem]">
        <span
          className={cn("unbounded-32-180-200 text-white text-center")}
        >
          Cysic
          <br />
          Hardware
        </span>
        <span className="sub-title text-center text-2xl !font-[400] mb40">
          we build hardcore, play long-term, shape the future
        </span>
      </div>

      {/* section-2 */}
      <div
        className={cn(
          "w-full py-16 flex flex-col gap-2 items-center relative",
          container
        )}
      >
        {
          easterEggVisible['2025_06_02'] && (
            <div 
            onClick={() => {
              setEasterEggVisible(old => !old);
            }}
            className={cn(
              "absolute z-1 cursor-pointer unbounded-16-500 top-7",
              "text-black [&::selection]:text-white",
              easterEggTextVisible && 'text-white'
            )}>The future is powered by math and metal</div>
          )
        }
        <div className="text-sm text-center">
          Our world-class engineering team, with deep roots in both cutting-edge
          research and real-world deployments, is shaping the future of the zk
          industry.{" "}
        </div>
        <div className="text-center unbounded-16-32-500 text-gradient">
          by combining ASIC innovation & GPU acceleration
        </div>
        <div className="text-sm text-center">
          we’re pushing the limits of what’s possible — and building for what
          comes next.
        </div>
      </div>

      <div className={cn("  py-6 lg:py-16 flex flex-col gap-12 items-center", container)}>
        <div className="unbounded-24-64-300 text-center">
          Technical Breakthroughs
        </div>
        <div className="flex flex-col gap-4">
          {hardwareAcademyConfig.map((item) => (
            <a key={item.title} href={item.href} target="_blank">
              <GradientBorderCard className="px-4 lg:px-6 py-4 flex justify-between cursor-pointer">
                <div className="flex flex-col gap-2 flex-1">
                  <span className="sub-title !text-base lg:!text-[1.5rem]">{item.title}</span>
                  <span className="sub-title !tracking-wider !text-sm lg:!text-base min-h-6">{item.subTitle}</span>
                </div>
                <div className="px-4 self-center">
                  <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6" />
                </div>
              </GradientBorderCard>
            </a>
          ))}
        </div>
      </div>

      <div className="py-6 lg:py-12 unbounded-36-96-300 text-center">Our Approach</div>
      <div className="w-full uppercase text-center bg-white text-black py-4 unbounded-20-40-500">
        001. Asic Solutions
      </div>
      <div className={cn("  py-16 flex gap-6 flex-wrap", container)}>
        <div className="flex flex-col gap-4">
          <div className="text-center unbounded-20-24-300">
            Deep custom silicon for ultimate zk performance
          </div>
          <GradientBorderCard
            onClick={() => {
              scrollIntoView("#Hypercube_IR_Layer");
            }}
            className="p-4 lg:p-6 flex flex-col gap-6 items-start cursor-pointer"
          >
            <div className="unbounded-20-24-500 text-center">Hypercube IR Layer</div>
          </GradientBorderCard>
          <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-6 items-start">
            <div className="unbounded-20-24-500 text-center">
              Custom Proof Generation Products
            </div>
            <div className="w-full gap-2 lg:gap-6 flex flex-wrap flex-col lg:flex-row">
              <div
                onClick={() => {
                  scrollIntoView("#zk-chip");
                }}
                className="cursor-pointer p-4 rounded bg-[#FFFFFF0D] border unbounded-16-24-300"
              >
                Cysic C1 Chip
              </div>
              <div
                onClick={() => {
                  scrollIntoView("#zk-chip");
                }}
                className="cursor-pointer p-4 rounded bg-[#FFFFFF0D] border unbounded-16-24-300"
              >
                ZK Air
              </div>
              <div
                onClick={() => {
                  scrollIntoView("#zk-chip");
                }}
                className="cursor-pointer p-4 rounded bg-[#FFFFFF0D] border unbounded-16-24-300"
              >
                ZK Pro
              </div>
            </div>
          </GradientBorderCard>
        </div>
        <div className="flex-1">
          <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 items-start">
            <div className="unbounded-16-24-300 text-left">
              Generate Zero-
              <br />
              Knowledge Proofs
              <br /> in Real Time
            </div>
            <div className="text-sm lg:text-base text-left">
              We have designed the zkVM-based chip, the Cysic C1 chip, which
              lays down the foundation of real-time ZK proof generation. Based
              on this chip, we provide two hardware products, the portable ZK
              Air and robust ZKPro. According to the current product road map
              and design plans, these products are expected to be released in
              2025.
            </div>
          </GradientBorderCard>
        </div>
      </div>

      <div id="zk-chip" className="  pt-12 w-full pb-16">
        <div className="pb-12 unbounded-36-64-300 text-center">
          Get to know ASIC Products
        </div>
        <div className={cn("flex gap-6 flex-wrap items-stretch flex-col lg:flex-row", container)}>
          <GradientBorderCard className="p-6 flex-1 bg-black">
            <div
              className="flex flex-col gap-4 "
              style={{
                background: `url(${getImageUrl(
                  "@/assets/images/hardware/zk_chip.png"
                )}) no-repeat center center / cover`,
              }}
            >
              <div className="flex flex-col gap-2 max-w-[200px] h-[240px]">
                <p className="unbounded-40-300">
                  zk Chip
                </p>
                <span className="font-[400] text-base">
                  The foundation of real-time ZKP generation is Cysic's
                  zkVM-based chip, the Cysic C1 chip.
                </span>
              </div>
              <div className="sub-title !text-2xl font-[400]">Key Features</div>
              <div className="text-base font-[400]">
                Native Support for Common Prime Fields and Hash functions.
              </div>
              <div className="text-base font-[400]">
                Ultra High Internal Memory Bandwidth.
              </div>
              <div className="text-base font-[400]">
                Programmable for Both Expert and Novice Users.
              </div>
            </div>
          </GradientBorderCard>
          <GradientBorderCard className="p-6 flex-1 bg-black">
            <div
              className="flex flex-col gap-4 "
              style={{
                background: `url(${getImageUrl(
                  "@/assets/images/hardware/zk_air.png"
                )}) no-repeat center center / cover`,
              }}
            >
              <div className="flex flex-col gap-2 max-w-[200px] h-[240px]">
                <p className="unbounded-40-300">
                  zk Air
                </p>
                <span className="font-[400] text-base">
                  Portable ZKP Accelerator.
                </span>
              </div>
              <div className="sub-title !text-2xl font-[400]">Key Features</div>
              <div className="text-base font-[400]">
                Comparable to an iPad charger.
              </div>
              <div className="text-base font-[400]">
                Plug and Play Functionality.
              </div>
            </div>
          </GradientBorderCard>
          <GradientBorderCard className="p-6 flex-1 bg-black">
            <div
              className="flex flex-col gap-4 "
              style={{
                background: `url(${getImageUrl(
                  "@/assets/images/hardware/zk_pro.png"
                )}) no-repeat center center / cover`,
              }}
            >
              <div className="flex flex-col gap-2 max-w-[200px] h-[240px]">
                <p className="unbounded-40-300">
                  zk Pro
                </p>
                <span className="font-[400] text-base">
                  Most Powerful ZKP
                  <br />
                  Hardware System.
                </span>
              </div>
              <div className="sub-title !text-2xl font-[400]">Key Features</div>
              <div className="text-base font-[400]">
                Game-changing combination of Cysic C1 silicon performance and
                frontend acceleration extension for ZKP workflows.
              </div>
              <div className="text-base font-[400]">
                Leading power efficiency design.
              </div>
              <div className="text-base font-[400]">
                Advanced cooling system.
              </div>
            </div>
          </GradientBorderCard>
        </div>
      </div>

      {/* secction-3 */}
      <div
        id="Hypercube_IR_Layer"
        className="w-full h-screen bg-black flex flex-col items-center justify-center gap-6"
        style={{
          background: `url(${getImageUrl(
            "@/assets/images/_global/zk_hardware_bg_2.png"
          )}) no-repeat center center / cover`,
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className=" sub-title !text-base lg:!text-xl !font-[400]">
            Parallelism. Precision. Proofs — reengineered.
          </div>
          <div className="unbounded-36-96-300">Hypercube IR</div>
        </div>
        <div className=" sub-title !text-base lg:!text-xl !font-[400] text-center">
          Advanced circuit optimization at the hardware level
        </div>

        <a
          href="https://x.com/cysic_xyz/status/1915390349457187169"
          target="_blank"
        >
          <Button
            className="sub-title !tracking-widest !text-base backdrop-blur-sm !p-6 text-white flex gap-2 uppercase"
            type="solid"
          >
            <span>Read About HypercubE IR</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </a>
      </div>

      <div className="  py-16 flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
        <div className="flex flex-col max-w-[46.5625rem] items-center text-center ">
          <span className="unbounded-24-200 leading-[1.2]">
            Cysic's Hypercube Intermediate <br />
            Representation (IR) <br />
            is a&nbsp;
            <span className="unbounded-24-500">
              custom-built optimization layer
            </span>
            &nbsp;
            <br />
            between
          </span>
          <span
            className="unbounded-20-32-500 leading-[1.3]"
            style={{
              background:
                "linear-gradient(253.59deg, #E8D7E0 37.6%, #9D47FF 97.1%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            zk circuits and
            <br />
            hardware execution.
          </span>

          <span className="text-sm font-[400]">
            a fundamental shift in how zk proofs get mapped to hardware, making
            scalable zk computing truly possible. It restructures traditional zk
            circuit logic into a high-dimensional, hypercube-style data flow,
            enabling parallel execution, better memory access patterns,
            and reduced latency at the ASIC level.
          </span>
        </div>

        <div className="flex flex-col gap-6 lg:gap-12 items-center lg:items-start">
          <div>
            <p className="unbounded-36-64-500 flex items-center justify-center lg:justify-start">
              x <InViewFlip number="13" className="unbounded-36-64-500" />
            </p>
            <span className="uppercase !tracking-widest sub-title !text-base font-[400]">
              faster on one single chip
            </span>
          </div>
          <div>
            <p className="unbounded-36-64-500 flex items-center justify-center lg:justify-start">
              <InViewFlip number="131" className="unbounded-36-64-500" />
              .
              <InViewFlip number="31" className="unbounded-36-64-500" />M
            </p>
            <span className="uppercase !tracking-widest sub-title !text-base font-[400]">
              Keccak proofs/sec on our ZK-ASIC
            </span>
          </div>
        </div>
      </div>

      <div className="  py-16">
        <div className="unbounded-36-64-300 text-center pb-6 lg:pb-12 uppercase ">
          Key advantages
        </div>

        <div className={cn("flex flex-col lg:flex-row gap-4 lg:gap-6", container)}>
          <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
            <div className="!tracking-widest sub-title !text-2xl !font-[400]">
              Maximized
              <br />
              Parallelism
            </div>
            <div className="text-base !font-[400]">
              Breaks down complex circuits into independent compute blocks that
              can be processed simultaneously.
            </div>
          </GradientBorderCard>
          <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
            <div className="!tracking-widest sub-title !text-2xl !font-[400]">
              Memory
              <br />
              Efficiency
            </div>
            <div className="text-base !font-[400]">
              Reduces redundant data reads and writes during proof generation, a
              major bottleneck for zk hardware.
            </div>
          </GradientBorderCard>
          <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
            <div className="!tracking-widest sub-title !text-2xl !font-[400]">
              Hardware-
              <br />
              Friendly Design
            </div>
            <div className="text-base !font-[400]">
              Makes circuit logic naturally align with the capabilities of
              modern ASICs and GPU cores, squeezing out every drop of
              performance.
            </div>
          </GradientBorderCard>
          <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
            <div className="!tracking-widest sub-title !text-2xl !font-[400]">
              Scalable
              <br />
              Complexity
            </div>
            <div className="text-base !font-[400]">
              Supports massive circuits without the typical exponential cost
              explosion, critical for next-gen zk use cases like zkML,
              zkRollups, and recursive proofs.
            </div>
          </GradientBorderCard>
        </div>
      </div>

      <div className="w-full py-16 bg-gradient-to-r  from-[#9838FF] to-[#2C0B50]">
        <div className=" flex flex-col gap-6 items-center justify-center main-container">

        <div className="text-center">
          <div className="sub-title !text-base lg:!text-[24] !font-[400]">
            Interested in generating
          </div>
          <div className="unbounded-36-64-300">
            ZKP in real-time?
          </div>
        </div>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdC7cCKdV1MWuzMktSp5eDrTxVWPgu9Dj4zANXlxAMN85Nm9w/viewform" target="_blank">
          <Button
            className="sub-title !tracking-widest !text-base backdrop-blur-sm !p-6 text-white flex gap-2 uppercase"
            type="solid"
          >
            <span>inquire about our asic solutions</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </a>

        </div>
      </div>

      <div className="w-full uppercase text-center bg-white text-black py-4 unbounded-20-40-500">
        002. gpu Acceleration
      </div>

      <div className={cn("  flex flex-col lg:flex-row items-center pt-6 lg:pt-0", container)}>
        <div className="flex flex-col gap-4 max-w-[32.25rem] px-0 lg:px-12">
          <div className="unbounded-24-300">
            Ready to Use GPU-Enhanced ZK Proving Acceleration?
          </div>
          <p className="text-base !font-[400]">
            To comprehensively support various new ZK Proof systems, Cysic has
            developed GPU based hardware acceleration solutions for major proof
            backends such as Plonky2, Halo2, Gnark, RapdSnark, and many more.
            Cysic's in-house GPU implementation outperforms several open-source
            frameworks. We utilize this GPU SDK to provide proof acceleration
            services for multiple top-tier ZK projects. Leveraging our in-house
            CUDA SDK, Cysic offers the most powerful, efficient, and
            user-friendly ZK hardware acceleration services to ZK projects
            worldwide.
          </p>
        </div>
        <div className="flex-1">
          <img
            src={getImageUrl("@/assets/images/_global/zk_hardware_bg_3.png")}
            alt="zk_gpu"
          />
        </div>
      </div>

      <div className={cn("  w-full flex flex-col lg:flex-row gap-4 lg:gap-6 py-16", container)}>
        <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
          <div className="!tracking-widest sub-title !text-base lg:!text-2xl !font-[400]">
            Support
            <br />
            different GPU
            <br />
            cards
          </div>
        </GradientBorderCard>
        <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
          <div className="!tracking-widest sub-title !text-base lg:!text-2xl !font-[400]">
            Top Notch
            <br />
            Performance
          </div>
        </GradientBorderCard>
        <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
          <div className="!tracking-widest sub-title !text-base lg:!text-2xl !font-[400]">
            Accelerate
            <br />
            mainstream proof
            <br />
            backend
          </div>
        </GradientBorderCard>
      </div>

      {/* section-4 */}
      <div
        className="w-full h-screen bg-black flex items-center"
        style={{
          background: `url(${getImageUrl(
            "@/assets/images/_global/zk_hardware_bg_4.png"
          )}) no-repeat center center / cover`,
        }}
      >
        <div className="main-container  flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center text-center">
            <div className=" sub-title !text-base lg:!text-xl !font-[400]">
              GPU-Enhanced ZK Proving Acceleration
            </div>
            <div className="unbounded-36-96-300 !normal-case">ZKPoG</div>
          </div>
          <div className=" sub-title !text-base lg:!text-xl !font-[400] text-center">
            The first GPU platform to accelerate both witness generation and end-to-end ZKP computation.
          </div>

          <a
            href="https://x.com/cysic_xyz/status/1917772291083231530"
            target="_blank"
          >
            <Button
              className="sub-title !normal-case !tracking-widest !text-base backdrop-blur-sm !p-6 text-white flex gap-2 uppercase"
              type="solid"
            >
              <span>READ ABOUT ZKPoG</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </a>
        </div>
      </div>

      <div className="py-16 flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
        <div className="flex flex-col max-w-[46.5625rem] items-center text-center ">
          <span
            className="unbounded-24-32-500 leading-[1.3]"
            style={{
              background:
                "linear-gradient(253.59deg, #E8D7E0 37.6%, #9D47FF 97.1%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            cysic's zkpog
          </span>

          <span className="unbounded-24-200 leading-[1.2]">
            is&nbsp;
            <span className="unbounded-24-500">
              the first GPU-based proving stack
            </span>
            &nbsp; TO
          </span>
          <span
            className="unbounded-24-32-500 leading-[1.3]"
            style={{
              background:
                "linear-gradient(253.59deg, #E8D7E0 37.6%, #9D47FF 97.1%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            optimize every stage of ZK
          </span>

          <div className="flex flex-col gap-2">
            <span className="!font-[400] !text-sm sub-title !tracking-widest ">
              from witness generation to quotient polynomial
            </span>
            <span className="unbounded-24-200 ">
              all on a single consumer-grade GPU.
            </span>
            <span className="!font-[400] !text-sm sub-title !tracking-widest ">
              The foundation for fast, scalable, flexible proving across:{" "}
            </span>
            <span className="!font-[400] !text-sm sub-title !tracking-widest ">
              zkRollups, ZKML, Real apps in production.
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:gap-12">
          <div>
            <p className="unbounded-36-64-500 flex justify-center lg:justify-start items-center">
              x <InViewFlip number="52" className="unbounded-36-64-500" />
            </p>
            <p className="text-center lg:text-left uppercase !tracking-widest sub-title !text-base font-[400]">
              faster than CPU-based proving
            </p>
          </div>
          <div>
            <p className="unbounded-36-64-500 flex justify-center lg:justify-start items-center">
              x <InViewFlip number="22" className="unbounded-36-64-500" />
              .
              <InViewFlip number="8" className="unbounded-36-64-500" />
            </p>
            <p className="text-center lg:text-left uppercase !tracking-widest sub-title !text-base font-[400]">
              average speedup across real-world circuits
            </p>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="unbounded-36-64-300 text-center pb-12 uppercase">
          Key advantages
        </div>

        <div className={cn("flex flex-col lg:flex-row gap-6", container)}>
          <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
            <div className="!tracking-widest sub-title !text-2xl !font-[400]">
              Unmatched
              <br />
              Speed
            </div>
            <div className="text-base !font-[400]">
              ZKPoG accelerates the entire ZK proof pipeline — from witness
              generation to final verification — on consumer-grade GPUs. Achieve
              up to 52x faster performance compared to traditional CPU-based
              proving, cutting down processing time dramatically.
            </div>
          </GradientBorderCard>
          <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
            <div className="!tracking-widest sub-title !text-2xl !font-[400]">
              Real-World
              <br />
              Tested
            </div>
            <div className="text-base !font-[400]">
              ZKPoG has been battle-tested with real-world apps, from
              cryptographic operations like SHA256 to factorials and Fibonacci.
              Deploy ZK proof systems with confidence, backed by rigorous
              performance data.
            </div>
          </GradientBorderCard>
          <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
            <div className="!tracking-widest sub-title !text-2xl !font-[400]">
              Built for
              <br />
              Developers
            </div>
            <div className="text-base !font-[400]">
              Designed with developers in mind, ZKPoG makes integrating custom
              logic easy. Plug in your circuit, add custom gates, and let the
              platform auto-generate optimized CUDA and CPU code. No need for
              manual CUDA work, allowing you to focus on building, not
              configuring.
            </div>
          </GradientBorderCard>
          <GradientBorderCard className="p-4 lg:p-6 flex flex-col gap-4 flex-1 justify-between">
            <div className="!tracking-widest sub-title !text-2xl !font-[400]">
              Seamless
              <br />
              INTEGRATION
            </div>
            <div className="text-base !font-[400]">
              Run Plonkish circuits and leverage custom logic easily. ZKPoG
              supports the flexibility of custom gates and auto-compiles GPU
              code, eliminating the need for manual CUDA configuration. Tailor
              the platform to your specific circuit needs with minimal effort.
            </div>
          </GradientBorderCard>
        </div>
      </div>

      <div className="w-full py-16 bg-gradient-to-r  from-[#9838FF] to-[#2C0B50]">
        <div className="flex flex-col gap-6 items-center justify-center main-container text-center">
          <div >
            <div className="sub-title !text-[24] !font-[400]">Interested in</div>
            <div className="unbounded-32-64-300">
              GPU-accelerated ZKPs?
            </div>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdC7cCKdV1MWuzMktSp5eDrTxVWPgu9Dj4zANXlxAMN85Nm9w/viewform"
            target="_blank"
          >
            <Button
              className="sub-title !tracking-widest !text-base backdrop-blur-sm !p-6 text-white flex gap-2 uppercase"
              type="solid"
            >
              <span>Inquire about GPU-Accelerated ZKPs</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </a>
        </div>
      </div>
    </>
  );
};

export default HardwarePage;
