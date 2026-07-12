import axiosInstance from './axiosInstance';

// Dashboard
export const getCustomerDashboard = () => axiosInstance.get('/customer/dashboard');

// Profile
export const getProfile = () => axiosInstance.get('/customer/profile');
export const updateProfile = (payload) => axiosInstance.put('/customer/profile', payload);

// Password
export const changePassword = (oldPassword, newPassword) =>
  axiosInstance.post('/customer/change-password', { oldPassword, newPassword });

// KYC
export const getKycStatus = () => axiosInstance.get('/customer/kyc/status');
export const uploadKyc = (documentType, documentNumber, file) => {
  const formData = new FormData();
  formData.append('documentType', documentType);
  formData.append('documentNumber', documentNumber);
  formData.append('file', file);
  // Do NOT set Content-Type manually: the browser must generate the multipart
  // boundary itself. Setting 'multipart/form-data' explicitly (without a boundary)
  // prevents that and the backend's multipart parser will fail to read the parts.
  return axiosInstance.post('/customer/kyc/upload', formData);
};

// Beneficiaries
export const getBeneficiaries = () => axiosInstance.get('/customer/beneficiaries');
export const addBeneficiary = (payload) => axiosInstance.post('/customer/beneficiaries', payload);
export const deleteBeneficiary = (id) => axiosInstance.delete(`/customer/beneficiaries/${id}`);

// Feedback
export const submitFeedback = (payload) => axiosInstance.post('/customer/feedback', payload);
export const getFeedbackHistory = () => axiosInstance.get('/customer/feedback');

// Transactions
export const depositFunds = (payload) => axiosInstance.post('/transactions/deposit', payload);
export const withdrawFunds = (payload) => axiosInstance.post('/transactions/withdraw', payload);
export const transferFunds = (payload) => axiosInstance.post('/transactions/transfer', payload);
export const getMyTransactionHistory = () => axiosInstance.get('/transactions/history');
