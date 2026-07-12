import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { getKycStatus, uploadKyc } from '../../api/customerApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/format';

export default function KycPage() {
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [documentType, setDocumentType] = useState('PAN');
  const [documentNumber, setDocumentNumber] = useState('');
  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const loadKyc = () => {
    setLoading(true);
    getKycStatus()
      .then((res) => setKyc(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load KYC status.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadKyc();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    if (!file) {
      setFormError('Please select a document file to upload.');
      return;
    }
    setSubmitting(true);
    try {
      await uploadKyc(documentType, documentNumber, file);
      setSuccess('Document uploaded successfully. Your KYC is now pending review.');
      setDocumentNumber('');
      setFile(null);
      loadKyc();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading KYC status..." />;

  const canUpload = !kyc || kyc.status === 'REJECTED';

  return (
    <div>
      <PageHeader title="KYC Verification" subtitle="Submit identity documents for verification" />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Row>
        <Col lg={7}>
          {kyc && (
            <Card className="table-card mb-4">
              <Card.Header className="bg-white fw-semibold">Current KYC Status</Card.Header>
              <Card.Body>
                <Row className="g-2">
                  <Col xs={5} className="text-muted small">Status</Col>
                  <Col xs={7}><StatusBadge status={kyc.status} /></Col>
                  <Col xs={5} className="text-muted small">Document Type</Col>
                  <Col xs={7}>{kyc.documentType}</Col>
                  <Col xs={5} className="text-muted small">Document Number</Col>
                  <Col xs={7}>{kyc.documentNumber}</Col>
                  <Col xs={5} className="text-muted small">Submitted On</Col>
                  <Col xs={7}>{formatDateTime(kyc.submittedAt)}</Col>
                  {kyc.reviewRemarks && (
                    <>
                      <Col xs={5} className="text-muted small">Remarks</Col>
                      <Col xs={7}>{kyc.reviewRemarks}</Col>
                    </>
                  )}
                </Row>
              </Card.Body>
            </Card>
          )}

          {canUpload ? (
            <Card className="table-card">
              <Card.Header className="bg-white fw-semibold">
                {kyc ? 'Resubmit KYC Document' : 'Submit KYC Document'}
              </Card.Header>
              <Card.Body>
                <AlertMessage message={formError} onClose={() => setFormError('')} />
                <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Document Type</Form.Label>
                    <Form.Select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                      <option value="PAN">PAN Card</option>
                      <option value="AADHAR">Aadhar Card</option>
                      <option value="PASSPORT">Passport</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Document Number</Form.Label>
                    <Form.Control
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Document</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      required
                    />
                    <Form.Text className="text-muted">Accepted: images or PDF, max 5MB.</Form.Text>
                  </Form.Group>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Uploading...' : 'Submit Document'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <AlertMessage
              variant={kyc.status === 'APPROVED' ? 'success' : 'info'}
              message={
                kyc.status === 'APPROVED'
                  ? 'Your KYC has already been approved.'
                  : 'Your KYC document is pending review by an administrator.'
              }
            />
          )}
        </Col>
      </Row>
    </div>
  );
}
