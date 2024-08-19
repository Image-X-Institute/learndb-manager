import AddUserForm from "../components/AddUserForm";
import NoAccessPage from "./NoAccessPage";
const AddNewUser = () => {

  const accessLevel = localStorage.getItem('access_level')

  if (accessLevel !== '2') {
    return <NoAccessPage />
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="font-bold text-lg my-4">Add New User</h1>
      <AddUserForm/>
    </div>
  );
}

export default AddNewUser;