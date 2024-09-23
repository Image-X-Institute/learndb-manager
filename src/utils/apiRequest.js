
import { BACKEND_URL } from "../config/config";

const fetchData = async (url, method, body=undefined) => {
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
  return fetchData('/api/getTrialList', 'GET');
}

export const getCenterList = async () => {
  return fetchData('/api/getCenterList', 'GET');
}

export const getCenterDetailList = async () => {
  return fetchData('/api/getCenterDetailList', 'GET');
}

export const getPatientIdList = async (trial, center) => {
  return fetchData(`/api/patient/getPatientIdList?trialName=${trial}&siteName=${center}`, 'GET');
}

export const getPatientInfo = async (patient) => {
  return fetchData(`/api/patient/getPatientInfo?patientId=${patient}`, 'GET');
}

export const updatePatientInfo = async (patient, data) => {
  return fetchData(`/api/prescription/updatePatientInfo?patientId=${patient}`, 'PATCH', data);
}

export const getFractionInfo = async (patient, trial) => {
  return fetchData(`/api/fraction/getFractionDetailByPatientId?patientId=${patient}&trialName=${trial}`, 'GET');
}

export const updateFractionInfo = async (data) => {
  return fetchData('/api/fraction/updateFractionInfo', 'PATCH', data);
}

export const getPatientTrialStats = async () => {
  return fetchData('/api/getPatientTrialStats', 'GET');
}

export const getPrescriptionQaCheck = async (trial) => {
  return fetchData(`/api/prescription/getMissingPrescriptionFieldCheck?trialName=${trial}`, 'GET');
}

export const getFractionQaCheck = async (trial) => {
  return fetchData(`/api/fraction/getMissingFractionFieldCheck?trialName=${trial}`, 'GET');
}

export const addOnePatient = async (data) => {
  return fetchData('/api/patient/addOnePatient', 'POST', data);
}

export const getUpdatePrescriptionField = async (trial, rootDrivePath) => {
  return fetchData(`/api/prescription/getUpdatePrescriptionField?trialName=${trial}&rootDrivePath=${rootDrivePath}`, 'GET');
}

export const updatePrescriptionField = async (data) => {
  return fetchData('/api/prescription/updatePrescriptionField', 'PATCH', data);
}

export const getUpdateFractionField = async (trial, rootDrivePath) => {
  return fetchData(`/api/fraction/getUpdateFractionField?trialName=${trial}&rootDrivePath=${rootDrivePath}`, 'GET');
}

export const updateFractionField = async (data) => {
  return fetchData('/api/fraction/updateFractionField', 'PATCH', data);
}

export const getUserList = async () => {
  return fetchData('/api/user/getUserList', 'GET');
}

export const registerUser = async (data) => {
  return fetchData('/api/user/register', 'POST', data);
}

export const loginUser = async (data) => {
  return fetchData('/api/user/login', 'POST', data);
}

export const addCentre = async (data) => {
  return fetchData('/api/addCentre', 'POST', data);
}

export const addTrial = async (data) => {
  return fetchData('/api/addTrial', 'POST', data);
}

export const getTrialStructure = async (trial) => {
  return fetchData(`/api/getTrialStructure?trialName=${trial}`, 'GET');
}

export const changePassword = async (data) => {
  return fetchData('/api/user/changePassword', 'POST', data);
}

export const getFolderList = async () => {
  return fetchData('/api/filesystem/getFolderList', 'GET');
}

export const moveFolder = async (data) => {
  return fetchData('/api/filesystem/moveFolder', 'POST', data);
}

export const deleteFolder = async (data) => {
  return fetchData('/api/filesystem/deleteFolder', 'POST', data);
}

export const addNewFraction = async (data) => {
  return fetchData('/api/fraction/addNewFraction', 'POST', data);
}

export const syncCloudDriveFolder = async () => {
  return fetchData('/api/filesystem/syncCloudDrive', 'GET');
}

export const getPatientInfoTemplate = async () => {
  return fetchData('/api/getPatientInfoTemplate', 'GET');
}

export const addBulkPatient = async (data) => {
  return fetchData('/api/patient/addBulkPatient', 'POST', data);
}

export const getFractionInfoTemplate = async () => {
  return fetchData('/api/getFractionInfoTemplate', 'GET');
}

export const addBulkFraction = async (data) => {
  return fetchData('/api/fraction/addBulkFraction', 'POST', data);
}

export const deleteUser = async (data) => {
  return fetchData('/api/user/deleteUser', 'POST', data);
}

export const getBusinessFolderList = async () => {
  return fetchData('/api/filesystem/getBussinessFolderConfig', 'GET');
}

export const addBusinessFolder = async (data) => {
  return fetchData('/api/filesystem/addBussinessFolderConfig', 'POST', data);
}

export const deleteBusinessFolder = async (data) => {
  return fetchData('/api/filesystem/deleteBussinessFolderConfig', 'POST', data);
}

export const getAvailableRootDrive = async () => {
  return fetchData('/api/filesystem/getAvailableRootDrive', 'GET');
}

export const getPatientDetailList = async (trial) => {
  return fetchData(`/api/patient/getPatientDetailList?trialName=${trial}`, 'GET');
}

export const deleteOnePatient = async (data) => {
  return fetchData('/api/patient/deleteOnePatient', 'POST', data);
}

export const deleteCenter = async (data) => {
  return fetchData('/api/deleteCentre', 'DELETE', data);
}

export const getFractionList = async (patient) => {
  return fetchData(`/api/fraction/getFractionListByPatientId?patientId=${patient}`, 'GET');
}

export const deleteFraction = async (data) => {
  return fetchData('/api/fraction/deleteFraction', 'DELETE', data);
}

export const deleteTrial = async (data) => {
  return fetchData('/api/deleteTrial', 'DELETE', data);
}