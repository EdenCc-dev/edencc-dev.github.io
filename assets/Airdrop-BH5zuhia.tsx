import Button from "@/components/Button";
import { appUrl } from "@/config";
import { cn } from "@nextui-org/react";
import { useCountDown } from "ahooks";
import { ArrowRight } from "lucide-react";

const AIRDROP_CLAIM_END_TIME = new Date("Sun Dec 21 2025 18:00:00 GMT+0800");
const claimCysTime = new Date("Thu Dec 11 2025 18:20:00 GMT+0800");
const claimDefaultTime = new Date("Thu Dec 11 2025 18:00:00 GMT+0800");

const CountdownButton = ({
  targetTime,
  children,
}: {
  targetTime: Date;
  children: React.ReactNode;
}) => {
  const [countdown, formattedRes] = useCountDown({
    targetDate: targetTime,
    onEnd: () => {
      console.log("end");
    },
  });

  if (countdown > 0) {
    return (
      <Button type="solid" className="flex items-center gap-4 py-6">
        <span className="teachers-16-400">
          Start in {formattedRes.days}D:{formattedRes.hours}H:
          {formattedRes.minutes}M:{formattedRes.seconds}S
        </span>
      </Button>
    );
  }
  return children;
};

export const CysClaimButton = () => {
  return (
    <CountdownButton targetTime={claimCysTime}>
      <a href="https://cysicfoundation.org/userPortal" target="_blank">
        <Button type="solid" className="flex items-center gap-4 py-6">
          <span className="teachers-16-400">claim CYS</span>
          <ArrowRight className="size-4 " />
        </Button>
      </a>
    </CountdownButton>
  );
};

const airdropConfig = [
  // {
  //   background:
  //     "bg-[url('@/assets/images/_global/airdrop.png')] bg-cover bg-center",
  //   title: (
  //     <>
  //       Airdrop
  //       <br />
  //       Now Live!
  //     </>
  //   ),
  //   desc: <>Check your eligibility and claim your CYS now.</>,
  //   button: (
  //     <CountdownButton targetTime={claimDefaultTime}>
  //         {/* <a href="https://claim.cysicfoundation.org/" target="_blank"> */}
  //           <Button disabled type="solid" className="flex items-center gap-4 py-6">
  //             <span className="teachers-16-400">claim airdrop</span>
  //             <ArrowRight className="size-4 " />
  //           </Button>
  //         {/* </a> */}
  //     </CountdownButton>
  //   ),
  // },
  {
    background:
      "bg-[url('@/assets/images/_global/airdrop-cgt.png')] bg-cover bg-center",
    title: (
      <>
        nft to cys
        <br />
        Redemption
      </>
    ),
    desc: <>50% unlock at TGE, 50% linear unlock over 6 months.</>,
    button: <CysClaimButton />,
  },
  // {
  //   background:
  //     "bg-[url('@/assets/images/_global/airdrop-cgt.png')] bg-cover bg-center",
  //   prefixTitle: <>Connect your Keplr wallet to check your CGT rewards.</>,
  //   title: <>CGT Airdrop</>,
  //   button: (
  //     <CountdownButton targetTime={claimDefaultTime}>
  //       {/* <a href={appUrl + "/userPortal"} target="_blank"> */}
  //         <Button disabled type="solid" className="flex items-center gap-4 py-6">
  //           <span className="teachers-16-400">claim CGT</span>
  //           <ArrowRight className="size-4 " />
  //         </Button>
  //       {/* </a> */}
  //     </CountdownButton>
  //   ),
  // },
];

export const Airdrop = () => {
  return (
    <>
      {airdropConfig.map((item, index) => {
        return (
          <div key={index} className={cn("h-screen w-full", item.background)}>
            <div className="h-full flex flex-col gap-12 items-center justify-center px-3">
              <div className="flex flex-col gap-4 items-center">
                {item?.prefixTitle && (
                  <div className="teachers-16-24-400 tracking-widest lg:tracking-[6px] text-center">
                    {item.prefixTitle}
                  </div>
                )}
                <div className="unbounded-36-96-200 text-center">
                  {item.title}
                </div>
                {item?.desc && (
                  <div className="teachers-18-400 text-sub text-center">
                    {item.desc}
                  </div>
                )}
              </div>
              {item.button}
            </div>
          </div>
        );
      })}
    </>
  );
};
