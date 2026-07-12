import React, { useEffect, useState, useCallback } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyOtp, forgotPassword } from '../../api/authApi';
import AlertMessage from '../../components/common/AlertMessage';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const demoOtp = location.state?.demoOtp || null;

  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(
    demoOtp ? `Demo mode: Your OTP is ${demoOtp}` : ''
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  // If the user landed here directly without going through Forgot Password
  // (no email in router state), send them back to start the flow properly.
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  // 60-second resend cooldown countdown, matching the backend's rate limit.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await verifyOtp(email, otpCode);
      navigate('/reset-password', { state: { email, otpCode } });
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return;
    setError('');
    setSuccess('');
    setResending(true);
    try {
      const res = await forgotPassword(email);
      const newDemoOtp = res.data?.otp || null;
      if (newDemoOtp) {
        setSuccess(`Demo mode: Your new OTP is ${newDemoOtp}`);
      } else {
        setSuccess('A new OTP has been sent to your email.');
      }
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  }, [cooldown, email]);

  return (
    <div className="auth-page">
      <Card className="auth-card p-4">
        <Card.Body>
          <h3 className="brand-title text-center mb-1">Verify OTP</h3>
          <p className="text-center text-muted mb-4">
            Enter the 6-digit code sent to <strong>{email}</strong>. It expires in 5 minutes.
          </p>
          <AlertMessage message={error} onClose={() => setError('')} />
          <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />
          <Form onSubmit={handleVerify}>
            <Form.Group className="mb-3">
              <Form.Label>OTP Code</Form.Label>
              <Form.Control
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                placeholder="123456"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 mt-2" disabled={loading || otpCode.length !== 6}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <div className="text-center mt-3">
              <Button
                variant="link"
                className="small p-0"
                onClick={handleResend}
                disabled={cooldown > 0 || resending}
              >
                {resending
                  ? 'Resending...'
                  : cooldown > 0
                    ? `Resend OTP in ${cooldown}s`
                    : 'Resend OTP'}
              </Button>
            </div>
            <div className="text-center mt-2">
              <Link to="/login" className="small">Back to Sign In</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
