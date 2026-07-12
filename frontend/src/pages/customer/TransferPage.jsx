import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { getCustomerDashboard, transferFunds } from '../../api/customerApi';
import PageHeader from '../../components/common/PageHeader';
import AlertMessage from '../../components/common/AlertMessage';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/format';

export default function TransferPage() {
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [sourceAccountNumber, setSourceAccountNumber] = useState('');
  const [destinationAccountNumber, setDestinationAccountNumber] = useState('');
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

  const resetForm = () => {
    setDestinationAccountNumber('');
    setAmount('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (sourceAccountNumber === destinationAccountNumber) {
      setError('Source and destination accounts cannot be the same.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await transferFunds({
        sourceAccountNumber,
        destinationAccountNumber,
        amount: parseFloat(amount),
        description: description || undefined,
      });
      setSuccess(`Transfer successful. Reference: ${res.data.transactionRef}`);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAccounts) return <Loader text="Loading your accounts..." />;

  return (
    <div>
      <PageHeader title="Transfer Funds" subtitle="Send money from your account to another account" />

      <Row>
        <Col lg={7}>
          <Card className="table-card">
            <Card.Body>
              <AlertMessage message={error} onClose={() => setError('')} />
              <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>From Account</Form.Label>
                  <Form.Select
                    value={sourceAccountNumber}
                    onChange={(e) => setSourceAccountNumber(e.target.value)}
                    required
                  >
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
                  <Form.Label>To Account Number</Form.Label>
                  <Form.Control
                    value={destinationAccountNumber}
                    onChange={(e) => setDestinationAccountNumber(e.target.value)}
                    placeholder="Enter recipient's account number"
                    required
                  />
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
                    placeholder="e.g. Rent payment"
                  />
                </Form.Group>

                <Button type="submit" variant="primary" disabled={submitting || !sourceAccountNumber}>
                  {submitting ? 'Processing...' : 'Transfer Funds'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
