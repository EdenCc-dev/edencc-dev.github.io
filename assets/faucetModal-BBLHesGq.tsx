import useModalState from "@/hooks/useModalState";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import axios from "axios";
import { useLocalStorageState, useRequest, useCountDown } from "ahooks";
import useAccount from "@/hooks/useAccount";
import { toast } from "react-toastify";
import { useMemo, useRef } from "react";
import useStatic from "@/models/_global";

// GIN-debug] GET    /api/v1/user/faucet       --> github.com/cysic-tech/cysic-api/router.claimFaucet (6 handlers)
// [GIN-debug] GET    /api/v1/user/faucet/last  --> github.com/cysic-tech/cysic-api/router.getLastClaimFaucetRecord (6 handlers)


const cooldownTime = 24 * 60 * 60 * 1000
const FaucetModal = () => {

    const once = useRef(false)
    
    const { faucetAmount } = useStatic()
    const { address, isSigned } = useAccount()
    // 获取模态框状态
    const { visible, setVisible, data } = useModalState({
        eventName: "modal_faucet_visible",
    });

    const handleClose = () => {
        once.current = false
        setVisible(false);
    }


    // { [addr]: undefined | number }
    const [lastClaimTime, setLastClaimTime] = useLocalStorageState<{ [key: string]: undefined | number }>('lastClaimTime', {
        defaultValue: {},
        listenStorageChange: true,
    });

    const currentAddressCountdown = useMemo(() => {
        if (!address) return undefined
        const _lastClaimTime = lastClaimTime?.[address]
        if (!_lastClaimTime) return undefined
        return Number(_lastClaimTime) + cooldownTime
    }, [address, lastClaimTime])


    useRequest(() => {
        if (once.current) return Promise.reject()
        if (currentAddressCountdown) return Promise.reject()
        return axios.get('/api/v1/user/faucet/last')
    }, {
        ready: visible && !!address && !currentAddressCountdown && !!isSigned,
        refreshDeps: [visible, address, currentAddressCountdown, isSigned],
        onSuccess: (res) => {
            once.current = true
            setLastClaimTime((prev: any) => {
                if (!address) return prev
                const t = new Date(res.data.lastClaimAt * 1000).getTime()
                if (t < 0) return prev
                prev[address] = t
                return prev
            })
        }
    })

    const expireTime = currentAddressCountdown

    const [countdown, formattedRes] = useCountDown({
        targetDate: expireTime,
        onEnd: () => {
            setLastClaimTime((prev: any) => {
                if (!address) return prev
                prev[address] = undefined
                return prev
            })
        }
    })

    const { hours, minutes, seconds } = formattedRes;

    const handleClaim = async () => {
        try {

            if (countdown > 0) return
            if (lastClaimTime == undefined) return

            const res: any = await axios.get('/api/v1/user/faucet')
            if (res?.code == 0) {
                setLastClaimTime((prev: any) => {
                    if (!address) return prev
                    prev[address] = Date.now()
                    return prev
                })
                toast.success('Claimed successfully')
            } else {
                if (Number(res?.msg) > 0) {
                    const targetDate = Number(res?.msg) + cooldownTime
                    setLastClaimTime((prev: any) => {
                        if (!address) return prev
                        prev[address] = targetDate
                        return prev
                    })
                }
                toast.error('Claim failed, please try again later')

            }
        } catch (error: any) {
            if (Number(error?.msg) > 0) {
                const targetDate = Number(error?.msg) + cooldownTime
                setLastClaimTime((prev: any) => {
                    if (!address) return prev
                    prev[address] = targetDate
                    return prev
                })
            }
            toast.error('Claim failed, please try again later')
        }
    }

    return (
        <Modal
            isOpen={visible}
            onClose={handleClose}
            className="max-w-[440px]"
            title="Claim Gas"
        >
            <div className="flex flex-col gap-6">
                <p>{faucetAmount || 1} $CYS gas is available to be claimed every 24 hours.</p>
                <Button type="light" onClick={handleClaim} disabled={countdown > 0 || lastClaimTime == undefined || !isSigned || !address} className="h-16 text-base teacher tracking-widest">
                    {
                        countdown > 0 ? <div className="flex items-center gap-2 justify-center">
                            {/* <Clock className="w-4 h-4" /> */}
                            <span className=" ">Countdown: {hours}:{minutes}:{seconds}</span>
                        </div> : 'Claim'
                    }
                </Button>
            </div>
        </Modal>
    );
};

export default FaucetModal;
