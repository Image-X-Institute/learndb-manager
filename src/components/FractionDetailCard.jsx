import React from "react";
import { Select, Collapse, Form, Input, Button, message, Tooltip, Spin, Row, Col, Typography, Divider, Card } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getTrialList, getCenterList, getPatientIdList, getFractionInfo, updateFractionInfo, getTrialStructure } from "../utils/apiRequest";
import {
  buildCbctBranchGroups,
  buildCbctBranchesInitialValues,
  collectCbctFieldChanges,
  getMultipleCbctFieldNames,
} from "../utils/cbctBranchFields";

const { Text } = Typography;

const READONLY_FRACTION_FIELDS = new Set(['fraction_name', 'fraction_number']);

const normaliseFormValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.filter((item) => item !== null && item !== "").join(";");
    }
    const entries = Object.entries(value).filter(([, item]) => item !== null && item !== "");
    if (entries.length === 0) {
      return "";
    }
    return entries
      .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
      .map(([, item]) => String(item))
      .join(";");
  }
  return value;
};

const getFractionFieldLabel = (key) => (
  <div className="fraction-field-label">
    <Text code>{key}</Text>
  </div>
);

const FractionItemForm = ({ fractionItem, multipleCbctFields, formKey }) => {
  const cbctBranches = buildCbctBranchGroups(fractionItem, multipleCbctFields);
  const regularFields = Object.keys(fractionItem).filter((key) => !multipleCbctFields.includes(key));

  const initialValues = {
    ...Object.fromEntries(
      regularFields.map((key) => [key, normaliseFormValue(fractionItem[key])]),
    ),
    cbctBranches: buildCbctBranchesInitialValues(fractionItem, multipleCbctFields),
  };

  return (
    <Form
      key={formKey}
      size="small"
      layout="vertical"
      className="fraction-detail-form"
      name={fractionItem.fraction_name}
      initialValues={initialValues}
    >
      <Row gutter={[16, 8]}>
        {regularFields.map((key) => (
          <Col xs={24} lg={12} key={key}>
            <Form.Item
              label={getFractionFieldLabel(key)}
              name={key}
            >
              <Input disabled={READONLY_FRACTION_FIELDS.has(key)} />
            </Form.Item>
          </Col>
        ))}
      </Row>

      {cbctBranches.length > 0 && (
        <>
          <Divider orientation="left" plain>CBCT Branches</Divider>
          {cbctBranches.map(({ branch }) => (
            <Card
              key={branch}
              size="small"
              title={branch}
              className="mb-3"
            >
              <Row gutter={[16, 8]}>
                {multipleCbctFields.map((fieldName) => (
                  <Col xs={24} key={`${branch}-${fieldName}`}>
                    <Form.Item
                      label={getFractionFieldLabel(fieldName)}
                      name={['cbctBranches', branch, fieldName]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </Card>
          ))}
        </>
      )}

      <Form.Item className="mb-0">
        <Button type="primary" htmlType="submit" size="large">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const FractionDetailCard = () => {
  const [trialList, setTrialList] = React.useState([]);
  const [centerList, setCenterList] = React.useState([]);
  const [patientList, setPatientList] = React.useState([]);
  const [fractionData, setFractionData] = React.useState({});
  const [fractionItemList, setFractionItemList] = React.useState([]);
  const [trialStructure, setTrialStructure] = React.useState(null);

  const [trial, setTrial] = React.useState('');
  const [center, setCenter] = React.useState('');
  const [patient, setPatient] = React.useState('');
  const [fraction, setFraction] = React.useState('');

  const [isLoaded, setIsLoaded] = React.useState(false);

  const multipleCbctFields = React.useMemo(
    () => getMultipleCbctFieldNames(trialStructure || {}),
    [trialStructure],
  );

  const onFormFinish = (formName, info) => {
    const changedFields = {};
    const values = info.values;
    const originalFields = fractionData[fraction]?.find((item) => item.fraction_name === formName) || {};
    const { cbctBranches, ...regularValues } = values;

    Object.keys(regularValues).forEach((key) => {
      if (READONLY_FRACTION_FIELDS.has(key) || multipleCbctFields.includes(key)) {
        return;
      }
      const originalValue = normaliseFormValue(originalFields[key]);
      const nextValue = normaliseFormValue(regularValues[key]);
      if (regularValues[key] !== undefined && nextValue !== originalValue) {
        changedFields[key] = regularValues[key];
      }
    });

    Object.assign(
      changedFields,
      collectCbctFieldChanges(cbctBranches, originalFields, multipleCbctFields),
    );

    if (Object.keys(changedFields).length > 0) {
      changedFields.patientId = patient;
      changedFields.fractionName = formName;
      updateFractionInfo(changedFields).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            message.success(data.message);
            getFractionInfo(patient, trial).then((refreshResponse) => {
              if (refreshResponse.status === 200) {
                refreshResponse.json().then((refreshData) => {
                  setFractionData(refreshData);
                });
              }
            });
          });
        } else {
          response.json().then((data) => {
            message.error(data.message);
          });
        }
      });
    }
  };

  React.useEffect(() => {
    getTrialList().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setTrialList(data.trials);
        });
      }
    });
    getCenterList().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setCenterList(data.sites);
          setIsLoaded(true);
        });
      }
    });
  }, []);

  React.useEffect(() => {
    if (!trial) {
      setTrialStructure(null);
      return;
    }
    getTrialStructure(trial).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setTrialStructure(data.trialStructure || null);
        });
      }
    });
  }, [trial]);

  React.useEffect(() => {
    if (trial && center) {
      getPatientIdList(trial, center).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setPatientList(data.patients);
          });
        }
      });
    }
  }, [trial, center]);

  React.useEffect(() => {
    if (patient && trial) {
      getFractionInfo(patient, trial).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setFractionData(data);
          });
        }
      });
    }
  }, [patient, trial]);

  React.useEffect(() => {
    if (fractionData && fraction) {
      const fractionItemPack = fractionData[fraction];
      const fractionItemFields = fractionItemPack.map((fractionItem) => ({
        key: fractionItem.fraction_name,
        label: fractionItem.fraction_name,
        children: (
          <FractionItemForm
            fractionItem={fractionItem}
            multipleCbctFields={multipleCbctFields}
            formKey={`${fractionItem.fraction_name}-${patient}-${fraction}-${multipleCbctFields.join(',')}`}
          />
        ),
      }));
      setFractionItemList(fractionItemFields);
    }
  }, [fractionData, fraction, multipleCbctFields, patient]);

  const handleTrialChange = (value) => {
    setTrial(value);
    setCenter('');
    setPatient('');
    setFraction('');
    setPatientList([]);
    setFractionData({});
    setFractionItemList([]);
  };

  const handleCenterChange = (value) => {
    setCenter(value);
    setPatient('');
    setFraction('');
    setFractionData({});
    setFractionItemList([]);
  };

  const handlePatientChange = (value) => {
    setPatient(value);
    setFraction('');
    setFractionData({});
    setFractionItemList([]);
  };

  const handleFractionChange = (value) => {
    setFraction(value);
  };

  if (!isLoaded) {
    return <Spin size='large' className='m-auto' tip='Loading...' />;
  }

  return (
    <React.Fragment>
      <div className="flex justify-center items-center">
        <h1 className='text-center text-xl font-bold'>Fraction Information</h1>
        <Tooltip title="In this section, you could edit the fraction information.">
          <QuestionCircleOutlined className='ml-2 text-lg' />
        </Tooltip>
      </div>
      <div className="flex justify-center">
        <div className="mr-2">
          <div>Trial:</div>
          <Select
            defaultValue=""
            style={{ width: 120 }}
            onChange={handleTrialChange}
            options={trialList.map((item) => ({ value: item, label: item }))}
            value={trial}
          />
        </div>
        <div className="mx-2">
          <div>Center:</div>
          <Select
            defaultValue=""
            style={{ width: 120 }}
            onChange={handleCenterChange}
            options={centerList.map((item) => ({ value: item, label: item }))}
            value={center}
          />
        </div>
        <div className="mx-2">
          <div>Patient ID:</div>
          <Select
            defaultValue=""
            style={{ width: 200 }}
            onChange={handlePatientChange}
            options={patientList.map((item) => ({ value: item, label: item }))}
            value={patient}
          />
        </div>
        <div className="ml-2">
          <div>Fraction Number:</div>
          <Select
            defaultValue=""
            style={{ width: 120 }}
            onChange={handleFractionChange}
            options={Object.keys(fractionData).map((item) => ({ value: item, label: item }))}
            value={fraction}
          />
        </div>
      </div>
      <Form.Provider onFormFinish={onFormFinish}>
        <Collapse
          accordion
          items={fractionItemList}
          style={{ width: '100%', marginTop: 20 }}
        />
      </Form.Provider>
    </React.Fragment>
  );
};

export default FractionDetailCard;
