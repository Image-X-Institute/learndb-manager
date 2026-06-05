import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Divider, Select, Spin, Typography, Upload, message } from 'antd';
import {
  exportPrescriptionCsv,
  getCenterList,
  getPatientIdList,
  getTrialList,
  syncPrescriptionCsv,
} from '../utils/apiRequest';

const { Dragger } = Upload;

const requiredCsvHeaders = [
  'patient_trial_id(*)',
  'clinical_trial(*)',
  'test_centre(*)',
  'centre_patient_no(*)',
  'tumour_site(*)',
];

const BulkModifyPrescriptionInformation = () => {
  const [trialList, setTrialList] = React.useState([]);
  const [centerList, setCenterList] = React.useState([]);
  const [patientList, setPatientList] = React.useState([]);
  const [trial, setTrial] = React.useState('');
  const [center, setCenter] = React.useState('');
  const [patient, setPatient] = React.useState('');
  const [fileList, setFileList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState(null);
  const [flags, setFlags] = React.useState({
    dryRun: false,
    deleteMissing: false,
    clearEmptyFields: false,
  });

  React.useEffect(() => {
    getTrialList().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => setTrialList(data.trials));
      }
    });
    getCenterList().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => setCenterList(data.sites));
      }
    });
  }, []);

  React.useEffect(() => {
    if (!trial || !center) {
      setPatientList([]);
      setPatient('');
      return;
    }

    getPatientIdList(trial, center).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => setPatientList(data.patients));
      }
    });
  }, [trial, center]);

  const updateFlag = (key, checked) => {
    setFlags((currentFlags) => ({
      ...currentFlags,
      [key]: checked,
    }));
  };

  const handleTrialChange = (value) => {
    setTrial(value || '');
    setCenter('');
    setPatient('');
  };

  const handleCenterChange = (value) => {
    setCenter(value || '');
    setPatient('');
  };

  const downloadCsv = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    if (!trial) {
      message.error('Please select a trial first.');
      return;
    }

    setIsLoading(true);
    exportPrescriptionCsv({ trialName: trial, siteName: center, patientId: patient }).then((response) => {
      response.json().then((data) => {
        setIsLoading(false);
        if (response.status === 200) {
          const filenameParts = [trial, center || 'all-centres', patient || 'all-patients', 'prescription'];
          downloadCsv(data.prescriptionCsv, `${filenameParts.join('_')}.csv`);
          message.success(`Downloaded ${data.rowCount} prescription rows.`);
        } else {
          message.error(data.message || 'Failed to export prescription CSV.');
        }
      });
    });
  };

  const validateCsvContent = (csvContent) => {
    const firstLine = csvContent.split(/\r?\n/).find((line) => line.trim());
    if (!firstLine) {
      return 'CSV file is empty.';
    }

    const headers = firstLine.split(',').map((header) => header.trim().replace(/^"|"$/g, ''));
    const missingHeaders = requiredCsvHeaders.filter((header) => !headers.includes(header));
    if (missingHeaders.length > 0) {
      return `CSV missing required columns: ${missingHeaders.join(', ')}`;
    }

    return '';
  };

  const handleUploadSubmit = () => {
    if (!trial) {
      message.error('Please select a trial first.');
      return;
    }
    if (fileList.length === 0) {
      message.error('Please upload a CSV file first.');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsText(fileList[0].originFileObj);
    reader.onload = (event) => {
      const csvContent = event.target.result;
      const validationError = validateCsvContent(csvContent);
      if (validationError) {
        message.error(validationError);
        setIsLoading(false);
        return;
      }

      syncPrescriptionCsv({
        csvContent,
        fileName: fileList[0].name,
        trialName: trial,
        siteName: center,
        patientId: patient,
        ...flags,
      }).then((response) => {
        response.json().then((data) => {
          setIsLoading(false);
          if (response.status === 200) {
            setSyncResult(data);
            message.success(flags.dryRun ? 'Dry run completed.' : 'Prescription CSV synced successfully.');
          } else {
            message.error(data.message || 'Failed to sync prescription CSV.');
          }
        });
      });
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center align-center my-32">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold mx-auto">
        Bulk Modify Prescription Information
      </div>

      <Alert
        className="mx-auto mt-4 w-full max-w-4xl"
        type="info"
        showIcon
        message="How to use this section"
        description={
          <div>
            <Typography.Paragraph className="!mb-2">
              Use this tool when you want to bulk edit patient and prescription-level data from a CSV file.
            </Typography.Paragraph>
            <ol className="ml-5 list-decimal">
              <li>Select a trial. Centre and patient ID are optional filters for downloading a smaller CSV.</li>
              <li>Click <strong>Download Prescription CSV</strong> to export current database records.</li>
              <li>Edit the downloaded CSV. Keep the required columns unchanged: {requiredCsvHeaders.map((header) => <code key={header}> {header}</code>)}.</li>
              <li>Upload the edited CSV and choose the flags below before clicking <strong>Upload and Sync</strong>.</li>
            </ol>
            <Typography.Paragraph className="!mt-2 !mb-0">
              <strong>Dry run only</strong> previews changes without writing to the database.
              <strong> Delete patients missing from CSV</strong> deletes missing patients and their related prescription, fraction, and image records inside the selected scope.
              <strong> Clear database fields when CSV cells are empty</strong> overwrites existing optional values with blanks.
            </Typography.Paragraph>
          </div>
        }
      />

      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <div>
          <div>Trial <span className="text-red-500">*</span>:</div>
          <Select
            allowClear
            className="w-40"
            onChange={handleTrialChange}
            options={trialList.map((trialName) => ({ value: trialName, label: trialName }))}
            value={trial || undefined}
          />
        </div>
        <div>
          <div>Centre:</div>
          <Select
            allowClear
            className="w-44"
            onChange={handleCenterChange}
            options={centerList.map((centerName) => ({ value: centerName, label: centerName }))}
            value={center || undefined}
          />
        </div>
        <div>
          <div>Patient ID:</div>
          <Select
            allowClear
            disabled={!center}
            className="w-44"
            onChange={(value) => setPatient(value || '')}
            options={patientList.map((patientId) => ({ value: patientId, label: patientId }))}
            value={patient || undefined}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button type="primary" onClick={handleDownload}>Download Prescription CSV</Button>
      </div>

      <Divider />

      <div className="mx-auto mb-4 flex flex-wrap justify-center gap-6">
        <Checkbox checked={flags.dryRun} onChange={(event) => updateFlag('dryRun', event.target.checked)}>
          Dry run only
        </Checkbox>
        <Checkbox checked={flags.deleteMissing} onChange={(event) => updateFlag('deleteMissing', event.target.checked)}>
          Delete patients missing from CSV
        </Checkbox>
        <Checkbox checked={flags.clearEmptyFields} onChange={(event) => updateFlag('clearEmptyFields', event.target.checked)}>
          Clear database fields when CSV cells are empty
        </Checkbox>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <Dragger
          accept=".csv,text/csv"
          maxCount={1}
          beforeUpload={() => false}
          fileList={fileList}
          onChange={({ fileList }) => {
            setFileList(fileList);
            setSyncResult(null);
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag CSV file to this area to upload prescription information</p>
          <p className="ant-upload-hint">
            Required columns: {requiredCsvHeaders.join(', ')}
          </p>
        </Dragger>
        <div className="mt-4 flex justify-center">
          <Button type="primary" onClick={handleUploadSubmit}>Upload and Sync</Button>
        </div>
      </div>

      {syncResult && (
        <Alert
          className="mx-auto mt-4 w-full max-w-3xl"
          type={syncResult.dryRun ? 'info' : 'success'}
          showIcon
          message="Sync result"
          description={
            <div>
              <div>Inserted: {syncResult.insertedCount}</div>
              <div>Updated: {syncResult.updatedCount}</div>
              <div>Deleted: {syncResult.deletedCount}</div>
              <div>Unchanged: {syncResult.unchangedCount}</div>
              <div>Skipped rows: {syncResult.skippedRows?.length || 0}</div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default BulkModifyPrescriptionInformation;
