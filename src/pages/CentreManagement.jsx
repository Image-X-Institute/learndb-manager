import { Card, Col, Row, Tooltip } from 'antd';
import AddCentreForm from '../components/AddCentreForm';
import { QuestionCircleOutlined } from '@ant-design/icons';
import DeleteCentreTable from '../components/DeleteCentreTable';

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
      case 'Centre List':
        return (
          <div style={{ display: 'flex'}}>
            <p className='font-bold text-lg mr-2'>Centre List</p>
            <Tooltip title="In this section, you could view all the centres in the database">
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
      <Card title={titleNode('Centre List')} bordered={false}>
        <DeleteCentreTable />
      </Card>
    </Col>
    </Row>
  );
}

export default CentreManagement;