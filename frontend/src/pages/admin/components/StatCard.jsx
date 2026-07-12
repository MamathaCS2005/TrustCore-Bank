import React from 'react';
import { Card } from 'react-bootstrap';

export default function StatCard({ icon, label, value, color = '#1a73e8' }) {
  return (
    <Card className="stat-card">
      <Card.Body className="d-flex align-items-center gap-3">
        <div className="stat-icon" style={{ backgroundColor: `${color}1a`, color }}>
          <i className={`bi ${icon}`}></i>
        </div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fs-4 fw-bold">{value}</div>
        </div>
      </Card.Body>
    </Card>
  );
}
