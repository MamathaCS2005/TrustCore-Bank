import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import AlertMessage from '../../../components/common/AlertMessage';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatDateTime } from '../../../utils/format';

export default function KycReviewModal({ show, kyc, onClose, onSubmit, submitting, error }) {
  const [status, setStatus] = useState('APPROVED');
  const [remarks, setRemarks] = useState('');
  const [docError, setDocError] = useState('');
  const [docLoading, setDocLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setStatus('APPROVED');
      setRemarks('');
      setDocError('');
    }
  }, [show, kyc]);

  if (!kyc) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ status, reviewRemarks: remarks });
  };

  // Static uploads are served outside the /api prefix but still require the JWT
  // (SecurityConfig protects /uploads/** under anyRequest().authenticated()),
  // so a plain <a href> without an Authorization header would get a 401/403.
  // Fetch it manually with the token and open it as a blob instead.
  const handleViewDocument = async () => {
    if (!kyc.documentUrl) return;
    setDocError('');
    setDocLoading(true);
    try {
      const token = localStorage.getItem('token');
      const cleanPath = kyc.documentUrl.replace(/^\/+/, '');
      const response = await fetch(`http://localhost:8081/${cleanPath}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) {
        throw new Error('Document could not be retrieved.');
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setDocError(err.message || 'Failed to load document.');
    } finally {
      setDocLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Review KYC Document</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <AlertMessage message={error} />
          <Row className="g-2 mb-3">
            <Col xs={6} className="text-muted small">Customer</Col>
            <Col xs={6}>{kyc.customerName} ({kyc.customerUsername})</Col>
            <Col xs={6} className="text-muted small">Document Type</Col>
            <Col xs={6}>{kyc.documentType}</Col>
            <Col xs={6} className="text-muted small">Document Number</Col>
            <Col xs={6}>{kyc.documentNumber}</Col>
            <Col xs={6} className="text-muted small">Submitted</Col>
            <Col xs={6}>{formatDateTime(kyc.submittedAt)}</Col>
            <Col xs={6} className="text-muted small">Current Status</Col>
            <Col xs={6}><StatusBadge status={kyc.status} /></Col>
            {kyc.documentUrl && (
              <>
                <Col xs={6} className="text-muted small">Document File</Col>
                <Col xs={6}>
                  <Button variant="link" size="sm" className="p-0" onClick={handleViewDocument} disabled={docLoading}>
                    {docLoading ? 'Loading...' : 'View document'}
                  </Button>
                </Col>
              </>
            )}
          </Row>
          <AlertMessage message={docError} onClose={() => setDocError('')} />
          <Form.Group className="mb-3">
            <Form.Label>Decision</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional remarks for the customer"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={status === 'APPROVED' ? 'success' : 'danger'} type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : status === 'APPROVED' ? 'Approve' : 'Reject'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
