import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Button, InputGroup, Form, Dropdown } from 'react-bootstrap';
import { getAllAccounts, createBankAccount, updateAccountStatus, getAllCustomers } from '../../api/adminApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import CreateAccountModal from './components/CreateAccountModal';
import { formatCurrency, formatDate } from '../../utils/format';

const STATUS_OPTIONS = ['ACTIVE', 'FROZEN', 'CLOSED'];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [createError, setCreateError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAllAccounts(), getAllCustomers()])
      .then(([accRes, custRes]) => {
        setAccounts(accRes.data);
        setCustomers(custRes.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load accounts.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return accounts;
    const q = search.toLowerCase();
    return accounts.filter(
      (a) => a.accountNumber?.toLowerCase().includes(q) || a.customerName?.toLowerCase().includes(q)
    );
  }, [accounts, search]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    setCreateError('');
    try {
      await createBankAccount(payload);
      setShowCreate(false);
      loadData();
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (account, status) => {
    if (account.status === status) return;
    setStatusUpdatingId(account.id);
    setError('');
    try {
      await updateAccountStatus(account.id, status);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update account status.');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  if (loading) return <Loader text="Loading accounts..." />;

  return (
    <div>
      <PageHeader
        title="Account Management"
        subtitle="Create bank accounts and manage account status"
        action={<Button variant="primary" onClick={() => { setCreateError(''); setShowCreate(true); }}><i className="bi bi-plus-lg me-1"></i>New Account</Button>}
      />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Card className="table-card">
        <Card.Header className="bg-white">
          <InputGroup style={{ maxWidth: 320 }}>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control
              placeholder="Search by account number or customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Opened On</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">No accounts found.</td>
                </tr>
              )}
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className="font-monospace">{a.accountNumber}</td>
                  <td>{a.customerName}</td>
                  <td>{a.accountType}</td>
                  <td>{formatCurrency(a.balance)}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>{formatDate(a.createdAt)}</td>
                  <td className="text-end">
                    <Dropdown align="end">
                      <Dropdown.Toggle size="sm" variant="outline-secondary" disabled={statusUpdatingId === a.id}>
                        {statusUpdatingId === a.id ? 'Updating...' : 'Change Status'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {STATUS_OPTIONS.map((s) => (
                          <Dropdown.Item
                            key={s}
                            active={a.status === s}
                            onClick={() => handleStatusChange(a, s)}
                          >
                            {s}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <CreateAccountModal
        show={showCreate}
        customers={customers}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        submitting={submitting}
        error={createError}
      />
    </div>
  );
}
