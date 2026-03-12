import GradientBorderCard from "@/components/GradientBorderCard";
import GradientNavDropdown from "@/components/GradientNavDropdown";
import {
  getImageUrl,
  handleLoginPersonalMessage,
  scrollToTop,
} from "@/utils/tools";
import { useState } from "react";
import { ArrowRight, Menu, ChevronDown } from "lucide-react";
import useNav from "@/hooks/useNav";
import { Link, useLocation } from "react-router-dom";
import {
  cn,
  Drawer,
  DrawerContent,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import Button from "@/components/Button";
import { createPortal } from "react-dom";
import { appUrl, isNewYear } from "@/config";
import useKrActivity from "@/models/kr";

const size = "full";

const MobileNavItem = ({
  nav,
  index,
  onClose,
  className,
  triggerClassName
}: {
  nav: any;
  index: number;
  onClose: () => void;
  className?: string;
  triggerClassName?: string;
}) => {
  const [openNavKey, setOpenNavKey] = useState<string | null>(null);

  const handleToggleNav = (key: string) => {
    setOpenNavKey((prev) => (prev === key ? null : key));
  };

  const hasChildren = nav?.children?.length;
  const itemKey = nav?.key || nav?.href || nav?.content || index;
  const isOpened = openNavKey === itemKey;

  if (hasChildren) {
    return (
      <div key={itemKey} className={cn("w-full")}>
        <button
          type="button"
          className={cn("flex w-full items-center justify-between text-xl !text-sub", triggerClassName)}
          onClick={() => handleToggleNav(itemKey)}
        >
          <span>
            {nav.content}{" "}
            {nav?.label && (
              <Button
                type="light"
                className="ml-2 scale-80 origin-center text-xs"
              >
                {nav.label}
              </Button>
            )}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              isOpened ? "rotate-180" : "rotate-0"
            )}
          />
        </button>

        <div
          className={cn(
            "overflow-hidden transition-[max-height] duration-300",
            isOpened ? "max-h-[1000px] mt-4" : "max-h-0",
            className
          )}
        >
          <div className="flex flex-col gap-4">
            {nav?.children?.map((child: any) => {
              const hasChildren = child?.children?.length;
              const childKey = child?.key || child?.href || child?.content;
              const isExternal =
                typeof child?.href === "string" &&
                (child.href.startsWith("http://") ||
                  child.href.startsWith("https://"));
              if (hasChildren) {
                return (
                  <MobileNavItem
                    key={childKey}
                    nav={child}
                    index={index}
                    onClose={onClose}
                    className="px-4"
                    triggerClassName="!text-base"
                  />
                );
              } else if (isExternal) {
                return (
                  <a
                    key={childKey}
                    href={child.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onClose}
                    className={cn(
                      "text-base !text-sub",
                      child?.disabled && "blur-[5px]"
                    )}
                  >
                    {child.content}{" "}
                    {child?.label && (
                      <Button
                        type="light"
                        className="scale-80 origin-center text-xs"
                      >
                        {child.label}
                      </Button>
                    )}
                  </a>
                );
              }

              return (
                <Link
                  key={childKey}
                  onClick={onClose}
                  to={child?.href}
                  className={cn(
                    "text-base !text-sub",
                    child?.disabled && "blur-[5px]"
                  )}
                >
                  {child.content}{" "}
                  {child?.label && (
                    <Button
                      type="light"
                      className="scale-80 origin-center text-xs"
                    >
                      {child.label}
                    </Button>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const isExternal =
    typeof nav?.href === "string" &&
    (nav.href.startsWith("http://") || nav.href.startsWith("https://"));

  if (isExternal) {
    return (
      <a
        key={itemKey}
        href={nav.href}
        target="_blank"
        rel="noreferrer"
        onClick={onClose}
        className={cn("text-xl !text-sub", nav?.disabled && "blur-[5px]")}
      >
        {nav.content}{" "}
        {nav?.label && (
          <Button type="light" className="scale-80 origin-center text-xs">
            {nav.label}
          </Button>
        )}
      </a>
    );
  }

  return (
    <Link
      key={itemKey}
      onClick={onClose}
      to={nav?.href || "/"}
      className={cn("text-xl !text-sub", nav?.disabled && "blur-[5px]")}
    >
      {nav.content}{" "}
      {nav?.label && (
        <Button type="light" className="scale-80 origin-center text-xs">
          {nav.label}
        </Button>
      )}
    </Link>
  );
};

export default function Header() {
  const { currentNavs } = useNav();
  const { user } = useKrActivity();
  const location = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = () => {
    onOpen();
  };

  // const handleOpenChange = (v: any)=>{
  //   if(v){
  //     document.body.style.overflow = 'auto'
  //   }else{
  //     document.body.style.overflow = 'hidden'
  //   }
  // }

  const handleScrollToTopInHome = () => {
    const path = location.pathname;
    if (path == "/") {
      scrollToTop();
    }
  };

  // useEffect(()=>{
  //   if(isOpen){
  //     document.body.style.overflow = 'auto'
  //   }
  // }, [isOpen])

  return (
    <>
      <>
        <div className="lg:hidden h-[5.625rem] flex items-center relative z-[1] flex-col">
          <div className="flex flex-wrap gap-3 relative w-full">
            <Button onClick={handleOpen}>
              <Menu width={30} height={30} />
            </Button>

            <Link
              to={"/"}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <img
                src={getImageUrl("@/assets/images/logo/cysic.svg")}
                className="w-[11.25rem]"
              />
            </Link>
          </div>
          {/* <Notify className="!px-4 w-screen" /> */}

          <Drawer
            isOpen={isOpen}
            size={size}
            onClose={onClose}
            shouldBlockScroll
            classNames={{ wrapper: "z-[51]" }}
          >
            <DrawerContent className="bg-[#090A09]">
              {(onClose) => (
                <>
                  <div className="h-[5.625rem] flex flex-wrap gap-3 relative w-full -z-[1]">
                    <Link
                      to={"/"}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <img
                        src={getImageUrl("@/assets/images/logo/cysic.svg")}
                        className="w-[11.25rem]"
                      />
                    </Link>
                  </div>

                  <div className="overflow-y-auto">
                    <div className="flex flex-col gap-6 overflow-hidden py-12 px-6 w-full">
                      {currentNavs?.map((nav: any, index: number) => {
                        return (
                          <MobileNavItem
                            key={index}
                            nav={nav}
                            index={index}
                            onClose={onClose}
                          />
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </>

      <>
        {createPortal(
          <div className="hidden lg:block main-container fixed top-0 z-[11] h-[8rem] w-full left-1/2 -translate-x-1/2">
            <div className="relative py-6">
              <GradientBorderCard className={cn(
                "h-20 flex items-center backdrop-blur",
                isNewYear ? "bg-new-year-1/20" : ""
              )}
              gradientFrom={isNewYear ? "var(--new-year-2)" : undefined}
              gradientTo={isNewYear ? "var(--new-year-2)" : undefined}
              >
                <div className="w-full h-full flex justify-between items-center">
                  <div className="flex items-center h-full flex-1">
                    <Link to={"/"} onClick={handleScrollToTopInHome}>
                      <img
                        src={getImageUrl("@/assets/images/logo/cysic.svg")}
                        className="flex-1 max-w-[11.25rem]"
                      />
                    </Link>

                    {currentNavs.map((nav: any) => (
                      <GradientNavDropdown
                        className={cn("flex-1 max-w-[11.25rem] text-center !transition-none",
                          isNewYear ? "!hover-bright-gradient_new_year !opacity-100 !scale-100" : ""
                        )}
                        key={nav.content}
                        item={nav}
                      />
                    ))}
                  </div>
                  <div className="h-full flex items-center justify-end w-[26.75rem]">
                    {window.location.href.includes("/kr") ? (
                      <>
                        {user?.id ? (
                          <Dropdown>
                            <DropdownTrigger>
                              <div className="px-10 w-fit h-full flex items-center justify-end gap-2 cursor-pointer hover:bg-gradient-to-r from-[#17D1B2] to-[#4C1F99] ">
                                <img
                                  src={
                                    user?.avatarURL ||
                                    getImageUrl(
                                      "@/assets/images/_global/stake_landing_bg.png"
                                    )
                                  }
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-sub font-[400] uppercase text-sm">
                                  {user?.userName}
                                </span>
                              </div>
                            </DropdownTrigger>
                            <DropdownMenu
                              className=""
                              onAction={(action) => {
                                if (action == "logout") {
                                  useKrActivity.getState().clearAll();
                                }
                              }}
                            >
                              <DropdownItem
                                key="logout"
                                className="text-danger"
                                color="danger"
                              >
                                Logout
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        ) : null}
                      </>
                    ) : (
                      <a
                        href={appUrl}
                        target="_blank"
                        className={cn(
                          "px-10 w-fit h-full flex items-center justify-end gap-1 cursor-pointer hover:bg-gradient-to-r from-brand to-brand-4 text-sub ",
                          isNewYear ? "from-new-year-1 to-new-year-2 hover:text-black" : "",
                          
                        )}
                      >
                        <span className={cn(
                          "font-[400] uppercase text-sm",
                        )}>
                          Get Started
                        </span>
                        <ArrowRight width={16} height={16} />
                      </a>
                    )}
                  </div>
                </div>
              </GradientBorderCard>

              {
                // @ts-ignore
                currentNavs?.[0]?.type == "subNav" && (
                  <div className="hidden lg:block main-container left-1/2 -translate-x-1/2 !px-4 absolute top-[calc(5rem+18px)] w-full">
                    <GradientBorderCard
                      gradientTo="rgba(255, 255, 255, 0)"
                      direction="0deg"
                      className="bg-gradient-to-t from-[#212121] to-[transparent] px-6 flex items-center h-[65px]"
                    >
                      {
                        // @ts-ignore
                        currentNavs?.[0]?.children?.map((i) => {
                          return (
                            <Link
                              to={i.href}
                              key={i.key}
                              className="flex-1 max-w-[11.25rem] p-6 flex items-center justify-center hover:bg-default/40"
                            >
                              <span className="teachers-14-400">
                                {i.content}{" "}
                                {i?.label && (
                                  <Button type="light">{i.label}</Button>
                                )}
                              </span>
                            </Link>
                          );
                        })
                      }
                    </GradientBorderCard>
                  </div>
                )
              }
            </div>

            {/* <Notify className="left-1/2 -translate-x-1/2 !px-4 absolute top-[calc(6.6rem)] w-screen" /> */}
          </div>,
          document.body
        )}
      </>
    </>
  );
}
