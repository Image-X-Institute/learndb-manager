import React from "react";
import { Select, Form, Input, Button, message, Tooltip, Spin, Card, Row, Col, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getTrialList, getCenterList, getPatientIdList, getPatientInfo, updatePatientInfo, getTrialStructure } from "../utils/apiRequest";
import BulkModifyPrescriptionInformation from "../components/BulkModifyPrescriptionInformation";

const { Text } = Typography;

const patientBaseFields = [
  "age",
  "avg_treatment_time",
  "centre_patient_no",
  "clinical_diag",
  "clinical_trial",
  "gender",
  "linac_type",
  "number_of_markers",
  "patient_note",
  "patient_trial_id",
  "tumour_site",
  "test_centre",
];

const normaliseFormValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  return value;
};

const PrescriptionsManagement = () => {

  const [form] = Form.useForm();

  const [trialList, setTrialList] = React.useState([])
  const [centerList, setCenterList] = React.useState([])
  const [patientList, setPatientList] = React.useState([])
  const [patientData, setPatientData] = React.useState({})
  const [prescriptionStructure, setPrescriptionStructure] = React.useState({})

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

  React.useEffect(() => {
    if (!trial) {
      setPrescriptionStructure({})
      return
    }

    getTrialStructure(trial).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setPrescriptionStructure(data.trialStructure?.prescription || {})
        })
      } else {
        setPrescriptionStructure({})
        message.error('Failed to load trial structure')
      }
    })
  }, [trial])

  React.useEffect(() => {
    if (patient && trial && center) {
      getPatientInfo(patient).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setPatientData(data)
            const formValues = {}
            Object.keys(data).forEach((key) => {
              formValues[key] = normaliseFormValue(data[key])
            })
            form.setFieldsValue(formValues)
          })
        }
      })
    }
  }, [patient, trial, center, form])


  const handleTrialChange = (value) => {
    setTrial(value)
    setCenter('')
    setPatient('')
    setPatientData({})
    setPrescriptionStructure({})
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
      const originalValue = normaliseFormValue(patientData[key])
      const nextValue = normaliseFormValue(values[key])
      if (values[key] !== undefined && nextValue !== originalValue) {
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

  const fieldList = React.useMemo(() => {
    const prescriptionFields = Object.keys(prescriptionStructure)
    const combinedFields = [...patientBaseFields, ...prescriptionFields]
    return [...new Set(combinedFields)]
  }, [prescriptionStructure])

  const getFieldLabel = (key) => {
    const displayName = prescriptionStructure[key]?.display_name
    if (displayName) {
      return (
        <div className="prescription-field-label">
          <Text code>{key}</Text>
          <div className="text-xs text-gray-500 mt-1">{displayName}</div>
        </div>
      )
    }
    return <Text code>{key}</Text>
  }

  if (!isLoaded) {
    return <Spin size='large' className='m-auto' tip='Loading...'/>
  }

  return (
    <div className="h-full">
      <div className="flex justify-center items-center">
        <h1 className='text-center text-2xl font-bold my-4'>Prescriptions Management</h1>
        <Tooltip 
          title="In this section, you could manage patient's prescription level data. 
          Select the trial, center and patient ID to view the patient's prescription data.
          To update the patient's prescription data, change the value and click submit."
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
              width: 200,
            }}
            onChange={handlePatientChange}
            options={patientList.map((patient) => ({ value: patient, label: patient }))}
            value={patient}
          />
        </div>
      </div>
     
      <div className="w-full px-4 mt-5">
        <Form
          layout="vertical"
          style={{
            width: '100%',
            maxWidth: 1200,
            margin: '20px auto 0',
          }}
          onFinish={onFinish}
          form={form}
        >
          <Card
            size="small"
            title="Patient and Prescription Fields"
            extra={!patient ? <Text type="secondary">Select a patient to edit values</Text> : null}
          >
            <Row gutter={[16, 8]}>
              {
                fieldList.map((key) => {
                  return (
                    <Col xs={24} lg={12} key={key}>
                      <Form.Item
                        label={getFieldLabel(key)}
                        name={key}
                      >
                        <Input disabled={!patient} />
                      </Form.Item>
                    </Col>
                  )
                })
              }
            </Row>
            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" disabled={!patient}>
                Submit
              </Button>
            </Form.Item>
          </Card>
        </Form>
      </div>
      <Card className="m-4">
        <BulkModifyPrescriptionInformation />
      </Card>
    </div>
  );
}

export default PrescriptionsManagement;
