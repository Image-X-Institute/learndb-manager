import { Tooltip, Card } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import PatientListTable from '../components/PatientListTable';

const PatientListPage = () => {
  return (
    <div className="h-full">
      <Card className="m-4">
        <div className="flex justify-center items-center">
          <h1 className='text-center text-xl font-bold'>Patient List</h1>
          <Tooltip 
            title="In this page, you can view the list of patients by selecting the trial name from the dropdown list."
          >
            <QuestionCircleOutlined className='ml-2 text-lg' />
          </Tooltip>
        </div>
        <PatientListTable />
      </Card>
    </div>
  )
}

export default PatientListPage;