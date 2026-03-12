import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { Chip } from '@nextui-org/react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { adminUserApi } from '@/routes/pages/Admin/adminApi';
import { EAdminUserStatus } from '@/routes/pages/Admin/interface';

interface AdminUser {
  id: number;
  address: string;
  name: string;
  status: number;
  createdAt: number;
  updatedAt: number;
}

export const AdminUserManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Edit/Create modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [adminUserForm, setAdminUserForm] = useState({
    address: '',
    name: '',
    status: EAdminUserStatus.AdminUserStatusEnabled,
    sign: '',
  });

  // Load admin user list
  const loadAdminUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminUserApi.getList(page, pageSize);
      if (response.code === '200') {
        setAdminUsers(response.list);
        setTotal(parseInt(response.total));
      }
    } catch (error) {
      console.error('Failed to load admin user list:', error);
      toast.error('Failed to load admin user list');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Save admin user
  const saveAdminUser = async () => {
    try {
      setLoading(true);
      const response = await adminUserApi.create(adminUserForm);
      
      if (response.code === '200') {
        toast.success('Admin user created successfully');
        onEditOpenChange();
        resetForm();
        loadAdminUsers();
      } else {
        toast.error(response.msg || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save admin user:', error);
      toast.error('Failed to save admin user');
    } finally {
      setLoading(false);
    }
  };

  // Update admin user status
  const updateAdminUserStatus = async (id: number, status: number) => {
    try {
      setLoading(true);
      const response = await adminUserApi.updateStatus(id, status);
      if (response.code === '200') {
        toast.success('Admin user status updated successfully');
        loadAdminUsers();
      } else {
        toast.error(response.msg || 'Update failed');
      }
    } catch (error) {
      console.error('Failed to update admin user status:', error);
      toast.error('Failed to update admin user status');
    } finally {
      setLoading(false);
    }
  };

  // Delete admin user
  const deleteAdminUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this admin user?')) return;
    
    try {
      setLoading(true);
      const response = await adminUserApi.delete(id);
      if (response.code === '200') {
        toast.success('Admin user deleted successfully');
        loadAdminUsers();
      } else {
        toast.error(response.msg || 'Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete admin user:', error);
      toast.error('Failed to delete admin user');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setAdminUserForm({
      address: '',
      name: '',
      status: EAdminUserStatus.AdminUserStatusEnabled,
      sign: '',
    });
  };

  // Open edit modal
  const openEditModal = () => {
    resetForm();
    onEditOpen();
  };

  // Format time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US');
  };

  // Format address (show first 6 and last 4 characters)
  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    loadAdminUsers();
  }, [loadAdminUsers]);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <Spinner color="primary" size="lg" />
        </div>
      )}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Admin User Management</h3>
          <Button color="primary" onPress={() => openEditModal()}>
            Create Admin User
          </Button>
        </CardHeader>
        <CardBody>
          {/* Admin User List */}
          <Table aria-label="Admin User List">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Address</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Created At</TableColumn>
              <TableColumn>Updated At</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {adminUsers.map((adminUser) => (
                <TableRow key={adminUser.id}>
                  <TableCell>{adminUser.id}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatAddress(adminUser.address)}
                  </TableCell>
                  <TableCell>{adminUser.name}</TableCell>
                  <TableCell>
                    <Chip
                      color={adminUser.status == EAdminUserStatus.AdminUserStatusEnabled ? 'success' : 'danger'}
                      variant="light"
                    >
                      {adminUser.status == EAdminUserStatus.AdminUserStatusEnabled ? 'Enabled' : 'Disabled'}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatTime(adminUser.createdAt * 1000)}</TableCell>
                  <TableCell>{formatTime(adminUser.updatedAt * 1000)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color={adminUser.status === EAdminUserStatus.AdminUserStatusEnabled ? 'danger' : 'success'}
                        variant="flat"
                        onClick={() => updateAdminUserStatus(adminUser.id, adminUser.status === EAdminUserStatus.AdminUserStatusEnabled ? EAdminUserStatus.AdminUserStatusDisabled : EAdminUserStatus.AdminUserStatusEnabled)}
                        isLoading={loading}
                      >
                        {adminUser.status === EAdminUserStatus.AdminUserStatusEnabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onClick={() => deleteAdminUser(adminUser.id)}
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

      {/* Create Admin User Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Admin User
              </ModalHeader>
              <ModalBody className="space-y-4">
                <Input
                  label="Wallet Address"
                  placeholder="Enter wallet address"
                  value={adminUserForm.address}
                  onChange={(e) => setAdminUserForm(prev => ({ ...prev, address: e.target.value }))}
                />
                
                <Input
                  label="Name"
                  placeholder="Enter admin name"
                  value={adminUserForm.name}
                  onChange={(e) => setAdminUserForm(prev => ({ ...prev, name: e.target.value }))}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex gap-2">
                    <Chip
                      color={adminUserForm.status === EAdminUserStatus.AdminUserStatusEnabled ? 'success' : 'danger'}
                      variant="light"
                    >
                      {adminUserForm.status === EAdminUserStatus.AdminUserStatusEnabled ? 'Enabled' : 'Disabled'}
                    </Chip>
                    <Button
                      size="sm"
                      color={adminUserForm.status === EAdminUserStatus.AdminUserStatusEnabled ? 'danger' : 'success'}
                      variant="flat"
                      onClick={() => setAdminUserForm(prev => ({ 
                        ...prev, 
                        status: prev.status === EAdminUserStatus.AdminUserStatusEnabled ? EAdminUserStatus.AdminUserStatusDisabled : EAdminUserStatus.AdminUserStatusEnabled 
                      }))}
                    >
                      {adminUserForm.status === EAdminUserStatus.AdminUserStatusEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>

                <Input
                  label="Signature"
                  placeholder="Enter signature (for identity verification)"
                  value={adminUserForm.sign}
                  onChange={(e) => setAdminUserForm(prev => ({ ...prev, sign: e.target.value }))}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={saveAdminUser} isLoading={loading}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
