import AddUserForm from "../components/AddUserForm";

const AddNewUser = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="font-bold text-lg my-4">Add New User</h1>
      <AddUserForm/>
    </div>
  );
}

export default AddNewUser;