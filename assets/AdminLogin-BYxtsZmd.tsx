import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Tabs, Tab } from '@nextui-org/tabs';
import { toast } from 'react-toastify';
import { authApi } from '@/routes/pages/Admin/adminApi';
import { Buffer } from 'buffer';

interface LoginProps {
  onLoginSuccess: (userId: number) => void;
}

export const AdminLogin = ({ onLoginSuccess }: LoginProps) => {
  const [loading, setLoading] = useState(false);
  
  // Manual input mode state
  const [manualForm, setManualForm] = useState({
    address: '',
    signature: '',
  });
  
  // Wallet connection mode state
  const [walletAddress, setWalletAddress] = useState('');

  // Check if Ethereum wallet is available
  const isWalletAvailable = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!isWalletAvailable()) {
      toast.error('Please install MetaMask or other Ethereum wallet');
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        toast.success('Wallet connected successfully');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet, please try again');
    } finally {
      setLoading(false);
    }
  };

  // Wallet signature login
  const walletSignAndLogin = async () => {
    if (!walletAddress) {
      toast.error('Please connect wallet first');
      return;
    }

    if (!isWalletAvailable()) {
      toast.error('Please install MetaMask or other Ethereum wallet');
      return;
    }

    try {
      setLoading(true);
      
      // Use personal_sign to sign wallet address

      const msg = `0x${Buffer.from(walletAddress, "utf8").toString("hex")}`

      const signature = await window.ethereum!.request({
        method: 'personal_sign',
        params: [msg, walletAddress], // Sign own address
      });

      // Call login API
      const response = await authApi.login(walletAddress, signature as unknown as string);
      
      if (response.code === '200') {
        toast.success('Login successful');
        onLoginSuccess(response.userId);
      } else {
        toast.error(response.msg || 'Login failed');
      }
    } catch (error: unknown) {
      console.error('Login failed:', error);
      if ((error as { code?: number })?.code === 4001) {
        toast.error('User rejected signature request');
      } else {
        toast.error('Login failed, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual input login
  const manualLogin = async () => {
    if (!manualForm.address || !manualForm.signature) {
      toast.error('Please enter wallet address and signature');
      return;
    }

    try {
      setLoading(true);
      
      const response = await authApi.login(manualForm.address, manualForm.signature);
      
      if (response.code === '200') {
        toast.success('Login successful');
        onLoginSuccess(response.userId);
      } else {
        toast.error(response.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed, please check if address and signature are correct');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Admin Login</h2>
        </CardHeader>
        <CardBody>
          <Tabs aria-label="Login Methods" className="w-full">
            {/* Wallet Connection Mode */}
            <Tab key="wallet" title="Wallet Login">
              <div className="space-y-4 py-4">
                {/* Wallet Connection */}
                <div className="space-y-2">
                  <Button
                    color="primary"
                    className="w-full"
                    onClick={connectWallet}
                    isLoading={loading}
                    isDisabled={!isWalletAvailable()}
                  >
                    {isWalletAvailable() ? 'Connect Wallet' : 'Please Install MetaMask'}
                  </Button>
                </div>

                {/* Address Display */}
                {walletAddress && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Wallet Address</label>
                    <Input
                      value={walletAddress}
                      readOnly
                      className="font-mono text-sm"
                    />
                  </div>
                )}

                {/* Sign and Login Button */}
                <Button
                  color="success"
                  className="w-full"
                  onClick={walletSignAndLogin}
                  isLoading={loading}
                  isDisabled={!walletAddress}
                >
                  Sign & Login
                </Button>
              </div>
            </Tab>

            {/* Manual Input Mode */}
            <Tab key="manual" title="Manual Input">
              <div className="space-y-4 py-4">
                {/* Wallet Address Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Wallet Address</label>
                  <Input
                    value={manualForm.address}
                    onChange={(e) => setManualForm(prev => ({ 
                      ...prev, 
                      address: e.target.value 
                    }))}
                    placeholder="Enter wallet address"
                    className="font-mono text-sm"
                  />
                </div>

                {/* Signature Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Signature</label>
                  <Input
                    value={manualForm.signature}
                    onChange={(e) => setManualForm(prev => ({ 
                      ...prev, 
                      signature: e.target.value 
                    }))}
                    placeholder="Enter signature result"
                    className="font-mono text-sm"
                  />
                </div>

                {/* Login Button */}
                <Button
                  color="primary"
                  className="w-full"
                  onClick={manualLogin}
                  isLoading={loading}
                  isDisabled={!manualForm.address || !manualForm.signature}
                >
                  Login
                </Button>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

// Extend Window interface to support ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: string[] }) => Promise<string[]>;
      isMetaMask?: boolean;
    };
  }
}
