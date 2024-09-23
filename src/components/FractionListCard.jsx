import React from 'react';
import { getFractionList, getTrialList, getCenterList, getPatientIdList, deleteFraction} from '../utils/apiRequest';
import { Select, Tooltip, Table, Button, Form } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const FractionListCard = () => {
  const [form] = Form.useForm();
  const [trialList, setTrialList] = React.useState([])
  const [centerList, setCenterList] = React.useState([])
  const [patientList, setPatientList] = React.useState([])
  const [fractionList, setFractionList] = React.useState([])

  const [trial, setTrial] = React.useState('')
  const [center, setCenter] = React.useState('')
  const [patient, setPatient] = React.useState('')

  const [isLoaded, setIsLoaded] = React.useState(false)

  const columns = [
    {
      title: 'Fraction Number',
      dataIndex: 'fractionNumber',
      key: 'fractionNumber',
    },
    {
      title: 'Fraction Name',
      dataIndex: 'fractionName',
      key: 'fractionName',
    },
    {
      title: 'Fraction Date',
      dataIndex: 'fractionDate',
      key: 'fractionDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type='link' className='m-0 p-0' onClick={() => handleDelete(record.key)}>Delete</Button>
      )
    }
  ];
    

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
    if (patient) {
      getFractionList(patient).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            const fractionList = data.fractionList.map((fraction, index) => {
              return {
                key: fraction.fraction_id,
                fractionNumber: fraction.fraction_number,
                fractionName: fraction.fraction_name,
                fractionDate: fraction.fraction_date
              }
            })
            setFractionList(fractionList)
          })
        }
      })
    }
  }, [patient])

  const handleDelete = (key) => {

    deleteFraction({"fractionId":key}).then((response) => {
      if (response.status === 200) {
        getFractionList(patient).then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              const fractionList = data.fractionList.map((fraction, index) => {
                return {
                  key: fraction.fraction_id,
                  fractionNumber: fraction.fraction_number,
                  fractionName: fraction.fraction_name,
                  fractionDate: fraction.fraction_date
                }
              })
              setFractionList(fractionList)
            })
          }
        })
      }
    })
  }

  const handleTrialChange = (value) => {
    setTrial(value)
    setCenter('')
    setPatient('')
  };

  const handleCenterChange = (value) => {
    setCenter(value)
    setPatient('')
  };

  const handlePatientChange = (value) => {
    setPatient(value)
  };

  return (
    <div className="flex flex-col">
    <div className="flex justify-center items-center">
      <h1 className='text-center text-xl font-bold'>Fraction List</h1>
      <Tooltip 
        title="In this section, you could view the list of fractions of a patient."
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
    {isLoaded && patient ? <Table columns={columns} dataSource={fractionList} size='small' className='my-4'/> : null}
    </div>
  );
}

export default FractionListCard;