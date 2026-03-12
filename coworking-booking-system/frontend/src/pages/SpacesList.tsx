import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, List, Tag, Typography, Space, Skeleton, Empty, Layout } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import api from '../services/api';
import type { CoworkingSpace } from '../types';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const SpacesList: React.FC = () => {
    const [spaces, setSpaces] = useState<CoworkingSpace[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await api.get('/coworkings');
                setSpaces(response.data);
            } catch (err) {
                setError('Failed to load spaces. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSpaces();
    }, []);

    if (loading) {
        return (
            <Content style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <Skeleton active paragraph={{ rows: 8 }} />
            </Content>
        );
    }

    if (error) {
        return (
            <Content style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Empty description={error} />
            </Content>
        );
    }

    return (
        <Content style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ marginBottom: '40px' }}>
                <Title level={2}>Explore Spaces</Title>
                <Text type="secondary">Find the perfect location for your next work session.</Text>
            </div>

            {spaces.length === 0 ? (
                <Empty description="No coworking spaces available right now. Check back later!" />
            ) : (
                <List
                    grid={{ gutter: 24, xs: 1, sm: 2, lg: 3 }}
                    dataSource={spaces}
                    renderItem={(space) => (
                        <List.Item>
                            <Link to={`/spaces/${space.id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <div style={{
                                            height: '192px',
                                            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: '32px', fontWeight: 'bold', letterSpacing: '6px' }}>COSPACE</Text>
                                        </div>
                                    }
                                    style={{ borderRadius: '16px', overflow: 'hidden' }}
                                >
                                    <Card.Meta
                                        title={<Text strong style={{ fontSize: '17px' }}>{space.name}</Text>}
                                        description={
                                            <Space direction="vertical" size={6} style={{ width: '100%' }}>
                                                <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ marginBottom: 0 }}>
                                                    {space.description || 'No description available.'}
                                                </Paragraph>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    <EnvironmentOutlined style={{ marginRight: '4px' }} />{space.address}
                                                </Text>
                                                <Tag icon={<ClockCircleOutlined />} color="processing" style={{ marginTop: '4px' }}>
                                                    {space.opening_time.slice(0, 5)} – {space.closing_time.slice(0, 5)}
                                                </Tag>
                                            </Space>
                                        }
                                    />
                                </Card>
                            </Link>
                        </List.Item>
                    )}
                />
            )}
        </Content>
    );
};

export default SpacesList;
