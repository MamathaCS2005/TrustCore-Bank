import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { getProfile, updateProfile, changePassword } from '../../api/customerApi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import AlertMessage from '../../components/common/AlertMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/format';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ fullName: '', email: '', mobileNumber: '', address: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          fullName: res.data.fullName || '',
          email: res.data.user?.email || '',
          mobileNumber: res.data.user?.mobileNumber || '',
          address: res.data.address || '',
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setSavingProfile(true);
    try {
      await updateProfile(form);
      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setSavingPassword(true);
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordSuccess('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <Loader text="Loading your profile..." />;

  return (
    <div>
      <PageHeader title="Profile & Settings" subtitle="Manage your personal information and account security" />
      <AlertMessage message={error} onClose={() => setError('')} />

      <Row className="g-4">
        <Col lg={7}>
          <Card className="table-card mb-4">
            <Card.Header className="bg-white fw-semibold">Personal Information</Card.Header>
            <Card.Body>
              <AlertMessage message={profileError} onClose={() => setProfileError('')} />
              <AlertMessage variant="success" message={profileSuccess} onClose={() => setProfileSuccess('')} />
              <Form onSubmit={handleProfileSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control name="fullName" value={form.fullName} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        title="10 digit mobile number"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control value={profile?.user?.username || ''} disabled />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Address</Form.Label>
                      <Form.Control name="address" value={form.address} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="primary" className="mt-3" disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="table-card">
            <Card.Header className="bg-white fw-semibold">Change Password</Card.Header>
            <Card.Body>
              <AlertMessage message={passwordError} onClose={() => setPasswordError('')} />
              <AlertMessage variant="success" message={passwordSuccess} onClose={() => setPasswordSuccess('')} />
              <Form onSubmit={handlePasswordSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="outline-primary" className="mt-3" disabled={savingPassword}>
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="table-card">
            <Card.Header className="bg-white fw-semibold">Account Summary</Card.Header>
            <Card.Body>
              <Row className="g-2">
                <Col xs={5} className="text-muted small">Account Status</Col>
                <Col xs={7}><StatusBadge status={profile?.user?.status} /></Col>
                <Col xs={5} className="text-muted small">KYC Status</Col>
                <Col xs={7}><StatusBadge status={profile?.kycStatus} /></Col>
                <Col xs={5} className="text-muted small">PAN Number</Col>
                <Col xs={7}>{profile?.panNumber || '-'}</Col>
                <Col xs={5} className="text-muted small">Aadhar Number</Col>
                <Col xs={7}>{profile?.aadharNumber || '-'}</Col>
                <Col xs={5} className="text-muted small">Date of Birth</Col>
                <Col xs={7}>{formatDate(profile?.dateOfBirth)}</Col>
                <Col xs={5} className="text-muted small">Member Since</Col>
                <Col xs={7}>{formatDate(profile?.user?.createdAt)}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
