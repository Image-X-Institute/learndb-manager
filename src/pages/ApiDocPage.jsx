import { Card, Collapse, Table, Tag, Typography } from 'antd';
import { BACKEND_URL } from '../config/config';

const { Paragraph, Text, Title } = Typography;

const methodColors = {
  GET: 'blue',
  POST: 'green',
  PATCH: 'orange',
  DELETE: 'red',
};

const apiGroups = [
  {
    key: 'patient',
    label: 'Patient APIs',
    apis: [
      {
        method: 'GET',
        path: '/api/patient/getPatientIdList',
        purpose: 'Get patient IDs by trial and centre.',
        params: 'Query: trialName (required), siteName (required)',
        body: '-',
        example: '/api/patient/getPatientIdList?trialName=LEARN&siteName=Nepean',
      },
      {
        method: 'GET',
        path: '/api/patient/getPatientInfo',
        purpose: 'Get one patient and prescription record by patient ID.',
        params: 'Query: patientId (required)',
        body: '-',
        example: '/api/patient/getPatientInfo?patientId=11443-1',
      },
      {
        method: 'POST',
        path: '/api/patient/addOnePatient',
        purpose: 'Add one patient and create its prescription row.',
        params: '-',
        body: 'JSON patient fields, e.g. patient_trial_id, clinical_trial, test_centre, centre_patient_no, tumour_site, linac_type',
        example: '{"patient_trial_id":"11443-1","clinical_trial":"LEARN","test_centre":"RNSH","centre_patient_no":"1","tumour_site":"Prostate","linac_type":"Linac"}',
      },
      {
        method: 'POST',
        path: '/api/patient/addBulkPatient',
        purpose: 'Bulk import patients from CSV content and create prescription rows.',
        params: '-',
        body: 'JSON: { patientList: "<csv text>" }',
        example: '{"patientList":"patient_trial_id(*),clinical_trial(*),test_centre(*),centre_patient_no(*),tumour_site(*)\\n11443-1,LEARN,RNSH,1,Prostate"}',
      },
      {
        method: 'GET',
        path: '/api/patient/getPatientDetailList',
        purpose: 'Export patient detail list for a trial.',
        params: 'Query: trialName (required)',
        body: '-',
        example: '/api/patient/getPatientDetailList?trialName=LEARN',
      },
      {
        method: 'POST',
        path: '/api/patient/deleteOnePatient',
        purpose: 'Delete one patient and related prescription, fraction, and image rows.',
        params: '-',
        body: 'JSON: { patientId: "<patient_trial_id>" }',
        example: '{"patientId":"11443-1"}',
      },
    ],
  },
  {
    key: 'prescription',
    label: 'Prescription APIs',
    apis: [
      {
        method: 'PATCH',
        path: '/api/prescription/updatePatientInfo',
        purpose: 'Update patient and prescription fields for one patient.',
        params: 'Query: patientId (required)',
        body: 'JSON fields to update. Patient table fields update patient; other fields update prescription.',
        example: '/api/prescription/updatePatientInfo?patientId=11443-1',
      },
      {
        method: 'GET',
        path: '/api/prescription/getMissingPrescriptionFieldCheck',
        purpose: 'Find missing prescription-level fields for a trial.',
        params: 'Query: trialName (required)',
        body: '-',
        example: '/api/prescription/getMissingPrescriptionFieldCheck?trialName=LEARN',
      },
      {
        method: 'GET',
        path: '/api/prescription/getUpdatePrescriptionField',
        purpose: 'Suggest prescription file path updates from the filesystem.',
        params: 'Query: trialName (required), rootDrivePath (optional)',
        body: '-',
        example: '/api/prescription/getUpdatePrescriptionField?trialName=LEARN&rootDrivePath=/mnt/rds',
      },
      {
        method: 'PATCH',
        path: '/api/prescription/updatePrescriptionField',
        purpose: 'Apply prescription file path updates.',
        params: '-',
        body: 'JSON array: [{ patient_trial_id, updateFields: { fieldName: value } }]',
        example: '[{"patient_trial_id":"11443-1","updateFields":{"rt_ct_pres":"/LEARN/RNSH/..."}}]',
      },
      {
        method: 'GET',
        path: '/api/prescription/exportPrescriptionCsv',
        purpose: 'Download patient + prescription rows as editable CSV.',
        params: 'Query: trialName (required), siteName (optional), patientId (optional)',
        body: '-',
        example: '/api/prescription/exportPrescriptionCsv?trialName=LEARN&siteName=Nepean&patientId=25998-1',
      },
      {
        method: 'POST',
        path: '/api/prescription/syncPrescriptionCsv',
        purpose: 'Sync uploaded prescription CSV into patient and prescription tables.',
        params: '-',
        body: 'JSON: csvContent or filePath, trialName, optional siteName/patientId, dryRun, deleteMissing, clearEmptyFields',
        example: '{"csvContent":"patient_trial_id(*),clinical_trial(*),...","trialName":"LEARN","dryRun":true,"deleteMissing":false,"clearEmptyFields":false}',
      },
    ],
  },
  {
    key: 'fraction',
    label: 'Fraction APIs',
    apis: [
      {
        method: 'GET',
        path: '/api/fraction/getFractionDetailByPatientId',
        purpose: 'Get fraction and image details for a patient.',
        params: 'Query: patientId (required), trialName (required)',
        body: '-',
        example: '/api/fraction/getFractionDetailByPatientId?patientId=11443-1&trialName=LEARN',
      },
      {
        method: 'GET',
        path: '/api/fraction/getFractionListByPatientId',
        purpose: 'Get basic fraction list for a patient.',
        params: 'Query: patientId (required)',
        body: '-',
        example: '/api/fraction/getFractionListByPatientId?patientId=11443-1',
      },
      {
        method: 'PATCH',
        path: '/api/fraction/updateFractionInfo',
        purpose: 'Update one fraction row and/or related image fields.',
        params: '-',
        body: 'JSON: patientId, fractionName, plus fields to update',
        example: '{"patientId":"11443-1","fractionName":"FX1","fraction_date":"2025-07-16"}',
      },
      {
        method: 'GET',
        path: '/api/fraction/getMissingFractionFieldCheck',
        purpose: 'Find missing fraction-level fields for a trial.',
        params: 'Query: trialName (required)',
        body: '-',
        example: '/api/fraction/getMissingFractionFieldCheck?trialName=LEARN',
      },
      {
        method: 'GET',
        path: '/api/fraction/getUpdateFractionField',
        purpose: 'Suggest fraction file path updates from the filesystem.',
        params: 'Query: trialName (required), rootDrivePath (optional)',
        body: '-',
        example: '/api/fraction/getUpdateFractionField?trialName=LEARN&rootDrivePath=/mnt/rds',
      },
      {
        method: 'PATCH',
        path: '/api/fraction/updateFractionField',
        purpose: 'Apply fraction file path updates.',
        params: '-',
        body: 'JSON array: [{ patient_trial_id, fraction_name, updateFields: { fieldName: value } }]',
        example: '[{"patient_trial_id":"11443-1","fraction_name":"FX1","updateFields":{"kv_images_path":"/LEARN/..."}}]',
      },
      {
        method: 'POST',
        path: '/api/fraction/addNewFraction',
        purpose: 'Add one fraction for a patient and create an empty images row.',
        params: '-',
        body: 'JSON: patientId, fractionNumber/fractionName/fractionDate and optional fraction fields',
        example: '{"patientId":"11443-1","fractionName":"FX1","fractionNumber":1,"fractionDate":"2025-07-16"}',
      },
      {
        method: 'POST',
        path: '/api/fraction/addBulkFraction',
        purpose: 'Bulk import fractions from CSV content.',
        params: '-',
        body: 'JSON: { fractionList: "<csv text>" }',
        example: '{"fractionList":"patientId(*),fractionNumber(*),fractionName(*)\\n11443-1,1,FX1"}',
      },
      {
        method: 'DELETE',
        path: '/api/fraction/deleteFraction',
        purpose: 'Delete one fraction and its image row by fraction UUID.',
        params: '-',
        body: 'JSON: { fractionId: "<uuid>" }',
        example: '{"fractionId":"00000000-0000-0000-0000-000000000000"}',
      },
      {
        method: 'GET',
        path: '/api/fraction/exportFractionCsv',
        purpose: 'Download fraction rows as editable CSV.',
        params: 'Query: trialName (required), siteName (optional), patientId (optional)',
        body: '-',
        example: '/api/fraction/exportFractionCsv?trialName=LEARN&siteName=Nepean&patientId=25998-1',
      },
      {
        method: 'POST',
        path: '/api/fraction/syncFractionCsv',
        purpose: 'Sync uploaded fraction CSV into the fraction table and related images rows.',
        params: '-',
        body: 'JSON: csvContent or filePath, trialName, optional dryRun/deleteMissing/clearEmptyFields',
        example: '{"csvContent":"patientId(*),fractionNumber(*),fractionName(*)\\n11443-1,1,FX1","trialName":"LEARN","dryRun":true,"deleteMissing":false,"clearEmptyFields":false}',
      },
    ],
  },
];

