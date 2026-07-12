import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Table, Row, Col } from 'react-bootstrap';
import { submitFeedback, getFeedbackHistory } from '../../api/customerApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import { formatDateTime } from '../../utils/format';

export default function FeedbackPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const loadHistory = () => {
    setLoading(true);
    getFeedbackHistory()
      .then((res) => setHistory(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load feedback history.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await submitFeedback({ subject, message });
      setSuccess('Thank you! Your feedback has been submitted.');
      setSubject('');
      setMessage('');
      loadHistory();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading feedback..." />;

  return (
    <div>
      <PageHeader title="Feedback" subtitle="Share your thoughts or report an issue" />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Row>
        <Col lg={7}>
          <Card className="table-card mb-4">
            <Card.Header className="bg-white fw-semibold">Submit Feedback</Card.Header>
            <Card.Body>
              <AlertMessage message={formError} onClose={() => setFormError('')} />
              <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={150}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="table-card">
        <Card.Header className="bg-white fw-semibold">Your Feedback History</Card.Header>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Message</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr><td colSpan={3} className="text-center text-muted py-4">You haven't submitted any feedback yet.</td></tr>
              )}
              {history.map((f) => (
                <tr key={f.id}>
                  <td className="fw-semibold">{f.subject}</td>
                  <td className="small text-muted" style={{ maxWidth: 400 }}>{f.message}</td>
                  <td>{formatDateTime(f.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
