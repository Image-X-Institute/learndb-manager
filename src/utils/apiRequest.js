
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
  return fatchData(`/api/getPatientList?trialName=${trial}&siteName=${center}`, 'GET');
}

export const getPatientInfo = async (patient) => {
  return fatchData(`/api/getPatientInfo?patientID=${patient}`, 'GET');
}

export const updatePatientInfo = async (patient, data) => {
  return fatchData(`/api/updatePatientInfo?patientID=${patient}`, 'PATCH', data);
}