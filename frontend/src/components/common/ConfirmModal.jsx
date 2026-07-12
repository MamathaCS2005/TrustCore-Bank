import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function ConfirmModal({ show, title, body, confirmLabel = 'Confirm', confirmVariant = 'danger', onConfirm, onCancel, loading }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
          {loading ? 'Please wait...' : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
