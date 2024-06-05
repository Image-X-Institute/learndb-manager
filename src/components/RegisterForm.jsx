import React from 'react';
import { Button, Tooltip, Form, Input } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { registerUser } from '../utils/apiRequest';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {

  const navigate = useNavigate();

  const onFinish = (values) => {
    registerUser(values).then((response) => {
      if (response.status === 201) {
        response.json().then((data) => {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', data.username)
          localStorage.setItem('access_level', data.access_level)
          navigate('/dashboard')
        })
      } else {
        alert('User registration failed!');
      }
    });
  }

  return (
    <Form
      name="register"
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
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
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
        label="Confirm Password"
        name="passwordCofirm"
        rules={[
          {
            required: true,
            message: 'Please input your password again!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Password does not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Invitation Code"
        name="invitationCode"
        tooltip='The invitation code is 
                  required to register in order to protect 
                  the system from unauthorized access. 
                  Currently, this feature is disabled. Please enter any code to register.'
        rules={[
          {
            required: true,
            message: 'Please ask admin for invitation code!',
          }
        ]}
      >
        <Input placeholder='123' />
      </Form.Item>
  
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" className='px-12'>
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}

export default RegisterForm;