import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <h1 className="mb-2">404</h1>
      <p className="text-muted mb-3">The page you are looking for does not exist.</p>
      <Link to="/login" className="btn btn-primary">Back to Login</Link>
    </div>
  );
}
