import { Tooltip, Card } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import AddPatientForm from '../components/AddPatientForm';
import ImportNewPatient from '../components/ImportNewPatient';

const AddNewPatientPage = () => {

  return (
    <div className="h-full">
    <div className="flex justify-center items-center">
      <h1 className='text-center text-2xl font-bold my-4'>Patients Management</h1>
      <Tooltip 
        title="In this page, you can either add a new patient or import a list of patients from a CSV file."
      >
        <QuestionCircleOutlined className='ml-2 text-lg' />
      </Tooltip>
    </div>
    <Card className="m-4">
      <ImportNewPatient />
    </Card>
    <Card className="m-4 overflow-auto">
      <AddPatientForm />
    </Card>
  </div>

  );
}

export default AddNewPatientPage;