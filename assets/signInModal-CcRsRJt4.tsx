import { useRef as useRefReact, useState, useEffect, useMemo } from "react";
import useModalState from "@/hooks/useModalState";
import Modal from "@/components/Modal";
import { ArrowRight, Upload } from "lucide-react";
import DigitInputs from "@/components/DigitInputs";
import Button from "@/components/Button";
import Copy from "@/components/Copy";
import { handleLoginPersonalMessage, shortStr } from "@/utils/tools";
import useUser from "@/models/user";
import useAccount from "@/hooks/useAccount";
import axios from "@/service";
import { useLocation } from "react-router-dom";
import useRef from "@/models/_global/ref";

import { usePrivy } from "@/hooks/usePrivy";
import { BIND_CHECK_PATHS, mediasLink, NO_BIND_CHECK_PATHS, responseSuccessCode } from "@/config";
import { toast } from "react-toastify";
import Spinner from "@/components/spinner";
import useWalletConnectRecord from "@/models/_global/loginRecord";
import { useEventListener } from "ahooks";

// 流程状态枚举
enum SignInStep {
  INVITE_CODE = 1, // 邀请码验证步骤
  USER_INFO = 2, // 用户信息设置步骤
  COMPLETED = 3, // 完成状态
}


const SignInModal = () => {  

  const { record, setRecord } = useWalletConnectRecord()
  const { overviewLoading, walletAddress, activeAddress, isSigned, isBinded, inviteCode: userInviteCode, userProfile } =
    useAccount();
  const { login: _login, linkGoogle, linkTwitter, linkDiscord, user } = usePrivy();

  const needForceToSetProfile = walletAddress && (!record?.[walletAddress as string] || record?.[walletAddress as string] == '0')
  const login = async (type: 'google' | 'twitter' | 'discord' | 'wallet')=>{
    if(user && user?.wallet?.address){
      if(type === 'google'){
        await linkGoogle()
      }else if(type === 'twitter'){
        await linkTwitter()
      } else if (type === 'discord') {
        await linkDiscord()
      }
    } else {
      await _login({
        loginMethods: [type]
      })
    }
  }

  const loginWithGoogle = () => {
    if(user?.google?.subject){
      linkGoogle()
    }else{
      login('google')
    }
  } 

  const loginWithDiscord = () => {
    login('discord')
  }

  const loginWithX = () => {
    if(user?.twitter?.subject){
      linkTwitter()
    }else{
      login('twitter')
    }
  }

  const loginWithWallet = () => {
    login('wallet')
  }

  // const { open } = useAppKit();
  const location = useLocation();

  // 检查当前路径是否需要绑定邀请码
  const needsBindCheck = BIND_CHECK_PATHS.some((path) =>
    location.pathname.includes(path) && !NO_BIND_CHECK_PATHS.includes(location.pathname)
  );

  // 根据当前路径和绑定状态判断是否需要显示绑定步骤
  const needsBinding = needsBindCheck && !isBinded;

  // 获取模态框状态
  const { visible, setVisible } = useModalState({
    eventName: "modal_signin_visible",
  });

  // 获取用户状态管理器
  const userStore = useUser();

  // 获取当前用户信息 - 确保使用正确的地址
  const currentAddress = activeAddress || walletAddress;
  const { addressMap } = userStore;
  const activeUser = currentAddress ? addressMap[currentAddress] : undefined;
  const savedName = activeUser?.name;
  const savedAvatarUrl = activeUser?.avatarUrl;

  // 控制当前步骤
  const [step, setStep] = useState<SignInStep>(SignInStep.INVITE_CODE);

  // 错误状态
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 邀请码状态
  const [inviteCode, setInviteCode] = useState("");
  const sameInviteCodeAsUserSelf = inviteCode && userInviteCode && inviteCode.toLowerCase() === userInviteCode.toLowerCase()

  // 第二步表单数据
  const [formData, setFormData] = useState({
    logo: null as File | null,
    name: "",
    agreeTerms: false,
  });


  const onlyProfileRef = useRefReact<boolean>(false)
  useEventListener('modal_user_profile_visible', ()=>{
    onlyProfileRef.current = true
    setStep(SignInStep.USER_INFO);
    setVisible(true)
  })

  // TODO rebuild
  // init
  useEffect(()=>{
    if(!visible){
      onlyProfileRef.current = false
      setStep(SignInStep.INVITE_CODE)
    }
  }, [visible])

  useEffect(() => {
    if (visible && !onlyProfileRef.current) {
      // 重置错误状态
      setError(null);

      if (walletAddress && isSigned) {
        if (needsBindCheck && !isBinded) {
          setStep(SignInStep.INVITE_CODE);
        } else {
          if(needForceToSetProfile){
            setStep(SignInStep.USER_INFO);
          }else{
            setVisible(false)
          }
        }
      } else {
        setStep(SignInStep.INVITE_CODE);
      }

      if (savedName) {
        setFormData((prev) => ({ ...prev, name: savedName }));
      }
    }
  }, [visible, needForceToSetProfile, walletAddress, isSigned, isBinded, needsBindCheck, savedName]);


  const { refCode } = useRef()
  const [needAutoBind, setNeedAutoBind] = useState(false)

  useEffect(() => {
    if (
      visible &&
      walletAddress &&
      inviteCode.length === 5 &&
      step === SignInStep.INVITE_CODE &&
      isSigned &&
      needAutoBind
    ) {
      bindWalletWithCode();
    }
  }, [visible, walletAddress, inviteCode, isSigned, step, needAutoBind]);

  useEffect(()=>{
    if(visible){
      if(refCode){
        setNeedAutoBind(false)
        setInviteCode(refCode);
        setError(null);
      }else{
        setNeedAutoBind(true)
      }
    }
  }, [visible, refCode])

  // 处理邀请码改变
  const handleCodeChange = (code: string) => {
    setNeedAutoBind(true)
    setInviteCode(code);
    setError(null);
  };

  // 连接钱包
  const handleConnectWallet = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithWallet();
    } catch (error) {
      console.error("Error opening wallet:", error);
      setError("Failed to open wallet connector");
    } finally {
      setLoading(false);
    }
  };

  // 验证邀请码 - 直接在组件内实现，简化版本
  const bindWalletWithCode = async () => {
    if (inviteCode.length !== 5 || !walletAddress) return;

    if (inviteCode?.toLowerCase() === userInviteCode?.toLowerCase()) {
      setError("You cannot bind your own invite code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. 直接调用API绑定邀请码
      const response: any = await axios.post("/api/v1/referral/bind", {
        code: inviteCode,
      });

      // 检查响应是否成功 - 处理两种成功情况
      const isSuccess = response.code === responseSuccessCode || response.code === 10024;

      // 如果绑定失败，显示错误并返回
      if (!isSuccess) {
        setError("Invalid invite code");
        return;
      }

      userStore.setState(walletAddress, {
        inviteCode: inviteCode,
        isRegistered: true,
        isBinded: true
      });


      toast.success("Please complete your profile");
      setStep(SignInStep.USER_INFO);

    } catch (error) {
      console.error("Bind error:", error);
      setError("Failed to verify invite code");
    } finally {
      setLoading(false);
    }
  };

  // 处理社交账号登录

  // 上传头像图片到服务器
  const uploadLogo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response: any = await axios.post("/api/v1/upload", formData);

      if (response?.code === responseSuccessCode) {
        // 修复：确保正确获取到图片URL
        if (typeof response.data === "string") {
          return response.data;
        } else if (response.data && typeof response.data.data === "string") {
          return response.data.data;
        }
        return "";
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Failed to upload avatar", error);
      throw error;
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!formData.name || !formData.agreeTerms) {
      setError("Please enter your name and agree to the terms");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 准备要上传的数据
      let avatarUrl;
      if (formData.logo) {
        avatarUrl = await uploadLogo(formData.logo);
      }

      // 确保有一个有效地址用于注册/更新
      const effectiveAddress = walletAddress || activeAddress;

      if (effectiveAddress) {
        // 构建用户数据对象
        const userData: any = {
          name: formData.name,
        };

        // 只有当上传了新头像时才包含avatarUrl
        if (avatarUrl) {
          userData.avatarUrl = 'https://statics.prover.xyz/' + avatarUrl;
        }

        console.log("更新用户资料:", userData);

        // 调用registerUser方法更新用户资料
        const success = await userStore.registerUser(
          effectiveAddress,
          userData
        );

        if (success) {
          toast.success("Update profile success");
          setVisible(false);
          resetState();
        } else {
          setError("Failed to update profile. Please try again.");
        }
      } else {
        setError("Wallet connection required");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Logo size must be less than 5MB, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 处理跳过
  const handleSkip = async () => {
    setVisible(false);
  };

  // 处理图片上传
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setFormData({ ...formData, logo: file });
    }
  };

  // 关闭模态框并重置状态
  const handleClose = () => {
    setVisible(false);
    resetState();

    if(walletAddress && step === SignInStep.USER_INFO && needForceToSetProfile){
      setRecord(walletAddress, '1')
    }
  };

  // 重置所有状态
  const resetState = () => {
    setStep(SignInStep.INVITE_CODE);
    setInviteCode("");
    setFormData({
      logo: null,
      name: "",
      agreeTerms: false,
    });
    setError(null);
    setLoading(false);
  };

  // 验证邀请码按钮处理
  const handleVerifyInviteCode = () => {
    if (inviteCode.length === 5) {
      bindWalletWithCode();
    } else {
      setError("Please enter a complete 5-digit invite code");
    }
  };

  // < 15
  const validInputLength = useMemo(()=>{
    return formData.name.length < 15
  }, [formData.name])

  return (
    <Modal
      isDismissable={false}
      isOpen={visible}
      onClose={handleClose}
      title="SIGN IN"
      className="max-w-[600px]"
      hideCloseButton={!isSigned && !!walletAddress}
    >
      {error && (
        <div className="bg-red-900/20 border border-error px-4 py-2 rounded mb-4 text-error">
          {error}
        </div>
      )}


      {
        overviewLoading ? <Spinner /> : null
      }
      {!overviewLoading && step === SignInStep.INVITE_CODE && (
        // 第一步: 输入邀请码
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-light tracking-wider text-center">
            {(walletAddress && needsBinding) ? "ENTER YOUR INVITE CODE" : walletAddress ? "SIGN MESSAGE" : "CONNECT WALLET"}
          </h2>

          {
            (walletAddress && needsBinding && isSigned) ? (
              <div className="">
                <DigitInputs
                  className="text-lg w-12 h-[3.875rem] rounded-md border-[#FFFFFFCC] gap-2"
                  n={5}
                  value={inviteCode}
                  onValueChange={handleCodeChange}
                />
              </div>
            ) : null
          }

          {/* 如果已连接钱包但未绑定邀请码，显示当前钱包地址 */}
          {walletAddress ? (
            <>
              {!isSigned ? (
                <Button
                  type="light"
                  className="font-[400] w-full h-16 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={handleLoginPersonalMessage}
                >
                  GET STARTED
                </Button>
              ) : (
                <Button
                  type="light"
                  className="font-[400] w-full h-16 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={handleVerifyInviteCode}
                  needLoading
                  loading={loading}
                  disabled={inviteCode.length < 5 || !!sameInviteCodeAsUserSelf}
                >
                  VERIFY INVITE CODE
                </Button>
              )}

              <div className="text-center text-sub mb-2">
                <p>Wallet connected</p>
                <Copy value={walletAddress}>
                  <span className="font-mono">
                    {shortStr(walletAddress, 10)}
                  </span>
                </Copy>
              </div>
            </>
          ) : (
            <>
              {
                (walletAddress && needsBinding) ? (
                  <div className="text-sub my-6">or Already Joined?</div>
                ) : null
              }
              <div className="w-full space-y-2">
                <>
                  <Button
                    type="solid"
                    className="font-[400] w-full h-16 bg-transparent border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors"
                    onClick={loginWithGoogle}
                    needLoading
                    loading={loading}
                  >
                    GOOGLE ACCOUNT
                  </Button>

                  {/* <Button
                    type="solid"
                    className="font-[400] w-full h-16 bg-transparent border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors"
                    onClick={loginWithDiscord}
                    needLoading
                    loading={loading}
                  >
                    DISCORD ACCOUNT
                  </Button> */}


                  <Button
                    type="solid"
                    className="font-[400] w-full h-16 bg-transparent border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors"
                    onClick={loginWithX}
                    needLoading
                    loading={loading}
                  >
                    X ACCOUNT
                  </Button>
                  <Button
                    type="light"
                    className="font-[400] w-full h-16 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={handleConnectWallet}
                    needLoading
                    loading={loading}
                  >
                    CONNECT WALLET
                  </Button>
                </>
              </div>
            </>
          )}

          {/* 关于Cysic链接 */}
          <a href={mediasLink.medium} target="_blank" className="flex items-center text-sub mt-4 cursor-pointer hover:text-white transition-colors">
            Read about Cysic
            <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      )}

      {!overviewLoading && step === SignInStep.USER_INFO && (
        // 第二步: 设置个人信息
        <div className="flex flex-col space-y-6">
          {/* Logo上传 - 显示为必填但验证时不必填 */}
          <div className="space-y-2">
            <label className="text-sub flex items-center">
              <span className="text-error mr-1">*</span> Logo
            </label>
            <div className="w-[7.5rem] h-[7.5rem] border border-gray-600 rounded flex items-center justify-center cursor-pointer relative bg-[#181818] group">
              {formData.logo ? (
                <>
                  <img
                    src={URL.createObjectURL(formData.logo)}
                    alt="Logo preview"
                    className="w-full h-full object-cover rounded"
                  />
                  {/* 添加悬停时显示的"EDIT"层 */}
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:backdrop-brightness-50 group-hover:opacity-100 transition-opacity duration-200 rounded">
                    <span className="text-white font-medium">EDIT</span>
                  </div>
                </>
              ) : savedAvatarUrl ? (
                <>
                  <img
                    src={savedAvatarUrl}
                    alt="Saved logo"
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:backdrop-brightness-50 group-hover:opacity-100 transition-opacity duration-200 rounded">
                    <span className="text-white font-medium">EDIT</span>
                  </div>
                </>
              ) : (
                <Upload size={24} className="text-white" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* 名称输入 */}
          <div className="space-y-2">
            <label className="text-sub flex items-center">
              <span className="text-error mr-1">*</span> Name
            </label>
            <input
              type="text"
              placeholder="ENTER YOUR NAME HERE"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-4 border border-gray-600 rounded bg-[#181818] text-white focus:border-white focus:outline-none"
            />
            {
              !validInputLength && (
                <div className="text-error text-sm">
                  Name must be less than 15 characters
                </div>
              )
            }
          </div>

          {/* 条款同意 */}
          <div className="flex items-start space-x-3 mt-4">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreeTerms: e.target.checked })
              }
              className="mt-1"
            />
            <label htmlFor="terms" className="text-gray-300 text-sm">
              By signing up, you agree to the Terms of Use and confirm that you
              are not a U.S. person, do not reside in the United States, and are
              not located in any restricted jurisdiction.
            </label>
          </div>

          {/* 提交和跳过按钮 - 只验证名称和条款同意 */}
          <div className="space-y-4 mt-6">
            {!isSigned ? (
              <Button
                type="light"
                className="w-full h-14 rounded transition-colors"
                onClick={handleLoginPersonalMessage}
              >
                SIGN MESSAGE{" "}
              </Button>
            ) : (
              <Button
                type="light"
                className="w-full h-14 rounded transition-colors"
                onClick={handleSubmit}
                needLoading
                loading={loading}
                disabled={!formData.name || !formData.agreeTerms || !validInputLength}
              >
                SUBMIT
              </Button>
            )}

            <Button
              type="solid"
              className="w-full h-14 bg-transparent border border-gray-600 text-white rounded hover:bg-gray-800 transition-colors"
              onClick={handleSkip}
            >
              SKIP FOR NOW
            </Button>
          </div>

          {/* 已连接钱包提示 */}
          {walletAddress && (
            <div className="flex items-center justify-center text-sub text-sm mt-4">
              <Copy value={walletAddress}>
                <span>Connected as {shortStr(walletAddress, 10)}</span>
              </Copy>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default SignInModal;
