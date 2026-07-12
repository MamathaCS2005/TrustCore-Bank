import React from 'react';
import { getPasswordRuleResults } from '../../utils/passwordValidation';

export default function PasswordStrengthChecklist({ password }) {
  const rules = getPasswordRuleResults(password);

  return (
    <ul className="list-unstyled small mb-3">
      {rules.map((rule) => (
        <li key={rule.key} className={rule.passed ? 'text-success' : 'text-muted'}>
          <i className={`bi ${rule.passed ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
