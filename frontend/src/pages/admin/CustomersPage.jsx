import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Button, InputGroup, Form } from 'react-bootstrap';
import {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from '../../api/adminApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import CustomerFormModal from './components/CustomerFormModal';
import { formatDate } from '../../utils/format';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCustomers = () => {
    setLoading(true);
    getAllCustomers()
      .then((res) => setCustomers(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load customers.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(q) ||
        c.user?.username?.toLowerCase().includes(q) ||
        c.user?.email?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormError('');
    setShowForm(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormError('');
    setShowForm(true);
  };

  const handleFormSubmit = async (form) => {
    setSubmitting(true);
    setFormError('');
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, form);
      } else {
        await addCustomer(form);
      }
      setShowForm(false);
      loadCustomers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save customer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCustomer(deleteTarget.id);
      setDeleteTarget(null);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete customer.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader text="Loading customers..." />;

  return (
    <div>
      <PageHeader
        title="Customer Management"
        subtitle="View, add, edit, and remove customer accounts"
        action={<Button variant="primary" onClick={openAddModal}><i className="bi bi-plus-lg me-1"></i>Add Customer</Button>}
      />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Card className="table-card">
        <Card.Header className="bg-white">
          <InputGroup style={{ maxWidth: 320 }}>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control
              placeholder="Search by name, username, or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>KYC Status</th>
                <th>Account Status</th>
                <th>Registered</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">No customers found.</td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>{c.fullName}</td>
                  <td>{c.user?.username}</td>
                  <td>{c.user?.email}</td>
                  <td>{c.user?.mobileNumber}</td>
                  <td><StatusBadge status={c.kycStatus} /></td>
                  <td><StatusBadge status={c.user?.status} /></td>
                  <td>{formatDate(c.user?.createdAt)}</td>
                  <td className="text-end">
                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openEditModal(c)}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(c)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <CustomerFormModal
        show={showForm}
        customer={editingCustomer}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        submitting={submitting}
        error={formError}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Customer"
        body={`Are you sure you want to permanently delete "${deleteTarget?.fullName}"? This will remove their user account, accounts, and related data.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
