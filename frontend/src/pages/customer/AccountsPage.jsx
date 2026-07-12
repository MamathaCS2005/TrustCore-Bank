import React, { useEffect, useState } from 'react';
import { Card, Table, Row, Col } from 'react-bootstrap';
import { getCustomerDashboard } from '../../api/customerApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/format';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getCustomerDashboard()
      .then((res) => {
        if (mounted) setAccounts(res.data.accounts || []);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Failed to load accounts.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loader text="Loading your accounts..." />;

  return (
    <div>
      <PageHeader title="My Accounts" subtitle="All bank accounts linked to your profile" />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Row className="g-3 mb-4">
        {accounts.map((a) => (
          <Col md={6} lg={4} key={a.id}>
            <Card className="stat-card h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="text-muted small">{a.accountType} Account</span>
                  <StatusBadge status={a.status} />
                </div>
                <div className="fs-4 fw-bold mb-1">{formatCurrency(a.balance)}</div>
                <div className="font-monospace text-muted small">{a.accountNumber}</div>
                <div className="text-muted small mt-2">Opened {formatDate(a.createdAt)}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="table-card">
        <Card.Header className="bg-white fw-semibold">Account Details</Card.Header>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Opened On</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted py-4">No accounts found.</td></tr>
              )}
              {accounts.map((a) => (
                <tr key={a.id}>
                  <td className="font-monospace">{a.accountNumber}</td>
                  <td>{a.accountType}</td>
                  <td>{formatCurrency(a.balance)}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>{formatDate(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
