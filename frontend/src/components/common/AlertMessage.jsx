import React from 'react';
import { Alert } from 'react-bootstrap';

export default function AlertMessage({ variant = 'danger', message, onClose }) {
  if (!message) return null;
  return (
    <Alert variant={variant} onClose={onClose} dismissible={!!onClose}>
      {message}
    </Alert>
  );
}
