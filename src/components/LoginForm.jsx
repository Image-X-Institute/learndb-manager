import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { loginUser } from '../utils/apiRequest';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {

  const navigate = useNavigate();
  
  const onFinish = (values) => {
    loginUser(values).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', data.username)
          localStorage.setItem('access_level', data.access_level)
          navigate('/dashboard')
        })
      } else {
        message.error('Invalid email or password')
      }
    });
  }
  
  return (
    <Form
      name="login"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 12,
      }}
      style={{
        maxWidth: 600,
        margin: 'auto'
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email address!',
          },
          {
            type: 'email',
            message: 'Please input a valid email address!'
          }
        ]}
      >
        <Input />
      </Form.Item>
  
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
  
      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
  
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" className='px-12'>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;