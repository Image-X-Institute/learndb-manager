import React from 'react';
import { Tooltip, Spin, Form, Select, Input, DatePicker, InputNumber, Button, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getTrialList, getCenterList, getPatientIdList, addNewFraction } from "../utils/apiRequest";

const AddNewFractionForm = () => {
  const [form] = Form.useForm();

  const [trialList, setTrialList] = React.useState([])
  const [centerList, setCenterList] = React.useState([])
  const [patientList, setPatientList] = React.useState([])

  const [trial, setTrial] = React.useState('')
  const [center, setCenter] = React.useState('')
  const [patient, setPatient] = React.useState('')

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

  React.useEffect(() => {
    if (trial && center) {
      getPatientIdList(trial, center).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setPatientList(data.patients)
          })
        }
      })
    }
  }, [trial, center])


  const handleTrialChange = (value) => {
    setTrial(value)
    setCenter('')
    setPatient('')
    form.resetFields()
  };

  const handleCenterChange = (value) => {
    setCenter(value)
    setPatient('')
    form.resetFields()
  };

  const handlePatientChange = (value) => {
    setPatient(value)
    form.resetFields()
  };

  const onFinish = (values) => {
    if ( values['fractionDate'] ) {
      values['fractionDate'] = values['fractionDate'].format('YYYY-MM-DD')
    }

    values['patientId'] = patient
    addNewFraction(values).then((response) => {
      if (response.status === 200) {
        form.resetFields()
        setTrial('')
        setCenter('')
        setPatient('')
        message.success('New Fraction Added Successfully!')
      } else{
        response.json().then((data) => {
          message.error(data.message)
        })
      }
    })
  }

  if (!isLoaded) {
    return <Spin size='large' className='m-auto' tip='Loading...'/>
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center">
        <h1 className='text-center text-xl font-bold'>Add New Fractions</h1>
        <Tooltip 
          title="In this section, you could add new fractions to the patient."
        >
          <QuestionCircleOutlined className='ml-2 text-lg' />
        </Tooltip>
      </div>
      
      <div className="flex justify-center">
        <div>
          <div>
            Trial:
          </div>
          <Select
            defaultValue=""
            style={{
              width: 120,
            }}
            onChange={handleTrialChange}
            options={trialList.map((trial) => ({ value: trial, label: trial }))}
            value={trial}
          />
        </div>
        <div className="mx-2">
          <div>
            Center:
          </div>
          <Select
            defaultValue=""
            style={{
              width: 120,
            }}
            onChange={handleCenterChange}
            options={centerList.map((center) => ({ value: center, label: center }))}
            value={center}
          />
        </div>
        <div>
          <div>
            Patient ID:
          </div>
          <Select
            defaultValue=""
            style={{
              width: 120,
            }}
            onChange={handlePatientChange}
            options={patientList.map((patient) => ({ value: patient, label: patient }))}
            value={patient}
          />
        </div>
      </div>
      {patient ? <Form
        form={form}
        name="addNewFractionForm"
        wrapperCol={{ span: 4 }}
        labelCol={{ span: 12 }}
        className='border border-gray-200 p-4 mt-4'
        onFinish={onFinish}
      >
        <Form.Item
          label="Fraction Number"
          name="fractionNumber"
          rules={[{ required: true, message: 'Please input the fraction number!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Fraction Folder Name"
          name="fractionName"
          rules={[{ required: true, message: 'Please input the fraction folder name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Fraction Date"
          name="fractionDate"
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="mvsdd"
          name="mvsdd"
        >
          <InputNumber decimalSeparator='.' />
        </Form.Item>
        <Form.Item
          label="kvsdd"
          name="kvsdd"
        >
          <InputNumber decimalSeparator='.' />
        </Form.Item>
        <Form.Item
          label="MV Pixel Size"
          name="mvPixelSize"
        >
          <InputNumber decimalSeparator='.' />
        </Form.Item>
        <Form.Item
          label="kV Pixel Size"
          name="kvPixelSize"
        >
          <InputNumber decimalSeparator='.' />
        </Form.Item>
        <Form.Item
          label="Marker Length"
          name="markerLength"
        >
          <InputNumber decimalSeparator='.' />
        </Form.Item>
        <Form.Item
          label="Marker Width"
          name="markerWidth"
        >
          <InputNumber decimalSeparator='.' />
        </Form.Item>
        <Form.Item
          label="Marker Type"
          name="markerType"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Imaging KV"
          name="imagingKv"
        >
          <InputNumber decimalSeparator='.' />
        </Form.Item>
        <Form.Item
          label="Imaging mA"
          name="imagingMa"
        >
          <InputNumber decimalSeparator='.' />
        </Form.Item>
        <Form.Item
          label="Imaging ms"
          name="imagingMs"
        >
          <InputNumber decimalSeparator='.' />
        </Form.Item>
        

        <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
        >
          <Button type="primary" htmlType="submit" className='px-12'>
            Submit
          </Button>
        </Form.Item>
      </Form> : null}
    </div>
  )

}

export default AddNewFractionForm;