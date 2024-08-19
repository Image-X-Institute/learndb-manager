import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Button, message, Spin } from 'antd';
import { getFractionInfoTemplate, addBulkFraction } from '../utils/apiRequest';

const { Dragger } = Upload;

const BulkAddFraction = () => {
  const [fileList, setFileList] = React.useState([]);
  const [isSpin, setIsSpin] = React.useState(false);

  const handleTemplateDownload = () => {
    getFractionInfoTemplate().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          const blob = new Blob([data['fractionInfoTemplate']], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'patient_fraction_template.csv');
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
        fractionList: filedata
      }
      addBulkFraction(pack).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setIsSpin(false);
            message.success(data.message);
          });
        } else {
          response.json().then((data) => {
            setIsSpin(false);
            message.error(data.message);
          });
        }
      });
    }
  }

  if (isSpin) {
    return (
      <div className="flex justify-center align-center my-32">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center align-center flex-col">
      <div className="text-2xl font-bold mx-auto">
        Bulk Import Fraction Information
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

export default BulkAddFraction;
