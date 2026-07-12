import React, { useEffect, useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { getAllFeedbacks, deleteFeedback } from '../../api/adminApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatDateTime } from '../../utils/format';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = () => {
    setLoading(true);
    getAllFeedbacks()
      .then((res) => setFeedbacks(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load feedback.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFeedback(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete feedback.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader text="Loading feedback..." />;

  return (
    <div>
      <PageHeader title="Customer Feedback" subtitle="View and manage feedback submitted by customers" />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Card className="table-card">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Submitted</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">No feedback submitted yet.</td>
                </tr>
              )}
              {feedbacks.map((f) => (
                <tr key={f.id}>
                  <td>{f.customerName} <span className="text-muted small">({f.customerUsername})</span></td>
                  <td className="fw-semibold">{f.subject}</td>
                  <td className="small text-muted" style={{ maxWidth: 360 }}>{f.message}</td>
                  <td>{formatDateTime(f.submittedAt)}</td>
                  <td className="text-end">
                    <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(f)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Feedback"
        body={`Delete feedback "${deleteTarget?.subject}" from ${deleteTarget?.customerName}?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
