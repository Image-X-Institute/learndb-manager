import UserListTable from "../components/UserListTable";
import NoAccessPage from "./NoAccessPage";


const UserManagement = () => {
  const accessLevel = localStorage.getItem('access_level')
  if (accessLevel !== '2') {
    return <NoAccessPage />
  }
  return (
    <div className="flex flex-col items-normal">
      <h1 className="text-2xl font-bold mb-4 text-center">
        User Management
      </h1>
      <UserListTable/>
    </div>
  );
}

export default UserManagement;