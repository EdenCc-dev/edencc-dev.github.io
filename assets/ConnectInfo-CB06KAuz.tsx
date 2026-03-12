import { getImageUrl, shortStr, handleFaucetModal } from "@/utils/tools";

import { DropdownMenu, DropdownItem, Tooltip } from "@nextui-org/react";
import Copy from "@/components/Copy";
import Button from "@/components/Button";
import useAccount from "@/hooks/useAccount";
import ConnectCosmosButton from "@/components/connectCosmosButton";
import { Link, useLocation } from "react-router-dom";
import useUser from "@/models/user";
import { useWriteContract } from "@/hooks/useWriteContract";
import { ArrowRight, LaptopMinimal as LaptopMinimalCheck } from "lucide-react";
import HoverDropdown from "@/components/HoverDropdown";
import { useState } from "react";
import { useLogout } from "@/hooks/useLogout";
import { easterEggVisible } from "@/config";

const ConnectInfo = () => {
  // 使用新的useAccount获取状态
  const { address, connector, avatarUrl, inviteCode } = useAccount();

  const { logout } = useLogout();
  const { reset } = useUser();

  const [loading, setLoading] = useState(false);
  // 处理断开连接
  const handleEVMDisconnect = async () => {
    try {
      setLoading(true);
      await logout();
      reset();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 处理测试代币领取
  const { writeContractAsync } = useWriteContract();

  const pathname = useLocation().pathname;

  return (
    <>

      {
        easterEggVisible['2025_06_02'] && (
          <Tooltip disableAnimation delay={0} closeDelay={0} content={<div className="!normal-case py-2 px-4 max-w-[12.625rem] text-center teachers-14-400 text-sub">In this new era, compute is the new oil. We’re the refinery.</div>}>
            <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 mr-4 size-[1.875rem] rounded-full border flex items-center justify-center">
              {/* <LaptopMinimalCheck className="w-4 h-4" /> */}
              <img src="/mediakits/symbol_gradient.svg" className="w-6 h-6" />
            </div>
          </Tooltip>
        )
      }


      {/* {
      easterEggVisible['2025_06_02'] && (
        <div className="!normal-case flex-1 pr-4 text-center teachers-12-400 text-sub">In this new era, compute is the new oil. We’re the refinery.</div>
      )
    } */}


      <Button needLoading className="!p-0" onClick={handleFaucetModal}>
        <img
          src={getImageUrl("@/assets/images/icon/faucet.svg")}
          className="rounded-full w-[1.875rem] h-[1.875rem]"
        />
      </Button>

      <HoverDropdown
        trigger={
          <div className="px-6 flex items-center gap-4 cursor-pointer">
            <div className="flex items-center gap-2">
              <img
                src={
                  connector?.icon ||
                  getImageUrl("@/assets/images/tokens/CYS.svg")
                }
                className="rounded-full w-[1.875rem] h-[1.875rem]"
              />
              <span className="text-sm text-sub font-[400] uppercase">
                {shortStr(address || "", 10)}
              </span>
            </div>

            <img
              src={avatarUrl || ""}
              className="rounded-full w-[1.875rem] h-[1.875rem] bg-[#D9D9D9]"
            />
          </div>
        }
      >
        <DropdownMenu
          className="p-0 min-w-[330px] backdrop-blur gradient-border-card bg-[transparent] rounded-lg overflow-hidden"
          variant="flat"
          itemClasses={{
            base: "hover:!opacity-100 text-sub uppercase transition-colors hover-bright-gradient",
          }}
        >
          <DropdownItem
            as={Link}
            to={pathname.includes("/zk") ? "/zk/userPortal" : "/userPortal"}
            key="user-portal"
            className="py-4 px-6 flex items-center gap-2 [&>span]:flex [&>span]:items-center [&>span]:justify-between "
          >
            <div className="flex items-center gap-2">
              <img
                src={avatarUrl || ""}
                className="rounded-full w-[1.875rem] h-[1.875rem] bg-[#D9D9D9]"
              />
              <span>User Portal</span>
            </div>
          </DropdownItem>

          <DropdownItem key="evm-disconnect" className="!p-0">
            <div
              className="py-4 px-6 flex items-center gap-2 justify-between w-full"
              onClick={handleEVMDisconnect}
            >
              <div className="flex items-center gap-2 w-full">
                <img
                  src={
                    connector?.icon ||
                    getImageUrl("@/assets/images/tokens/CYS.svg")
                  }
                  className="rounded-full w-[1.875rem] h-[1.875rem]"
                />
                <span className="text-sm text-sub font-[400] uppercase">
                  {shortStr(address || "", 10)}
                </span>
              </div>

              <Button
                loading={loading}
                needLoading
                type="text"
                className="uppercase !px-0"
              >
                disconnect
              </Button>
            </div>
          </DropdownItem>

          <DropdownItem key="cosmos-disconnect" className="!p-0">
            <ConnectCosmosButton />
          </DropdownItem>

          <DropdownItem key="referral-code" className="!p-0">
            <Copy
              value={inviteCode}
              className="flex items-center gap-2 justify-between py-4 px-6"
            >
              <span className="">Referral Code</span>
              <span className="ml-auto">{inviteCode || "-"}</span>
            </Copy>
          </DropdownItem>

          <DropdownItem
            as={Link}
            to={'/zk/invite'}
            key="check-invite"
            className="py-4 px-6 "
          >
            <div className="flex items-center gap-2 text-[#00F0FF]">
              <span>Check invite details</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </DropdownItem>
        </DropdownMenu>
      </HoverDropdown>
    </>
  );
};

export default ConnectInfo;
