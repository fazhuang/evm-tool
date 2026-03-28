import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Authorization': 'Bearer hz_sage_secure_token_2026' // Hardcoded for this agent setup demo
  },
});

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  // Axios will automatically set multipart/form-data with bounds
  const response = await api.post('/review/upload', formData);
  return response.data;
};

export const downloadReport = async (reportData, filename) => {
  const response = await api.post('/review/download_report', { report_data: reportData, filename }, {
    responseType: 'blob',
  });
  return response.data;
};

export const diagnoseIssue = async (userIssue) => {
  const response = await api.post('/warning/diagnose', { user_issue: userIssue });
  return response.data;
};

export const getDashboardMetrics = async () => {
  const response = await api.get('/dashboard/metrics');
  return response.data;
};

// System Settings
export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (settings) => {
  const response = await api.post('/settings', { settings });
  return response.data;
};

export const verifyAdminPasscode = async (passcode) => {
  const response = await api.post('/settings/verify_passcode', { passcode });
  return response.data;
};

export const downloadReminder = async (projectName, manager) => {
  const response = await api.post('/dashboard/generate_reminder', { project_name: projectName, manager }, {
    responseType: 'blob',
  });
  return response.data;
};

export default api;
