import { useState, useEffect } from "react";
import useModalState from "@/hooks/useModalState";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { formatReward, getImageUrl, handleConvertModal, handleReserveModal, handleStakeModal } from "@/utils/tools";
import { useRequest } from "ahooks";
import axios from "@/service";
import useAccount from "@/hooks/useAccount";
import { cn } from "@nextui-org/react";
import { isMobile } from "react-device-detect";
import BigNumber from "bignumber.js";

// 阶段枚举
enum RewardPhase {
    PHASE_I = "PHASE I",
    PHASE_II = "PHASE II",
    PHASE_III = "PHASE III"
}

const RewardsDetailModal = () => {
    const { isBinded, isSigned, address } = useAccount()
    // 获取模态框状态
    const { visible, setVisible, data } = useModalState({
        eventName: "modal_rewards_detail_visible",
    });

    // 状态管理
    const [activePhase, setActivePhase] = useState<RewardPhase>(RewardPhase.PHASE_I);

    // 初始化时设置正确的阶段
    useEffect(() => {
        if (visible && data?.phase) {
            switch (data.phase) {
                case "phase1":
                    setActivePhase(RewardPhase.PHASE_I);
                    break;
                case "phase2":
                    setActivePhase(RewardPhase.PHASE_II);
                    break;
                case "phase3":
                    setActivePhase(RewardPhase.PHASE_III);
                    break;
                default:
                    setActivePhase(RewardPhase.PHASE_I);
            }
        }
    }, [visible, data]);

    // 使用 useRequest 获取奖励数据
    const { data: phasesData, loading, run } = useRequest(
        async () => {
            const requests = [
                axios.get('/api/v1/zkTask/reward/phase1'),
                axios.get('/api/v1/zkTask/reward/phase2'),
                axios.get('/api/v1/zkTask/reward/phase3')
            ];

            const results = await Promise.allSettled(requests);

            return {
                phase1: results[0].status === 'fulfilled' ? results[0].value.data : null,
                phase2: results[1].status === 'fulfilled' ? results[1].value.data : null,
                phase3: results[2].status === 'fulfilled' ? results[2].value.data : null
            };
        },
        {
            refreshDeps: [visible, isSigned, address],
            ready: visible && isSigned && !!address,
        }
    );

    // 处理阶段切换
    const handlePhaseChange = (phase: RewardPhase) => {
        setActivePhase(phase);
    };

    // 关闭模态框
    const handleClose = () => {
        setVisible(false);
    };

    // 处理确认按钮点击
    const handleConfirm = () => {
        setVisible(false);
    };

    // 处理领取奖励
    const handleClaim = async () => {
        await axios.get(`/api/v1/zkTask/reward/phase2/claim`)
        run()
    };

    // 渲染 Phase I 内容
    const renderPhaseI = () => {
        const phase1 = phasesData?.phase1;

        if (loading || !phase1) {
            return <div className="text-center py-8">Loading...</div>;
        }

        const totalPoints = BigNumber(phase1?.activity || 0).plus(phase1.staking || 0).toString();

        return (
            <div className="space-y-4">
                <div className="border border-[#333] rounded-lg px-6 py-4">
                    <div className="flex justify-between items-center">
                        <span className={cn("unbounded-18-36-300")}>Total Points</span>
                        <span className={cn("unbounded-18-36-300", isMobile ? "!text-[18px]" : "!text-3xl")}>{formatReward(totalPoints, 4, true)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 gap-6 text-sm">
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-sub">Activity</span>
                            <span>{formatReward(phase1.activity, 4, true)}</span>
                        </div>
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-sub">Staking</span>
                            <span>{formatReward(phase1.staking, 4, true)}</span>
                        </div>
                    </div>
                </div>
                <Button
                    type="light"
                    className="w-full py-4 rounded-lg text-base font-[400] mt-4"
                    onClick={handleConfirm}
                >
                    CONFIRM
                </Button>
            </div>
        )
    };

    // 渲染 Phase II 内容
    const renderPhaseII = () => {
        const phase2 = phasesData?.phase2;

        if (loading || !phase2) {
            return <div className="text-center py-8">Loading...</div>;
        }

        return (
            <div className="space-y-4">
                <div className="border border-[#333] rounded-lg px-6 py-4">
                    <div className="flex justify-between items-center">
                        <span className={cn("unbounded-18-36-300")}>Claimable</span>
                        <span className={cn("unbounded-18-36-300")}>{formatReward(phase2.claimable, 4, true)}</span>
                        <Button
                            needLoading
                            disabled={!Number(phase2?.claimable)}
                            type="light"
                            className="px-6 py-2 rounded-lg text-base font-[400]"
                            onClick={handleClaim}
                        >
                            CLAIM
                        </Button>
                    </div>
                </div>

                <div className="border border-[#333] rounded-lg px-6 py-4">
                    <div className="flex justify-between items-center border-b border-[#FFFFFF4D] pb-2">
                        <span className={cn("unbounded-18-36-300")}>Total CYS</span>
                        <span className={cn("unbounded-18-36-300")}>{formatReward(phase2.cys.total, 4, true)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 gap-6 text-sm">
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-sub">Prover</span>
                            <span>{formatReward(phase2.cys.prover, 4, true)}</span>
                        </div>
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-sub">Verifier</span>
                            <span>{formatReward(phase2.cys.verifier, 4, true)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 gap-6 text-sm">
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-sub">Activity</span>
                            <span>{formatReward(phase2.cys.activity, 4, true)}</span>
                        </div>
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-sub">Staking</span>
                            <span>{formatReward(phase2.cys.staking, 4, true)}</span>
                        </div>
                    </div>
                </div>

                <div className="border border-[#333] rounded-lg px-6 py-4">
                    <div className="flex justify-between items-center border-b border-[#FFFFFF4D] pb-2">
                        <span className={cn("unbounded-18-36-300")}>Total CGT</span>
                        <span className={cn("unbounded-18-36-300")}>{formatReward(phase2.cgt.total, 4, true)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 gap-6 text-sm">
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-sub">Prover</span>
                            <span>{formatReward(phase2.cgt.prover, 4, true)}</span>
                        </div>
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-sub">Verifier</span>
                            <span>{formatReward(phase2.cgt.verifier, 4, true)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 gap-6 text-sm">
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-sub">Activity</span>
                            <span>{formatReward(phase2.cgt.activity, 4, true)}</span>
                        </div>
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-sub">Staking</span>
                            <span>{formatReward(phase2.cgt.staking, 4, true)}</span>
                        </div>
                    </div>
                </div>

                <Button
                    type="light"
                    className="w-full py-4 rounded-lg text-base font-[400] mt-4"
                    onClick={handleConfirm}
                >
                    CONFIRM
                </Button>
            </div>
        );
    };

    // 渲染 Phase III 内容
    const renderPhaseIII = () => {
        const phase3 = phasesData?.phase3;

        if (loading || !phase3) {
            return <div className="text-center py-8">Loading...</div>;
        }

        return (
            <div className="space-y-4">
                <div className="border border-[#333] rounded-lg px-6 py-4">
                    <div className="flex justify-between items-center border-b border-[#FFFFFF4D] pb-2">
                        <span className={cn("unbounded-18-36-300")}>Total CYS</span>
                        <span className={cn("unbounded-18-36-300")}>{formatReward(phase3?.cysIncomeDetail?.total, 4, true)}</span>
                    </div>
                    <div className="mt-2">
                        <div className="text-sub mb-2">Income</div>
                        <div className="flex justify-between items-center gap-6 text-sm">
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub">Prover</span>
                                <span>{formatReward(phase3?.cysIncomeDetail?.income?.prover, 4, true)}</span>
                            </div>
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub">Verifier</span>
                                <span>{formatReward(phase3?.cysIncomeDetail?.income?.verifier, 4, true)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 gap-6 text-sm">
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub">Activity</span>
                                <span>{formatReward(phase3?.cysIncomeDetail?.income?.activity, 4, true)}</span>
                            </div>
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub">Staking</span>
                                <span>{formatReward(phase3?.cysIncomeDetail?.income?.staking, 4, true)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 gap-6 text-sm">
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub">Others</span>
                                <span>{formatReward(phase3?.cysIncomeDetail?.income?.others, 4, true)}</span>
                            </div>
                            <div className="flex-1" />
                        </div>
                    </div>
                    <div className="border-t border-dashed border-[#333] my-4"></div>
                    <div>
                        <div className="text-sub mb-2">Information</div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub flex-1">Convertable CYS - CGT</span>
                                <span className="flex-1 text-right mr-4">{formatReward(phase3?.cysIncomeDetail?.information?.convertable || "0", 4, true)}</span>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <Button
                                    type="text"
                                    className=" text-sm flex items-center min-h-fit h-fit text-sub !p-0"
                                    onClick={() => handleConvertModal()}
                                >
                                    CONVERT <span className="ml-1">→</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-[#333] rounded-lg px-6 py-4">
                    <div className="flex justify-between items-center border-b border-[#FFFFFF4D] pb-2">
                        <span className={cn("unbounded-18-36-300")}>Total CGT</span>
                        <span className={cn("unbounded-18-36-300")}>{formatReward(phase3?.cgtIncomeDetail?.total, 4, true)}</span>
                    </div>
                    <div className="mt-2">
                        <div className="text-sub mb-2">Income</div>
                        <div className="flex justify-between items-center gap-6 text-sm">
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub">Prover</span>
                                <span>{formatReward(phase3?.cgtIncomeDetail?.income?.prover, 4, true)}</span>
                            </div>
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub">Verifier</span>
                                <span>{formatReward(phase3?.cgtIncomeDetail?.income?.verifier, 4, true)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 gap-6 text-sm">
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub">Activity</span>
                                <span>{formatReward(phase3?.cgtIncomeDetail?.income?.activity, 4, true)}</span>
                            </div>
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub">Others</span>
                                <span>{formatReward(phase3?.cgtIncomeDetail?.income?.others, 4, true)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-dashed border-[#333] my-4"></div>
                    <div>
                        <div className="text-sub mb-1">Cost</div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex-1 flex justify-between items-center">
                                <span className="text-sub">Maintenance Fee</span>
                                <span>{formatReward(phase3?.cgtIncomeDetail?.cost?.maintenanceFee, 4, true)}</span>
                            </div>
                            <div className="flex-1" />
                        </div>
                    </div>
                    <div className="border-t border-dashed border-[#333] my-4"></div>
                    <div>
                        <div className="text-sub mb-2">Information</div>
                        <div className="flex justify-between items-center mb-2 text-sm">
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub flex-1">Convertable CGT - CYS</span>
                                <span className="flex-1 text-right mr-4">{formatReward(phase3?.cgtIncomeDetail?.information?.convertable || "0", 4, true)}</span>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <Button
                                    type="text"
                                    className="text-sm flex items-center min-h-fit h-fit text-sub !p-0"
                                    onClick={() => handleConvertModal({ fromToken: 'CGT' })}
                                >
                                    CONVERT <span className="ml-1">→</span>
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-2 text-sm">
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub flex-1">Staked Amount</span>
                                <span className="flex-1 text-right mr-4">{formatReward(phase3?.cgtIncomeDetail?.information?.stakedAmount || "0", 4, true)}</span>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <Button
                                    type="text"
                                    className="text-sm flex items-center min-h-fit h-fit text-sub !p-0"
                                    onClick={() => handleStakeModal({ tab: 'unstake' })}
                                >
                                    UNSTAKE <span className="ml-1">→</span>
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex justify-between items-center flex-1">
                                <span className="text-sub flex-1">Reserved Amount</span>
                                <span className="flex-1 text-right mr-4">{formatReward(phase3?.cgtIncomeDetail?.information?.reservedAmount || "0", 4, true)}</span>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <Button
                                    type="text"
                                    className="text-sm flex items-center min-h-fit h-fit text-sub !p-0"
                                    onClick={() => handleReserveModal({ tab: 'withdraw' })}
                                >
                                    WITHDRAW <span className="ml-1">→</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    type="light"
                    className="w-full py-4 rounded-lg text-base font-[400] mt-4"
                    onClick={handleConfirm}
                >
                    CONFIRM
                </Button>
            </div>
        );
    };

    return (
        <Modal
            isOpen={visible}
            onClose={handleClose}
            title="REWARDS DETAILS"
            className="max-w-[720px]"
        >
            {/* 阶段标签页 */}
            <div className="flex justify-between mb-6 relative">
                <button
                    className={`uppercase text-center text-base w-1/3 py-4 ${activePhase === RewardPhase.PHASE_III ? "text-white" : "text-sub"
                        }`}
                    onClick={() => handlePhaseChange(RewardPhase.PHASE_III)}
                >
                    PHASE III
                </button>
                <button
                    className={`uppercase text-center text-base w-1/3 py-4 ${activePhase === RewardPhase.PHASE_II ? "text-white" : "text-sub"
                        }`}
                    onClick={() => handlePhaseChange(RewardPhase.PHASE_II)}
                >
                    PHASE II
                </button>
                <button
                    className={`uppercase text-center text-base w-1/3 py-4 ${activePhase === RewardPhase.PHASE_I ? "text-white" : "text-sub"
                        }`}
                    onClick={() => handlePhaseChange(RewardPhase.PHASE_I)}
                >
                    PHASE I
                </button>

                {/* 下划线指示器 */}
                <div className="absolute bottom-0 w-full h-[1px] bg-[#333]"></div>
                <div
                    className="absolute bottom-0 h-[2px] bg-white transition-all duration-300 w-1/3"
                    style={{
                        left: activePhase === RewardPhase.PHASE_III ? "0" :
                            activePhase === RewardPhase.PHASE_II ? "33.33%" : "66.66%"
                    }}
                ></div>
            </div>

            {/* 根据当前活跃标签页显示不同内容 */}
            {activePhase === RewardPhase.PHASE_I && renderPhaseI()}
            {activePhase === RewardPhase.PHASE_II && renderPhaseII()}
            {activePhase === RewardPhase.PHASE_III && renderPhaseIII()}
        </Modal>
    );
};

export default RewardsDetailModal;