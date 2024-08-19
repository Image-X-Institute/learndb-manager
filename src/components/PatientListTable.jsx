import React from 'react';
import { Select, Button, message, Spin, Table, Modal } from 'antd';
import { getTrialList, getPatientDetailList, deleteOnePatient } from "../utils/apiRequest";



const PatientListTable = () => {

  const [trialList, setTrialList] = React.useState([])
  const [trial, setTrial] = React.useState('')
  const [selectedPatient, setSelectedPatient] = React.useState('')
  const [patientList, setPatientList] = React.useState([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const [isLoaded, setIsLoaded] = React.useState(false)

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    deleteOnePatient({patientId: selectedPatient}).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          message.success(data.message)
          getPatientDetailList(trial).then((response) => {
            if (response.status === 200) {
              response.json().then((data) => {
                const patientList = data.patients.map((patient) => {
                  return {
                    key: patient.patient_trial_id,
                    patientId: patient.patient_trial_id,
                    testCentre: patient.test_centre,
                    centreNumber: patient.centre_patient_no,
                    tumourSite: patient.tumour_site
                  }
                })
                setPatientList(patientList)
              })
            }
          })
        })
      } else {
        response.json().then((data) => {
          message.error(data.message)
        })
      }
    }) 
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (key) => {
    setSelectedPatient(key)
    showModal()
  }

  const tableTitle = [
    {
      title: 'Patient Trial ID',
      dataIndex: 'patientId',
      key: 'patientId',
    },
    {
      title: 'Test Centre',
      dataIndex: 'testCentre',
      key: 'testCentre',
      sorter: {
        compare: (a, b) => a.testCentre.localeCompare(b.testCentre),
        multiple: 1
      }
    },
    {
      title: 'Centre Patient Number',
      dataIndex: 'centreNumber',
      key: 'centreNumber',
      sorter:{
        compare: (a, b) => a.centreNumber - b.centreNumber,
        multiple: 2
      }
    },
    {
      title: 'Tumour Site',
      dataIndex: 'tumourSite',
      key: 'tumourSite',
      sorter: {
        compare: (a, b) => a.tumourSite.localeCompare(b.tumourSite),
        multiple: 3
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type='link' className='m-0 p-0' onClick={() => handleDelete(record.key)}>Delete</Button>
      )
    }
  ]

  React.useEffect(() => {
    getTrialList().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setTrialList(data.trials)
          setIsLoaded(true)
        })
      }
    })
  }, [])

  React.useEffect(() => {
    if (trial) {
      getPatientDetailList(trial).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            const patientList = data.patients.map((patient) => {
              return {
                key: patient.patient_trial_id,
                patientId: patient.patient_trial_id,
                testCentre: patient.test_centre,
                centreNumber: patient.centre_patient_no,
                tumourSite: patient.tumour_site
              }
            })
            setPatientList(patientList)
          })
        }
      })
    }
  }, [trial])

  const handleTrialChange = (value) => {
    setTrial(value)
  }

  if (!isLoaded) {
    return <Spin size='large' className='m-auto' tip='Loading...'/>
  }

  return (
    <div>
      <div className='flex justify-center items-center my-4'>
        <div className='font-bold'>
          Please Select a Trial: 
        </div>
        <Select
          style={{ width: 200, margin: '10px' }}
          placeholder="Select a trial"
          optionFilterProp="children"
          onChange={handleTrialChange}
        >
          {trialList.map((trial) => (
            <Select.Option key={trial} value={trial}>{trial}</Select.Option>
          ))}
        </Select>
      </div>
      <Table columns={tableTitle} dataSource={patientList} />
      <Modal
        title="Confirm Patient Delete"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this patient?</p>
      </Modal>
    </div>
  )

}

export default PatientListTable;