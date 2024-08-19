import React from 'react';
import { Select, Button, message, Divider, Spin } from 'antd';
import { getTrialList, getUpdatePrescriptionField, updatePrescriptionField, getUpdateFractionField, updateFractionField } from "../utils/apiRequest";

const UpdateDatabasCard = (rootDrivePath) => {

  const [trialList, setTrialList] = React.useState([])

  const [trial, setTrial] = React.useState('')
  const [level, setLevel] = React.useState('')
  const [updateData, setUpdateData] = React.useState([]);
  const [isDisabled, setIsDisabled] = React.useState(true)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isWaitingForServer, setIsWaitingForServer] = React.useState(false)

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

  const handleTrialChange = (value) => {
    setTrial(value)
    setLevel('')
    setIsDisabled(true)
    setUpdateData([])
  };

  const handleLevelChange = (value) => {
    setLevel(value)
    setIsDisabled(true)
    setUpdateData([])
  }

  const handleShowUpdateClick = () => {
    if (trial === '' || level === '') {
      message.error('Please select trial and level');
    } else {
      setIsWaitingForServer(true)
      switch (level) {
        case 'Prescription':
          getUpdatePrescriptionField(trial, rootDrivePath.rootDrivePath).then((response) => {
            if (response.status === 200) {
              response.json().then((data) => {
                setUpdateData(data)
                setIsDisabled(false)
              })
            } else {
              response.json().then((data) => {
                message.error(data.message)
              })
            }
            setIsWaitingForServer(false)
          })
          break;
        case 'Fraction':
          getUpdateFractionField(trial, rootDrivePath.rootDrivePath).then((response) => {
            if (response.status === 200) {
              response.json().then((data) => {
                setUpdateData(data)
                setIsDisabled(false)
              })
            } else {
              response.json().then((data) => {
                message.error(data.message)
              })
            }
            setIsWaitingForServer(false)
          })
          break;
        default:
          break;
      }
    }
  }

  const handleConfirmUpdateClick = () => {
    setIsWaitingForServer(true)
    switch (level) {
      case 'Prescription':
        updatePrescriptionField(updateData).then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              message.success('Update success!')
              setUpdateData([])
              setIsDisabled(true)
            })
          } else {
            response.json().then((data) => {
              message.error(data.message)
            })
          }
          setIsWaitingForServer(false)
        })
        break;
      case 'Fraction':
        updateFractionField(updateData).then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              message.success('Update success!')
              setUpdateData([])
              setIsDisabled(true)
            })
          } else {
            response.json().then((data) => {
              message.error(data.message)
            })
          }
          setIsWaitingForServer(false)
        })
        break;
      default:
        break;
    }
  }

  if (!isLoaded) {
    return <Spin size='large' className='m-auto' tip='Loading...'/>
  }

  return (
    <Spin className="h-full" spinning={isWaitingForServer} tip="Loading" size="large">
      <div className="flex flex-col justify-center items-center">
        <div>Please select Trial and level:</div>
        <div className='flex flex-row my-4'>
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
          <div>
            <div>
              Level:
            </div>
            <Select
              defaultValue=""
              style={{
                width: 120,
              }}
              onChange={handleLevelChange}
              options={["Prescription", "Fraction"].map((level) => ({ value: level, label: level }))}
              value={level}
            />
          </div>
        </div>
        <div>
          <Button type="primary" onClick={handleShowUpdateClick}>Show Updates</Button>
          <Button type="primary" className="mx-2" disabled={isDisabled} onClick={handleConfirmUpdateClick}>Confirm Update</Button>
        </div>
        <div className='max-h-[300px] overflow-scroll' style={{'max-width': '-webkit-fill-available'}}>
          {updateData.map((data, idx) => {
            return (
                <div key={idx}>
                  {Object.keys(data) ? JSON.stringify(data) : ''}
                  <Divider />
                </div>
            )
          })}
        </div>
      </div>
    </Spin>
  );
}

export default UpdateDatabasCard;
