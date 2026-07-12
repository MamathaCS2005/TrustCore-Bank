import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import AlertMessage from '../../../components/common/AlertMessage';

export default function AddBeneficiaryModal({ show, onClose, onSubmit, submitting, error }) {
  const [name, setName] = useState('');
  const [beneficiaryAccountNumber, setBeneficiaryAccountNumber] = useState('');

  useEffect(() => {
    if (show) {
      setName('');
      setBeneficiaryAccountNumber('');
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, beneficiaryAccountNumber });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Beneficiary</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <AlertMessage message={error} />
          <Form.Group className="mb-3">
            <Form.Label>Nickname / Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Beneficiary Account Number</Form.Label>
            <Form.Control
              value={beneficiaryAccountNumber}
              onChange={(e) => setBeneficiaryAccountNumber(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Beneficiary'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
