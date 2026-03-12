// https://github.com/heroui-inc/heroui/issues/2269
import { DropdownMenu, DropdownItem, Button, cn } from "@nextui-org/react";
import CButton from "@/components/Button";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as NextUILink } from "@nextui-org/react";
import HoverDropdown from "@/components/HoverDropdown";

interface NavItem {
  label: any;
  key: string;
  content: string;
  type?: string;
  href?: string;
  children?: NavItem[];
  disabled?: boolean;
}

interface GradientNavDropdownProps {
  item: NavItem;
  className?: string;
  classNames?: any;
  side?: "left" | "right" | "top" | "bottom";
}

export default function GradientNavDropdown({
  item,
  className,
  classNames,
  side,
}: GradientNavDropdownProps) {
  const navigate = useNavigate();

  const isExternalLink = (url?: string) => {
    return url?.startsWith("http://") || url?.startsWith("https://");
  };

  const handleNavigation = (url?: string) => {
    if (!url) return;

    if (isExternalLink(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate(url);
    }
  };

  if (!item?.children || item?.children?.length == 0) {
    if (isExternalLink(item.href)) {
      return (
        <Button
          as={NextUILink}
          href={item.href}
          variant="light"
          className={cn(
            "uppercase font-[400] !text-sub h-full rounded-none relative",
            className
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.content}{" "}
          {item?.label && (
            <CButton
              className="w-fit !px-2 text-xs absolute top-3/5 -translate-y-full right-0 origin-right scale-75 !py-1"
              type="light"
            >
              {item?.label}
            </CButton>
          )}
        </Button>
      );
    } else {
      return (
        <Button
          as={RouterLink}
          to={item.href || "/"}
          variant="light"
          className={cn(
            "uppercase font-[400] !text-sub h-full rounded-none relative",
            className
          )}
        >
          {item.content}{" "}
          {item?.label && (
            <CButton
              className="w-fit !px-2 text-xs absolute top-3/5 -translate-y-full right-0 origin-right scale-75 !py-1"
              type="light"
            >
              {item?.label}
            </CButton>
          )}
        </Button>
      );
    }
  }

  const disabledKeys = item?.children
    ?.filter((i: any) => i.disabled)
    .map((i) => i.key);

  if (item?.type == "subNav") {
    return (
      <>
        <Button
          as={item?.href ? RouterLink : "div"}
          to={item?.href ? item.href : null}
          variant="light"
          className={cn(
            "uppercase font-[400] text-sub w-full h-full rounded-none flex-1 max-w-[11.25rem]"
          )}
        >
          {item.content}
        </Button>
      </>
    );
  }

  return (
    <HoverDropdown
      placement={side || "bottom-center"}
      className={cn(className, "h-full ")}
      classNames={{
        ...classNames,
        content: cn("p-0 !pt-2 -mt-1 bg-[transparent]", classNames?.content),
      }}
      trigger={
        <Button
          // as={item?.href ? RouterLink : "div"}
          as={RouterLink}
          to={item?.href ? item.href : null}
          variant="light"
          className={cn(
            "uppercase font-[400] text-sub w-full h-full rounded-none",
            className
          )}
        >
          {item.content}
        </Button>
      }
    >
      <DropdownMenu
        disabledKeys={disabledKeys}
        style={{
          "--gradient-direction": "0deg",
        }}
        aria-label={`${item.content} submenu`}
        className="p-0 min-w-[180px] bg-[#090A09B2] backdrop-blur gradient-border-card rounded-lg overflow-hidden"
        variant="flat"
        itemClasses={{
          base: cn("hover:!opacity-100 text-sub uppercase "),
        }}
      >
        {item.children.map((child) => {
          if (child?.children?.length) {
            console.log("child", child);
            return (
              <DropdownItem
                key={child.key}
                className="p-0 text-sm text-center"
              >
                <GradientNavDropdown
                  item={child}
                  side="right"
                  classNames={{
                    content: cn("!p-0 m-0"),
                    trigger: cn("py-6 px-4 hover-bright-gradient hover-bright-gradient_new_year !scale-100"),
                  }}
                />
              </DropdownItem>
            );
          } else if (isExternalLink(child.href)) {
            return (
              <DropdownItem
                key={child.key}
                className="py-6 px-4 text-sm text-center hover-bright-gradient hover-bright-gradient_new_year"
                onPress={() => handleNavigation(child.href)}
              >
                {child.content}
              </DropdownItem>
            );
          } else {
            return (
              <DropdownItem
                key={child.content}
                className={cn(
                  "py-6 px-4 text-sm text-center relative",
                  !child?.disabled ? "hover-bright-gradient hover-bright-gradient_new_year" : ""
                )}
                onPress={() =>
                  child.disabled ? null : handleNavigation(child.href)
                }
              >
                {child?.disabled ? (
                  <div className="blur-[3px]">
                    <span>{child.content}</span>
                  </div>
                ) : (
                  child.content
                )}
              </DropdownItem>
            );
          }
        })}
      </DropdownMenu>
    </HoverDropdown>
  );
}
