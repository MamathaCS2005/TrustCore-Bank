import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Button, ButtonGroup } from 'react-bootstrap';
import { getAllKyc, updateKycStatus } from '../../api/adminApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import KycReviewModal from './components/KycReviewModal';
import { formatDateTime } from '../../utils/format';

const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

export default function KycPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('PENDING');

  const [reviewTarget, setReviewTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = () => {
    setLoading(true);
    getAllKyc()
      .then((res) => setDocuments(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load KYC documents.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return documents;
    return documents.filter((d) => d.status === filter);
  }, [documents, filter]);

  const handleReview = async (payload) => {
    if (!reviewTarget) return;
    setSubmitting(true);
    setFormError('');
    try {
      await updateKycStatus(reviewTarget.id, payload);
      setReviewTarget(null);
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update KYC status.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading KYC documents..." />;

  return (
    <div>
      <PageHeader title="KYC Verification" subtitle="Review and approve or reject customer KYC submissions" />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Card className="table-card">
        <Card.Header className="bg-white">
          <ButtonGroup>
            {FILTERS.map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </ButtonGroup>
        </Card.Header>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Username</th>
                <th>Document Type</th>
                <th>Document Number</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Reviewed By</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">No KYC documents found.</td>
                </tr>
              )}
              {filtered.map((k) => (
                <tr key={k.id}>
                  <td>{k.customerName}</td>
                  <td>{k.customerUsername}</td>
                  <td>{k.documentType}</td>
                  <td>{k.documentNumber}</td>
                  <td><StatusBadge status={k.status} /></td>
                  <td>{formatDateTime(k.submittedAt)}</td>
                  <td>{k.reviewedByUsername || '-'}</td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => { setReviewTarget(k); setFormError(''); }}
                    >
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <KycReviewModal
        show={!!reviewTarget}
        kyc={reviewTarget}
        onClose={() => setReviewTarget(null)}
        onSubmit={handleReview}
        submitting={submitting}
        error={formError}
      />
    </div>
  );
}
