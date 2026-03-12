import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Switch } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';
import { settingsApi } from '@/routes/pages/Admin/adminApi';
import { toast } from 'react-toastify';

export const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    enableInviteCode: false,
    firstTaskId: 0,
  });
  const [loading, setLoading] = useState(false);

  // Load system settings
  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsApi.getSettings();
      if (response.code === '200') {
        setSettings({
          enableInviteCode: response.enableInviteCode,
          firstTaskId: response.firstTaskId,
        });
      }
    } catch (error) {
      console.error('加载设置失败:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // Update invite code setting
  const updateInviteCodeSetting = async (enabled: boolean) => {
    try {
      setLoading(true);
      const response = await settingsApi.updateEnableInviteCode(enabled);
      if (response.code === '200') {
        setSettings(prev => ({ ...prev, enableInviteCode: enabled }));
        toast.success('Invite code settings updated successfully');
      } else {
        toast.error(response.msg || 'Update failed');
      }
    } catch (error) {
      console.error('更新邀请码设置失败:', error);
      toast.error('Failed to update invite code settings');
    } finally {
      setLoading(false);
    }
  };

  // Update first task ID
  const updateFirstTaskId = async () => {
    try {
      setLoading(true);
      const response = await settingsApi.updateFirstTaskId(settings.firstTaskId);
      if (response.code === '200') {
        toast.success('First task ID updated successfully');
      } else {
        toast.error(response.msg || 'Update failed');
      }
    } catch (error) {
      console.error('更新第一个任务ID失败:', error);
      toast.error('Failed to update first task ID');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <Spinner color="primary" size="lg" />
        </div>
      )}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">System Settings</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {loading && (
            <div className="w-full flex justify-center py-2">
              <Spinner color="primary" size="sm" />
            </div>
          )}
          {/* Invite Code Settings */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Invite Code</h4>
              <p className="text-sm text-gray-500">Control whether to enable invite code functionality</p>
            </div>
            <Switch
              isSelected={settings.enableInviteCode}
              onValueChange={updateInviteCodeSetting}
              isDisabled={loading}
            />
          </div>

          {/* First Task ID Settings */}
          <div className="space-y-2">
            <h4 className="font-medium">First Task ID</h4>
            <p className="text-sm text-gray-500">Set the task ID displayed when users first enter</p>
            <div className="flex gap-2">
              <Input
                type="number"
                value={settings.firstTaskId.toString()}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  firstTaskId: parseInt(e.target.value) || 0 
                }))}
                placeholder="Enter task ID"
                className="flex-1"
              />
              <Button
                color="primary"
                onClick={updateFirstTaskId}
                isLoading={loading}
              >
                Update
              </Button>
            </div>
          </div>

          {/* Toast-based notifications, no in-page message block */}
        </CardBody>
      </Card>
    </div>
  );
};
