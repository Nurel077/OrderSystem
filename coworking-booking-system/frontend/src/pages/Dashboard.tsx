import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Layout, Typography, Card, Table, Tag, Button,
    Avatar, Space, Skeleton, Empty, Modal, message
} from 'antd';
import {
    UserOutlined, CalendarOutlined, ClockCircleOutlined,
    HomeOutlined, CloseCircleOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Booking } from '../types';

const { Title, Text } = Typography;
const { Content } = Layout;
const { confirm } = Modal;

const formatDate = (dateString: string): string => {
    const opts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, opts);
};

const formatTime = (dateString: string): string => {
    const opts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, opts);
};

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings');
            setBookings(response.data);
        } catch (err) {
            message.error('Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = (id: string) => {
        confirm({
            title: 'Cancel this booking?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            okText: 'Yes, Cancel',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await api.delete(`/bookings/${id}`);
                    message.success('Booking cancelled successfully.');
                    fetchBookings();
                } catch (err) {
                    message.error('Failed to cancel booking.');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Space & Workspace',
            key: 'location',
            render: (_: unknown, record: Booking) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.coworking_name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.workspace_name}</Text>
                </Space>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'start_time',
            key: 'date',
            render: (v: string) => (
                <Space><CalendarOutlined style={{ color: '#94a3b8' }} />{formatDate(v)}</Space>
            ),
        },
        {
            title: 'Time',
            key: 'time',
            render: (_: unknown, record: Booking) => (
                <Space><ClockCircleOutlined style={{ color: '#94a3b8' }} />{formatTime(record.start_time)} – {formatTime(record.end_time)}</Space>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (v: number) => <Text strong style={{ color: '#0d9488' }}>${Number(v).toFixed(2)}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colorMap: Record<string, string> = { confirmed: 'success', cancelled: 'error', pending: 'warning' };
                return <Tag color={colorMap[status] || 'default'}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: unknown, record: Booking) =>
                record.status === 'confirmed' && new Date(record.start_time) > new Date() ? (
                    <Button
                        danger size="small" icon={<CloseCircleOutlined />}
                        onClick={() => handleCancelBooking(record.id)}
                    >
                        Cancel
                    </Button>
                ) : null,
        },
    ];

    if (loading) {
        return (
            <Content style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <Skeleton active paragraph={{ rows: 10 }} />
            </Content>
        );
    }

    return (
        <Content style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            {/* Profile Header */}
            <Card style={{ marginBottom: '32px', borderRadius: '16px' }}>
                <Space align="center" size={16}>
                    <Avatar
                        size={64}
                        style={{ backgroundColor: '#14b8a6', fontSize: '24px' }}
                        icon={<UserOutlined />}
                    >
                        {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </Avatar>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>Welcome back, {user?.first_name}!</Title>
                        <Text type="secondary">{user?.email}</Text>
                    </div>
                </Space>
            </Card>

            {/* Bookings Table */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Title level={4} style={{ margin: 0 }}>Your Bookings</Title>
                <Link to="/spaces">
                    <Button type="primary" icon={<HomeOutlined />}>Find a Space</Button>
                </Link>
            </div>

            <Card style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <Table
                    dataSource={bookings}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{
                        emptyText: (
                            <Empty
                                description="You have no bookings yet."
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                <Link to="/spaces">
                                    <Button type="primary">Explore Spaces</Button>
                                </Link>
                            </Empty>
                        )
                    }}
                />
            </Card>
        </Content>
    );
};

export default Dashboard;
