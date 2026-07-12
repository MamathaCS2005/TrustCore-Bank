import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Form, InputGroup } from 'react-bootstrap';
import { getMyTransactionHistory } from '../../api/customerApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    getMyTransactionHistory()
      .then((res) => {
        if (mounted) setTransactions(res.data);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Failed to load transaction history.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (t) =>
        t.transactionRef?.toLowerCase().includes(q) ||
        t.sourceAccountNumber?.toLowerCase().includes(q) ||
        t.destinationAccountNumber?.toLowerCase().includes(q) ||
        t.transactionType?.toLowerCase().includes(q)
    );
  }, [transactions, search]);

  if (loading) return <Loader text="Loading your transactions..." />;

  return (
    <div>
      <PageHeader title="Transaction History" subtitle="All deposits, withdrawals, and transfers on your accounts" />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Card className="table-card">
        <Card.Header className="bg-white">
          <InputGroup style={{ maxWidth: 320 }}>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control
              placeholder="Search by reference, account, or type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
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
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center text-muted py-4">No transactions found.</td></tr>
              )}
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="font-monospace small">{t.transactionRef}</td>
                  <td>{t.transactionType}</td>
                  <td>{t.sourceAccountNumber || '-'}</td>
                  <td>{t.destinationAccountNumber || '-'}</td>
                  <td>{formatCurrency(t.amount)}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td className="small text-muted">{t.description}</td>
                  <td>{formatDateTime(t.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
