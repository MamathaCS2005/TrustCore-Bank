import axiosInstance from './axiosInstance';

// Dashboard
export const getAdminDashboard = () => axiosInstance.get('/admin/dashboard');

// Customer Management
export const getAllCustomers = () => axiosInstance.get('/admin/customers');
export const addCustomer = (payload) => axiosInstance.post('/admin/customers', payload);
export const updateCustomer = (id, payload) => axiosInstance.put(`/admin/customers/${id}`, payload);
export const deleteCustomer = (id) => axiosInstance.delete(`/admin/customers/${id}`);

// KYC Management
export const getAllKyc = () => axiosInstance.get('/admin/kyc');
export const updateKycStatus = (id, payload) => axiosInstance.put(`/admin/kyc/${id}`, payload);

// Banking Services Management
export const getAllServices = () => axiosInstance.get('/admin/services');
export const addService = (payload) => axiosInstance.post('/admin/services', payload);
export const updateService = (id, payload) => axiosInstance.put(`/admin/services/${id}`, payload);
export const deleteService = (id) => axiosInstance.delete(`/admin/services/${id}`);

// Bank Account Management
export const getAllAccounts = () => axiosInstance.get('/admin/accounts');
export const createBankAccount = (payload) => axiosInstance.post('/admin/accounts', payload);
export const updateAccountStatus = (id, status) =>
  axiosInstance.put(`/admin/accounts/${id}/status`, null, { params: { status } });

// Feedback Management
export const getAllFeedbacks = () => axiosInstance.get('/admin/feedback');
export const deleteFeedback = (id) => axiosInstance.delete(`/admin/feedback/${id}`);

// Transactions (admin-scoped)
export const getAllTransactions = () => axiosInstance.get('/transactions/all');
export const getTransactionsByAccount = (accountNumber) =>
  axiosInstance.get(`/transactions/history/account/${accountNumber}`);
export const reverseTransaction = (id) => axiosInstance.post(`/transactions/${id}/reverse`);
