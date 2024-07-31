import LoginForm from '../components/LoginForm';
import ResetPasswordModal from '../components/ResetPasswordModal';
import { Card } from 'antd';

const LoginPage = () => {




  return (
    <div className="g-0 lg:flex lg:flex-wrap h-screen">
      {/* <!-- Left column container--> */}
      <div className="px-4 md:px-0 lg:w-6/12 m-auto">
        <div className="md:mx-6 md:p-12">
          {/* <!--Logo--> */}
          <div className="text-center">
            <img
              className="mx-auto w-32"
              src="/biglogo.jpg"
              alt="logo"
            />
            <h4 className="m-auto mt-4 pb-1 text-xl font-semibold">
              Sign in to your account
            </h4>
          </div>
          <Card className='p-4 shadow-md mt-4 w-full'>
            <LoginForm />
            <div className='text-center'>
              Do not have an account? <a href='/register' className='text-blue-500'>Register</a>
            </div>
            <ResetPasswordModal />
          </Card>
        </div>
      </div>

      {/* <!-- Right column container with background and description--> */}
      <div
        className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none"
        style={{
          background:
            "linear-gradient(to right, #f6d098, #f3ab42, #f19816, #f3a93d, #f6d098)",
        }}
      >
        <div className="px-4 py-6 text-white md:mx-6 md:p-12">
          <h4 className="mb-6 text-xl font-semibold">
            Welcome to Real-Time Imaging Database Management Portal
          </h4>
          <p className="text-sm">
            This is a secure portal 
            for Imaage X Institute clinical staff to manage the imaging database. 
            With this portal, staff are able to edit, update, and delete the database records.
            Please sign in to access the portal.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;