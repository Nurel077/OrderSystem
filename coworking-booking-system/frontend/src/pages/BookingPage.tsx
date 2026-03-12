import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
    Layout, Typography, Card, Form, DatePicker, TimePicker,
    Button, Descriptions, Skeleton, message, Divider, Space, Empty
} from 'antd';
import {
    CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined,
    HomeOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import api from '../services/api';
import type { CoworkingSpace, Workspace } from '../types';

const { Title, Text } = Typography;
const { Content } = Layout;

const BookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get('workspaceId');
    const navigate = useNavigate();

    const [space, setSpace] = useState<CoworkingSpace | null>(null);
    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id || !workspaceId) {
                message.error('Invalid booking parameters.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/coworkings/${id}`);
                const fetchedSpace = response.data;
                setSpace(fetchedSpace);

                const foundWorkspace = fetchedSpace.workspaces.find((w: Workspace) => w.id === workspaceId);
                if (foundWorkspace) {
                    setWorkspace(foundWorkspace);
                } else {
                    message.error('Workspace not found in this location.');
                }
            } catch (err) {
                message.error('Failed to load space details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, workspaceId]);

    const calculateTotal = (): number => {
        if (!startTime || !endTime || !workspace) return 0;
        const diffHours = endTime.diff(startTime, 'minute') / 60;
        if (diffHours <= 0) return 0;
        return diffHours * parseFloat(workspace.price_per_hour);
    };

    const total = calculateTotal();

    const handleBooking = async () => {
        if (!workspaceId || !date || !startTime || !endTime) return;

        const dateStr = date.format('YYYY-MM-DD');
        const startIso = new Date(`${dateStr}T${startTime.format('HH:mm')}`).toISOString();
        const endIso = new Date(`${dateStr}T${endTime.format('HH:mm')}`).toISOString();

        setBookingLoading(true);

        try {
            await api.post('/bookings', {
                workspace_id: workspaceId,
                start_time: startIso,
                end_time: endIso
            });
            message.success('Booking confirmed successfully!');
            navigate('/dashboard');
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Failed to create booking. The time slot might be unavailable.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <Content style={{ padding: '48px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                <Skeleton active paragraph={{ rows: 10 }} />
            </Content>
        );
    }

    if (!space || !workspace) {
        return (
            <Content style={{ padding: '100px 24px', textAlign: 'center' }}>
                <Empty description="Booking details not found" />
                <Button style={{ marginTop: 16 }} onClick={() => navigate('/spaces')}>Back to Spaces</Button>
            </Content>
        );
    }

    return (
        <Content style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            <Title level={2} style={{ marginBottom: '32px' }}>Complete Your Booking</Title>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {/* Left: Booking Summary */}
                <Card
                    style={{ flex: 1, minWidth: '280px', borderRadius: '16px', background: '#f8fafc' }}
                    title={<><HomeOutlined style={{ marginRight: 8 }} />Booking Summary</>}
                >
                    <Descriptions column={1} size="small" colon={false}>
                        <Descriptions.Item label={<Text type="secondary">Space</Text>}>
                            <Text strong>{space.name}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text type="secondary">Address</Text>}>
                            <Text><EnvironmentOutlined style={{ marginRight: 4 }} />{space.address}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text type="secondary">Workspace</Text>}>
                            <Text strong>{workspace.name}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text type="secondary">Type</Text>}>
                            <Text style={{ textTransform: 'capitalize' }}>{workspace.type.replace(/_/g, ' ')}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text type="secondary">Capacity</Text>}>
                            <Text>{workspace.capacity} {workspace.capacity === 1 ? 'person' : 'people'}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text type="secondary">Rate</Text>}>
                            <Text strong style={{ color: '#0d9488' }}>${workspace.price_per_hour}/hr</Text>
                        </Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={5} style={{ margin: 0 }}>Estimated Total</Title>
                        <Title level={4} style={{ margin: 0, color: '#0d9488' }}>
                            ${total > 0 ? total.toFixed(2) : '0.00'}
                        </Title>
                    </div>
                </Card>

                {/* Right: Booking Form */}
                <Card style={{ flex: 1, minWidth: '280px', borderRadius: '16px' }}>
                    <Form layout="vertical" size="large" onFinish={handleBooking}>
                        <Form.Item label={<><CalendarOutlined style={{ marginRight: 6 }} />Select Date</>} required>
                            <DatePicker
                                style={{ width: '100%' }}
                                value={date}
                                onChange={(d) => setDate(d)}
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                format="MMMM D, YYYY"
                            />
                        </Form.Item>
                        <Space style={{ width: '100%' }} size={16}>
                            <Form.Item label={<><ClockCircleOutlined style={{ marginRight: 4 }} />Start Time</>} style={{ flex: 1, marginBottom: 0 }} required>
                                <TimePicker
                                    style={{ width: '100%' }}
                                    value={startTime}
                                    onChange={(t) => setStartTime(t)}
                                    format="HH:mm"
                                    minuteStep={30}
                                    needConfirm={false}
                                />
                            </Form.Item>
                            <Form.Item label={<><ClockCircleOutlined style={{ marginRight: 4 }} />End Time</>} style={{ flex: 1, marginBottom: 0 }} required>
                                <TimePicker
                                    style={{ width: '100%' }}
                                    value={endTime}
                                    onChange={(t) => setEndTime(t)}
                                    format="HH:mm"
                                    minuteStep={30}
                                    needConfirm={false}
                                />
                            </Form.Item>
                        </Space>

                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={bookingLoading}
                            style={{ marginTop: '32px' }}
                            icon={<CheckCircleOutlined />}
                            disabled={!date || !startTime || !endTime || total <= 0}
                        >
                            {bookingLoading ? 'Processing...' : `Confirm Booking • $${total > 0 ? total.toFixed(2) : '0.00'}`}
                        </Button>
                        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '12px' }}>
                            By confirming, you agree to our terms of service and cancellation policy.
                        </Text>
                    </Form>
                </Card>
            </div>
        </Content>
    );
};

export default BookingPage;

