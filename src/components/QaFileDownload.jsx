import React from 'react';
import { Select, Button, message, Spin } from 'antd';
import { getTrialList, getFractionQaCheck, getPrescriptionQaCheck } from "../utils/apiRequest";

const QaFileDownload = () => {

  const [trialList, setTrialList] = React.useState([])

  const [trial, setTrial] = React.useState('')
  const [level, setLevel] = React.useState('')

  const [isLoaded, setIsLoaded] = React.useState(false)

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
  };

  const handleLevelChange = (value) => {
    setLevel(value)
  }

  if (!isLoaded) {
    return <Spin size='large' className='m-auto' tip='Loading...'/>
  }

  const exportData = (data, level, trial) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trial}_${level}_QA_check.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleDownload = () => {
    if (trial === '' || level === '') {
      message.error('Please select trial and level');
    } else {
      switch (level) {
        case 'Prescription':
          getPrescriptionQaCheck(trial).then((response) => {
            if (response.status === 200) {
              response.json().then((data) => {
                exportData(data, level, trial);
              })
            }else {
              message.error('No data found');
            }
          })
          break;
        case 'Fraction':
          getFractionQaCheck(trial).then((response) => {
            if (response.status === 200) {
              response.json().then((data) => {
                exportData(data, level, trial);
              })
            } else {
              message.error('No data found');
            }
          })
          break;
        default:
          break;
      }
    }
  }

  return (
    <div className="h-full">
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
        <Button type="primary" onClick={handleDownload}>Download Result</Button>
      </div>
    </div>
  );
}

export default QaFileDownload;