const columns = [
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
    width: 90,
    render: (method) => <Tag color={methodColors[method]}>{method}</Tag>,
  },
  {
    title: 'Address',
    dataIndex: 'path',
    key: 'path',
    width: 300,
    render: (path) => <Text code>{path}</Text>,
  },
  {
    title: 'How to Use',
    key: 'usage',
    render: (_, record) => (
      <div>
        <Paragraph className="!mb-1">{record.purpose}</Paragraph>
        <Paragraph className="!mb-1"><Text strong>Parameters:</Text> {record.params}</Paragraph>
        <Paragraph className="!mb-1"><Text strong>Body:</Text> {record.body}</Paragraph>
        <Paragraph className="!mb-0 break-all"><Text strong>Example:</Text> <Text code>{record.example}</Text></Paragraph>
      </div>
    ),
  },
];

const ApiDocPage = () => {
  return (
    <div className="h-full">
      <div className="flex justify-center items-center">
        <Title level={2} className="!my-4">API Doc</Title>
      </div>

      <Card className="m-4">
        <Paragraph>
          This page documents the management APIs used by the frontend for patient, prescription, and fraction data.
        </Paragraph>
        <Paragraph className="!mb-0">
          Base URL: <Text code>{BACKEND_URL}</Text>. Most frontend requests include
          <Text code className="mx-1">Authorization: Bearer {'<token>'}</Text>
          automatically after login.
        </Paragraph>
      </Card>

      <Card className="m-4">
        <Collapse
          defaultActiveKey={['patient', 'prescription', 'fraction']}
          items={apiGroups.map((group) => ({
            key: group.key,
            label: group.label,
            children: (
              <Table
                rowKey={(record) => `${record.method}-${record.path}`}
                columns={columns}
                dataSource={group.apis}
                pagination={false}
                bordered
                size="small"
              />
            ),
          }))}
        />
      </Card>
    </div>
  );
};

export default ApiDocPage;
