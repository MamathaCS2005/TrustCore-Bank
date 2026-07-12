import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-overlay">
      <Spinner animation="border" variant="primary" role="status" className="me-2" />
      <span className="text-muted">{text}</span>
    </div>
  );
}
