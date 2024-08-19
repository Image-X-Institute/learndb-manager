import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Button, message, Spin } from 'antd';
import { getPatientInfoTemplate, addBulkPatient } from '../utils/apiRequest';

const { Dragger } = Upload;


const ImportNewPatient = () => {

  const [fileList, setFileList] = React.useState([]);
  const [isSpin, setIsSpin] = React.useState(false);

  const handleTemplateDownload = () => {
    getPatientInfoTemplate().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          const blob = new Blob([data['patientInfoTemplate']], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'patient_info_template.csv');
          document.body.appendChild(link);
          link.click();
        });
      }
    });
  }

  const handleSubmitClick = () => {
    setIsSpin(true);
    const reader = new FileReader();
    reader.readAsText(fileList[0].originFileObj);
    reader.onload = fileReader => {
      const filedata = fileReader.target.result;
      const pack = {
        patientList: filedata
      }
      addBulkPatient(pack).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setIsSpin(false);
            if (data.failedPatients) {
              message.warning(data.message + '. ' + 'Failed Patient ID: ' + data.failedPatients);
              return;
            }
            message.success('Patient information added successfully');
          });
        } else {
          response.json().then((data) => {
            setIsSpin(false);
            message.error(data.message + '. ' + 'Failed Patient ID: ' + data.failedPatients);
          });
        }
      });
    }
  }

  if (isSpin) {
    return (
      <div className="flex justify-center align-center flex-col my-32">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center align-center flex-col">
      <div className="text-2xl font-bold mx-auto">
        Bulk Import Patient Information
      </div>
      <Button type='link' onClick={handleTemplateDownload}>Download Blank Template</Button>
      <div className="flex justify-center align-center flex-col mx-48">
        <Dragger
          name="patientList" 
          maxCount={1} 
          beforeUpload={() => false}
          style={{display: 'flex', justifyContent: 'center'}}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload patient information</p>
          <p className="ant-upload-hint">
            Support for a single upload.
          </p>
        </Dragger>
        <Button type="primary" className="mt-4" onClick={handleSubmitClick}>Submit</Button>
      </div>
  </div>
  );
}

export default ImportNewPatient;