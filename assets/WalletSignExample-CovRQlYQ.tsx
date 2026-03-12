// 钱包签名登录示例
// 这个文件展示了两种登录模式的使用方法

import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Tabs, Tab } from '@nextui-org/tabs';
import { authApi } from '@/routes/pages/Admin/adminApi';
import { toast } from 'react-toastify';

export const WalletSignExample = () => {
  const [loading, setLoading] = useState(false);
  // Use toast for transient notifications
  
  // 手动输入模式的状态
  const [manualForm, setManualForm] = useState({
    address: '',
    signature: '',
  });
  
  // 钱包连接模式的状态
  const [walletAddress, setWalletAddress] = useState('');

  // Check if wallet is available
  const isWalletAvailable = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Connect wallet and get address
  const connectWallet = async () => {
    if (!isWalletAvailable()) {
      toast.error('Please install MetaMask');
      return null;
    }

    try {
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(accounts[0]);
      toast.success(`Wallet connected: ${accounts[0]}`);
      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
      return null;
    }
  };

  // Sign wallet address
  const signAddress = async (address: string) => {
    if (!isWalletAvailable()) {
      throw new Error('Wallet not available');
    }

    try {
      const signature = await window.ethereum!.request({
        method: 'personal_sign',
        params: [address, address], // 签名自己的地址
      }) as unknown as string;
      return signature;
    } catch (error: unknown) {
      if ((error as { code?: number })?.code === 4001) {
        throw new Error('User rejected signature');
      }
      throw new Error('Signature failed');
    }
  };

  // Wallet login flow
  const handleWalletLogin = async () => {
    try {
      setLoading(true);

      // 1. 连接钱包
      const address = await connectWallet();
      if (!address) return;

      // 2. 签名地址
      const signature = await signAddress(address);
      toast.success(`Signed: ${signature.slice(0, 20)}...`);

      // 3. 调用登录接口
      const response = await authApi.login(address, signature);
      
      if (response.code === '200') {
        toast.success(`Wallet login success! UserID: ${response.userId}`);
      } else {
        toast.error(`Login failed: ${response.msg}`);
      }
    } catch (error) {
      toast.error((error as Error)?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Manual login
  const handleManualLogin = async () => {
    try {
      setLoading(true);

      if (!manualForm.address || !manualForm.signature) {
        toast.error('Please enter wallet address and signature');
        return;
      }

      const response = await authApi.login(manualForm.address, manualForm.signature);
      
      if (response.code === '200') {
        toast.success(`Manual login success! UserID: ${response.userId}`);
      } else {
        toast.error(`Login failed: ${response.msg}`);
      }
    } catch (error) {
      toast.error((error as Error)?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Wallet Signature Login Example</h3>
      
      <Tabs aria-label="Login Methods" className="w-full">
        {/* Wallet login */}
        <Tab key="wallet" title="Wallet Login">
          <div className="space-y-4 py-4">
            <Button
              color="primary"
              onClick={connectWallet}
              isLoading={loading}
              isDisabled={!isWalletAvailable()}
              className="w-full"
            >
              {isWalletAvailable() ? 'Connect Wallet' : 'Please install MetaMask'}
            </Button>

            {walletAddress && (
              <Input
                label="Wallet Address"
                value={walletAddress}
                readOnly
                className="font-mono text-sm"
              />
            )}

            <Button
              color="success"
              onClick={handleWalletLogin}
              isLoading={loading}
              isDisabled={!walletAddress}
              className="w-full"
            >
              Sign and Login
            </Button>
          </div>
        </Tab>

        {/* Manual input */}
        <Tab key="manual" title="Manual Input">
          <div className="space-y-4 py-4">
            <Input
              label="Wallet Address"
              placeholder="Enter wallet address"
              value={manualForm.address}
              onChange={(e) => setManualForm(prev => ({ 
                ...prev, 
                address: e.target.value 
              }))}
              className="font-mono text-sm"
            />

            <Input
              label="Signature"
              placeholder="Enter signature"
              value={manualForm.signature}
              onChange={(e) => setManualForm(prev => ({ 
                ...prev, 
                signature: e.target.value 
              }))}
              className="font-mono text-sm"
            />

            <Button
              color="primary"
              onClick={handleManualLogin}
              isLoading={loading}
              isDisabled={!manualForm.address || !manualForm.signature}
              className="w-full"
            >
              Login
            </Button>
          </div>
        </Tab>
      </Tabs>
      <div className="text-xs text-gray-500">
        <p>• Wallet login: automatically connect and sign</p>
        <p>• Manual input: suitable for offline scenarios</p>
        <p>• Signature content: the wallet address itself</p>
        <p>• Ensure the wallet address is in the admin list</p>
      </div>
    </div>
  );
};

// 扩展 Window 接口
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: string[] }) => Promise<string[]>;
      isMetaMask?: boolean;
    };
  }
}
