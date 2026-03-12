import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Textarea } from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { Image } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { signInRewardApi, stampApi } from '@/routes/pages/Admin/adminApi';
import React from 'react';

interface SignInReward {
  id: number;
  description: string;
  requiredConsecutiveDays: number;
  rewardPoints: number;
  rewardStampId: number;
  createdAt: number;
  updatedAt: number;
}

interface Stamp {
  id: number;
  name: string;
  stampType: string;
  description: string;
  imgUrl: string;
  sorted: number;
  disabled: boolean;
}

export const SignInRewardManagement = () => {
  const [rewards, setRewards] = useState<SignInReward[]>([]);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Edit/Create modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [editingReward, setEditingReward] = useState<SignInReward | null>(null);
  const [rewardForm, setRewardForm] = useState({
    description: '',
    requiredConsecutiveDays: 0,
    rewardPoints: 0,
    rewardStampId: 0,
  });

  // Load sign-in reward list
  const loadRewards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await signInRewardApi.getList(page, pageSize);
      if (response.code === '200') {
        setRewards(response.list);
        setTotal(parseInt(response.total));
      }
    } catch (error) {
      console.error('Failed to load sign-in reward list:', error);
      toast.error('Failed to load sign-in reward list');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Load stamp list (for selecting reward stamps)
  const loadStamps = async () => {
    try {
      const response = await stampApi.getList(1, 100); // 获取所有徽章
      if (response.code === '200') {
        setStamps(response.list);
      }
    } catch (error) {
      console.error('Failed to load stamp list:', error);
    }
  };

  // Save sign-in reward
  const saveReward = async () => {
    try {
      setLoading(true);
      const response = editingReward
        ? await signInRewardApi.update(editingReward.id, rewardForm)
        : await signInRewardApi.create(rewardForm);
      
      if (response.code === '200') {
        toast.success(editingReward ? 'Sign-in reward updated successfully' : 'Sign-in reward created successfully');
        onEditOpenChange();
        resetForm();
        loadRewards();
      } else {
        toast.error(response.msg || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save sign-in reward:', error);
      toast.error('Failed to save sign-in reward');
    } finally {
      setLoading(false);
    }
  };

  // Delete sign-in reward
  const deleteReward = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sign-in reward?')) return;
    
    try {
      setLoading(true);
      const response = await signInRewardApi.delete(id);
      if (response.code === '200') {
        toast.success('Sign-in reward deleted successfully');
        loadRewards();
      } else {
        toast.error(response.msg || 'Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete sign-in reward:', error);
      toast.error('Failed to delete sign-in reward');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setRewardForm({
      description: '',
      requiredConsecutiveDays: 0,
      rewardPoints: 0,
      rewardStampId: 0,
    });
    setEditingReward(null);
  };

  // Open edit modal
  const openEditModal = (reward?: SignInReward) => {
    if (reward) {
      setEditingReward(reward);
      setRewardForm({
        description: reward.description,
        requiredConsecutiveDays: reward.requiredConsecutiveDays,
        rewardPoints: reward.rewardPoints,
        rewardStampId: reward.rewardStampId,
      });
    } else {
      resetForm();
    }
    onEditOpen();
  };

  // Format time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US');
  };

  // Get stamp name
  const getStampName = (stampId: number) => {
    const stamp = stamps?.find(s => s.id === stampId);
    return stamp ? stamp.name : `Stamp ID: ${stampId}`;
  };

  useEffect(() => {
    loadRewards();
    loadStamps();
  }, [loadRewards]);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <Spinner color="primary" size="lg" />
        </div>
      )}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Sign-in Reward Management</h3>
          <Button color="primary" onPress={() => openEditModal()}>
            Create Sign-in Reward
          </Button>
        </CardHeader>
        <CardBody>
          {/* Sign-in Reward List */}
          <Table aria-label="Sign-in Reward List">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Consecutive Days</TableColumn>
              <TableColumn>Reward Points</TableColumn>
              <TableColumn>Reward Stamp</TableColumn>
              <TableColumn>Created At</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {rewards?.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>{reward.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{reward.description}</TableCell>
                  <TableCell>{reward.requiredConsecutiveDays} days</TableCell>
                  <TableCell>{reward.rewardPoints}</TableCell>
                  <TableCell className='flex items-center gap-1'>
                    <Image
                      src={stamps?.find(s => s.id === reward.rewardStampId)?.imgUrl}
                      alt={stamps?.find(s => s.id === reward.rewardStampId)?.name}
                      width={20}
                      height={20}
                      className="rounded"
                    />
                    {reward.rewardStampId ? getStampName(reward.rewardStampId) : '-'}
                  </TableCell>
                  <TableCell>{formatTime(reward.createdAt * 1000)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => openEditModal(reward)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onClick={() => deleteReward(reward.id)}
                        isLoading={loading}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Button
              isDisabled={page === 1}
              onClick={() => setPage(page - 1)}
              variant="flat"
            >
              Previous
            </Button>
            <span className="mx-4 flex items-center">
              Page {page} of {Math.ceil(total / pageSize)}
            </span>
            <Button
              isDisabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage(page + 1)}
              variant="flat"
            >
              Next
            </Button>
          </div>

        </CardBody>
      </Card>

      {/* Edit/Create Sign-in Reward Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingReward ? 'Edit Sign-in Reward' : 'Create Sign-in Reward'}
              </ModalHeader>
              <ModalBody className="space-y-4">
                <Textarea
                  label="Reward Description"
                  placeholder="Enter reward description"
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm(prev => ({ ...prev, description: e.target.value }))}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    // type="number"
                    label="Consecutive Sign-in Days"
                    placeholder="Enter consecutive sign-in days"
                    value={rewardForm.requiredConsecutiveDays.toString()}
                    onChange={(e) => setRewardForm(prev => ({ 
                      ...prev, 
                      requiredConsecutiveDays: parseInt(e.target.value) || 0 
                    }))}
                    min={0}
                  />
                  <Input
                    // type="number"
                    label="Reward Points"
                    placeholder="Enter reward points"
                    value={rewardForm.rewardPoints.toString()}
                    onChange={(e) => setRewardForm(prev => ({ 
                      ...prev, 
                      rewardPoints: parseInt(e.target.value) || 0 
                    }))}
                    min={0}
                  />
                </div>

                <Select
                  label="Reward Stamp"
                  placeholder="Select Stamp"
                  selectedKeys={rewardForm.rewardStampId ? [rewardForm.rewardStampId.toString()] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setRewardForm(prev => ({ 
                      ...prev, 
                      rewardStampId: selected ? parseInt(selected) : 0 
                    }));
                  }}
                  renderValue={(items) => {
                    return items.map((item) => {
                      const stamp = stamps?.find(s => s.id.toString() === item.key);
                      if (!stamp) return item.textValue;
                      return (
                        <div key={item.key} className="flex items-center gap-2">
                          <Image
                            src={stamp.imgUrl}
                            alt={stamp.name}
                            width={20}
                            height={20}
                            className="rounded"
                          />
                          <span>{stamp.name}</span>
                        </div>
                      );
                    });
                  }}
                >
                  <SelectItem key="0" value="0">
                    Select Stamp
                  </SelectItem>
                  <React.Fragment>
                    {stamps?.map((stamp) => (
                      <SelectItem 
                        key={stamp.id.toString()} 
                        value={stamp.id.toString()}
                        textValue={`${stamp.name} (${stamp.stampType})`}
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={stamp.imgUrl}
                            alt={stamp.name}
                            width={24}
                            height={24}
                            className="rounded"
                          />
                          <div>
                            <div className="font-medium">{stamp.name}</div>
                            <div className="text-xs text-gray-500">{stamp.stampType}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </React.Fragment>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={saveReward} isLoading={loading}>
                  {editingReward ? 'Update' : 'Create'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
