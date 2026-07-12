import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import AlertMessage from '../../components/common/AlertMessage';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      const demoOtp = res.data?.otp || null;
      // Hand off to the OTP verification page. Passing the email via router
      // state avoids re-typing it and avoids putting it in the URL/query string.
      // If demo mode returned the OTP, pass it along so the verify page can display it.
      navigate('/verify-otp', { state: { email, demoOtp } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card p-4">
        <Card.Body>
          <h3 className="brand-title text-center mb-1">Forgot Password</h3>
          <p className="text-center text-muted mb-4">
            Enter your registered email and we'll send you a 6-digit OTP to reset your password.
          </p>
          <AlertMessage message={error} onClose={() => setError('')} />
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Registered Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="you@example.com"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 mt-2" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
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
