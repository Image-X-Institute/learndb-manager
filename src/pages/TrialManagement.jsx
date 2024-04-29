import { Card, Col, Row, Tooltip } from 'antd';
import AddTrialForm from '../components/AddTrialForm';
import { QuestionCircleOutlined } from '@ant-design/icons';

const TrialManagement = () => {

  const titleNode = (type) => {
    switch (type) {
      case 'title':
        return (
          <div style={{ display: 'flex'}}>
            <p className='font-bold text-lg mr-2'>Add New Trial</p>
            <Tooltip 
              title="In this section, you could add new trial to the database.
                      Please fill in the form below and click the 'Add Trial' button to submit the form.
                      You can also update the existing trial structure using this form. Simply, enter the trial name, 
                      and select and download the trial structure file,
                      update the updated file using the 'Upload Trial Structure' button.
                    "
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        )
      default:
        return '';
    }
  }

  return (
    <Row gutter={[8,16]}>
    <Col span={24}>
      <Card title={titleNode('title')} bordered={false}>
        <AddTrialForm />
      </Card>
    </Col>
    <Col span={24}>
    </Col>
    </Row>
  );
}

export default TrialManagement;
