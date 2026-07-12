import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from '../pages/customer/components/ChangePasswordModal';

const NAV_ITEMS = [
  { to: '/customer/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/customer/accounts', label: 'My Accounts', icon: 'bi-bank' },
  { to: '/customer/transactions', label: 'Transactions', icon: 'bi-clock-history' },
  { to: '/customer/transfer', label: 'Transfer', icon: 'bi-send' },
  { to: '/customer/deposit', label: 'Deposit', icon: 'bi-plus-circle' },
  { to: '/customer/withdraw', label: 'Withdraw', icon: 'bi-dash-circle' },
  { to: '/customer/beneficiaries', label: 'Beneficiaries', icon: 'bi-person-lines-fill' },
  { to: '/customer/kyc', label: 'KYC Verification', icon: 'bi-patch-check' },
  { to: '/customer/feedback', label: 'Feedback', icon: 'bi-chat-dots' },
  { to: '/customer/profile', label: 'Profile & Settings', icon: 'bi-gear' },
];

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePw, setShowChangePw] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-shell">
      <div className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar}></div>

      <aside className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="brand">🏦 My Bank</div>
        <nav className="nav flex-column mt-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <header className="admin-topbar">
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-light btn-sm sidebar-toggle-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list"></i>
          </button>
          <div className="fw-semibold text-muted">Welcome, {user?.fullName || user?.username}</div>
        </div>
        <Dropdown align="end">
          <Dropdown.Toggle variant="light" size="sm" id="customer-user-dropdown">
            {user?.username || 'Customer'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setShowChangePw(true)}>Change Password</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </header>

      <main className="admin-content">
        <Outlet />
      </main>

      <ChangePasswordModal show={showChangePw} onClose={() => setShowChangePw(false)} />
    </div>
  );
}
