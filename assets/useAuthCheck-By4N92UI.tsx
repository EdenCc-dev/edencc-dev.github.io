import useMetadata from "@/hooks/useMetadata";
import useAuth from "@/models/_global/auth";
import useUser from "@/models/_global/user";
import { useEventListener } from "ahooks";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount, useAccountEffect } from "wagmi";

// 添加与路由相同的开关变量
const PHASE2_FINALIZE_MODE = true; // 设置为 true 启用 Phase2Finalize 模式，false 禁用

// 白名单路径，这些路径不需要身份验证，同时在 Phase2Finalize 模式下也不会被重定向
// const whiteList = ['subscribe', 'dashboard/overview', 'about', 'faq', 'aleopool', 'register', 'leadingboard']?.map(i => [i, '/' + i]).flat(Infinity)
// const whiteList = ['subscribe', 'dashboard/overview', 'about', 'faq', 'leadingboard', 'my']?.map(i => [i, '/' + i]).flat(Infinity)

const whiteList = ['subscribe', 'about', 'faq']?.map(i => [i, '/' + i]).flat(Infinity)

const useAuthCheck = () => {
    // const [from, setFrom] = useState<any>()
    const { address } = useAccount()
    const { phase2ModalStatus, profile } = useUser()

    const { runAsync } = useMetadata()
    useEventListener('refresh_profile', () => {
        runAsync()
    })
    const from = useRef<string>()
    // const setFrom = v => from.current = v
    const { pathname } = useLocation()
    const navigate = useNavigate();
    const { reset, authMap, setState, createAddress, updateAddress } = useAuth();
    useAccountEffect({
        onDisconnect() {
            dispatchEvent(new CustomEvent('modal_new_to_visible', { detail: { visible: false } }))
            reset()
        }
    })

    const auth = authMap?.[address || '']?.auth
    const valid = authMap?.[address || '']?.valid

    useEffect(() => {
        setState({ currentAddr: address })
        if (address && !authMap?.[address]) {
            createAddress(address)
        }
    }, [authMap, address])

    useEffect(() => {
        // 如果处于 Phase2Finalize 模式，且当前路径不在白名单中，则重定向到 phase2Finalize 页面
        if (PHASE2_FINALIZE_MODE && !whiteList.some(path => pathname === path || pathname.startsWith(path + '/'))) {
            navigate('/subscribe');
            return;
        }

        // 如果不在 Phase2Finalize 模式，则执行原有的权限检查逻辑
        if (!PHASE2_FINALIZE_MODE && (!auth || !valid) && !whiteList.includes(pathname)) {
            navigate('/referral/invite');
        }
    }, [auth, valid, pathname, navigate]);

    useEffect(() => {
        // 只有在非 Phase2Finalize 模式下才记录来源路径
        if (!PHASE2_FINALIZE_MODE && !['/my', '/referral/invite'].includes(pathname)) {
            from.current = pathname;
        }
    }, [pathname]);

    useEffect(() => {
        // 只有在非 Phase2Finalize 模式下才执行身份验证后的导航逻辑
        if (!PHASE2_FINALIZE_MODE && auth) {
            axios.get(`/api/v1/referral/${address}/checkBind`).then((res: any) => {
                // 响应成功
                if (!res?.data?.bind) return;

                if (res?.data?.bind) {
                    updateAddress(address, { valid: true })
                    dispatchEvent(new CustomEvent('refresh_profile'))
                }

                if (from?.current?.includes('referral/invite') || from?.current == '/') {
                    navigate('/my', { replace: true })
                } else {
                    navigate(from?.current || '/my', { replace: true })
                }
            })
        }
    }, [auth, from, address, navigate, updateAddress]);

    useEffect(() => {
        // 只有在非 Phase2Finalize 模式下才显示奖励模态框
        if (!PHASE2_FINALIZE_MODE && address && profile?.[address]?.needRegister != undefined && !profile?.[address]?.needRegister && !phase2ModalStatus && profile?.[address]?.can_claim_reward) {
            dispatchEvent(new CustomEvent('modal_phase_1_reward_visible', { detail: { visible: true } }))
            return;
        }
    }, [address, profile, phase2ModalStatus]);
};

export default useAuthCheck;