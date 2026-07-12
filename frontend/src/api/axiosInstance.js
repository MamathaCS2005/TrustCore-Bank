import axios from 'axios';
import { getToken, clearSession } from '../utils/authStorage';

// Centralized Axios instance. Base URL points to the Spring Boot backend.
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically to every outgoing request.
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // When sending FormData (e.g. KYC document upload), the instance's default
  // 'Content-Type: application/json' header must be removed so the browser
  // can set 'multipart/form-data; boundary=...' itself. Without this, Spring's
  // multipart parser cannot read the request (missing/incorrect boundary).
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Global response handler: if the token is invalid/expired (401), log the user out.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearSession();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
