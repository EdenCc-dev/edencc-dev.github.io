import { useEffect, useMemo, useRef } from 'react';
import useUser from '@/models/user';
import useStatic from '@/models/_global';
import { config } from '@/config/privyProvider';
import { watchAccount } from 'wagmi/actions';
import { useEventListener } from 'ahooks';
import { useSignMessage } from '@/hooks/useSignMessage';
import { BIND_CHECK_PATHS, loginSignContent } from '@/config';
import useAccount from '@/hooks/useAccount';
import { useLocation } from 'react-router-dom';
import { usePrivy } from "@/hooks/usePrivy";
import { handleSignIn, sleep } from '@/utils/tools';
import axios from 'axios';
import useCheckMatchedCosmosAddressWithEVM from './useCheckMatchedCosmosAddressWithEVM';

/**
 * 账户状态初始化Hook
 * 只处理基础的钱包连接、切换和签名
 */
const useAccountBootstrap = () => {
  useCheckMatchedCosmosAddressWithEVM()
  const { socialAccount, address, isBinded, addressMap } = useAccount()
  const { user } = usePrivy()
  const isEmbed = user?.wallet?.connectorType == "embedded"
  const isSigned = !!addressMap?.[address || '']?.signature

  useEffect(() => {
    if (isEmbed && address && !isSigned) {
      handleSignIn()
    }
  }, [isEmbed, address, isSigned])


  const { signMessageAsync } = useSignMessage();
  const userStore = useUser();
  const { setAddress } = useStatic();
  const location = useLocation();
  // 检查当前路径是否需要绑定邀请码
  const needsBindCheck = useMemo(() => {
    const path = location.pathname;
    // 使用 includes 检查路径是否包含特定字符串
    return BIND_CHECK_PATHS.some(checkPath => path.includes(checkPath));
  }, [location.pathname]);

  // 当进入需要检查绑定状态的页面时，查询绑定状态
  useEffect(() => {
    if (address && isSigned && needsBindCheck && !isBinded) {
      // 只在状态未知时查询绑定状态
      userStore.checkBindStatus(address).catch(console.error);
    }
  }, [address, isSigned, needsBindCheck, isBinded]);


  // 跟踪上一个钱包地址
  const lastWalletAddress = useRef<string | null>(null);


  // 监听登录签名请求
  useEventListener('login_personal_message', async () => {
    if (!address) return;

    try {
      const event = new CustomEvent('modal_signin_visible', {
        detail: { visible: false, step: 'code' }
      });

      if (user?.wallet?.connectorType == "embedded") {
        window.dispatchEvent(event);
      }

      const signature = await signMessageAsync(loginSignContent);

      userStore.setSignature(address, signature as string);
    } catch (error) {
      handleSignIn()
      console.error("Fail to sign message", error);
    }
  });

  useEffect(() => {
    if (address && isSigned) {
      userStore.fetchUserInfo(address).catch(console.error);
    }
  }, [address, isSigned])

  // 清理函数
  useEffect(() => {
    if (!address) return;

    document.documentElement.style.overflow = 'auto'

    setAddress(address);
    userStore.setActiveAddress(address);


    const unwatch = watchAccount(config, {
      onChange(account: any) {

        const newAddress = account?.address;
        if (newAddress !== lastWalletAddress.current) {
          if (newAddress) {
            setAddress(newAddress);
            userStore.setActiveAddress(newAddress);
          } else {
            userStore.setActiveAddress(undefined);
          }

          lastWalletAddress.current = newAddress;
        }
      },
    });

    return () => {
      unwatch();
    };
  }, [address]);





  // social account
  const handleUploadSocialAccount = async ({ accountType, account, subject }: { accountType: string, account: string, subject: string }) => {

    if (!address) return;
    await axios.post('/api/v1/social/account/update', {
      accountType,
      account,
      subject
    })

    await sleep(1000)
    userStore.fetchUserInfo(address)

  }

  useEffect(() => {
    if (isSigned && address) {
      // CHECK SOCIAL ACCOUNT
      if (socialAccount?.discord?.name == '' && user?.discord?.subject) {
        handleUploadSocialAccount({
          accountType: 'discord',
          account: user?.discord?.username || '',
          subject: user?.discord?.subject || ''
        })
      }

      if (socialAccount?.google?.name == '' && user?.google?.subject) {
        handleUploadSocialAccount({
          accountType: 'google',
          account: user?.google?.email || '',
          subject: user?.google?.subject || ''
        })
      }

      if (socialAccount?.x?.name == '' && user?.twitter?.subject) {
        handleUploadSocialAccount({
          accountType: 'x',
          account: user?.twitter?.username || '',
          subject: user?.twitter?.subject || ''
        })
      }

    }
  }, [isSigned, address, socialAccount, user?.discord?.subject, user?.google?.subject, user?.twitter?.subject])




  return null;
};

export default useAccountBootstrap;