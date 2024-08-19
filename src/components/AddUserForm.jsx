import { Button, Select, Form, Input, message } from 'antd';
import { registerUser } from '../utils/apiRequest';

const AddUserForm = () => {

  const [form] = Form.useForm();

  const onFinish = (values) => {
    registerUser(values).then((response) => {
      if (response.status === 201) {
        response.json().then((data) => {
          message.success('User registration successful!');
          form.resetFields();
        })
      } else {
        response.json().then((data) => {
          message.error('User registration failed. Reason: ' + data.message);
        })
      }
    })
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="registerUser"
      form={form}
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
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
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
            required: true,
            message: 'Please input your email!',
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
        label="Access Level"
        name="accessLevel"
        rules={[
          {
            required: true,
            message: 'Please select access level!',
          }
        ]}
      >
        <Select options={
          [
            { label: 'Read Only', value: '0' },
            { label: 'Read and Write', value: '1' },
            { label: 'Administrator', value: '2' },
          ]
        } />
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

export default AddUserForm;