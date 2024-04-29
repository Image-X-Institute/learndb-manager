import { Card, Col, Row, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import QaFileDownload from '../components/QaFileDownload';
import UpdateDatabasCard from '../components/UpdateDatabaseCard';
const QaCheck = () => {

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
      default:
        return null;
    }
  }
  return (
    <Row gutter={[8,16]}>
    <Col span={24}>
      <Card title={titleNode('Download missing records')} bordered={false}>
        <QaFileDownload />
      </Card>
    </Col>
    <Col span={24}>
      <Card title={titleNode('Update Database')} bordered={false}>
        <UpdateDatabasCard />
      </Card>
    </Col>
    </Row>
  );
}

export default QaCheck;