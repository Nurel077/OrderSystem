import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Row, Col, Card, Layout } from 'antd';
import {
    ArrowRightOutlined,
    WifiOutlined,
    CoffeeOutlined,
    TeamOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const Home: React.FC = () => {
    return (
        <Content style={{ background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                color: '#fff',
                padding: '100px 24px',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Title level={1} style={{ color: '#fff', fontSize: '48px', marginBottom: '24px' }}>
                        Find your perfect workspace, <Text style={{ color: '#99f6e4' }}>anywhere.</Text>
                    </Title>
                    <Paragraph style={{ color: '#ccfbf1', fontSize: '18px', marginBottom: '40px' }}>
                        Book desks, meeting rooms, and private offices by the hour or day. The ultimate coworking platform for students, freelancers, and teams.
                    </Paragraph>
                    <Link to="/spaces">
                        <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end">
                            Explore Spaces
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <Title level={2}>Why choose CoSpace?</Title>
                    <Text type="secondary">Everything you need to do your best work.</Text>
                </div>
                <Row gutter={[32, 32]}>
                    <Col xs={24} sm={12} lg={6}>
                        <FeatureCard icon={<WifiOutlined />} title="Fast Wi-Fi" description="Enterprise-grade internet in every location." />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <FeatureCard icon={<CoffeeOutlined />} title="Free Coffee" description="Unlimited premium coffee and tea to stay focused." />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <FeatureCard icon={<TeamOutlined />} title="Community" description="Network with other professionals." />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <FeatureCard icon={<SafetyCertificateOutlined />} title="Secure Access" description="24/7 keyless entry for dedicated desks." />
                    </Col>
                </Row>
            </div>
        </Content>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <Card hoverable style={{ height: '100%', borderRadius: '16px', textAlign: 'center' }}>
        <div style={{
            fontSize: '32px',
            color: '#14b8a6',
            marginBottom: '16px',
            background: '#f0fdfa',
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
        }}>
            {icon}
        </div>
        <Title level={4} style={{ marginBottom: '12px' }}>{title}</Title>
        <Paragraph type="secondary">{description}</Paragraph>
    </Card>
);

export default Home;
