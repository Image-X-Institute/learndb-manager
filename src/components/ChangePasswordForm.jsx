import React from 'react';
import { Button, message, Form, Input } from 'antd';
import { changePassword } from '../utils/apiRequest';

const ChangePasswordForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const payload = {
      newPassword: values.newPassword,
      isReset: 0,
      oldPassword: values.oldPassword,
      email: localStorage.getItem('email'),
    }
    changePassword(payload).then((res) => {
      if (res.status === 200) {
        message.success('Password changed successfully');
      } else {
        res.json().then((data) => {
          message.error(data.message);
        });
      }
      form.resetFields();
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="changePassword"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 24,
      }}
      style={{
        maxWidth: 600,
        width: '60%',
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
    >
      <Form.Item
        label="Old Password"
        name="oldPassword"
        rules={[
          {
            required: true,
            message: 'Please input your old password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[
          {
            required: true,
            message: 'Please input your new password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
          {
            required: true,
            message: 'Please re-input your new password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ChangePasswordForm;