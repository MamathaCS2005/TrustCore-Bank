import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import AlertMessage from '../../../components/common/AlertMessage';

export default function CreateAccountModal({ show, customers, onClose, onSubmit, submitting, error }) {
  const [customerId, setCustomerId] = useState('');
  const [accountType, setAccountType] = useState('SAVINGS');
  const [initialBalance, setInitialBalance] = useState('0');

  useEffect(() => {
    if (show) {
      setCustomerId('');
      setAccountType('SAVINGS');
      setInitialBalance('0');
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      customerId: Number(customerId),
      accountType,
      initialBalance: parseFloat(initialBalance || '0'),
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Bank Account</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <AlertMessage message={error} />
          <Form.Group className="mb-3">
            <Form.Label>Customer</Form.Label>
            <Form.Select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
              <option value="">Select a customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.user?.username})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Account Type</Form.Label>
                <Form.Select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                  <option value="SAVINGS">Savings</option>
                  <option value="CURRENT">Current</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Initial Balance</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={submitting || !customerId}>
            {submitting ? 'Creating...' : 'Create Account'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
