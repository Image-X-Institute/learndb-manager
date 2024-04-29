import { Card, Col, Row, Tooltip } from 'antd';
import AddCentreForm from '../components/AddCentreForm';
import { QuestionCircleOutlined } from '@ant-design/icons';

const CentreManagement = () => {

  const titleNode = (type) => {
    switch (type) {
      case 'title':
        return (
          <div style={{ display: 'flex'}}>
            <p className='font-bold text-lg mr-2'>Add New Centre</p>
            <Tooltip title="In this section, you could add new centre to the database">
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
        <AddCentreForm />
      </Card>
    </Col>
    <Col span={24}>
    </Col>
    </Row>
  );
}

export default CentreManagement;