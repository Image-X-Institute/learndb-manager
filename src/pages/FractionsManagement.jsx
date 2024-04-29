import React from "react";
import { Select, Collapse, Form, Input, Button, message, Tooltip, Spin } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getTrialList, getCenterList, getPatientList, getFractionInfo, updateFractionInfo } from "../utils/apiRequest";


const FractionsManagement = () => {

  const [trialList, setTrialList] = React.useState([])
  const [centerList, setCenterList] = React.useState([])
  const [patientList, setPatientList] = React.useState([])
  const [fractionData, setFractionData] = React.useState({})
  const [fractionItemList, setFractionItemList] = React.useState([])

  const [trial, setTrial] = React.useState('')
  const [center, setCenter] = React.useState('')
  const [patient, setPatient] = React.useState('')
  const [fraction, setFraction] = React.useState('')


  const [isLoaded, setIsLoaded] = React.useState(false)

  const onFormFinish = (formName, info) => {
    const changedFields = {}
    const values = info.values
    Object.keys(info.values).forEach((key) => {
      if (values[key] !== undefined) {
        changedFields[key] = values[key]
      }
    })
    if (Object.keys(changedFields).length > 0) {
      changedFields['patientId'] = patient
      changedFields['fractionName'] = formName
      updateFractionInfo(changedFields).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            message.success(data.message)
          })
        } else {
          response.json().then((data) => {
            message.error(data.message)
          })
        }
      })
    }
  }


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
    if (patient && trial) {
      getFractionInfo(patient, trial).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setFractionData(data)
          })
        }
      })
    }
  }, [patient, trial])

  React.useEffect(() => {
    if (fractionData && fraction) {
      const fractionItemPack = fractionData[fraction]
      const fractionItemFields = fractionItemPack.map((fractionItem) => {
        return {
          key: fractionItem.fraction_name,
          label: fractionItem.fraction_name,
          children: <Form 
                      size="small"
                      style={{
                        maxHeight: 400,
                        overflow: 'scroll',
                      }}
                      name={fractionItem.fraction_name}
                    >
            {
              Object.keys(fractionItem).map((key) => {
                if (key == 'fraction_name' || key == 'fraction_number') {
                  return (
                    <Form.Item
                      label={key}
                      name={key}
                      key={key}
                    >
                      <Input defaultValue={fractionItem[key]} disabled />
                    </Form.Item>
                  )
                }
                return (
                  <Form.Item
                    label={key}
                    name={key}
                    key={key}
                  >
                    <Input defaultValue={fractionItem[key]} />
                  </Form.Item>
                )
              })
            }
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" size="large">
              Submit
            </Button>
          </Form.Item>

          </Form>
        }
      })
      setFractionItemList(fractionItemFields)
    }
  }, [fractionData, fraction])




  const handleTrialChange = (value) => {
    setTrial(value)
    setCenter('')
    setPatient('')
    setFraction('')
  };

  const handleCenterChange = (value) => {
    setCenter(value)
    setPatient('')
    setFraction('')
  };

  const handlePatientChange = (value) => {
    setPatient(value)
    setFraction('')
  };

  const handleFractionChange = (value) => {
    setFraction(value)
  };

  if (!isLoaded) {
    return <Spin size='large' className='m-auto' tip='Loading...'/>
  }

  return (
    <div className="h-full">
      <div className="flex justify-center items-center">
        <h1 className='text-center text-2xl font-bold my-4'>Fractions Management</h1>
        <Tooltip 
          title="In this page, you can manage the fractions of a patient. 
                  Select the trial, center, patient and fraction number to view the details of the fraction.
                  To update the fraction data, change the value and click submit button which is at the bottom of each fraction tab."
        >
          <QuestionCircleOutlined className='ml-2 text-lg' />
        </Tooltip>
      </div>
      <div className="flex justify-center">
        <div className="mr-2">
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
        <div className="mx-2">
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
        <div className="ml-2">
          <div>
            Fraction Number:
          </div>
          <Select
            defaultValue=""
            style={{
              width: 120,
            }}
            onChange={handleFractionChange}
            options={Object.keys(fractionData).map((fraction) => ({ value: fraction, label: fraction }))}
            value={fraction}
          />
        </div>
      </div>
      <Form.Provider
        onFormFinish={onFormFinish}
      >
        <Collapse 
          accordion 
          items={fractionItemList}
          style={
            {
              width: '100%',
              marginTop: 20,
            }
          }
        />
      </Form.Provider>
    </div>
  );
}

export default FractionsManagement;