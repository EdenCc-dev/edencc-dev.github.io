import GradientBorderCard from "@/components/GradientBorderCard";
import { Divider } from "@nextui-org/react";
import { cn } from "@nextui-org/react";
import { getImageUrl } from "@/utils/tools";
import { Stamp } from "@/routes/pages/Kr/krApi";
import { useTranslation } from "react-i18next";
import Copy from "@/components/Copy";

interface ProfileSectionProps {
    user: {
        id?: string;
        twitterName?: string;
        avatarURL?: string;
        relatedURL?: string;
        points?: number;
    } | null;
    stampList: Stamp[];
}

export const ProfileSection = ({ user, stampList }: ProfileSectionProps) => {
    const { t } = useTranslation();
    const totalPoints = user?.points || 0;

    const earnedLength = stampList?.filter(i=>i?.earnedAt > 0)?.length
    return (
        <GradientBorderCard borderRadius={8} className="w-full p-4">
            <>
                <div className="flex items-center justify-between gap-4">
                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <img
                            src={
                                user?.avatarURL ||
                                getImageUrl("@/assets/images/_global/stake_landing_bg.png")
                            }
                            className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                        />
                        <div className="flex flex-col gap-1">
                            <span className="unbounded-18-200 text-white">
                                {user?.userName || "-"}
                            </span>
                            <Copy value={user?.address || "-"} className="teachers-16-200 text-white/80 normal-case">
                                {user?.address || "-"}
                            </Copy>
                            <a
                                href={user?.relatedURL}
                                target="_blank"
                                className="cursor-pointer size-5"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="12" cy="12" r="12" fill="white" />
                                    <path
                                        d="M12.9989 11.3988L16.9078 6H15.9815L12.5874 10.6877L9.87662 6H6.75L10.8493 13.0886L6.75 18.75H7.67633L11.2605 13.7997L14.1234 18.75H17.25L12.9987 11.3988H12.9989ZM11.7302 13.151L11.3148 12.4452L8.0101 6.82855H9.43288L12.0999 11.3613L12.5152 12.0672L15.9819 17.9591H14.5592L11.7302 13.1513V13.151Z"
                                        fill="black"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3">
                        {/* Total Points */}
                        <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-[8px] bg-white/10 border border-white/20">
                            <span className="text-white/60 text-xs uppercase tracking-wide">
                                {t('points')}
                            </span>
                            <span className="unbounded-18-400 text-white">{totalPoints}</span>
                        </div>

                        {/* Stamp Count */}
                        <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-[8px] bg-white/10 border border-white/20">
                            <span className="text-white/60 text-xs uppercase tracking-wide">
                                {t('stamps')}
                            </span>
                            <span className="unbounded-18-400 text-white">
                                {earnedLength || 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stamp Collection */}
                {stampList?.length > 0 && (
                    <>
                        <Divider className="my-4" />
                        <div className="flex flex-col gap-2">
                            <span className="unbounded-14-300 text-white/80 uppercase tracking-wide">
                                {t('cysicEmblems')}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {stampList?.map((stamp: Stamp) => {
                                    const isEarned = stamp.earnedAt > 0;
                                    return (
                                        <div
                                            key={stamp.id}
                                            className={cn(
                                                "relative size-8 rounded-lg overflow-hidden transition-all",
                                                isEarned
                                                    ? ""
                                                    : "grayscale"
                                            )}
                                        >
                                            <img
                                                src={stamp.imgUrl}
                                                className="w-full h-full object-cover"
                                                alt={stamp.name}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </>
        </GradientBorderCard>
    );
};

