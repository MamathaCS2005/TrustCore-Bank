import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import UnauthorizedPage from './pages/misc/UnauthorizedPage';
import NotFoundPage from './pages/misc/NotFoundPage';

import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import CustomersPage from './pages/admin/CustomersPage';
import AccountsPage from './pages/admin/AccountsPage';
import TransactionsPage from './pages/admin/TransactionsPage';
import KycPage from './pages/admin/KycPage';
import ServicesPage from './pages/admin/ServicesPage';
import FeedbackPage from './pages/admin/FeedbackPage';

import CustomerLayout from './layouts/CustomerLayout';
import CustomerDashboardPage from './pages/customer/DashboardPage';
import CustomerAccountsPage from './pages/customer/AccountsPage';
import CustomerTransactionsPage from './pages/customer/TransactionsPage';
import TransferPage from './pages/customer/TransferPage';
import DepositPage from './pages/customer/DepositPage';
import WithdrawPage from './pages/customer/WithdrawPage';
import BeneficiariesPage from './pages/customer/BeneficiariesPage';
import CustomerKycPage from './pages/customer/KycPage';
import CustomerFeedbackPage from './pages/customer/FeedbackPage';
import ProfilePage from './pages/customer/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="kyc" element={<KycPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
        </Route>

        {/* Customer routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute requiredRole="ROLE_CUSTOMER">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboardPage />} />
          <Route path="accounts" element={<CustomerAccountsPage />} />
          <Route path="transactions" element={<CustomerTransactionsPage />} />
          <Route path="transfer" element={<TransferPage />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="beneficiaries" element={<BeneficiariesPage />} />
          <Route path="kyc" element={<CustomerKycPage />} />
          <Route path="feedback" element={<CustomerFeedbackPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
