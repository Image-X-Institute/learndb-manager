import React from 'react';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { DownloadOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { addTrial, getTrialList, getTrialStructure } from '../utils/apiRequest';

const { Link, Text } = Typography;

const EMPTY_STRUCTURE = {
  prescription: {},
  fraction: {},
};

const STORAGE_OPTIONS = [
  { label: 'column (existing physical column)', value: 'column' },
  { label: 'jsonb (extended_data)', value: 'jsonb' },
];

const FIELD_TYPE_OPTIONS = [
  { label: 'folder', value: 'folder' },
  { label: 'file', value: 'file' },
  { label: 'text', value: 'text' },
  { label: 'number', value: 'number' },
  { label: 'json', value: 'json' },
];

const LEVEL_OPTIONS = [
  { label: 'prescription', value: 'prescription' },
  { label: 'fraction', value: 'fraction' },
];

const STORAGE_TABLE_OPTIONS = [
  { label: 'fraction.extended_data', value: 'fraction' },
  { label: 'images.extended_data', value: 'images' },
];

const CUSTOM_FIELD_OPTION = '__extended_custom_key__';

const PRESCRIPTION_COLUMN_FIELDS = [
  'linac_type',
  'rt_plan_pres',
  'rt_ct_pres',
  'rt_structure_pres',
  'rt_dose_pres',
  'rt_mri_pres',
  'planned_dvh_pres',
  'centroid_path',
  'centroid_pres',
  'planned_dicom_pres',
  'magik_visual',
  'magik_model',
  'marker_offsets',
  'cardiac_ct',
  'fused_ct',
  'test1',
];

const FRACTION_COLUMN_FIELDS = [
  'fraction_date',
  'fraction_number',
  'fraction_name',
  'num_gating_events',
  'mvsdd',
  'kvsdd',
  'kv_pixel_size',
  'mv_pixel_size',
  'marker_length',
  'marker_width',
  'marker_type',
  'imaging_kv',
  'imaging_ms',
  'imaging_ma',
];

const IMAGE_COLUMN_FIELDS = [
  'kim_logs_path',
  'kv_images_path',
  'mv_images_path',
  'metrics_path',
  'triangulation_path',
  'trajectory_logs_path',
  'dvh_track_path',
  'dvh_no_track_path',
  'dicom_track_plan_path',
  'dicom_no_track_plan_path',
  'respiratory_files_path',
  'extra_items',
  'kim_threshold',
  'rt_ct_fraction',
  'rt_dose_fraction',
  'rt_plan_fraction',
  'rt_structure_fraction',
  'centroid_fraction',
  'planned_dvh_fraction',
  'planned_dicom_fraction',
  'rpm_path',
  'rt_mri_fraction',
  'scan_file',
  'couch_shift_file',
  'cbct_images_path',
  'contour_files_path',
  'fluoro_images_path',
  'pet_image_path',
  'pet_3d_attenuation_ct_path',
  'pet_listmode_path',
  'pet_4d_attenuation_ct_path',
  'petct_files',
  'spect_image_path',
  'spect_3d_attenuation_ct_path',
  'timepoint_ct_path',
  'magik_logs',
  'projections',
  'rpm_kim_matching',
  'couch_register_file',
  'surface_imaging',
  'abc_path',
  'ecg_path',
  'mri_intra',
];

const PATH_TEMPLATE_HELP_URL = 'https://docs.python.org/3/library/string.html#format-string-syntax';

const PATH_TEMPLATE_VARIABLES = [
  { token: '{clinical_trial}', example: 'LEARN', levels: ['prescription', 'fraction'] },
  { token: '{test_centre}', example: 'CMN', levels: ['prescription', 'fraction'] },
  { token: '{centre_patient_no}', example: '05', levels: ['prescription', 'fraction'] },
  { token: '{patient_trial_id}', example: '11443-10', levels: ['prescription', 'fraction'] },
  { token: '{tumour_site}', example: 'lung', levels: ['prescription', 'fraction'] },
  { token: '{fraction_name}', example: 'Fx1D1', levels: ['fraction'] },
  { token: '{fraction_number}', example: '1', levels: ['fraction'] },
  { token: '{cbct_branch}', example: 'CBCT1', levels: ['fraction'], multipleCbctOnly: true },
];

const getPathTemplateVariables = (level, multipleCbctBranches) => (
  PATH_TEMPLATE_VARIABLES.filter((variable) => (
    (!level || variable.levels.includes(level))
    && (!variable.multipleCbctOnly || multipleCbctBranches)
  ))
);

const buildPathVariableSegment = (token) => `/${token}/`;

// Internal Form.Item input component; Ant Design injects value/onChange at runtime.
// eslint-disable-next-line react/prop-types
const PathTemplateInput = ({ value, onChange, level, multipleCbctBranches }) => {
  const textAreaRef = React.useRef(null);

  const insertVariable = (token) => {
    const currentValue = value || '';
    const textarea = textAreaRef.current?.resizableTextArea?.textArea;
    let segment = buildPathVariableSegment(token);

    const start = textarea?.selectionStart ?? currentValue.length;
    const end = textarea?.selectionEnd ?? currentValue.length;
    const before = currentValue.slice(0, start);
    const after = currentValue.slice(end);

    if (before.endsWith('/') && segment.startsWith('/')) {
      segment = segment.slice(1);
    }

    const nextValue = `${before}${segment}${after}`;
    onChange?.(nextValue);

    if (!textarea) {
      return;
    }

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = start + segment.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  return (
    <Space direction="vertical" size={8} style={{ width: '100%' }}>
      <div className="path-template-variable-panel">
        <Text type="secondary" className="path-template-variable-hint">
          Click a variable to insert it into the path below:
        </Text>
        <Space size={[12, 8]} wrap className="path-template-variable-list">
          {getPathTemplateVariables(level, multipleCbctBranches).map((variable) => (
            <span key={variable.token} className="path-template-variable-item">
              <Tag
                className="path-template-variable-tag"
                onClick={() => insertVariable(variable.token)}
              >
                {buildPathVariableSegment(variable.token)}
              </Tag>
              <Text type="secondary" className="path-template-variable-example">
                e.g. {variable.example}
              </Text>
            </span>
          ))}
        </Space>
      </div>
      <Input.TextArea
        ref={textAreaRef}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder="/{clinical_trial}/{test_centre}/Patient Structure Sets/PAT{centre_patient_no}/"
        autoSize={{ minRows: 2, maxRows: 5 }}
      />
    </Space>
  );
};

const normaliseStructure = (structure) => ({
  prescription: structure?.prescription || {},
  fraction: structure?.fraction || {},
});

const parseAllowed = (value) => {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatAllowed = (value) => {
  if (!Array.isArray(value)) {
    return '';
  }
  return value.join(', ');
};

const fieldOption = (fieldName) => ({
  label: fieldName,
  value: fieldName,
});

const createEditorSnapshot = (structure, trialFullName, rdsPath) => ({
  structure: JSON.stringify(normaliseStructure(structure)),
  trialFullName: trialFullName || '',
  rdsPath: rdsPath || '',
});

const downloadJson = (fileName, data) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const TrialStructureEditor = () => {
  const [fieldForm] = Form.useForm();
  const [trialList, setTrialList] = React.useState([]);
  const [trialDetails, setTrialDetails] = React.useState([]);
  const [selectedTrial, setSelectedTrial] = React.useState();
  const [trialFullName, setTrialFullName] = React.useState('');
  const [rdsPath, setRdsPath] = React.useState('');
  const [structure, setStructure] = React.useState(EMPTY_STRUCTURE);
  const [activeLevel, setActiveLevel] = React.useState('prescription');
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [fieldModalOpen, setFieldModalOpen] = React.useState(false);
  const [editingField, setEditingField] = React.useState(null);
  const [savedSnapshot, setSavedSnapshot] = React.useState(null);

  const currentSnapshot = React.useMemo(
    () => createEditorSnapshot(structure, trialFullName, rdsPath),
    [structure, trialFullName, rdsPath],
  );

  const hasUnsavedChanges = Boolean(
    selectedTrial
    && savedSnapshot
    && (
      currentSnapshot.structure !== savedSnapshot.structure
      || currentSnapshot.trialFullName !== savedSnapshot.trialFullName
      || currentSnapshot.rdsPath !== savedSnapshot.rdsPath
    ),
  );

  const watchedStorage = Form.useWatch('storage', fieldForm);
  const watchedLevel = Form.useWatch('level', fieldForm);
  const watchedFieldKey = Form.useWatch('fieldKey', fieldForm);
  const watchedMultipleCbctBranches = Form.useWatch('multiple_cbct_branches', fieldForm);

  const getColumnFieldOptions = React.useCallback((level, currentFieldKey) => {
    const extraCurrentOption = (knownFields) => {
      if (!currentFieldKey || knownFields.includes(currentFieldKey)) {
        return [];
      }
      return [{
        label: 'Current field',
        options: [fieldOption(currentFieldKey)],
      }];
    };

    if (level === 'prescription') {
      return [
        {
          label: 'prescription table columns',
          options: PRESCRIPTION_COLUMN_FIELDS.map(fieldOption),
        },
        ...extraCurrentOption(PRESCRIPTION_COLUMN_FIELDS),
        {
          label: 'Extended',
          options: [{
            label: 'Extended/custom JSONB field',
            value: CUSTOM_FIELD_OPTION,
          }],
        },
      ];
    }

    return [
      {
        label: 'fraction table columns',
        options: FRACTION_COLUMN_FIELDS.map(fieldOption),
      },
      {
        label: 'images table columns',
        options: IMAGE_COLUMN_FIELDS.map(fieldOption),
      },
      ...extraCurrentOption([...FRACTION_COLUMN_FIELDS, ...IMAGE_COLUMN_FIELDS]),
      {
        label: 'Extended',
        options: [{
          label: 'Extended/custom JSONB field',
          value: CUSTOM_FIELD_OPTION,
        }],
      },
    ];
  }, []);

  const loadTrialList = React.useCallback(() => {
    getTrialList().then((response) => {
      if (response.status !== 200) {
        message.error('Failed to load trial list.');
        return;
      }
      response.json().then((data) => {
        setTrialList(data.trials || []);
        setTrialDetails(data.trialDetails || []);
      });
    });
  }, []);

  React.useEffect(() => {
    loadTrialList();
  }, [loadTrialList]);

  const loadTrialStructure = (trialName) => {
    if (!trialName) {
      return;
    }
    setLoading(true);
    setSavedSnapshot(null);
    setSelectedTrial(trialName);
    const detail = trialDetails.find((trial) => trial[0] === trialName);
    setTrialFullName(detail?.[1] || trialName);
    setRdsPath(detail?.[2] || '');

    getTrialStructure(trialName)
      .then((response) => {
        if (response.status !== 200) {
          message.error('Failed to load trial structure.');
          return;
        }
        response.json().then((data) => {
          const loadedStructure = normaliseStructure(data.trialStructure);
          const loadedTrialFullName = data.trialFullName || detail?.[1] || trialName;
          const loadedRdsPath = data.rdsPath || detail?.[2] || '';
          setStructure(loadedStructure);
          setTrialFullName(loadedTrialFullName);
          setRdsPath(loadedRdsPath);
          setSavedSnapshot(createEditorSnapshot(loadedStructure, loadedTrialFullName, loadedRdsPath));
          message.success(`Loaded ${trialName} structure.`);
        });
      })
      .finally(() => setLoading(false));
  };

  const openAddFieldModal = () => {
    setEditingField(null);
    fieldForm.setFieldsValue({
      fieldKey: undefined,
      display_name: '',
      path: '',
      field_type: 'folder',
      level: activeLevel,
      allowed: '',
      storage: undefined,
      storage_table: undefined,
      multiple_cbct_branches: false,
    });
    setFieldModalOpen(true);
  };

  const openEditFieldModal = (record) => {
    setEditingField(record);
    fieldForm.setFieldsValue({
      fieldKey: record.fieldKey,
      display_name: record.display_name,
      path: record.path,
      field_type: record.field_type,
      level: record.level,
      allowed: formatAllowed(record.allowed),
      storage: record.storage || 'column',
      storage_table: record.storage_table,
      multiple_cbct_branches: record.multiple && record.branch_variable === 'cbct_branch',
    });
    setFieldModalOpen(true);
  };

  const handleStorageChange = (value) => {
    fieldForm.setFieldsValue({
      fieldKey: undefined,
      storage_table: value === 'jsonb' && watchedLevel === 'fraction' ? 'images' : undefined,
      multiple_cbct_branches: false,
    });
  };

  const handleLevelChange = (value) => {
    setActiveLevel(value);
    fieldForm.setFieldsValue({
      fieldKey: undefined,
      storage_table: watchedStorage === 'jsonb' && value === 'fraction' ? 'images' : undefined,
      multiple_cbct_branches: false,
    });
  };

  const handleColumnFieldChange = (value) => {
    if (value !== CUSTOM_FIELD_OPTION) {
      return;
    }
    fieldForm.setFieldsValue({
      storage: 'jsonb',
      fieldKey: '',
      storage_table: watchedLevel === 'fraction' ? 'images' : undefined,
    });
  };

  const handleMultipleCbctChange = (event) => {
    if (!event.target.checked) {
      return;
    }
    fieldForm.setFieldsValue({
      storage: 'jsonb',
      level: 'fraction',
      storage_table: 'images',
    });
  };

  const saveField = (values) => {
    const level = values.level;
    const fieldKey = values.fieldKey?.trim();
    const originalKey = editingField?.fieldKey;
    const nextLevelFields = { ...(structure[level] || {}) };

    if (!fieldKey) {
      message.error('Field key is required.');
      return;
    }
    const isSameRecord = editingField && editingField.level === level && fieldKey === originalKey;
    if (!isSameRecord && nextLevelFields[fieldKey]) {
      message.error(`Field ${fieldKey} already exists in ${level}.`);
      return;
    }

    if (editingField && editingField.level === level && originalKey !== fieldKey) {
      delete nextLevelFields[originalKey];
    }

    const fieldConfig = {
      path: values.path || '',
      display_name: values.display_name || '',
      field_type: values.field_type || '',
      level,
      allowed: parseAllowed(values.allowed),
      storage: values.storage || 'jsonb',
    };

    if (level === 'fraction' && values.storage === 'jsonb' && values.storage_table) {
      fieldConfig.storage_table = values.storage_table;
    }

    if (level === 'fraction' && values.storage === 'jsonb' && values.multiple_cbct_branches) {
      fieldConfig.multiple = true;
      fieldConfig.branch_variable = 'cbct_branch';
      fieldConfig.legacy_format = 'semicolon';
      fieldConfig.storage_table = 'images';
    }

    const nextStructure = {
      ...normaliseStructure(structure),
      [level]: {
        ...nextLevelFields,
        [fieldKey]: fieldConfig,
      },
    };

    if (editingField && editingField.level !== level) {
      const previousLevelFields = { ...(structure[editingField.level] || {}) };
      delete previousLevelFields[originalKey];
      nextStructure[editingField.level] = previousLevelFields;
    }

    setStructure(nextStructure);
    setActiveLevel(level);
    setFieldModalOpen(false);
    fieldForm.resetFields();
  };

  const deleteField = (level, fieldKey) => {
    setStructure((currentStructure) => {
      const nextLevelFields = { ...(currentStructure[level] || {}) };
      delete nextLevelFields[fieldKey];
      return {
        ...currentStructure,
        [level]: nextLevelFields,
      };
    });
  };

  const saveStructure = () => {
    if (!selectedTrial) {
      message.error('Please select a trial first.');
      return;
    }

    setSaving(true);
    addTrial({
      trialDetails: {
        trialName: selectedTrial,
        trialFullName: trialFullName || selectedTrial,
        rdsPath: rdsPath || null,
      },
      fileStructure: normaliseStructure(structure),
    })
      .then((response) => {
        if (response.status !== 201) {
          response.json().then((data) => {
            message.error(data.message || 'Failed to save trial structure.');
          });
          return;
        }
        response.json().then((data) => {
          message.success(data.message || 'Trial structure saved.');
          setSavedSnapshot(createEditorSnapshot(structure, trialFullName, rdsPath));
          loadTrialList();
        });
      })
      .finally(() => setSaving(false));
  };

  const fieldRows = (level) => Object.entries(structure[level] || {}).map(([fieldKey, config]) => ({
    key: `${level}-${fieldKey}`,
    fieldKey,
    level,
    path: config?.path || '',
    display_name: config?.display_name || '',
    field_type: config?.field_type || '',
    allowed: config?.allowed || [],
    storage: config?.storage || 'column',
    storage_table: config?.storage_table,
    multiple: config?.multiple,
    branch_variable: config?.branch_variable,
  }));

  const columns = [
    {
      title: 'Field Key',
      dataIndex: 'fieldKey',
      key: 'fieldKey',
      fixed: 'left',
      width: 180,
      className: 'trial-structure-key-cell',
      render: (value) => <Text code className="trial-structure-key-text">{value}</Text>,
    },
    {
      title: 'Display Name',
      dataIndex: 'display_name',
      key: 'display_name',
      width: 190,
      className: 'trial-structure-display-cell',
      ellipsis: { showTitle: true },
    },
    {
      title: 'Field Type',
      dataIndex: 'field_type',
      key: 'field_type',
      width: 90,
      align: 'center',
    },
    {
      title: 'Storage',
      dataIndex: 'storage',
      key: 'storage',
      width: 88,
      align: 'center',
      render: (value) => <Tag color={value === 'jsonb' ? 'green' : 'blue'}>{value || 'column'}</Tag>,
    },
    {
      title: 'Storage Table',
      dataIndex: 'storage_table',
      key: 'storage_table',
      width: 120,
      render: (value, record) => {
        if (record.storage !== 'jsonb') {
          return '-';
        }
        if (record.level === 'prescription') {
          return 'prescription';
        }
        return value || 'auto';
      },
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
      width: 460,
      className: 'trial-structure-path-cell',
      render: (value) => (
        value ? (
          <Tooltip title={value} placement="topLeft">
            <Text className="trial-structure-path-text">{value}</Text>
          </Tooltip>
        ) : '-'
      ),
    },
    {
      title: 'Allowed',
      dataIndex: 'allowed',
      key: 'allowed',
      width: 150,
      className: 'trial-structure-allowed-cell',
      ellipsis: { showTitle: true },
      render: (value) => formatAllowed(value) || '-',
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 150,
      align: 'center',
      className: 'trial-structure-action-cell',
      render: (_, record) => (
        <Space size={4} className="trial-structure-action-buttons">
          <Button type="link" size="small" onClick={() => openEditFieldModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title={`Delete ${record.fieldKey}?`}
            onConfirm={() => deleteField(record.level, record.fieldKey)}
          >
            <Button type="link" size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={8}>
          <Select
            showSearch
            placeholder="Select a trial to edit"
            value={selectedTrial}
            onChange={loadTrialStructure}
            loading={loading}
            style={{ width: '100%' }}
            options={trialList.map((trial) => ({ label: trial, value: trial }))}
          />
        </Col>
        <Col xs={24} md={10}>
          <Input
            addonBefore="Trial Full Name"
            placeholder="Trial full name"
            value={trialFullName}
            onChange={(event) => setTrialFullName(event.target.value)}
            disabled={!selectedTrial}
          />
        </Col>
        <Col xs={24} md={24}>
          <Input
            addonBefore="RDS Path"
            placeholder="RDS path, e.g. /PRJ-RPL/2RESEARCH/1_ClinicalData/LEARN"
            value={rdsPath}
            onChange={(event) => setRdsPath(event.target.value)}
            disabled={!selectedTrial}
          />
        </Col>
        <Col xs={24} md={6}>
          <Space wrap>
            <Button icon={<ReloadOutlined />} disabled={!selectedTrial} onClick={() => loadTrialStructure(selectedTrial)}>
              Reload
            </Button>
            <Button
              icon={<DownloadOutlined />}
              disabled={!selectedTrial}
              onClick={() => downloadJson(`${selectedTrial}.json`, normaliseStructure(structure))}
            >
              Download
            </Button>
          </Space>
        </Col>
      </Row>

      <Card size="small" className="mt-3" bordered={false}>
        <Space className="mb-3" wrap>
          <Button type="primary" icon={<PlusOutlined />} disabled={!selectedTrial} onClick={openAddFieldModal}>
            Add Field
          </Button>
          <Button
            icon={<SaveOutlined />}
            loading={saving}
            disabled={!selectedTrial}
            onClick={saveStructure}
            className={hasUnsavedChanges ? 'trial-structure-save-reminder' : undefined}
          >
            Save Structure
          </Button>
          <Tooltip title="New JSONB fraction image/path fields should use storage_table=images. Existing column fields should remain storage=column.">
            <Text type={hasUnsavedChanges ? 'danger' : 'secondary'} className={hasUnsavedChanges ? 'trial-structure-save-reminder-text' : undefined}>
              {hasUnsavedChanges
                ? 'Unsaved changes. Click Save Structure to update the database.'
                : 'Edit fields below, then click Save Structure to update the database.'}
            </Text>
          </Tooltip>
        </Space>

        <div className="trial-structure-editor-table-wrap">
        <Table
          className="trial-structure-editor-table"
          columns={columns}
          dataSource={fieldRows(activeLevel)}
          loading={loading}
          pagination={{ pageSize: 8 }}
          tableLayout="fixed"
          scroll={{ x: 1500 }}
          title={() => (
            <Select
              value={activeLevel}
              onChange={setActiveLevel}
              options={LEVEL_OPTIONS}
              style={{ width: 180 }}
              disabled={!selectedTrial}
            />
          )}
        />
        </div>

        <Collapse
          className="mt-3"
          items={[
            {
              key: 'json-preview',
              label: 'Live JSON Preview',
              children: (
                <Input.TextArea
                  value={JSON.stringify(normaliseStructure(structure), null, 2)}
                  autoSize={{ minRows: 8, maxRows: 18 }}
                  readOnly
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={editingField ? `Edit ${editingField.fieldKey}` : 'Add Trial Structure Field'}
        open={fieldModalOpen}
        onCancel={() => setFieldModalOpen(false)}
        onOk={() => fieldForm.submit()}
        destroyOnClose
        width={760}
      >
        <Form form={fieldForm} layout="vertical" onFinish={saveField}>
          <Row gutter={12}>
            <Col xs={24} md={8}>
              <Form.Item label="Storage" name="storage" rules={[{ required: true, message: 'Please choose storage first.' }]}>
                <Select
                  options={STORAGE_OPTIONS}
                  onChange={handleStorageChange}
                  placeholder="Choose storage type"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Level" name="level" rules={[{ required: true }]}>
                <Select
                  options={LEVEL_OPTIONS}
                  onChange={handleLevelChange}
                  placeholder="Choose level"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Field Type" name="field_type">
                <Select options={FIELD_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={watchedStorage === 'column' ? 'Field Key (existing column)' : 'Field Key (custom JSONB key)'}
                name="fieldKey"
                rules={[
                  { required: true, message: 'Field key is required.' },
                  {
                    pattern: /^[A-Za-z_][A-Za-z0-9_]*$/,
                    message: 'Use letters, numbers, and underscores. The first character cannot be a number.',
                  },
                ]}
                extra={watchedStorage === 'column'
                  ? 'Choose an existing physical database column. Select Extended/custom JSONB field if this list does not contain the field you need.'
                  : 'Custom keys are stored in extended_data and should use letters, numbers, and underscores.'}
              >
                {watchedStorage === 'column' ? (
                  <Select
                    showSearch
                    placeholder="Select an existing column"
                    options={getColumnFieldOptions(watchedLevel, watchedFieldKey)}
                    onChange={handleColumnFieldChange}
                    optionFilterProp="label"
                  />
                ) : (
                  <Input
                    placeholder={watchedStorage ? 'new_image_path' : 'Select storage first'}
                    disabled={!watchedStorage}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Display Name" name="display_name">
                <Input placeholder="New Image Path" />
              </Form.Item>
            </Col>
            {watchedLevel === 'fraction' && watchedStorage === 'jsonb' && (
              <Col xs={24} md={12}>
                <Form.Item
                  label="Storage Table"
                  name="storage_table"
                  rules={[{ required: true, message: 'Please choose where to store this JSONB field.' }]}
                >
                  <Select options={STORAGE_TABLE_OPTIONS} />
                </Form.Item>
              </Col>
            )}
            {watchedLevel === 'fraction' && (
              <Col span={24}>
                <Form.Item
                  name="multiple_cbct_branches"
                  valuePropName="checked"
                  extra="Use this when one fraction contains CBCT1, CBCT2, CBCT3... branches. Checking this will store the field in images.extended_data and legacy /fractions returns all matched paths as a semicolon-separated string."
                >
                  <Checkbox onChange={handleMultipleCbctChange}>
                    Multiple CBCT branches
                  </Checkbox>
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item
                label={(
                  <Space size={6}>
                    <span>Path Template</span>
                    <Link
                      href={PATH_TEMPLATE_HELP_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      template syntax
                    </Link>
                  </Space>
                )}
                name="path"
                extra={(
                  <div>
                    <div>Click a variable above to insert a path segment like /{'{clinical_trial}'}/. You can still type fixed folder text directly in the input below.</div>
                    {watchedMultipleCbctBranches && (
                      <div>For multiple CBCT branches, include /{'{cbct_branch}'}/ where CBCT1, CBCT2, CBCT3 should be discovered.</div>
                    )}
                    <div>Text outside braces is fixed folder text. Only values inside braces are replaced by patient/trial data.</div>
                    <div>For fraction missing-data search, the backend appends the fraction folder/name after this base path when needed.</div>
                  </div>
                )}
              >
                <PathTemplateInput
                  level={watchedLevel}
                  multipleCbctBranches={watchedMultipleCbctBranches}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={(
                  <Space size={6}>
                    <span>Allowed Values</span>
                    <Link
                      href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types"
                      target="_blank"
                      rel="noreferrer"
                    >
                      supported formats
                    </Link>
                  </Space>
                )}
                name="allowed"
                extra="Comma-separated MIME types or broad media groups. Examples: image, image/tiff, application/dicom, text/csv."
              >
                <Input placeholder="image/tiff, application/dicom" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default TrialStructureEditor;
