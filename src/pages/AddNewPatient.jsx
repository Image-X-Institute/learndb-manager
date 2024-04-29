import React from 'react';
import { Button, Select, Form, Input, message, Spin } from 'antd';
import { getTrialList, getCenterList, addOnePatient } from "../utils/apiRequest";


const AddNewPatient = () => {

  const [form] = Form.useForm();

  const [trialList, setTrialList] = React.useState([])
  const [centerList, setCenterList] = React.useState([])

  const [trial, setTrial] = React.useState('')
  const [center, setCenter] = React.useState('')

  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    getTrialList().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setTrialList(data.trials)
        })
      }
    })
    getCenterList().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setCenterList(data.sites)
          setIsLoaded(true)
        })
      }
    })
  }, [])


  const onFinish = (values) => {
    addOnePatient(values).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          message.success('Add new patient success!')
          form.resetFields();
        })
      } else {
        response.json().then((data) => {
          message.error(data.message)
        })
      }
    })
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (!isLoaded) {
    return <Spin size='large' className='m-auto' tip='Loading...'/>
  }


  return (
    <div className="w-full flex justify-center align-center flex-col">
      <h1 className='text-center text-2xl font-bold my-4'>Add New Patient</h1>
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          width: 600,
          margin: 'auto',
          height: 'calc(100vh - 200px)',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Form.Item
          label="Trial"
          name="clinical_trial"
          rules={[
            {
              required: true,
              message: 'Please select trial!',
            },
          ]}
        >
          <Select
            options={trialList.map((trial) => ({ value: trial, label: trial }))}
            value={trial}
            onChange={(value) => {setTrial(value)}}
          />
        </Form.Item>
        <Form.Item
          label="Centre"
          name="test_centre"
          rules={[
            {
              required: true,
              message: 'Please select centre!',
            },
          ]}
        >
          <Select
            options={centerList.map((center) => ({ value: center, label: center }))}
            value={center}
            onChange={(value) => {setCenter(value)}}
          />
        </Form.Item>
        <Form.Item
          label="Patient Trial ID"
          name="patient_trial_id"
          rules={[
            {
              required: true,
              message: 'Please input patient trial id!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Centre Patient Number"
          name="centre_patient_no"
          rules={[
            {
              required: true,
              message: 'Please input patient trial id!',
            },
            {
              pattern: /^[0-9]*$/,
              message: 'Please input valid number!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[
            {
              required: true,
              message: 'Please input patient age',
            },
            {
              pattern: /^[0-9]*$/,
              message: 'Please input valid number!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
        >
          <Select>
            <Select.Option value="Female" />
            <Select.Option value="Male" />
            <Select.Option value="Other" />
          </Select>
        </Form.Item>

        <Form.Item
          label="Clinical Diag"
          name="clinical_diag"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tumour Site"
          name="tumour_site"
          rules={[
            {
              required: true,
              message: 'Please input tumour site!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Number of Markers"
          name="number_of_markers"
          rules={[
            {
              required: true,
              message: 'Please input number of markers!',
            },
            {
              pattern: /^[0-9]*$/,
              message: 'Please input valid number!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Average Treatment Time"
          name="avg_treatment_time"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="KIM Accuracy"
          name="kim_accuracy"
          rules={[
            {
              pattern: /^[0-9]*$/,
              message: 'Please input valid number!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="LINAC Type"
          name="linac_type"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Remarks"
          name="patient_note"
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>

  );
}

export default AddNewPatient;