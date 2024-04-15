import React from "react";
import { Select, Form, Input, Button, message } from 'antd';
import { getTrialList, getCenterList, getPatientList, getPatientInfo, updatePatientInfo } from "../utils/apiRequest";
const PatientManagement = () => {

  const [form] = Form.useForm();

  const [trialList, setTrialList] = React.useState([])
  const [centerList, setCenterList] = React.useState([])
  const [patientList, setPatientList] = React.useState([])
  const [patientData, setPatientData] = React.useState({})

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
      getPatientList(trial, center).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setPatientList(data.patients)
          })
        }
      })
    }
  }, [trial, center])

  React.useEffect(() => {
    if (patient && trial && center) {
      getPatientInfo(patient).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            console.log(data);
            setPatientData(data)
          })
        }
      })
    }
  }, [patient, trial, center])


  const handleTrialChange = (value) => {
    setTrial(value)
    setCenter('')
    setPatient('')
    setPatientData({})
    form.resetFields()
  };

  const handleCenterChange = (value) => {
    setCenter(value)
    setPatient('')
    setPatientData({})
    form.resetFields()
  };

  const handlePatientChange = (value) => {
    setPatient(value)
    form.resetFields()
    setPatientData({})
  };

  const onFinish = (values) => {
    const changedData = {}
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        changedData[key] = values[key]
      }
    })
    if (Object.keys(changedData).length > 0) {
      updatePatientInfo(patient, changedData).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            message.info('Patient data updated successfully')
          })
        }
        else {
          message.error('Failed to update patient data')
        }
      })
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-full">
      <h1>Patient Management</h1>
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
     
      <div className="w-full flex justify-center align-center">
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            width: 600,
            maxHeight: 600,
            overflow: 'scroll',
            marginTop: 20,
          }}
          onFinish={onFinish}
          form={form}
        >
          {
            Object.keys(patientData).map((key) => {
              return (
                <Form.Item
                  key={key}
                  label={key}
                  name={key}
                >
                  <Input defaultValue={patientData[key]} />
                </Form.Item>
              )
            })
          }
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default PatientManagement;
