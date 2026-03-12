import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Textarea } from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { Image } from '@nextui-org/react';
import { Tabs, Tab } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';
import { CustomDatePicker } from './Datepicker';
import { toast } from 'react-toastify';
import { taskApi, stampApi, uploadApi } from '@/routes/pages/Admin/adminApi';
import { ETaskType, ETaskForceLocked } from '@/routes/pages/Admin/interface';
import React from 'react';

interface TaskGroup {
  id: number;
  title: string;
  description: string;
  imgUrl: string;
  startAt: number;
  endAt: number;
  taskList: Task[];
  createdAt: number;
  updatedAt: number;
}

interface Task {
  id: number;
  groupId?: number;
  title: string;
  description: string;
  imgUrl: string;
  taskType: string;
  RewardPoints: number;
  RewardStampId: number;
  startAt: number;
  endAt: number;
  forceLocked: boolean;
  inviteTaskConfig?: { requestInviteNum: number };
  postTwitterTaskConfig?: { content: string };
  quoteTwitterTaskConfig?: { content: string };
  quizTaskConfig?: { quiz: string; answer: string };
  retweetAndLikeTwitterTaskConfig?: { content: string };
  interactionNicknameTwitterTaskConfig?: { content: string };
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

export const TASK_TYPES = [
  { key: ETaskType.TaskTypeInvite, label: 'Invite Task' },
  { key: ETaskType.TaskTypeQuiz, label: 'Quiz Task' },
  // { key: 'signIn', label: 'Sign-in Task' }, // 签到任务暂时保持原样，因为枚举中没有定义
  { key: ETaskType.TaskTypePostTwitter, label: 'Post Twitter Task' },
  { key: ETaskType.TaskTypeQuoteTwitter, label: 'Quote Twitter Task' },
  { key: ETaskType.TaskTypeRetweetAndLike, label: 'Retweet and Like Task' },
  { key: ETaskType.TaskTypeInteractionNickname, label: 'Interaction With Nickname' },
];

export const TASK_TYPE_LABELS = {
  [ETaskType.TaskTypeInvite]: 'Invite',
  [ETaskType.TaskTypeQuiz]: 'Quiz',
  [ETaskType.TaskTypePostTwitter]: 'Post',
  [ETaskType.TaskTypeQuoteTwitter]: 'Comment',
  [ETaskType.TaskTypeRetweetAndLike]: 'Retweet&Like',
  [ETaskType.TaskTypeInteractionNickname]: 'Interaction',
};


export const TaskManagement = () => {
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('taskGroups');

  // Edit/Create task modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({
    groupId: 0,
    title: '',
    description: '',
    imgUrl: '',
    taskType: '',
    RewardPoints: 0,
    RewardStampId: 0,
    startAt: 0,
    endAt: 0,
    forceLocked: ETaskForceLocked.TaskForceLockedNo,
    inviteTaskConfig: { requestInviteNum: 0 },
    postTwitterTaskConfig: { content: '' },
    quoteTwitterTaskConfig: { content: '' },
    retweetAndLikeTwitterTaskConfig: { content: '' },
    interactionNicknameTwitterTaskConfig: { content: '' },
    quizTaskConfig: { quiz: '', answer: '' },
  });
  const [uploading, setUploading] = useState(false);

  // Edit/Create task group modal
  const { isOpen: isGroupEditOpen, onOpen: onGroupEditOpen, onOpenChange: onGroupEditOpenChange } = useDisclosure();
  const [editingTaskGroup, setEditingTaskGroup] = useState<TaskGroup | null>(null);
  const [taskGroupForm, setTaskGroupForm] = useState({
    title: '',
    description: '',
    imgUrl: '',
    startAt: 0,
    endAt: 0,
  });
  const [groupUploading, setGroupUploading] = useState(false);


  // Load task group list
  const loadTaskGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTaskGroupList(page, pageSize);
      if (response.code === '200') {
        setTaskGroups(response.list as TaskGroup[]);
        setTotal(parseInt(response.total));
      }
    } catch (error) {
      console.error('Failed to load task group list:', error);
      toast.error('Failed to load task group list');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Load task list
  const loadTasks = useCallback(async (groupId: number) => {
    try {
      setLoading(true);
      const response = await taskApi.getTaskList(groupId, page, pageSize);
      if (response.code === '200') {
        setTasks(response.list as Task[]);
        setTotal(parseInt(response.total));
      }
    } catch (error) {
      console.error('Failed to load task list:', error);
      toast.error('Failed to load task list');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Load tasks when selectedGroupId changes
  useEffect(() => {
    if (selectedGroupId) {
      loadTasks(selectedGroupId);
    }
  }, [selectedGroupId, loadTasks]);


  // Load stamp list
  const loadStamps = async () => {
    try {
      const response = await stampApi.getList(1, 100);
      if (response.code === '200') {
        setStamps(response.list as Stamp[]);
      }
    } catch (error) {
      console.error('Failed to load stamp list:', error);
    }
  };

  // File upload
  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const response = await uploadApi.upload(file);
      if (response.code === '200') {
        setTaskForm(prev => ({ ...prev, imgUrl: response.fileUrl }));
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

  // File upload for task group
  const handleGroupFileUpload = async (file: File) => {
    try {
      setGroupUploading(true);
      const response = await uploadApi.upload(file);
      if (response.code === '200') {
        setTaskGroupForm(prev => ({ ...prev, imgUrl: response.fileUrl }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Image upload failed');
    } finally {
      setGroupUploading(false);
    }
  };

  // Save task
  const saveTask = async () => {
    try {
      setLoading(true);

      // 构建任务数据，只对quiz类型进行JSON转换
      const taskData = {
        ...taskForm,
        ...(taskForm.taskType === 'quiz' ? {
          quizTaskConfig: {
            quiz: taskForm.quizTaskConfig.quiz,
            answer: taskForm.quizTaskConfig.answer
          }
        } : {}),
      };

      const response = editingTask
        ? await taskApi.updateTask({ ...taskData, id: editingTask.id })
        : await taskApi.createTask(taskData);

      if (response.code === '200') {
        toast.success(editingTask ? 'Task updated successfully' : 'Task created successfully');
        onEditOpenChange();
        resetForm();
        if (selectedGroupId) {
          loadTasks(selectedGroupId);
        }
      } else {
        toast.error(response.msg || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save task:', error);
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      setLoading(true);
      const response = await taskApi.deleteTask(id);
      if (response.code === '200') {
        toast.success('Task deleted successfully');
        if (selectedGroupId) {
          loadTasks(selectedGroupId);
        }
      } else {
        toast.error(response.msg || 'Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };


  // Save task group
  const saveTaskGroup = async () => {
    try {
      setLoading(true);
      const response = editingTaskGroup
        ? await taskApi.updateTaskGroup(editingTaskGroup.id, taskGroupForm)
        : await taskApi.createTaskGroup(taskGroupForm);

      if (response.code === '200') {
        toast.success(editingTaskGroup ? 'Task group updated successfully' : 'Task group created successfully');
        onGroupEditOpenChange();
        resetGroupForm();
        loadTaskGroups();
      } else {
        toast.error(response.msg || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save task group:', error);
      toast.error('Failed to save task group');
    } finally {
      setLoading(false);
    }
  };

  // Delete task group
  const deleteTaskGroup = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task group?')) return;

    try {
      setLoading(true);
      const response = await taskApi.deleteTaskGroup(id);
      if (response.code === '200') {
        toast.success('Task group deleted successfully');
        loadTaskGroups();
      } else {
        toast.error(response.msg || 'Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete task group:', error);
      toast.error('Failed to delete task group');
    } finally {
      setLoading(false);
    }
  };

  // Reset task group form
  const resetGroupForm = () => {
    setTaskGroupForm({
      title: '',
      description: '',
      imgUrl: '',
      startAt: 0,
      endAt: 0,
    });
    setEditingTaskGroup(null);
  };

  // Open task group edit modal
  const openGroupEditModal = (taskGroup?: TaskGroup) => {
    if (taskGroup) {
      setEditingTaskGroup(taskGroup);
      setTaskGroupForm({
        title: taskGroup.title,
        description: taskGroup.description,
        imgUrl: taskGroup.imgUrl,
        startAt: taskGroup.startAt,
        endAt: taskGroup.endAt,
      });
    } else {
      resetGroupForm();
    }
    onGroupEditOpen();
  };

  // Reset form
  const resetForm = () => {
    setTaskForm({
      groupId: selectedGroupId || 0,
      title: '',
      description: '',
      imgUrl: '',
      taskType: '',
      RewardPoints: 0,
      RewardStampId: 0,
      startAt: 0,
      endAt: 0,
      forceLocked: ETaskForceLocked.TaskForceLockedNo,
      inviteTaskConfig: { requestInviteNum: 0 },
      postTwitterTaskConfig: { content: '' },
      quoteTwitterTaskConfig: { content: '' },
      retweetAndLikeTwitterTaskConfig: { content: '' },
      interactionNicknameTwitterTaskConfig: { content: '' },
      quizTaskConfig: { quiz: '', answer: '' },
    });
    setEditingTask(null);
  };

  // Open edit modal
  const openEditModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);

      // 只处理quiz类型的配置解析
      const quizConfig = task.taskType === 'quiz' && task.quizTaskConfig ? {
        quiz: task.quizTaskConfig.quiz || '',
        answer: task.quizTaskConfig.answer || ''
      } : { quiz: '', answer: '' };

      setTaskForm({
        groupId: task.groupId || selectedGroupId || 0,
        title: task.title,
        description: task.description,
        imgUrl: task.imgUrl,
        taskType: task.taskType,
        RewardPoints: task.RewardPoints,
        RewardStampId: task.RewardStampId,
        startAt: task.startAt,
        endAt: task.endAt,
        forceLocked: task.forceLocked ? ETaskForceLocked.TaskForceLockedYes : ETaskForceLocked.TaskForceLockedNo,
        inviteTaskConfig: task.inviteTaskConfig || { requestInviteNum: 0 },
        postTwitterTaskConfig: task.postTwitterTaskConfig || { content: '' },
        quoteTwitterTaskConfig: task.quoteTwitterTaskConfig || { content: '' },
        quizTaskConfig: quizConfig,
        retweetAndLikeTwitterTaskConfig: task.retweetAndLikeTwitterTaskConfig || { content: '' },
        interactionNicknameTwitterTaskConfig: task.interactionNicknameTwitterTaskConfig || { content: '' },
      });
    } else {
      resetForm();
    }
    onEditOpen();
  };

  // Format time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US');
  };



  // Get stamp name
  const getStampName = (stampId: number) => {
    const stamp = stamps?.find(s => s.id === stampId);
    return stamp ? stamp.name : `Stamp ID: ${stampId}`;
  };

  useEffect(() => {
    loadTaskGroups();
    loadStamps();
  }, [loadTaskGroups]);

  useEffect(() => {
    if (selectedGroupId) {
      loadTasks(selectedGroupId);
    }
  }, [selectedGroupId, loadTasks]);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <Spinner color="primary" size="lg" />
        </div>
      )}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Task Management</h3>
        </CardHeader>
        <CardBody>
          <Tabs
            aria-label="Task Management"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            <Tab key="taskGroups" title="Task Groups">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Task Group List</h4>
                  <Button color="primary" size="sm" onPress={() => openGroupEditModal()}>
                    Create Task Group
                  </Button>
                </div>

                <Table aria-label="Task Group List">
                  <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>Title</TableColumn>
                    <TableColumn>Description</TableColumn>
                    <TableColumn>Start Time</TableColumn>
                    <TableColumn>End Time</TableColumn>
                    <TableColumn>Task Count</TableColumn>
                    <TableColumn>Actions</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {taskGroups?.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell>{group.id}</TableCell>
                        <TableCell>{group.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{group.description}</TableCell>
                        <TableCell>{formatTime(group.startAt)}</TableCell>
                        <TableCell>{formatTime(group.endAt)}</TableCell>
                        <TableCell>{group.taskList?.length || 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onClick={() => {
                                setSelectedGroupId(group.id);
                                setActiveTab('tasks');
                              }}
                            >
                              Manage Tasks
                            </Button>
                            <Button
                              size="sm"
                              color="warning"
                              variant="flat"
                              onClick={() => openGroupEditModal(group)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              onClick={() => deleteTaskGroup(group.id)}
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
              </div>
            </Tab>

            <Tab key="tasks" title="Tasks">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h4 className="font-medium">Task Management</h4>
                    <Select
                      placeholder="Select Task Group"
                      selectedKeys={selectedGroupId ? [selectedGroupId.toString()] : []}
                      onSelectionChange={(keys) => {
                        const groupId = Array.from(keys)[0] as string;
                        setSelectedGroupId(groupId ? parseInt(groupId) : null);
                      }}
                      className="w-64"
                    >
                      {taskGroups?.map((group) => (
                        <SelectItem key={group.id.toString()} value={group.id.toString()}>
                          {group.title}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <Button
                    color="primary"
                    size="sm"
                    onPress={() => openEditModal()}
                    isDisabled={!selectedGroupId}
                  >
                    Create Task
                  </Button>
                </div>

                {selectedGroupId ? (
                  <Table aria-label="Task List">
                    <TableHeader>
                      <TableColumn>ID</TableColumn>
                      <TableColumn>Title</TableColumn>
                      <TableColumn>Type</TableColumn>
                      <TableColumn>Reward Points</TableColumn>
                      <TableColumn>Reward Stamp</TableColumn>
                      {/* <TableColumn>Force Locked</TableColumn> */}
                      <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {tasks?.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{task.id}</TableCell>
                          <TableCell>{task.title}</TableCell>
                          <TableCell>
                            {TASK_TYPES.find(type => type.key === task.taskType)?.label || task.taskType}
                          </TableCell>
                          <TableCell>{task.RewardPoints}</TableCell>
                          <TableCell className='flex items-center gap-1'>
                            <Image
                              src={stamps?.find(s => s.id === task.RewardStampId)?.imgUrl}
                              alt={stamps?.find(s => s.id === task.RewardStampId)?.name}
                              width={20}
                              height={20}
                              className="rounded"
                            />
                            {task.RewardStampId ? getStampName(task.RewardStampId) : '-'}</TableCell>
                          {/* <TableCell>
                            <Chip
                              color={task.forceLocked ? 'warning' : 'default'}
                              variant="light"
                            >
                              {task.forceLocked ? 'Locked' : 'Normal'}
                            </Chip>
                          </TableCell> */}
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                onClick={() => openEditModal(task)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                variant="flat"
                                onClick={() => deleteTask(task.id)}
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
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Please select a task group to manage tasks
                  </div>
                )}
              </div>
            </Tab>

          </Tabs>

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

      {/* Edit/Create Task Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="4xl" className='max-h-[80vh] overflow-y-auto'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingTask ? 'Edit Task' : 'Create Task'}
              </ModalHeader>
              <ModalBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Task Title"
                    placeholder="Enter task title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Select
                    label="Task Type"
                    placeholder="Select task type"
                    selectedKeys={taskForm.taskType ? [taskForm.taskType] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setTaskForm(prev => ({ ...prev, taskType: selected }));
                    }}
                  >
                    {TASK_TYPES?.map((type) => (
                      <SelectItem key={type.key} value={type.key}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <Textarea
                  label="Task Description"
                  placeholder="Enter task description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Reward Points"
                    placeholder="Enter reward points"
                    value={taskForm.RewardPoints.toString()}
                    onChange={(e) => setTaskForm(prev => ({
                      ...prev,
                      RewardPoints: parseInt(e.target.value) || 0
                    }))}
                  />
                  <div className="space-y-2">
                    {/* <label className="text-sm font-medium">Reward Stamp</label> */}
                    <Select
                      label="Reward Stamp"
                      placeholder="Select Stamp"
                      selectedKeys={taskForm.RewardStampId ? [taskForm.RewardStampId.toString()] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setTaskForm(prev => ({
                          ...prev,
                          RewardStampId: selected ? parseInt(selected) : 0
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
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CustomDatePicker
                    label="Start Time"
                    value={taskForm.startAt}
                    onChange={(timestamp) => setTaskForm(prev => ({
                      ...prev,
                      startAt: timestamp
                    }))}
                    granularity="minute"
                  />
                  <CustomDatePicker
                    label="End Time"
                    value={taskForm.endAt}
                    onChange={(timestamp) => setTaskForm(prev => ({
                      ...prev,
                      endAt: timestamp
                    }))}
                    granularity="minute"
                  />
                </div>

                {/* Task type specific configuration */}
                {taskForm.taskType === 'invite' && (
                  <Input
                    type="number"
                    label="Required Invite Count"
                    placeholder="Enter required invite count"
                    value={taskForm.inviteTaskConfig.requestInviteNum.toString()}
                    onChange={(e) => setTaskForm(prev => ({
                      ...prev,
                      inviteTaskConfig: {
                        ...prev.inviteTaskConfig,
                        requestInviteNum: parseInt(e.target.value) || 0
                      }
                    }))}
                  />
                )}

                {(taskForm.taskType === 'postTwitter') && (
                  <Textarea
                    label="Twitter Post Content Requirement"
                    placeholder="Enter Twitter post content requirement"
                    value={taskForm.postTwitterTaskConfig.content}
                    onChange={(e) => setTaskForm(prev => ({
                      ...prev,
                      postTwitterTaskConfig: {
                        ...prev.postTwitterTaskConfig,
                        content: e.target.value
                      }
                    }))}
                  />
                )}

                {(taskForm.taskType === 'quoteTwitter') && (
                  <Textarea
                    label="Twitter Quote URL"
                    placeholder="Enter Twitter URL"
                    value={taskForm.quoteTwitterTaskConfig.content}
                    onChange={(e) => setTaskForm(prev => ({
                      ...prev,
                      quoteTwitterTaskConfig: {
                        ...prev.quoteTwitterTaskConfig,
                        content: e.target.value
                      }
                    }))}
                  />
                )}

                {(taskForm.taskType === 'retweetAndLike') && (
                  <Textarea
                    label="Twitter Quote URL"
                    placeholder="Enter Twitter URL"
                    value={taskForm.retweetAndLikeTwitterTaskConfig.content}
                    onChange={(e) => setTaskForm(prev => ({
                      ...prev,
                      retweetAndLikeTwitterTaskConfig: {
                        ...prev.retweetAndLikeTwitterTaskConfig,
                        content: e.target.value
                      }
                    }))}
                  />
                )}

                {(taskForm.taskType === 'interaction.nickname') && (
                  <Textarea
                    label="Interaction Nickname"
                    placeholder="Enter interaction nickname"
                    value={taskForm.interactionNicknameTwitterTaskConfig.content}
                    onChange={(e) => setTaskForm(prev => ({
                      ...prev,
                      interactionNicknameTwitterTaskConfig: {
                        ...prev.interactionNicknameTwitterTaskConfig,
                        content: e.target.value
                      }
                    }))}
                  />
                )}

                {taskForm.taskType === 'quiz' && (
                  <div className="space-y-4">
                    <Textarea
                      label="Question"
                      placeholder="Enter question"
                      value={taskForm.quizTaskConfig.quiz}
                      onChange={(e) => setTaskForm(prev => ({
                        ...prev,
                        quizTaskConfig: {
                          ...prev.quizTaskConfig,
                          quiz: e.target.value
                        }
                      }))}
                    />
                    <Input
                      label="Answer"
                      placeholder="Enter answer"
                      value={taskForm.quizTaskConfig.answer}
                      onChange={(e) => setTaskForm(prev => ({
                        ...prev,
                        quizTaskConfig: {
                          ...prev.quizTaskConfig,
                          answer: e.target.value
                        }
                      }))}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Image</label>
                  <div className="flex gap-4 items-center">
                    {taskForm.imgUrl && (
                      <Image
                        src={taskForm.imgUrl}
                        alt="Task preview"
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
                      id="task-image-upload"
                    />
                    <Button
                      as="label"
                      htmlFor="task-image-upload"
                      color="primary"
                      variant="flat"
                      isLoading={uploading}
                    >
                      Upload Image
                    </Button>
                  </div>
                </div>

                {/* <div className="flex items-center gap-2">
                  <label className="text-sm">Force Locked:</label>
                  <Chip
                    color={taskForm.forceLocked === ETaskForceLocked.TaskForceLockedYes ? 'warning' : 'default'}
                    variant="light"
                  >
                    {taskForm.forceLocked === ETaskForceLocked.TaskForceLockedYes ? 'Locked' : 'Normal'}
                  </Chip>
                  <Button
                    size="sm"
                    color={taskForm.forceLocked === ETaskForceLocked.TaskForceLockedYes ? 'default' : 'warning'}
                    variant="flat"
                    onClick={() => setTaskForm(prev => ({ ...prev, forceLocked: prev.forceLocked === ETaskForceLocked.TaskForceLockedYes ? ETaskForceLocked.TaskForceLockedNo : ETaskForceLocked.TaskForceLockedYes }))}
                  >
                    {taskForm.forceLocked === ETaskForceLocked.TaskForceLockedYes ? 'Unlock' : 'Lock Task'}
                  </Button>
                </div> */}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={saveTask} isLoading={loading}>
                  {editingTask ? 'Update' : 'Create'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit/Create Task Group Modal */}
      <Modal isOpen={isGroupEditOpen} onOpenChange={onGroupEditOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingTaskGroup ? 'Edit Task Group' : 'Create Task Group'}
              </ModalHeader>
              <ModalBody className="space-y-4">
                <Input
                  label="Group Title"
                  placeholder="Enter group title"
                  value={taskGroupForm.title}
                  onChange={(e) => setTaskGroupForm(prev => ({ ...prev, title: e.target.value }))}
                />

                <Textarea
                  label="Group Description"
                  placeholder="Enter group description"
                  value={taskGroupForm.description}
                  onChange={(e) => setTaskGroupForm(prev => ({ ...prev, description: e.target.value }))}
                />

                <div className="grid grid-cols-2 gap-4">
                  <CustomDatePicker
                    label="Start Time"
                    value={taskGroupForm.startAt}
                    onChange={(timestamp) => setTaskGroupForm(prev => ({
                      ...prev,
                      startAt: timestamp
                    }))}
                    granularity="minute"
                  />
                  <CustomDatePicker
                    label="End Time"
                    value={taskGroupForm.endAt}
                    onChange={(timestamp) => setTaskGroupForm(prev => ({
                      ...prev,
                      endAt: timestamp
                    }))}
                    granularity="minute"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Group Image</label>
                  <div className="flex gap-4 items-center">
                    {taskGroupForm.imgUrl && (
                      <Image
                        src={taskGroupForm.imgUrl}
                        alt="Group preview"
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
                          handleGroupFileUpload(file);
                        }
                      }}
                      className="hidden"
                      id="group-image-upload"
                    />
                    <Button
                      as="label"
                      htmlFor="group-image-upload"
                      color="primary"
                      variant="flat"
                      isLoading={groupUploading}
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
                <Button color="primary" onPress={saveTaskGroup} isLoading={loading}>
                  {editingTaskGroup ? 'Update' : 'Create'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
};
