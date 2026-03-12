import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Spinner from "@/components/spinner";
import useAccount from "@/hooks/useAccount";
import useModalState from "@/hooks/useModalState";
import { cn, Tab, Tabs } from "@nextui-org/react";
import { useCountDown, useRequest } from "ahooks";
import axios from "axios";
import dayjs from "dayjs";
import { Check } from "lucide-react";
import { SetStateAction, useState, useEffect } from "react";
import { toast } from "react-toastify";


enum VoucherTab {
    VALID = "VALID",
    INVALID = "INVALID"
}

// - status: 0 - 可用, 1 - 已过期, 2 - 已使用
const limitTime = 1000 * 3600 * 7;
interface IVoucher {
    id: number;
    name: string;
    description: string;
    status: number;
    expireAt: number; // sec
}

const tabStyle =
    '[data-selected="true"]:!text-black [data-selected="true"]:!bg-white [data-selected="true"]:border-black bg-[#FFFFFF1A] text-[#FFFFFF80]';

const ExpireMonitor = ({
    expireAt,
    onEnd,
}: {
    expireAt: number;
    onEnd: () => void;
}) => {
    const [countdown, formattedRes] = useCountDown({
        targetDate: expireAt == 0 ? undefined : expireAt * 1000,
        onEnd: () => {
            onEnd();
        },
    });

    const { hours, minutes, seconds } = formattedRes;

    if (expireAt == 0) return null;

    if (expireAt < dayjs().unix()) {
        return (
            <div className="text-sm text-sub">
                Expired At {dayjs(expireAt * 1000).format("YYYY-MM-DD HH:mm")}
            </div>
        );
    }

    if (countdown > limitTime) {
        return (
            <div className="text-sm text-sub">
                Valid Until {dayjs(expireAt * 1000).format("YYYY-MM-DD HH:mm")}
            </div>
        );
    }

    return (
        <div className="text-sm text-sub">
            Expired In {hours}:{minutes}:{seconds}
        </div>
    );
};

const VoucherItem = ({ voucher, refresh }: { voucher: IVoucher, refresh: () => void }) => {
    const [isExpire, setIsExpire] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (voucher.status === 0 || voucher.status === 2) {
            setIsExpire(false);
        } else if (voucher.status === 1) {
            setIsExpire(true);
        }
    }, [voucher.status]);

    const handleClick = async () => {
        if (isExpire !== undefined && !isExpire) {
            await axios.post('/api/v1/user/voucher/redeem', {
                userVoucherId: voucher.id
            })
            toast.success('Voucher redeemed successfully');
            refresh();
        }
    };

    return (
        <div className="flex items-center justify-between gap-2 p-4 border border-[#FFFFFF80] rounded-md">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <div className="text-2xl">{voucher.name}</div>
                    {voucher.description && (
                        <div className="text-lg">{voucher.description}</div>
                    )}
                </div>

                <ExpireMonitor
                    expireAt={voucher.expireAt}
                    onEnd={() => {
                        setIsExpire(true);
                    }}
                />
            </div>
            <Button
                needLoading
                onClick={handleClick}
                type={voucher.status === 0 ? "light" : "dark"}
                className={cn(
                    "teacher text-base h-12 w-[8.125rem] text-black flex gap-2 items-center justify-center !border-[#FFFFFF1A] !border rounded-lg",
                    voucher.status === 1 && "!text-[#EA4335]",
                    voucher.status === 2 && "text-white"
                )}
            >
                {isExpire === undefined ?
                    <Spinner />
                    : voucher.status === 0 ? (
                        "Redeem"
                    ) : isExpire ? (
                        "Expired"
                    ) : (
                        <>
                            <Check className="w-3 h-3 text-lightBrand" />
                            <p>Claimed</p>
                        </>
                    )}
            </Button>
        </div>
    );
};

const VoucherModal = () => {
    const { visible, setVisible } = useModalState({
        eventName: "modal_voucher_visible",
    });

    const handleClose = () => {
        setVisible(false);
    };

    const { address, isSigned } = useAccount()
    const [validTasks, setValidTasks] = useState<IVoucher[]>([]);
    const [invalidTasks, setInvalidTasks] = useState<IVoucher[]>([]);
    const { run, loading: _loading } = useRequest(() => axios.get("/api/v1/user/voucher/list"), {
        onSuccess: (res) => {
            const validList: SetStateAction<IVoucher[]> = [];
            const invalidList: SetStateAction<IVoucher[]> = [];

            res.data?.list.forEach((item: IVoucher) => {
                if (item.status === 0) {
                    validList.push(item);
                } else {
                    invalidList.push(item);
                }
            });

            setValidTasks(validList);
            setInvalidTasks(invalidList);
        },
        ready: visible && isSigned && !!address,
        refreshDeps: [visible, isSigned, address],
    });

    const validLoading = !validTasks?.length && _loading
    const invalidLoading = !invalidTasks?.length && _loading


    const [activeTab, setActiveTab] = useState<VoucherTab>(VoucherTab.VALID);
    return (
        <Modal
            title="VOUCHER"
            className="max-w-[33.75rem]"
            isOpen={visible}
            onClose={handleClose}
        >
            <div className="flex flex-col gap-6">
                <div className="text-base">
                    Free Trial vouchers activate instantly upon redemption, while discount
                    vouchers can be applied at checkout when purchasing a Digital
                    Harvester.
                </div>


                <div className="grid grid-cols-2 rounded-lg overflow-hidden mb-6 border border-[#FFFFFF4D]">
                    <button
                        className={`py-4 uppercase text-center text-base ${activeTab === VoucherTab.VALID
                            ? "bg-white text-black"
                            : "bg-[#1E1E1E] text-[#777]"
                            }`}
                        onClick={() => setActiveTab(VoucherTab.VALID)}
                    >
                        VALID
                    </button>
                    <button
                        className={`py-4 uppercase text-center text-base ${activeTab === VoucherTab.INVALID
                            ? "bg-white text-black"
                            : "bg-[#1E1E1E] text-[#777]"
                            }`}
                        onClick={() => setActiveTab(VoucherTab.INVALID)}
                    >
                        INVALID
                    </button>
                </div>


                {activeTab === VoucherTab.VALID ? (
                    <div className="flex flex-col gap-4">
                        {validLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Spinner />
                            </div>
                        ) : validTasks?.length ? (
                            validTasks.map((task) => (
                                <VoucherItem refresh={run} key={task.name} voucher={task} />
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-400">No voucher found</div>
                        )}
                    </div>
                ) : null}
                {activeTab === VoucherTab.INVALID ? (
                    <div className="flex flex-col gap-4">
                        {invalidLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Spinner />
                            </div>
                        ) : invalidTasks?.length ? (
                            invalidTasks.map((task) => (
                                <VoucherItem refresh={run} key={task.name} voucher={task} />
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-400">No voucher found</div>
                        )}
                    </div>
                ) : null}

            </div>
        </Modal>
    );
};

export default VoucherModal;
