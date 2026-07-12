import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <h1 className="mb-2">403</h1>
      <p className="text-muted mb-3">You do not have permission to view this page.</p>
      <Link to="/login" className="btn btn-primary">Back to Login</Link>
    </div>
  );
}
