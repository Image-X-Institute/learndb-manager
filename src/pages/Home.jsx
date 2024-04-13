import React from "react";
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom'

const { Content, Footer, Sider } = Layout;
const items = [
  {
    key: '/dashboard',
    icon: <UserOutlined />,
    label: 'Home',
  },
  {
    key: '/dashboard/patitents',
    icon: <VideoCameraOutlined />,
    label: 'Patients',
  },
  {
    key: '/dashboard/users',
    icon: <UploadOutlined />,
    label: 'Users',
  },
]


const Home = () => {
  const navigate = useNavigate();
  const handleMenuChange = (e) => {
    navigate(e.key);
  };

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} onClick={handleMenuChange} />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Database Managment System ©2024 Created by ImageX Institute
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Home;