// Shared strong-password policy, mirrored by the backend's @Pattern validation
// on RegisterRequest/ChangePasswordRequest/ResetPasswordRequest in AuthDTOs.java:
//   ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$

export const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'uppercase', label: 'At least one uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'lowercase', label: 'At least one lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'number', label: 'At least one number', test: (v) => /\d/.test(v) },
  { key: 'special', label: 'At least one special character', test: (v) => /[^a-zA-Z0-9]/.test(v) },
];

export function getPasswordRuleResults(password) {
  const value = password || '';
  return PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(value) }));
}

export function isPasswordStrong(password) {
  return getPasswordRuleResults(password).every((rule) => rule.passed);
}

export function getFirstPasswordError(password) {
  const failed = getPasswordRuleResults(password).find((rule) => !rule.passed);
  return failed ? failed.label : null;
}
