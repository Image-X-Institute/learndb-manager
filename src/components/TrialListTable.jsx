import React from 'react';
import { getTrialList, deleteTrial } from '../utils/apiRequest';
import { Button, Table, Modal, message } from 'antd';


const TrialListTable = () => {

  const [ trialList, setTrialList ] = React.useState([]);
  const [ isModalVisible, setIsModalVisible ] = React.useState(false);
  const [ trialToDelete, setTrialToDelete ] = React.useState('');

  const handleDeleteClick = () => {
    if (trialToDelete === '') {
      message.error({
        content: 'Please select a trial to delete'
      })
      return;
    }
    deleteTrial({trialName: trialToDelete}).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          message.success({
            content: data.message
          })
          getTrialList().then((res) => {
            if (res.status === 200) {
              res.json().then((data) => {
                const tableList = data.trialDetails.map((trial) => {
                  return {
                    key: trial[0],
                    trialName: trial[0],
                    trialFullName: trial[1],
                  }
                })
                setTrialList(tableList);
              })
            }
          })
        })
      } else {
        res.json().then((data) => {
          message.error({
            content: data.message
          })
        })
      }
    })
    setIsModalVisible(false);
  }

  const columns = [
    {
      title: 'Trial Name',
      dataIndex: 'trialName',
      key: 'trialName',
    },
    {
      title: 'Trial Full Name',
      dataIndex: 'trialFullName',
      key: 'trialDescription',
    },
    {
      title: 'Action',
      key: 'action',
      render: (trial) => (
        <Button type='link' className='p-0 m-0' onClick={() => {
          setIsModalVisible(true);
          setTrialToDelete(trial.trialName);
        }}>Delete</Button>
      )
    }
  ]

  React.useEffect(() => {
    getTrialList().then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          const tableList = data.trialDetails.map((trial) => {
            return {
              key: trial[0],
              trialName: trial[0],
              trialFullName: trial[1],
            }
          })
          setTrialList(tableList);
        })
      }
    })
  }, [])


  return (
    <div>
      <Table columns={columns} dataSource={trialList} />
      <Modal
        title="Delete Trial"
        open={isModalVisible}
        onOk={() => handleDeleteClick()}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to delete the trial {trialToDelete}?</p>
      </Modal>
    </div>
  
  );

}

export default TrialListTable;