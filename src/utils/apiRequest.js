
import { BACKEND_URL } from "../config/config";

const fatchData = async (url, method, body=undefined) => {
  const requestOption = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  }
  try {
    const response = await fetch(`${BACKEND_URL}${url}`, requestOption);
    return response;
  } catch (error) {
    return error;
  }
}

export const getTrialList = async () => {
  return fatchData('/api/getTrialList', 'GET');
}

export const getCenterList = async () => {
  return fatchData('/api/getCenterList', 'GET');
}

export const getPatientList = async (trial, center) => {
  return fatchData(`/api/patient/getPatientList?trialName=${trial}&siteName=${center}`, 'GET');
}

export const getPatientInfo = async (patient) => {
  return fatchData(`/api/patient/getPatientInfo?patientId=${patient}`, 'GET');
}

export const updatePatientInfo = async (patient, data) => {
  return fatchData(`/api/prescription/updatePatientInfo?patientId=${patient}`, 'PATCH', data);
}

export const getFractionInfo = async (patient, trial) => {
  return fatchData(`/api/fraction/getFractionDetialByPatientId?patientId=${patient}&trialName=${trial}`, 'GET');
}

export const updateFractionInfo = async (data) => {
  return fatchData('/api/fraction/updateFractionInfo', 'PATCH', data);
}

export const getPatientTrialStats = async () => {
  return fatchData('/api/getPatientTrialStats', 'GET');
}

export const getPrescriptionQaCheck = async (trial) => {
  return fatchData(`/api/prescription/getMissingPrescriptionFieldCheck?trialName=${trial}`, 'GET');
}

export const getFractionQaCheck = async (trial) => {
  return fatchData(`/api/fraction/getMissingFractionFieldCheck?trialName=${trial}`, 'GET');
}

export const addOnePatient = async (data) => {
  return fatchData('/api/patient/addOnePatient', 'POST', data);
}

export const getUpdatePrescriptionField = async (trial) => {
  return fatchData(`/api/prescription/getUpdatePrescriptionField?trialName=${trial}`, 'GET');
}

export const updatePrescriptionField = async (data) => {
  return fatchData('/api/prescription/updatePrescriptionField', 'PATCH', data);
}

export const getUpdateFractionField = async (trial) => {
  return fatchData(`/api/fraction/getUpdateFractionField?trialName=${trial}`, 'GET');
}

export const updateFractionField = async (data) => {
  return fatchData('/api/fraction/updateFractionField', 'PATCH', data);
}

export const getUserList = async () => {
  return fatchData('/api/user/getUserList', 'GET');
}

export const registerUser = async (data) => {
  return fatchData('/api/user/register', 'POST', data);
}

export const loginUser = async (data) => {
  return fatchData('/api/user/login', 'POST', data);
}

export const addCentre = async (data) => {
  return fatchData('/api/addCentre', 'POST', data);
}

export const addTrial = async (data) => {
  return fatchData('/api/addTrial', 'POST', data);
}

export const getTrialStructure = async (trial) => {
  return fatchData(`/api/getTrialStructure?trialName=${trial}`, 'GET');
}