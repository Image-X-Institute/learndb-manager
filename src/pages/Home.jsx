import { dashboardNavItems } from '../config/dashboardNavigate';
import { Layout, Menu, Button } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom'
import LoginPage from './LoginPage';
const { Content, Footer, Sider, Header } = Layout;

const Home = () => {
  const navigate = useNavigate();
  const handleMenuChange = (e) => {
    navigate(e.key);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  }

  if (!localStorage.getItem('token')) {
    return <LoginPage />
  }

  return (
    <Layout>
      <Sider
        width={230}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Menu 
          mode="inline" 
          items={dashboardNavItems} 
          onClick={handleMenuChange} 
          style={{ height: '100%'}}
        />
      </Sider>
      <Layout style={{ marginLeft: 230 }}>
        <Header style={{
            height: 54,
            paddingInline: 48,
            lineHeight: '64px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}
        >
            <div style={{display: 'flex',  justifyContent: 'end', alignItems: 'center'}}>
              <div>Welcome,</div>
              <Button type='link' style={{paddingLeft:6}}>{localStorage.getItem('user')}</Button>
            </div>
            <Button onClick={handleLogout}>Logout</Button>
        </Header>
        <Content
          style={{
            margin: '24px 32px 0',
            overflow: 'auto',
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