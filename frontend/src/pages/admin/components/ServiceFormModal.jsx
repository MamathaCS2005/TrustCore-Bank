import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import AlertMessage from '../../../components/common/AlertMessage';

const emptyForm = { serviceName: '', description: '', status: 'ACTIVE' };

export default function ServiceFormModal({ show, service, onClose, onSubmit, submitting, error }) {
  const [form, setForm] = useState(emptyForm);
  const isEdit = !!service;

  useEffect(() => {
    if (show) {
      setForm(service ? { serviceName: service.serviceName, description: service.description || '', status: service.status } : emptyForm);
    }
  }, [show, service]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Edit Banking Service' : 'Add Banking Service'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <AlertMessage message={error} />
          <Form.Group className="mb-3">
            <Form.Label>Service Name</Form.Label>
            <Form.Control name="serviceName" value={form.serviceName} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Service'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
