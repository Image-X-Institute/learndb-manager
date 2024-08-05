
import { Tooltip, Card } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import FractionDetailCard from "../components/FractionDetailCard";
import AddNewFractionForm from "../components/AddNewFractionForm";

const FractionsManagement = () => {

  return (
    <div className="h-full">
      <div className="flex justify-center items-center">
        <h1 className='text-center text-2xl font-bold my-4'>Fractions Management</h1>
        <Tooltip 
          title="In this page, you can manage the fractions of a patient. 
                  Select the trial, center, patient and fraction number to view the details of the fraction.
                  To update the fraction data, change the value and click submit button which is at the bottom of each fraction tab."
        >
          <QuestionCircleOutlined className='ml-2 text-lg' />
        </Tooltip>
      </div>
      <Card className="m-4">
        <FractionDetailCard />
      </Card>
      <Card className="m-4">
        <AddNewFractionForm />   
      </Card>
    </div>
  );
}

export default FractionsManagement;