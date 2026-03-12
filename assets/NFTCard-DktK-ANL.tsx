import GradientBorderCard from "@/components/GradientBorderCard";
import Button from "@/components/Button";
import { Pencil } from "lucide-react";
import { getImageUrl } from "@/utils/tools";
import { cn } from "@nextui-org/react";
import { isMobile } from "react-device-detect";

const NFTProverCard = ({ status, className }: { status: { nft: boolean }, className?: string }) => {
    return (
        <GradientBorderCard
            borderRadius={8}
            className={className}
        >
            <div className="w-full px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className={cn("flex flex-col", isMobile ? "col-span-8" : "col-span-4 ")}>
                        <div className="bg-gray-300 w-full flex-1 rounded-lg mb-3 aspect-square max-w-[12rem] mx-auto"></div>
                        <div className={cn("flex items-center gap-2 mb-2", isMobile ? "justify-center" : "")}>
                            <div className={`w-3 h-3 rounded-full ${status.nft ? 'bg-lightBrand' : 'bg-error'}`}></div>
                            <span className="uppercase">NFT ACTIVE</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2 text-sm !font-[400]">
                            <div className="text-sub ">Chip</div>
                            <div className="text-right">Intel</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4 text-sm !font-[400]">
                            <div className="text-sub ">Computing Power</div>
                            <div className="text-right">50 TH</div>
                        </div>
                        <Button
                            type="light"
                            className="py-3 !font-[400] text-base w-full rounded-lg"
                        >
                            EXTEND
                        </Button>
                    </div>

                    <div className="col-span-8">
                        <div className="flex justify-between items-center mb-4 text-3xl !font-[400] ">
                            <h3 className="uppercase">ZK Dust Harvester</h3>
                            <span>x3</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="text-sub">Purchase Price</div>
                            <div className="text-right flex items-center justify-end gap-1">
                                888 USDC <Pencil width={12} height={12} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-1">
                            <div className="text-sub">Current Earnings Efficiency</div>
                            <div className="text-right">
                                39.80 CYS + 32.29 CGT /Day
                                <div className="text-xs text-green-400 flex items-center gap-1 justify-end"><img src={getImageUrl('@/assets/images/icon/flash.svg')} /> Ultra Speed Applied</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <div className="text-sub">Maintenance Fee</div>
                            <div className="text-right">3.23 CYS/Day</div>
                        </div>

                        <div className="border-t border-white/10 my-4"></div>

                        <div className="grid grid-cols-2 gap-2 mb-1">
                            <div className="text-sub">Realized Earnings</div>
                            <div className="text-right">39.80 CYS + 32.29 CGT</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-1">
                            <div className="text-sub">Realized Net Earnings</div>
                            <div className="text-right">30.80 CYS + 32.29 CGT</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-1">
                            <div className="text-sub">Estimated Remaining Earnings</div>
                            <div className="text-right">3092.23 CYS + 2332.23 CGT</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <div className="text-sub">Estimated Remaining Net Earnings</div>
                            <div className="text-right">3000.23 CYS + 2332.23 CGT</div>
                        </div>

                        <div className="border-t border-white/10 my-4"></div>

                        <div className="grid grid-cols-2 gap-2 mb-1">
                            <div className="text-sub">Start Time</div>
                            <div className="text-right">Mar 29, 1:23PM UTC</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-sub">End In</div>
                            <div className="text-right">10 Days</div>
                        </div>
                    </div>
                </div>
            </div>
        </GradientBorderCard>
    )
}

export default NFTProverCard;