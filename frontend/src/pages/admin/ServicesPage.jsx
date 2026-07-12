import React, { useEffect, useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { getAllServices, addService, updateService, deleteService } from '../../api/adminApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import ServiceFormModal from './components/ServiceFormModal';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = () => {
    setLoading(true);
    getAllServices()
      .then((res) => setServices(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load banking services.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditingService(null);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (service) => {
    setEditingService(service);
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    setFormError('');
    try {
      if (editingService) {
        await updateService(editingService.id, form);
      } else {
        await addService(form);
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteService(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader text="Loading banking services..." />;

  return (
    <div>
      <PageHeader
        title="Banking Services"
        subtitle="Manage the services offered to customers"
        action={<Button variant="primary" onClick={openAdd}><i className="bi bi-plus-lg me-1"></i>Add Service</Button>}
      />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Card className="table-card">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">No banking services configured.</td>
                </tr>
              )}
              {services.map((s) => (
                <tr key={s.id}>
                  <td className="fw-semibold">{s.serviceName}</td>
                  <td className="text-muted small">{s.description}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="text-end">
                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openEdit(s)}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(s)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ServiceFormModal
        show={showForm}
        service={editingService}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Banking Service"
        body={`Are you sure you want to delete "${deleteTarget?.serviceName}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
