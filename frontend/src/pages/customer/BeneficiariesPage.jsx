import React, { useEffect, useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { getBeneficiaries, addBeneficiary, deleteBeneficiary } from '../../api/customerApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import ConfirmModal from '../../components/common/ConfirmModal';
import AddBeneficiaryModal from './components/AddBeneficiaryModal';
import { formatDate } from '../../utils/format';

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [addError, setAddError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = () => {
    setLoading(true);
    getBeneficiaries()
      .then((res) => setBeneficiaries(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load beneficiaries.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (payload) => {
    setSubmitting(true);
    setAddError('');
    try {
      await addBeneficiary(payload);
      setShowAdd(false);
      loadData();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add beneficiary.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBeneficiary(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove beneficiary.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader text="Loading beneficiaries..." />;

  return (
    <div>
      <PageHeader
        title="Beneficiaries"
        subtitle="Manage saved recipients for faster transfers"
        action={<Button variant="primary" onClick={() => { setAddError(''); setShowAdd(true); }}><i className="bi bi-plus-lg me-1"></i>Add Beneficiary</Button>}
      />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Card className="table-card">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Account Number</th>
                <th>Account Holder</th>
                <th>Added On</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted py-4">No beneficiaries added yet.</td></tr>
              )}
              {beneficiaries.map((b) => (
                <tr key={b.id}>
                  <td className="fw-semibold">{b.name}</td>
                  <td className="font-monospace">{b.beneficiaryAccountNumber}</td>
                  <td>{b.beneficiaryCustomerName}</td>
                  <td>{formatDate(b.createdAt)}</td>
                  <td className="text-end">
                    <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(b)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <AddBeneficiaryModal
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAdd}
        submitting={submitting}
        error={addError}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Remove Beneficiary"
        body={`Remove "${deleteTarget?.name}" from your beneficiaries?`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
