import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Input, Spinner } from "@nextui-org/react";
import Button from "@/components/Button";
import GradientBorderCard from "@/components/GradientBorderCard";
import { PT12Wrapper } from "@/components/Wrappers";
import useKrActivity from "@/models/kr";
import { inviteCodeApi, socialMediaApi } from "../krApi";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import i18n from "i18next";


const codeLength = 5;
// a模块：登录权限校验页面
export const LoginPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const lng = searchParams.get('lng') || 'kr';
    
    // 监听URL参数变化，切换语言
    useEffect(() => {
        if (lng === 'en') {
            i18n.changeLanguage('kr_en');
        } else {
            i18n.changeLanguage('kr');
        }
    }, [lng]);

    const { systemSetting, loading, inviterId, authToken } = useKrActivity();
    const [inviteCode, setInviteCode] = useState(window.localStorage.getItem('cysic_kr_invite_code') || "");
    const [isConnecting, setIsConnecting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Twitter登录处理
    const handleConnectTwitter = async () => {
        try {
            setIsConnecting(true);
            const response = await socialMediaApi.bindTwitter();

            if (response.code === '200') {
                // 跳转到Twitter授权页面
                window.location.href = response.authURL as string;
            } else {
                toast.error(response.msg || t('failedToConnectTwitter'));
            }
        } catch (error) {
            toast.error(t('failedToConnectTwitter'));
        } finally {
            setIsConnecting(false);
        }
    };

    // 邀请码验证处理
    const handleVerifyInviteCode = async () => {
        if (!inviteCode.trim()) {
            toast.error(t('pleaseEnterInviteCode'));
            return;
        }

        try {
            setIsVerifying(true);
            
            if (authToken) {
                const response = await inviteCodeApi.bindInviteCode(inviteCode.trim(), 'twitter');
                if (response.code === '200') {
                    toast.success(t('inviteCodeBoundSuccessfully'));
                    dispatchEvent(new CustomEvent("cysic_kr_tasks_refresh_user_overview"));
                } else {
                    if(response.msg == 'Invite code max use times'){
                        toast.error('초대코드 사용 완료. 다른 코드로 시도하세요!' || t('failedToBindInviteCode'));
                      }else{
                        toast.error(response.msg || t('failedToBindInviteCode'));          
                      }
                }
            } else {
                localStorage.setItem('cysic_kr_invite_code', inviteCode.trim());
                toast.success(t('inviteCodeSavedRedirectingToTwitter'));
                handleConnectTwitter();
            }
        } catch (error) {
            toast.error(t('failedToProcessInviteCode'));
        } finally {
            setIsVerifying(false);
        }
    };

    // 直接登录Twitter（当不需要邀请码时）
    const handleDirectLogin = () => {
        handleConnectTwitter();
    };


    if (loading) {
        return (
            <PT12Wrapper className="w-full">
                <GradientBorderCard borderRadius={8} className="py-8 px-8 text-center">
                    <div className="flex justify-center">
                        <Spinner size="lg" />
                    </div>
                </GradientBorderCard>
            </PT12Wrapper>
        );
    }

    return (
        <PT12Wrapper className="w-full">
            <GradientBorderCard borderRadius={8} className="py-8 px-8 text-center">
                <h1 className="unbounded-40-300">{t('welcomeTitle')}</h1>
                <h3 className="mt-4 unbounded-18-200 text-sub">
                    {t('joinOurCommunityAndStartJourney')}
                </h3>

                {
                    systemSetting?.enableInviteCode && (
                        <div className="mt-8 rounded-[8px] bg-white text-black py-3 px-6 mx-auto teachers-14-400 !normal-case w-fit">
                            🎉{" "}
                            <span className="text-[#9D47FF]">{t('preRegistrationPeriod')}</span>{" "}
                            {t('first72HoursGetExclusiveStamp')}
                        </div>
                    )
                }

                <div className="max-w-[500px] mx-auto mt-8">
                    {((systemSetting?.enableInviteCode) && (Number(inviterId) <= 0) && authToken) ? (
                        // 已登录但未绑定邀请码的情况
                        <Card className="bg-white/5">
                            <CardHeader className="text-center flex flex-col items-center">
                                <h2 className="unbounded-24-300">{t('bindYourInviteCode')}</h2>
                                <p className="mt-2 text-sub/80">
                                    {t('youNeedToBindInviteCode')}
                                </p>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <Input
                                    classNames={{ input: "text-center" }}
                                    placeholder={t('enterInviteCode')}
                                    variant="bordered"
                                    value={inviteCode}
                                    onValueChange={setInviteCode}
                                    isInvalid={!!inviteCode && inviteCode.length < codeLength}
                                />

                                <Button
                                    disabled={!inviteCode || inviteCode.length < codeLength || isVerifying}
                                    className="w-full"
                                    type="light"
                                    onClick={handleVerifyInviteCode}
                                >
                                    {isVerifying ? t('binding') : t('bindContinue')}
                                </Button>
                            </CardBody>
                        </Card>
                    ) : systemSetting?.enableInviteCode ? (
                        // 需要邀请码的流程
                        <Card className="bg-white/5">
                            <CardHeader className="text-center flex flex-col items-center">
                                <h2 className="unbounded-24-300">{t('enterYourInviteCode')}</h2>
                                <p className="mt-2 text-sub/80">
                                    {t('pleaseEnterInviteCodeToContinue')}
                                </p>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <Input
                                    classNames={{ input: "text-center" }}
                                    placeholder={t('enterInviteCode')}
                                    variant="bordered"
                                    value={inviteCode}
                                    onValueChange={setInviteCode}
                                    isInvalid={!!inviteCode && inviteCode.length < codeLength}
                                />

                                <Button
                                    disabled={!inviteCode || inviteCode.length < codeLength || isVerifying}
                                    className="w-full"
                                    type="light"
                                    onClick={handleVerifyInviteCode}
                                >
                                    {isVerifying ? t('verifying') : t('verifyContinue2')}
                                </Button>

                                {/* OR 分隔线 */}
                                <div className="flex items-center my-4">
                                    <div className="flex-1 h-px bg-sub/30"></div>
                                    <span className="px-4 text-sub/60 text-sm">{t('or')}</span>
                                    <div className="flex-1 h-px bg-sub/30"></div>
                                </div>

                                {/* 直接连接X选项 */}
                                <Button
                                    className="w-full"
                                    type="bordered"
                                    onClick={handleDirectLogin}
                                    disabled={isConnecting}
                                >
                                    {isConnecting ? t('connecting') : t('alreadyJoinedConnectXDirectly')}
                                    <ChevronRight className="size-4" />
                                </Button>
                            </CardBody>
                        </Card>
                    ) : (
                        // 直接登录流程
                        <Card className="bg-white/5">
                            <CardHeader className="text-center flex flex-col items-center">
                                <h2 className="unbounded-24-300">{t('connectWithX')}</h2>
                                <p className="mt-2 text-sub/80">
                                    {t('loginWithXAccount')}
                                </p>
                            </CardHeader>
                            <CardBody>
                                <Button
                                    className="w-full"
                                    type="light"
                                    onClick={handleDirectLogin}
                                    disabled={isConnecting}
                                >
                                    {isConnecting ? t('connecting') : t('connectX')}
                                </Button>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </GradientBorderCard>
        </PT12Wrapper>
    );
};
