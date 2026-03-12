import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Space, Avatar, Typography } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    DashboardOutlined,
    SettingOutlined,
    EnvironmentOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userMenuItems = [
        {
            key: 'dashboard',
            label: <Link to="/dashboard">My Bookings</Link>,
            icon: <DashboardOutlined />,
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    const adminMenuItems = [
        {
            key: 'admin',
            label: <Link to="/admin">Admin Panel</Link>,
            icon: <SettingOutlined />,
        },
        ...userMenuItems
    ];

    const menuItems = [
        {
            key: '/',
            label: <Link to="/">Home</Link>,
            icon: <HomeOutlined />,
        },
        {
            key: '/spaces',
            label: <Link to="/spaces">Find Space</Link>,
            icon: <EnvironmentOutlined />,
        },
    ];

    return (
        <Header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '0 24px'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', marginRight: '48px' }}>
                <Space size="small">
                    <div style={{
                        width: 32,
                        height: 32,
                        background: '#14b8a6',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold'
                    }}>C</div>
                    <Text strong style={{ fontSize: '18px', color: '#000' }}>CoSpace</Text>
                </Space>
            </Link>

            <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{ flex: 1, minWidth: 0, borderBottom: 'none' }}
            />

            <div style={{ marginLeft: 'auto' }}>
                {isAuthenticated ? (
                    <Dropdown
                        menu={{ items: isAdmin ? adminMenuItems : userMenuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#14b8a6' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                                <Text strong style={{ fontSize: '14px', display: 'block' }}>{user?.first_name}</Text>
                                <Text type="secondary" style={{ fontSize: '10px' }}>{user?.role.toUpperCase()}</Text>
                            </div>
                        </Space>
                    </Dropdown>
                ) : (
                    <Space>
                        <Button type="text" onClick={() => navigate('/login')}>Login</Button>
                        <Button type="primary" onClick={() => navigate('/register')}>Register</Button>
                    </Space>
                )}
            </div>
        </Header>
    );
};

export default Navbar;
