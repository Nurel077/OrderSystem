import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Row, Col, message, Layout } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, RocketOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const { Title, Text } = Typography;
const { Content } = Layout;

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/register', values);
            const { token, user } = response.data;
            login(token, user);
            message.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Content style={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            padding: '40px 24px'
        }}>
            <Card style={{ maxWidth: '500px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ marginBottom: '8px' }}>Create your account</Title>
                    <Text type="secondary">Join CoSpace and find your best workspace today</Text>
                </div>

                <Form
                    name="register"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="first_name"
                                label="First Name"
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="John" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="last_name"
                                label="Last Name"
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="Doe" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="you@university.edu" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '32px' }}>
                        <Button type="primary" htmlType="submit" loading={loading} block icon={<RocketOutlined />}>
                            Create Account
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Text type="secondary">Already have an account? </Text>
                    <Link to="/login">
                        <Button type="link" style={{ padding: 0 }}>Sign in here</Button>
                    </Link>
                </div>
            </Card>
        </Content>
    );
};

export default Register;
