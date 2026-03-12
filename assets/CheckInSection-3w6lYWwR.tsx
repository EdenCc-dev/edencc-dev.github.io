import GradientBorderCard from "@/components/GradientBorderCard";
import { Calendar1Icon, CalendarCheckIcon, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Calendar, cn, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";



const min = dayjs('2025-10-29');
interface DayItem {
    timestamp: number;
    format: string;
    formatWithMonth: string;
    isToday: boolean;
}

interface CheckInSectionProps {
    signInList: string[];
    ifActive: boolean;
}

function getNextMonthDays(): DayItem[] {
    const firstDayOfWeek = dayjs(Math.max(dayjs().subtract(7, 'day').valueOf(), min.valueOf())).startOf("day");
    const lastDayOfWeek = dayjs().add(1, "month").endOf("day");
    const today = dayjs();
    const days: DayItem[] = [];

    for (let i = firstDayOfWeek; i <= lastDayOfWeek; i = i.add(1, "day")) {
        days.push({
            timestamp: i.valueOf(),
            format: i.format("DD"),
            formatWithMonth: i.format("YYYY-MM-DD"),
            isToday: i.isSame(today, "day"),
        });
    }

    return days;
}

export const CheckInSection = ({ signInList, ifActive }: CheckInSectionProps) => {
    const { t } = useTranslation();
    const [last7, setLast7] = useState<DayItem[]>([]);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        const res = getNextMonthDays();
        setLast7(res);
    }, []);

    // 滚动到今天的位置
    useEffect(() => {
        if (scrollContainer && last7.length > 0) {
            const todayIndex = last7.findIndex((item) => item.isToday);
            if (todayIndex !== -1) {
                const targetElement = scrollContainer.children[todayIndex] as HTMLElement;
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center",
                    });
                }
            }
        }
    }, [scrollContainer, last7]);

    // 检查滚动位置，显示/隐藏箭头
    useEffect(() => {
        if (!scrollContainer) return;

        const updateArrows = () => {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        };

        updateArrows();
        scrollContainer.addEventListener("scroll", updateArrows);

        return () => {
            scrollContainer.removeEventListener("scroll", updateArrows);
        };
    }, [scrollContainer]);

    const activeList = signInList || [];
    const signInSet = new Set(activeList.map((d) => d));

    const minSignInStr = activeList[0];
    const maxSignInStr = activeList.length > 0 ? activeList[activeList.length - 1] : undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const minSignInDate: any = minSignInStr ? parseDate(minSignInStr) : undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maxSignInDate: any = maxSignInStr ? parseDate(maxSignInStr) : undefined;

    // 滚动函数
    const scrollLeft = () => {
        if (scrollContainer) {
            scrollContainer.scrollBy({ left: -100, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainer) {
            scrollContainer.scrollBy({ left: 100, behavior: "smooth" });
        }
    };

    return (
        <GradientBorderCard borderRadius={8} className="w-full p-4">
            <>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-1 unbounded-18-200">
                        <Calendar1Icon className="stroke-[1px] size-6" />
                        <div className="flex flex-col ">
                            <Tooltip
                                delay={0}
                                disableAnimation
                                closeDelay={0}
                                content={
                                    <div className="py-2 flex flex-col gap-1 text-white/80">
                                        <span className="mb-1">출석체크는 4주 캠페인이 종료된 시점, 포인트로 전환됩니다! </span>
                                        <span>
                                            🏆 7일 연속 달성시, 추가 포인트가 제공됩니다
                                        </span>
                                        <span>
                                            👑 4주 연속 달성시, 개근상 스탬프가 제공됩니다
                                        </span>
                                    </div>
                                }
                            >
                                <p className="flex items-center gap-1">
                                    {t('dailyCheckIn')} <Info className="size-3" />{" "}
                                </p>
                            </Tooltip>

                            <span className="text-white/80 text-xs !normal-case">
                                {t('checkInEveryDayToMaintainStreak')}
                            </span>
                        </div>
                    </div>


                    <div className="flex items-center gap-3">
                        <Popover placement="bottom-end" >
                            <PopoverTrigger>
                                <button
                                    type="button"
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-[8px] bg-white/10 border border-white/20 h-14",
                                        ifActive ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                                    )}
                                    disabled={!ifActive}
                                >
                                    <CalendarCheckIcon className="size-6" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="p-2 bg-black border border-white/20">
                                <I18nProvider locale="ko-KR-u-ca-gregory">
                                    <Calendar
                                        aria-label="Check-in calendar"
                                        className="bg-transparent text-white rounded-md"
                                        visibleMonths={2}
                                        minValue={minSignInDate}
                                        maxValue={maxSignInDate}
                                        isDateUnavailable={(date) => !signInSet.has(String(date))}
                                        isReadOnly
                                        lang="kr"
                                        classNames={{
                                            content: 'rounded-md',
                                            cellButton: cn(
                                                "p-1",
                                                '[&:not([data-unavailable=true])_span]:flex [&:not([data-unavailable=true])_span]:items-center [&:not([data-unavailable=true])_span]:justify-center [&:not([data-unavailable=true])_span]:bg-white [&:not([data-unavailable=true])_span]:text-black [&:not([data-unavailable=true])_span]:rounded-full [&:not([data-unavailable=true])_span]:size-full',
                                                "data-[unavailable=true]:no-underline data-[unavailable=true]:bg-transparent ",
                                            ),
                                        }}
                                    />
                                </I18nProvider>
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-[8px] bg-white/10 border border-white/20">
                            <span className="text-white/60 text-xs uppercase tracking-wide">
                                {t('streak')}
                            </span>
                            <span className="unbounded-18-400 text-white">
                                {signInList?.length || 0}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                    <div className="text-left">{t('checkInCalendar')}</div>
                    <div className="relative w-full">
                        {/* 左侧渐变阴影遮罩 */}
                        {showLeftArrow && (
                            <div
                                className="absolute left-0 top-0 bottom-0 w-12 z-20 pointer-events-none"
                                style={{
                                    background:
                                        "linear-gradient(to right, rgba(0, 0, 0, 1) 0%, transparent 100%)",
                                }}
                            />
                        )}

                        {/* 右侧渐变阴影遮罩 */}
                        {showRightArrow && (
                            <div
                                className="absolute right-0 top-0 bottom-0 w-12 z-20 pointer-events-none"
                                style={{
                                    background:
                                        "linear-gradient(to left, rgba(0, 0, 0, 1) 0%, transparent 100%)",
                                }}
                            />
                        )}

                        {/* 左侧箭头按钮 */}
                        {showLeftArrow && (
                            <button
                                onClick={scrollLeft}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-30  rounded-full p-1 transition-all"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="size-4 " />
                            </button>
                        )}

                        {/* 右侧箭头按钮 */}
                        {showRightArrow && (
                            <button
                                onClick={scrollRight}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-30  rounded-full p-1 transition-all"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="size-4 " />
                            </button>
                        )}

                        {/* 滚动容器 */}
                        <div
                            ref={setScrollContainer}
                            className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {last7?.map((item, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "min-w-[40px] relative opacity-30 text-black bg-white flex flex-col gap-1 pt-1 items-center justify-center rounded-[6px] text-center aspect-[1/1.1] shadow-md",
                                            activeList.includes(item?.formatWithMonth) &&
                                            "opacity-100 bg-white text-black shadow-lg",
                                            item.isToday && "ring-2 ring-blue-500"
                                        )}
                                    >
                                        <span>{item.format}</span>
                                        <span
                                            className={cn(
                                                !activeList.includes(item?.formatWithMonth) &&
                                                "grayscale",
                                                ""
                                            )}
                                        >
                                            🔥
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </>
        </GradientBorderCard>
    );
};

