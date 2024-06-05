import React from 'react';
import { Button, Form, Input, Upload, Select, Spin, message, Tooltip } from 'antd';
import { addTrial, getTrialList, getTrialStructure } from '../utils/apiRequest';
import { UploadOutlined, DownloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const AddTrialForm = () => {

  const [form] = Form.useForm();
  const [trialList, setTrialList] = React.useState([]);
  const [selectedTrial, setSelectedTrial] = React.useState();

  React.useEffect(() => {
    getTrialList().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setTrialList(data.trials);
        });
      }
    });
  }, []);

  const onFinish = (values) => {
    const reader = new FileReader();
    reader.readAsText(values.fileStructure.file);
    reader.onload = fileReader => {
      const filedata = JSON.parse(fileReader.target.result);
      const data = {
        trialDetails: {
          trialName: values.trialName,
          trialFullName: values.trialFullName
        },
        "fileStructure": filedata
      }
      addTrial(data).then((response) => {
        if (response.status === 201) {
          response.json().then((data) => {
            message.success(data.message);
            form.resetFields();
          });
        } else {
          response.json().then((data) => {
            message.error(data.message);
          });
        }
      });
    }
  }

  const handleTrialStructureDownload = () => {
    getTrialStructure(selectedTrial).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          if (!data.trialStructure) {
            message.error('No trial structure found');
            return;
          }
          const jsonString = JSON.stringify(data.trialStructure, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${selectedTrial}.json`);
          document.body.appendChild(link);
          link.click();
        });
      }
    });
  }

  const handleTrialTemplateDownload = () => {
    getTrialStructure('Template').then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          if (!data.trialStructure) {
            message.error('No trial structure found');
            return;
          }
          const jsonString = JSON.stringify(data.trialStructure, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Template.json');
          document.body.appendChild(link);
          link.click();
        });
      }
    });
  }


  if (!trialList) {
    return <Spin size='large' className='m-auto' tip='Loading...' />
  }


  return (
    <Form name="registerTrial"
      labelCol={{
        span: 12,
      }}
      wrapperCol={{
        span: 20,
      }}
      style={{
        maxWidth: 600,
        width: '60%',
      }}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
      form={form}
      onFinish={onFinish}
    >
      <Form.Item
        label="Trial Name"
        name="trialName"
        rules={[
          {
            required: true,
            message: 'Please input the trial name!',
          },
        ]}
      >
        <Input placeholder="LARK" />
      </Form.Item>

      <Form.Item
        label="Trial Full Name"
        name="trialFullName"
      >
        <Input placeholder="Liver Adaptive Radiotherapy utilising KIM" />
      </Form.Item>

      <Form.Item
        label="Trial Structure"
        name="trialStructure"
      >
        <React.Fragment>
          <div className='flex d-flex align-items-center'>
            <Select placeholder="Select trial structure template file" onChange={(value) => setSelectedTrial(value)}>
              {trialList.map((trial) => (
                <Select.Option key={trial} value={trial}>{trial}</Select.Option>
              ))
              }
            </Select>
            <Tooltip 
              title="Please select a trial from the dropdown list, 
              then click the download button to download the trial structure file.
              You can also download a blank template file by clicking the 'Download Blank Template' button.
              Once you have filled in the template file, upload it using the 'Upload Trial Structure' button.
              "
            >
              <QuestionCircleOutlined className='ml-2' />
            </Tooltip>
          </div>

          <div style={{display: 'flex', marginTop: '10px'}}>
          <Button icon={<DownloadOutlined />} className='mr-3' onClick={handleTrialStructureDownload} disabled={selectedTrial ? false : true}>Download</Button>
          <div className='m-auto'>OR</div>
          <Button type='link' onClick={handleTrialTemplateDownload}>Download Blank Template</Button>
          </div>
        </React.Fragment>
      </Form.Item>

      <Form.Item
        name="fileStructure"
        label="Upload Trial Structure"
        rules={[
          {
            required: true,
            message: 'Please upload file structure in json format!',
          },
        ]}
      >
        <Upload 
          name="fileStructure" 
          listType="json" 
          maxCount={1} 
          beforeUpload={() => false}
          style={{display: 'flex', justifyContent: 'center'}}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Add Trial
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddTrialForm;