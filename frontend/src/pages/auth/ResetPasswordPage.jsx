import React, { useEffect, useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';
import AlertMessage from '../../components/common/AlertMessage';
import PasswordField from '../../components/common/PasswordField';
import PasswordStrengthChecklist from '../../components/common/PasswordStrengthChecklist';
import { isPasswordStrong } from '../../utils/passwordValidation';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otpCode = location.state?.otpCode || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset Password must only be reachable after a successful OTP verification
  // (VerifyOtpPage navigates here with email + otpCode in router state).
  useEffect(() => {
    if (!email || !otpCode) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, otpCode, navigate]);

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordStrong(newPassword)) {
      setError('Password does not meet the required strength rules.');
      return;
    }
    if (!passwordsMatch) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otpCode, newPassword, confirmPassword);
      navigate('/login', { state: { resetSuccess: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card p-4">
        <Card.Body>
          <h3 className="brand-title text-center mb-1">Reset Password</h3>
          <p className="text-center text-muted mb-4">Choose a new password for your account.</p>
          <AlertMessage message={error} onClose={() => setError('')} />
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>New Password</Form.Label>
              <PasswordField
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>
            <PasswordStrengthChecklist password={newPassword} />
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <PasswordField
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <Form.Text className="text-danger">Passwords do not match.</Form.Text>
              )}
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100 mt-2"
              disabled={loading || !isPasswordStrong(newPassword) || !passwordsMatch}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
            <div className="text-center mt-3">
              <Link to="/login" className="small">Back to Sign In</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
