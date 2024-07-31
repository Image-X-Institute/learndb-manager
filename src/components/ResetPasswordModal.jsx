import { Button, Modal, Input, message } from "antd";
import React from "react"; 
import { changePassword } from "../utils/apiRequest";



const ResetPasswordModal = () => {
  const [visible, setVisible] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [tempPassword, setTempPassword] = React.useState('');
  const [isTempPassword, setIsTempPassword] = React.useState(false);

  const showModal = () => {
    setVisible(true);
  }

  const handleOk = () => {
    if (isTempPassword) {
      handleCancel();
      return;
    }
    const payload = {
      email: email,
      isReset: 1
    }
    changePassword(payload).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          if (data.tempPassword) {
            setIsTempPassword(true);
            setTempPassword(data.tempPassword);
          }
        });
      } else {
        res.json().then((data) => {
          message.error(data.message);
        });
      }
    }).catch((err) => {
      message.error(err.message);
    });
  }

  const handleCancel = () => {
    setVisible(false);
    setEmail('');
    setTempPassword('');
    setIsTempPassword(false);
  }

  return (
  <React.Fragment>
    <div className='text-center'>
      Forget your password? <Button className="p-0" type='link' onClick={showModal}>Reset Password</Button>
    </div>
    <Modal title="Reset Password" centered open={visible} onOk={handleOk} onCancel={handleCancel}>
      { isTempPassword 
        ? <div>The temporary password is <p className="text-3xl text-rose-500 font-bold ">{tempPassword}</p>
                Please change the password after login.
          </div>
        : <div>
            <p>Enter your email address below to reset your password.</p>
            <Input placeholder="abc@sydney.edu.au" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
      }
    </Modal>
  </React.Fragment>
  );
}

export default ResetPasswordModal;