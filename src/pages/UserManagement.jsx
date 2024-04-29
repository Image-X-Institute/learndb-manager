import UserListTable from "../components/UserListTable";

const UserManagement = () => {
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