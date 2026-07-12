import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Button, InputGroup, Form } from 'react-bootstrap';
import { getAllTransactions, getTransactionsByAccount, reverseTransaction } from '../../api/adminApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [filtering, setFiltering] = useState(false);

  const [reverseTarget, setReverseTarget] = useState(null);
  const [reversing, setReversing] = useState(false);

  const loadAll = () => {
    setLoading(true);
    setAccountFilter('');
    getAllTransactions()
      .then((res) => setTransactions(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load transactions.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAccountSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      loadAll();
      return;
    }
    setFiltering(true);
    setError('');
    try {
      const res = await getTransactionsByAccount(search.trim());
      setTransactions(res.data);
      setAccountFilter(search.trim());
    } catch (err) {
      setError(err.response?.data?.message || 'No transactions found for that account number.');
    } finally {
      setFiltering(false);
    }
  };

  const handleReverse = async () => {
    if (!reverseTarget) return;
    setReversing(true);
    try {
      await reverseTransaction(reverseTarget.id);
      setReverseTarget(null);
      if (accountFilter) {
        const res = await getTransactionsByAccount(accountFilter);
        setTransactions(res.data);
      } else {
        loadAll();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reverse transaction.');
      setReverseTarget(null);
    } finally {
      setReversing(false);
    }
  };

  const sorted = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [transactions]
  );

  if (loading) return <Loader text="Loading transactions..." />;

  return (
    <div>
      <PageHeader
        title="Transaction Management"
        subtitle="View all transactions and reverse completed ones if needed"
      />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Card className="table-card">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Form onSubmit={handleAccountSearch} className="d-flex gap-2">
            <InputGroup style={{ maxWidth: 320 }}>
              <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
              <Form.Control
                placeholder="Filter by account number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            <Button type="submit" variant="outline-primary" disabled={filtering}>
              {filtering ? 'Searching...' : 'Search'}
            </Button>
            {accountFilter && (
              <Button variant="outline-secondary" onClick={() => { setSearch(''); loadAll(); }}>
                Clear
              </Button>
            )}
          </Form>
          {accountFilter && <span className="text-muted small">Showing history for account: {accountFilter}</span>}
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
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-muted py-4">No transactions found.</td>
                </tr>
              )}
              {sorted.map((t) => (
                <tr key={t.id}>
                  <td className="font-monospace small">{t.transactionRef}</td>
                  <td>{t.transactionType}</td>
                  <td>{t.sourceAccountNumber || '-'}</td>
                  <td>{t.destinationAccountNumber || '-'}</td>
                  <td>{formatCurrency(t.amount)}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td className="small text-muted">{t.description}</td>
                  <td>{formatDateTime(t.timestamp)}</td>
                  <td className="text-end">
                    {t.status === 'SUCCESS' && t.transactionType !== 'REVERSAL' && (
                      <Button size="sm" variant="outline-danger" onClick={() => setReverseTarget(t)}>
                        Reverse
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ConfirmModal
        show={!!reverseTarget}
        title="Reverse Transaction"
        body={`Reverse transaction "${reverseTarget?.transactionRef}" for ${formatCurrency(reverseTarget?.amount)}? This will restore account balances to their prior state.`}
        confirmLabel="Reverse"
        onConfirm={handleReverse}
        onCancel={() => setReverseTarget(null)}
        loading={reversing}
      />
    </div>
  );
}
