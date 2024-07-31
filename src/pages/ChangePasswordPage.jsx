import ChangePasswordForm from "../components/ChangePasswordForm";
import ResetPasswordModal from "../components/ResetPasswordModal";

const ChangePasswordPage = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <ChangePasswordForm />
      <ResetPasswordModal />
    </div>
  );
}

export default ChangePasswordPage;