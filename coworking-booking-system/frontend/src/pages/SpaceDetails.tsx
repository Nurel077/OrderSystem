import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout, Typography, Card, Table, Tag, Button,
    Breadcrumb, Descriptions, Skeleton, Space, message, Empty
} from 'antd';
import {
    EnvironmentOutlined, ClockCircleOutlined,
    UserOutlined, ArrowLeftOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { CoworkingSpace, Workspace } from '../types';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const SpaceDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [space, setSpace] = useState<CoworkingSpace | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSpaceDetails = async () => {
            try {
                const response = await api.get(`/coworkings/${id}`);
                setSpace(response.data);
            } catch (err) {
                message.error('Failed to load space details.');
            } finally {
                setLoading(false);
            }
        };

        fetchSpaceDetails();
    }, [id]);

    if (loading) {
        return (
            <Content style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <Skeleton active avatar={{ size: 'large', shape: 'square' }} paragraph={{ rows: 10 }} />
            </Content>
        );
    }

    if (!space) {
        return (
            <Content style={{ padding: '100px 24px', textAlign: 'center' }}>
                <Empty description="Space not found" />
                <Button style={{ marginTop: 16 }} onClick={() => navigate('/spaces')}>Back to Spaces</Button>
            </Content>
        );
    }

    const workspaceColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => {
                const colors: Record<string, string> = { hot_desk: 'cyan', meeting_room: 'purple', private_office: 'blue' };
                return <Tag color={colors[type] || 'default'}>{type.replace(/_/g, ' ').toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            key: 'capacity',
            render: (capacity: number) => (
                <Space><UserOutlined />{capacity} {capacity === 1 ? 'person' : 'people'}</Space>
            ),
        },
        {
            title: 'Price / hr',
            dataIndex: 'price_per_hour',
            key: 'price_per_hour',
            render: (price: number) => <Text strong style={{ color: '#0d9488' }}>${Number(price).toFixed(2)}</Text>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: unknown, record: Workspace) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => navigate(`/spaces/${space.id}/book?workspaceId=${record.id}`)}
                >
                    Book Now
                </Button>
            ),
        },
    ];

    return (
        <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <Breadcrumb
                style={{ marginBottom: '16px' }}
                items={[
                    { title: <Link to="/">Home</Link> },
                    { title: <Link to="/spaces">Spaces</Link> },
                    { title: space.name },
                ]}
            />

            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/spaces')} style={{ marginBottom: '24px' }}>
                Back to all spaces
            </Button>

            <Card style={{ borderRadius: '16px', marginBottom: '32px', overflow: 'hidden' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                    height: '220px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '-24px -24px 24px -24px',
                }}>
                    <Text style={{ color: 'rgba(255,255,255,0.15)', fontSize: '48px', fontWeight: 900, letterSpacing: '8px' }}>COSPACE</Text>
                </div>

                <Title level={2} style={{ marginBottom: '8px' }}>{space.name}</Title>
                <Space direction="vertical" size={4} style={{ marginBottom: '24px' }}>
                    <Text type="secondary"><EnvironmentOutlined style={{ marginRight: 6 }} />{space.address}</Text>
                    <Text type="secondary"><ClockCircleOutlined style={{ marginRight: 6 }} />{space.opening_time.slice(0, 5)} – {space.closing_time.slice(0, 5)}</Text>
                </Space>

                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label={<><InfoCircleOutlined style={{ marginRight: 6 }} />About this location</>}>
                        <Paragraph style={{ margin: 0 }}>
                            {space.description || 'No description available for this location.'}
                        </Paragraph>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Title level={3} style={{ marginBottom: '20px' }}>Available Workspaces</Title>
            <Table
                dataSource={space.workspaces}
                columns={workspaceColumns}
                rowKey="id"
                pagination={false}
                bordered
                locale={{ emptyText: 'No workspaces have been added to this location yet.' }}
                style={{ borderRadius: '12px', overflow: 'hidden' }}
            />
        </Content>
    );
};

export default SpaceDetails;

