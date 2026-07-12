import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { getCustomerDashboard, depositFunds } from '../../api/customerApi';
import PageHeader from '../../components/common/PageHeader';
import AlertMessage from '../../components/common/AlertMessage';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/format';

export default function DepositPage() {
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCustomerDashboard()
      .then((res) => setAccounts(res.data.accounts || []))
      .catch(() => setError('Failed to load your accounts.'))
      .finally(() => setLoadingAccounts(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const res = await depositFunds({
        accountNumber,
        amount: parseFloat(amount),
        description: description || undefined,
      });
      setSuccess(`Deposit successful. Reference: ${res.data.transactionRef}`);
      setAmount('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Deposit failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAccounts) return <Loader text="Loading your accounts..." />;

  return (
    <div>
      <PageHeader title="Deposit Funds" subtitle="Add money to one of your accounts" />

      <Row>
        <Col lg={7}>
          <Card className="table-card">
            <Card.Body>
              <AlertMessage message={error} onClose={() => setError('')} />
              <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Deposit To Account</Form.Label>
                  <Form.Select value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required>
                    <option value="">Select your account...</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.accountNumber} disabled={a.status !== 'ACTIVE'}>
                        {a.accountNumber} — {a.accountType} ({formatCurrency(a.balance)})
                        {a.status !== 'ACTIVE' ? ` [${a.status}]` : ''}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description (optional)</Form.Label>
                  <Form.Control
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Cash deposit"
                  />
                </Form.Group>

                <Button type="submit" variant="success" disabled={submitting || !accountNumber}>
                  {submitting ? 'Processing...' : 'Deposit Funds'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
