import React, { useState, useEffect } from 'react';
import {
    Layout, Typography, Card, Table, Button, Modal,
    Form, Input, InputNumber, Select, TimePicker, Space,
    Tag, Skeleton, message, Empty
} from 'antd';
import {
    PlusOutlined, EnvironmentOutlined, ClockCircleOutlined,
    SettingOutlined, ApartmentOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';
import type { CoworkingSpace } from '../types';

const { Title, Text } = Typography;
const { Content } = Layout;
const { TextArea } = Input;

const AdminDashboard: React.FC = () => {
    const [spaces, setSpaces] = useState<CoworkingSpace[]>([]);
    const [loading, setLoading] = useState(true);

    const [spaceModalOpen, setSpaceModalOpen] = useState(false);
    const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
    const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [spaceForm] = Form.useForm();
    const [workspaceForm] = Form.useForm();

    useEffect(() => {
        fetchSpaces();
    }, []);

    const fetchSpaces = async () => {
        try {
            const response = await api.get('/coworkings');
            setSpaces(response.data);
        } catch (error) {
            message.error('Failed to load spaces.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSpace = async (values: any) => {
        setSubmitting(true);
        try {
            const openingTime = values.opening_time.format('HH:mm:ss');
            const closingTime = values.closing_time.format('HH:mm:ss');
            await api.post('/coworkings', {
                name: values.name,
                description: values.description,
                address: values.address,
                opening_time: openingTime,
                closing_time: closingTime,
            });
            message.success('Coworking space created successfully!');
            setSpaceModalOpen(false);
            spaceForm.resetFields();
            fetchSpaces();
        } catch (error) {
            message.error('Failed to create space.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateWorkspace = async (values: any) => {
        if (!activeSpaceId) return;
        setSubmitting(true);
        try {
            await api.post('/workspaces', { ...values, coworking_id: activeSpaceId });
            message.success('Workspace added successfully!');
            setWorkspaceModalOpen(false);
            workspaceForm.resetFields();
        } catch (error) {
            message.error('Failed to create workspace.');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (text: string) => (
                <Text type="secondary"><EnvironmentOutlined style={{ marginRight: 4 }} />{text}</Text>
            ),
        },
        {
            title: 'Hours',
            key: 'hours',
            render: (_: unknown, record: CoworkingSpace) => (
                <Tag icon={<ClockCircleOutlined />} color="processing">
                    {record.opening_time.slice(0, 5)} – {record.closing_time.slice(0, 5)}
                </Tag>
            ),
        },
        {
            title: 'Workspaces',
            key: 'workspaces_count',
            render: (_: unknown, record: CoworkingSpace) => (
                <Text>{record.workspaces?.length ?? 0} workspace(s)</Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: CoworkingSpace) => (
                <Button
                    size="small"
                    type="dashed"
                    icon={<ApartmentOutlined />}
                    onClick={() => { setActiveSpaceId(record.id); setWorkspaceModalOpen(true); }}
                >
                    Add Workspace
                </Button>
            ),
        },
    ];

    return (
        <Content style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        <SettingOutlined style={{ marginRight: 10 }} />Admin Control Panel
                    </Title>
                    <Text type="secondary">Manage coworking locations and workspaces</Text>
                </div>
                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => setSpaceModalOpen(true)}
                >
                    Add Location
                </Button>
            </div>

            <Card style={{ borderRadius: '16px', overflow: 'hidden' }}>
                {loading ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                ) : (
                    <Table
                        dataSource={spaces}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        locale={{ emptyText: <Empty description="No locations created yet." /> }}
                    />
                )}
            </Card>

            {/* Create Space Modal */}
            <Modal
                title="Add Coworking Space"
                open={spaceModalOpen}
                onCancel={() => { setSpaceModalOpen(false); spaceForm.resetFields(); }}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={spaceForm}
                    layout="vertical"
                    onFinish={handleCreateSpace}
                    initialValues={{
                        opening_time: dayjs('09:00', 'HH:mm'),
                        closing_time: dayjs('18:00', 'HH:mm'),
                    }}
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Central Hub" />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                        <Input placeholder="e.g. 123 Main St, City" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <TextArea rows={3} placeholder="Describe the space..." />
                    </Form.Item>
                    <Space style={{ width: '100%' }} size={16}>
                        <Form.Item name="opening_time" label="Opening Time" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <TimePicker format="HH:mm" style={{ width: '100%' }} needConfirm={false} />
                        </Form.Item>
                        <Form.Item name="closing_time" label="Closing Time" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <TimePicker format="HH:mm" style={{ width: '100%' }} needConfirm={false} />
                        </Form.Item>
                    </Space>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button onClick={() => { setSpaceModalOpen(false); spaceForm.resetFields(); }}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>Create Space</Button>
                    </div>
                </Form>
            </Modal>

            {/* Create Workspace Modal */}
            <Modal
                title="Add Workspace"
                open={workspaceModalOpen}
                onCancel={() => { setWorkspaceModalOpen(false); workspaceForm.resetFields(); }}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={workspaceForm}
                    layout="vertical"
                    onFinish={handleCreateWorkspace}
                    initialValues={{ type: 'hot_desk', capacity: 1 }}
                >
                    <Form.Item name="name" label="Workspace Name" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Desk A1" />
                    </Form.Item>
                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="hot_desk">Hot Desk</Select.Option>
                            <Select.Option value="dedicated_desk">Dedicated Desk</Select.Option>
                            <Select.Option value="meeting_room">Meeting Room</Select.Option>
                        </Select>
                    </Form.Item>
                    <Space style={{ width: '100%' }} size={16}>
                        <Form.Item name="capacity" label="Capacity" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="price_per_hour" label="Price/Hour ($)" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
                        </Form.Item>
                    </Space>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button onClick={() => { setWorkspaceModalOpen(false); workspaceForm.resetFields(); }}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>Add Workspace</Button>
                    </div>
                </Form>
            </Modal>
        </Content>
    );
};

export default AdminDashboard;
