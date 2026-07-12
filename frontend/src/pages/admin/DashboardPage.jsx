import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { getAdminDashboard } from '../../api/adminApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import StatCard from './components/StatCard';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAdminDashboard()
      .then((res) => {
        if (mounted) setStats(res.data);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Failed to load dashboard stats.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="System-wide overview and analytics" />
      <AlertMessage message={error} onClose={() => setError('')} />

      {stats && (
        <>
          <Row className="g-3 mb-4">
            <Col md={3} sm={6}>
              <StatCard icon="bi-people-fill" label="Total Customers" value={stats.totalCustomers} color="#1a73e8" />
            </Col>
            <Col md={3} sm={6}>
              <StatCard icon="bi-bank2" label="Total Accounts" value={stats.totalAccounts} color="#198754" />
            </Col>
            <Col md={3} sm={6}>
              <StatCard icon="bi-arrow-left-right" label="Total Transactions" value={stats.totalTransactions} color="#6f42c1" />
            </Col>
            <Col md={3} sm={6}>
              <StatCard icon="bi-patch-exclamation" label="Pending KYC" value={stats.pendingKyc} color="#fd7e14" />
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col md={3} sm={6}>
              <StatCard icon="bi-check-circle" label="Active Accounts" value={stats.activeAccounts} color="#20c997" />
            </Col>
            <Col md={3} sm={6}>
              <StatCard icon="bi-graph-up-arrow" label="Total Deposits" value={formatCurrency(stats.totalDeposits)} color="#0dcaf0" />
            </Col>
            <Col md={3} sm={6}>
              <StatCard icon="bi-graph-down-arrow" label="Total Withdrawals" value={formatCurrency(stats.totalWithdrawals)} color="#dc3545" />
            </Col>
            <Col md={3} sm={6}>
              <StatCard icon="bi-send-fill" label="Total Transfers" value={formatCurrency(stats.totalTransfers)} color="#6610f2" />
            </Col>
          </Row>

          <Card className="table-card">
            <Card.Header className="bg-white fw-semibold">Recent Transactions</Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0">
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
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">No recent transactions.</td>
                    </tr>
                  )}
                  {(stats.recentTransactions || []).map((txn) => (
                    <tr key={txn.id}>
                      <td>{txn.transactionRef}</td>
                      <td>{txn.transactionType}</td>
                      <td>{txn.sourceAccountNumber || '-'}</td>
                      <td>{txn.destinationAccountNumber || '-'}</td>
                      <td>{formatCurrency(txn.amount)}</td>
                      <td><StatusBadge status={txn.status} /></td>
                      <td>{formatDateTime(txn.timestamp)}</td>
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
