import React from 'react';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="d-flex justify-content-between align-items-start flex-wrap mb-4">
      <div>
        <h3 className="page-title mb-1">{title}</h3>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
