import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import AlertMessage from '../../../components/common/AlertMessage';

const emptyAddForm = {
  username: '',
  email: '',
  password: '',
  mobileNumber: '',
  fullName: '',
  address: '',
  dateOfBirth: '',
  panNumber: '',
  aadharNumber: '',
};

const emptyEditForm = {
  fullName: '',
  email: '',
  mobileNumber: '',
  address: '',
};

/**
 * Reusable Add/Edit customer modal.
 * - When `customer` is null -> Add mode (full RegisterRequest fields incl. username/password).
 * - When `customer` is provided -> Edit mode (EditProfileRequest fields only).
 */
export default function CustomerFormModal({ show, customer, onClose, onSubmit, submitting, error }) {
  const isEdit = !!customer;
  const [form, setForm] = useState(isEdit ? emptyEditForm : emptyAddForm);

  useEffect(() => {
    if (isEdit && customer) {
      setForm({
        fullName: customer.fullName || '',
        email: customer.user?.email || '',
        mobileNumber: customer.user?.mobileNumber || '',
        address: customer.address || '',
      });
    } else {
      setForm(emptyAddForm);
    }
  }, [customer, show, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Edit Customer' : 'Add New Customer'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <AlertMessage message={error} />
          <Row className="g-3">
            {!isEdit && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control name="username" value={form.username} onChange={handleChange} required minLength={4} maxLength={20} />
                </Form.Group>
              </Col>
            )}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control name="fullName" value={form.fullName} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control name="mobileNumber" value={form.mobileNumber} onChange={handleChange} pattern="[0-9]{10}" required title="10 digit mobile number" />
              </Form.Group>
            </Col>
            {!isEdit && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
                </Form.Group>
              </Col>
            )}
            <Col md={isEdit ? 12 : 6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control name="address" value={form.address} onChange={handleChange} required />
              </Form.Group>
            </Col>
            {!isEdit && (
              <>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>PAN Number</Form.Label>
                    <Form.Control name="panNumber" value={form.panNumber} onChange={handleChange} required placeholder="ABCDE1234F" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Aadhar Number</Form.Label>
                    <Form.Control name="aadharNumber" value={form.aadharNumber} onChange={handleChange} required pattern="[0-9]{12}" title="12 digit Aadhar number" />
                  </Form.Group>
                </Col>
              </>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Customer'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
