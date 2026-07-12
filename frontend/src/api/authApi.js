import axiosInstance from './axiosInstance';

export const login = (username, password, rememberMe = false) =>
  axiosInstance.post('/auth/login', { username, password, rememberMe });

export const register = (payload) => axiosInstance.post('/auth/register', payload);

export const forgotPassword = (email) =>
  axiosInstance.post('/auth/forgot-password', { email });

export const verifyOtp = (email, otpCode) =>
  axiosInstance.post('/auth/verify-otp', { email, otpCode });

export const resetPassword = (email, otpCode, newPassword, confirmPassword) =>
  axiosInstance.post('/auth/reset-password', { email, otpCode, newPassword, confirmPassword });

export const changePasswordAdmin = (oldPassword, newPassword) =>
  axiosInstance.post('/admin/change-password', { oldPassword, newPassword });
