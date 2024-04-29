import { Button, Form, Input, message } from 'antd';
import { addCentre } from '../utils/apiRequest';

const AddCentreForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    addCentre(values).then((response) => {
      if (response.status === 201) {
        response.json().then((data) => {
          message.success(data.message);
          form.resetFields();
        });
      } else {
        response.json().then((data) => {
          message.error(data.message);
        });
      }
    });
  }

  return (
    <Form name="registerCentre"
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
      autoComplete="off"
      onFinish={onFinish}
      form={form}
    >
      <Form.Item
        label="Centre Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input the centre name!',
          },
        ]}
      >
        <Input placeholder='Westmead' />
      </Form.Item>

      <Form.Item
        label="Centre Full Name"
        name="fullName"
        rules={[
          {
            required: true,
            message: 'Please input the centre full name!',
          }
        ]}
      >
        <Input placeholder='Westmead Hospital' />
      </Form.Item>

      <Form.Item
        label="Centre Location"
        name="location"
        rules={[
          {
            required: true,
            message: 'Please input the centre location!',
          }
        ]}
      >
        <Input placeholder='Sydney, Australia' />
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


export default AddCentreForm;