import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Textarea } from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { Chip } from '@nextui-org/react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { Image } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { stampApi, uploadApi } from '@/routes/pages/Admin/adminApi';
import { EStampStatus } from '@/routes/pages/Admin/interface';

interface Stamp {
  id: number;
  name: string;
  stampType: string;
  description: string;
  imgUrl: string;
  sorted: number;
  disabled: number;
  createdAt: number;
  updatedAt: number;
}

const STAMP_LABELS = [
  { key: 'common', label: 'Common' },
];

export const StampManagement = () => {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Edit/Create modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [editingStamp, setEditingStamp] = useState<Stamp | null>(null);
  const [stampForm, setStampForm] = useState({
    name: '',
    stampType: '',
    description: '',
    imgUrl: '',
    sorted: 0,
    disabled: EStampStatus.StampStatusEnabled,
  });
  const [uploading, setUploading] = useState(false);

  // Load stamp list
  const loadStamps = useCallback(async () => {
    try {
      setLoading(true);
      const response = await stampApi.getList(page, pageSize);
      if (response.code === '200') {
        setStamps(response.list as unknown as Stamp[]);
        setTotal(parseInt(response.total));
      }
    } catch (error) {
      console.error('Failed to load stamp list:', error);
      toast.error('Failed to load stamp list');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // File upload
  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const response = await uploadApi.upload(file);
      if (response.code === '200') {
        setStampForm(prev => ({ ...prev, imgUrl: response.fileUrl }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Save stamp
  const saveStamp = async () => {
    try {
      setLoading(true);
      const response = editingStamp
        ? await stampApi.update(editingStamp.id, stampForm)
        : await stampApi.create(stampForm);
      
      if (response.code === '200') {
        toast.success(editingStamp ? 'Stamp updated successfully' : 'Stamp created successfully');
        onEditOpenChange();
        resetForm();
        loadStamps();
      } else {
        toast.error(response.msg || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save stamp:', error);
      toast.error('Failed to save stamp');
    } finally {
      setLoading(false);
    }
  };

  // Delete stamp
  const deleteStamp = async (id: number) => {
    if (!confirm('Are you sure you want to delete this stamp?')) return;
    
    try {
      setLoading(true);
      const response = await stampApi.delete(id);
      if (response.code === '200') {
        toast.success('Stamp deleted successfully');
        loadStamps();
      } else {
        toast.error(response.msg || 'Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete stamp:', error);
      toast.error('Failed to delete stamp');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setStampForm({
      name: '',
      stampType: '',
      description: '',
      imgUrl: '',
      sorted: 0,
      disabled: EStampStatus.StampStatusEnabled,
    });
    setEditingStamp(null);
  };

  // Open edit modal
  const openEditModal = (stamp?: Stamp) => {
    if (stamp) {
      setEditingStamp(stamp);
      setStampForm({
        name: stamp.name,
        stampType: stamp.stampType,
        description: stamp.description,
        imgUrl: stamp.imgUrl,
        sorted: stamp.sorted,
        disabled: stamp.disabled,
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

  useEffect(() => {
    loadStamps();
  }, [loadStamps]);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <Spinner color="primary" size="lg" />
        </div>
      )}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Stamp Management</h3>
          <Button color="primary" onPress={() => openEditModal()}>
            Create Stamp
          </Button>
        </CardHeader>
        <CardBody>
          {/* Stamp List */}
          <Table aria-label="Stamp List">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Image</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Sort</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Created At</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {stamps?.map((stamp) => (
                <TableRow key={stamp.id}>
                  <TableCell>{stamp.id}</TableCell>
                  <TableCell>
                    <Image
                      src={stamp.imgUrl}
                      alt={stamp.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>{stamp.name}</TableCell>
                  <TableCell>
                    {STAMP_LABELS.find(type => type.key === stamp.stampType)?.label || stamp.stampType}
                  </TableCell>
                  <TableCell>{stamp.sorted}</TableCell>
                  <TableCell>
                    <Chip
                      color={stamp.disabled === EStampStatus.StampStatusEnabled ? 'danger' : 'success'}
                      variant="light"
                    >
                      {stamp.disabled === EStampStatus.StampStatusEnabled ? 'Disabled' : 'Enabled'}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatTime(stamp.createdAt * 1000)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => openEditModal(stamp)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onClick={() => deleteStamp(stamp.id)}
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

      {/* Edit/Create Stamp Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingStamp ? 'Edit Stamp' : 'Create Stamp'}
              </ModalHeader>
              <ModalBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Stamp Name"
                    placeholder="Enter stamp name"
                    value={stampForm.name}
                    onChange={(e) => setStampForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Select
                    label="Stamp Label"
                    placeholder="Select stamp label"
                    selectedKeys={stampForm.stampType ? [stampForm.stampType] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setStampForm(prev => ({ ...prev, stampType: selected }));
                    }}
                  >
                    {STAMP_LABELS?.map((type) => (
                      <SelectItem key={type.key} value={type.key}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                
                <Textarea
                  label="Stamp Description"
                  placeholder="Enter stamp description"
                  value={stampForm.description}
                  onChange={(e) => setStampForm(prev => ({ ...prev, description: e.target.value }))}
                />
{/*                 
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Sort Order"
                    placeholder="Lower numbers appear first"
                    value={stampForm.sorted.toString()}
                    onChange={(e) => setStampForm(prev => ({ 
                      ...prev, 
                      sorted: parseInt(e.target.value) || 0 
                    }))}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Status:</label>
                    <Chip
                      color={stampForm.disabled === EStampStatus.StampStatusEnabled ? 'danger' : 'success'}
                      variant="light"
                    >
                      {stampForm.disabled === EStampStatus.StampStatusEnabled ? 'Disabled' : 'Enabled'}
                    </Chip>
                    <Button
                      size="sm"
                      color={stampForm.disabled === EStampStatus.StampStatusEnabled ? 'success' : 'danger'}
                      variant="flat"
                      onClick={() => setStampForm(prev => ({ ...prev, disabled: prev.disabled === EStampStatus.StampStatusEnabled ? EStampStatus.StampStatusDisabled : EStampStatus.StampStatusEnabled }))}
                    >
                      {stampForm.disabled === EStampStatus.StampStatusEnabled ? 'Enable' : 'Disable'}
                    </Button>
                  </div>
                </div> */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stamp Image</label>
                  <div className="flex gap-4 items-center">
                    {stampForm.imgUrl && (
                      <Image
                        src={stampForm.imgUrl}
                        alt="Stamp preview"
                        width={80}
                        height={80}
                        className="rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                        }
                      }}
                      className="hidden"
                      id="stamp-image-upload"
                    />
                    <Button
                      as="label"
                      htmlFor="stamp-image-upload"
                      color="primary"
                      variant="flat"
                      isLoading={uploading}
                    >
                      Upload Image
                    </Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={saveStamp} isLoading={loading}>
                  {editingStamp ? 'Update' : 'Create'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
