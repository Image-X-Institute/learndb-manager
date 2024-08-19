import React from 'react';
import { Col, Row, Statistic, Card, Select, Tooltip, Spin } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import { getPatientTrialStats } from '../utils/apiRequest';

const formatter = (value) => <CountUp end={value} separator="," />;

const Dashboard = () => {

  const [generalStats, setGeneralStats] = React.useState({});
  const [selectedTrial, setSelectedTrial] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    getPatientTrialStats().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setGeneralStats(data);
          setIsLoading(false);
        });
      }
    });
  }, []);

  if (isLoading) {
    return <Spin size='large' className='m-auto' tip='Loading...'/>
  }

  const handleTrialChange = (value) => {
    setSelectedTrial(value);
  }

  const titleNode = (type) => {
    switch (type) {
      case 'patients':
        return (
          <div style={{ display: 'flex'}}>
            <p className='font-bold text-lg mr-2'>Total Patients</p>
            <Tooltip title="The below figure shows number of patients in the database">
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        )
      case 'trials':
        return (
          <div style={{ display: 'flex'}}>
            <p className='font-bold text-lg mr-2'>Total Trials</p>
            <Tooltip title="The below figure shows number of trials in the database">
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        )
      default:
        return '';
    }
  }

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card style={{ height: '100%' }}>
          <Statistic title={titleNode('patients')} value={generalStats['totalPatients']} formatter={formatter}>
            <QuestionCircleOutlined />
          </Statistic>
          <div>
            <p className='font-bold'>Number of Patients in Trial:</p>
          </div>
          {
            Object.keys(generalStats['patientInTrials']).map((trial) => {
              return (
                <div key={trial}>
                  <p>{trial}: <CountUp end={generalStats['patientInTrials'][trial]} separator="," /></p>
                </div>      
              )
            })
          }
        </Card>
      </Col>
      <Col span={12}>
        <Card style={{ height: '100%' }}>
          <Statistic title={titleNode('trials')} value={generalStats['totalTrials']} precision={2} formatter={formatter} />
          <div>
            <p className='font-bold'>Select Trial for number of patients in centre:</p>
            <Select
              placeholder="Select a trial"
              style={{ width: 200 }}
              onChange={handleTrialChange}
              options={Object.keys(generalStats['patientInTrials']).map((trial) => {
                return { label: trial, value: trial }
              }
              )}
            />
            {selectedTrial && (
              <div>
                {
                  Object.keys(generalStats['centreInTrials'][selectedTrial]).map((centre) => {
                    return (
                      <div key={centre}>
                        <p>{centre}: <CountUp end={generalStats['centreInTrials'][selectedTrial][centre]} separator="," /></p>
                      </div>
                    )
                  })
                }
              </div>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
}
export default Dashboard;