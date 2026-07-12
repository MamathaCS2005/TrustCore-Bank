import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCustomerDashboard } from '../../api/customerApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getCustomerDashboard()
      .then((res) => {
        if (mounted) setStats(res.data);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Failed to load dashboard.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loader text="Loading your dashboard..." />;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your accounts and recent activity" />
      <AlertMessage message={error} onClose={() => setError('')} />

      {stats && (
        <>
          <Row className="g-3 mb-4">
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body className="d-flex align-items-center gap-3">
                  <div className="stat-icon" style={{ backgroundColor: '#1a73e81a', color: '#1a73e8' }}>
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <div>
                    <div className="text-muted small">Total Balance</div>
                    <div className="fs-4 fw-bold">{formatCurrency(stats.totalBalance)}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body className="d-flex align-items-center gap-3">
                  <div className="stat-icon" style={{ backgroundColor: '#19875419', color: '#198754' }}>
                    <i className="bi bi-bank"></i>
                  </div>
                  <div>
                    <div className="text-muted small">Accounts</div>
                    <div className="fs-4 fw-bold">{stats.accounts?.length || 0}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body className="d-flex align-items-center gap-3">
                  <div className="stat-icon" style={{ backgroundColor: '#fd7e141a', color: '#fd7e14' }}>
                    <i className="bi bi-patch-check"></i>
                  </div>
                  <div>
                    <div className="text-muted small">KYC Status</div>
                    <div className="fs-5 fw-bold"><StatusBadge status={stats.kycStatus} /></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3">
            <Col lg={7}>
              <Card className="table-card mb-4">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">My Accounts</span>
                  <Link to="/customer/accounts" className="small">View all</Link>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table hover responsive className="mb-0 align-middle">
                    <thead>
                      <tr>
                        <th>Account Number</th>
                        <th>Type</th>
                        <th>Balance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats.accounts || []).length === 0 && (
                        <tr><td colSpan={4} className="text-center text-muted py-4">No accounts found.</td></tr>
                      )}
                      {(stats.accounts || []).map((a) => (
                        <tr key={a.id}>
                          <td className="font-monospace">{a.accountNumber}</td>
                          <td>{a.accountType}</td>
                          <td>{formatCurrency(a.balance)}</td>
                          <td><StatusBadge status={a.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={5}>
              <Card className="table-card mb-4">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">Beneficiaries</span>
                  <Link to="/customer/beneficiaries" className="small">Manage</Link>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table hover responsive className="mb-0 align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Account Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats.beneficiaries || []).length === 0 && (
                        <tr><td colSpan={2} className="text-center text-muted py-4">No beneficiaries added.</td></tr>
                      )}
                      {(stats.beneficiaries || []).map((b) => (
                        <tr key={b.id}>
                          <td>{b.name}</td>
                          <td className="font-monospace">{b.beneficiaryAccountNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="table-card">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Recent Transactions</span>
              <Link to="/customer/transactions" className="small">View all</Link>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentTransactions || []).length === 0 && (
                    <tr><td colSpan={7} className="text-center text-muted py-4">No recent transactions.</td></tr>
                  )}
                  {(stats.recentTransactions || []).map((t) => (
                    <tr key={t.id}>
                      <td className="font-monospace small">{t.transactionRef}</td>
                      <td>{t.transactionType}</td>
                      <td>{t.sourceAccountNumber || '-'}</td>
                      <td>{t.destinationAccountNumber || '-'}</td>
                      <td>{formatCurrency(t.amount)}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td>{formatDateTime(t.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
}
