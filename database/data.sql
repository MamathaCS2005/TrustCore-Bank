-- Insert Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN');
INSERT INTO roles (id, name) VALUES (2, 'ROLE_CUSTOMER');

-- Insert Users
-- Password for the default customer accounts is 'password' -> BCrypt: $2b$10$nAbOdqpdt8zKStQYhrTZ3uRAx/MruZEVzDzvhvms1AmDBGC3V/gWS
-- Admin login: username/email 'lakshmimamatha725@gmail.com', password '123@obs' -> BCrypt: $2b$10$5iamcldCPsVfkhT89dE.y.dkDyAzqiAlYk7nwf1laE3t39Jz.ayrS
INSERT INTO users (id, username, email, password_hash, mobile_number, status, role_id) 
VALUES (1, 'lakshmimamatha725@gmail.com', 'lakshmimamatha725@gmail.com', '$2b$10$5iamcldCPsVfkhT89dE.y.dkDyAzqiAlYk7nwf1laE3t39Jz.ayrS', '9876543210', 'ACTIVE', 1);

INSERT INTO users (id, username, email, password_hash, mobile_number, status, role_id) 
VALUES (2, 'john_doe', 'john@gmail.com', '$2b$10$nAbOdqpdt8zKStQYhrTZ3uRAx/MruZEVzDzvhvms1AmDBGC3V/gWS', '9123456789', 'ACTIVE', 2);

INSERT INTO users (id, username, email, password_hash, mobile_number, status, role_id) 
VALUES (3, 'jane_smith', 'jane@gmail.com', '$2b$10$nAbOdqpdt8zKStQYhrTZ3uRAx/MruZEVzDzvhvms1AmDBGC3V/gWS', '9876123450', 'ACTIVE', 2);

-- Insert Admins
INSERT INTO admins (id, user_id, employee_id, department)
VALUES (1, 1, 'EMP001', 'Management');

-- Insert Customers
INSERT INTO customers (id, user_id, full_name, address, date_of_birth, pan_number, aadhar_number, kyc_status)
VALUES (1, 2, 'John Doe', '123 Main St, New York', '1990-05-15', 'ABCDE1234F', '123456789012', 'APPROVED');

INSERT INTO customers (id, user_id, full_name, address, date_of_birth, pan_number, aadhar_number, kyc_status)
VALUES (2, 3, 'Jane Smith', '456 Oak Rd, San Francisco', '1995-10-20', 'XYZWR5678G', '987654321098', 'PENDING');

-- Insert Accounts
INSERT INTO accounts (id, account_number, customer_id, balance, account_type, status)
VALUES (1, '1000000001', 1, 50000.00, 'SAVINGS', 'ACTIVE');

INSERT INTO accounts (id, account_number, customer_id, balance, account_type, status)
VALUES (2, '1000000002', 1, 10000.00, 'CURRENT', 'ACTIVE');

INSERT INTO accounts (id, account_number, customer_id, balance, account_type, status)
VALUES (3, '1000000003', 2, 25000.00, 'SAVINGS', 'ACTIVE');

-- Insert Transactions
INSERT INTO transactions (id, transaction_ref, source_account_id, destination_account_id, amount, transaction_type, status, description)
VALUES (1, 'TXN-1720272001', NULL, 1, 50000.00, 'DEPOSIT', 'SUCCESS', 'Initial Deposit');

INSERT INTO transactions (id, transaction_ref, source_account_id, destination_account_id, amount, transaction_type, status, description)
VALUES (2, 'TXN-1720272002', NULL, 2, 10000.00, 'DEPOSIT', 'SUCCESS', 'Initial Deposit');

INSERT INTO transactions (id, transaction_ref, source_account_id, destination_account_id, amount, transaction_type, status, description)
VALUES (3, 'TXN-1720272003', NULL, 3, 25000.00, 'DEPOSIT', 'SUCCESS', 'Initial Deposit');

INSERT INTO transactions (id, transaction_ref, source_account_id, destination_account_id, amount, transaction_type, status, description)
VALUES (4, 'TXN-1720272004', 1, 3, 2000.00, 'TRANSFER', 'SUCCESS', 'Rent Payment');

-- Update Account Balance for transfer (already calculated in insertion balances)
-- Account 1 balance = 50000 - 2000 = 48000 (We set 50000.00 in accounts table, so let's keep account balances consistent or adjust here)
UPDATE accounts SET balance = 48000.00 WHERE id = 1;
UPDATE accounts SET balance = 27000.00 WHERE id = 3;

-- Insert Beneficiaries
INSERT INTO beneficiaries (id, customer_id, beneficiary_account_id, name)
VALUES (1, 1, 3, 'Jane S');

-- Insert Banking Services
INSERT INTO banking_services (id, service_name, description, status)
VALUES (1, 'Personal Loan', 'Apply for a personal loan at attractive rates.', 'ACTIVE');
INSERT INTO banking_services (id, service_name, description, status)
VALUES (2, 'Credit Card', 'Apply for premium credit cards with cashback.', 'ACTIVE');
INSERT INTO banking_services (id, service_name, description, status)
VALUES (3, 'Fixed Deposit', 'Invest in high yield fixed deposits.', 'ACTIVE');

-- Insert KYC Documents (For John Doe it was already approved, let's insert one for Jane Smith which is pending)
INSERT INTO kyc_documents (id, customer_id, document_type, document_number, document_url, status)
VALUES (1, 2, 'PAN', 'XYZWR5678G', 'uploads/pan_jane.jpg', 'PENDING');

-- Insert Feedbacks
INSERT INTO feedbacks (id, customer_id, subject, message)
VALUES (1, 1, 'UI Feedback', 'Love the clean new dark dashboard, very smooth experience!');
