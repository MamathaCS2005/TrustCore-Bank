import React from 'react';
import { Badge } from 'react-bootstrap';

export default function StatusBadge({ status }) {
  if (!status) return null;
  return <Badge className={`badge-status-${status}`}>{status}</Badge>;
}
