import { Card, Col, Row, Tooltip, Select, Input, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import QaFileDownload from '../components/QaFileDownload';
import UpdateDatabasCard from '../components/UpdateDatabaseCard';
import React from 'react';
import { getAvailableRootDrive } from '../utils/apiRequest';
const QaCheck = () => {

  const [availableRootDrive, setAvailableRootDrive] = React.useState([]);
  const [selectedDrive, setSelectedDrive] = React.useState('');
  const [pathToTrialFolder, setPathToTrialFolder] = React.useState('');

  React.useEffect(() => {
    getAvailableRootDrive().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          const options = data.rootFolderList.map((item) => {
            return {
              label: item,
              value: item
            }
          });
          setAvailableRootDrive(options);
        });
      }
    });
  }, []);


  const titleNode = (title) => {
    switch (title) {
      case 'Download missing records':
        return (
          <div className='flex'>
            <div className='mr-2'>{title}</div>
            <Tooltip 
              title="In this section, you can download the missing records of a trial in the database.
                      Select the trial and level to download the missing records.
                      The downloaded file will be a JSON file. You could use this file to upload the missing files
                      in the RDS. After the files are uploaded in the RDS, you can update the database with the below section.
                      "
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        )
      case 'Update Database':
        return (
          <div className='flex'>
            <div className='mr-2'>{title}</div>
            <Tooltip 
              title="In this section, you can sync and update the database records with the files in RDS.
                      Select the trial and level, then click the 'Show Updates' button to view the updates.
                      If you want to update the database, click the 'Confirm Updates' button. After the update,
                      the database will be updated with the records in RDS. This operation is IRRIVERSIBLE.
                      "
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        )
      case 'Drive Selection':
        return (
          <div className='flex'>
            <div className='mr-2'>Data Drive Selection</div>
            <Tooltip 
              title="In this section, you can select the available drive 
                      and input the path to the trial folder 
                      if your trial data is not in the default RDS drive.
                      The format of the path should be like 'path/to/trial/folder'.
                      For example, The location of LARK trial in RDS is /PRJ-RPL/2RESEARCH/1_ClinicalData/LARK,
                      then you should select the drive 'PRJ-RPL' and input '2RESEARCH/1_ClinicalData' in the input box.
                    "
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        )
      default:
        return null;
    }
  }
  const handleClearClick = () => {
    setSelectedDrive('');
    setPathToTrialFolder('');
  }

  const combinePath = () => {
    if (selectedDrive == '') {
      return '';
    }
    if (pathToTrialFolder == '') {
      return `/${selectedDrive}`;
    }
    return `/${selectedDrive}/${pathToTrialFolder}`;
  }

  return (
    <Row gutter={[8,16]}>
      <Col span={24}>
        <Card title={titleNode('Drive Selection')} bordered={false}>
          <div className='flex'>
            <div className='w-1/3'>
              <div className='mr-2'>Select Available Drive</div>
              <Select options={availableRootDrive} className='w-full' onChange={(value) => setSelectedDrive(value)} value={selectedDrive} />
            </div>
            <div className='w-2/3'>
              <div className='mr-2'>Input path to trial folder</div>
              <Input placeholder='Path to trial folder' onChange={(e) => setPathToTrialFolder(e.target.value)} value={pathToTrialFolder} />
            </div>
          </div>
          <Button className='mt-4' type='primary' onClick={handleClearClick}>Clear</Button>
          <div className='mt-4 flex'>
            <div>Path to trial folder:&#20;</div>
            <div>
              {combinePath()}
            </div>
          </div>
        </Card>
      </Col>

      <Col span={24}>
        <Card title={titleNode('Download missing records')} bordered={false}>
          <QaFileDownload />
        </Card>
      </Col>
      <Col span={24}>
        <Card title={titleNode('Update Database')} bordered={false}>
          <UpdateDatabasCard rootDrivePath={combinePath()} />
        </Card>
      </Col>
    </Row>
  );
}

export default QaCheck;