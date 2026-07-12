# Implementation Plan - Full Stack Online Banking System

This plan outlines the design and steps to build a production-quality, secure, and responsive **Online Banking System** with distinct roles for Admin and Customer, using Java 21, Spring Boot 3.5.x (or 3.4.x depending on standard Maven libraries), Spring Security, JWT, React 19, Vite 7, Bootstrap 5, and MySQL.

## User Review Required

> [!IMPORTANT]
> The MySQL server password is set to `12342005MCS@7727` and the database `online_banking` has been successfully created. We will configure the backend to use this database.

> [!NOTE]
> Since we are running in a local environment without a pre-configured SMTP server, the **Email Service** for OTPs will, by default, log the 6-digit OTP code to the console for testing and verification purposes. An SMTP configuration block will be provided in `application.properties` so the user can easily plug in their real mail server details (e.g. Gmail SMTP) to send real emails.

## Proposed Architecture & Changes

### 1. Database Schema
We will create a relational MySQL schema with 10 tables:
- `roles` (id, name [ROLE_ADMIN, ROLE_CUSTOMER])
- `users` (id, username, email, password_hash, mobile_number, status, role_id, created_at, updated_at)
- `customers` (id, user_id, full_name, address, date_of_birth, pan_number, aadhar_number, kyc_status)
- `admins` (id, user_id, employee_id, department)
- `accounts` (id, account_number, customer_id, balance, account_type, status, created_at)
- `transactions` (id, transaction_ref, source_account_id, destination_account_id, amount, transaction_type, status, description, timestamp)
- `beneficiaries` (id, customer_id, beneficiary_account_id, name, created_at)
- `banking_services` (id, service_name, description, status, created_at)
- `kyc_documents` (id, customer_id, document_type, document_number, document_url, status, submitted_at, reviewed_by, review_remarks, reviewed_at)
- `feedbacks` (id, customer_id, subject, message, submitted_at)
- `otp_verifications` (id, email, otp_code, expiry_time, attempts, verified, created_at)

---

### 2. Backend Component (Spring Boot)
The backend will follow a clean layered architecture.

#### [NEW] [pom.xml](file:///g:/Online%20Banking/backend/pom.xml)
Maven dependencies for Spring Boot Starter Web, JPA, Security, Mail, Validation, JWT, MySQL Driver. We will use Spring Boot 3.4.x (or 3.5.x if compatible) and Java 21.

#### [NEW] [application.properties](file:///g:/Online%20Banking/backend/src/main/resources/application.properties)
Database and JPA configuration (using MySQL, Hibernate 6, update DDL strategy), JWT parameters (secret, expiration), and Spring Mail configuration.

#### [NEW] Java Entities
- [User.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/User.java)
- [Role.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/Role.java)
- [Customer.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/Customer.java)
- [Admin.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/Admin.java)
- [Account.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/Account.java)
- [Transaction.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/Transaction.java)
- [Beneficiary.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/Beneficiary.java)
- [BankingService.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/BankingService.java)
- [KYC.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/KYC.java)
- [Feedback.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/Feedback.java)
- [OTPVerification.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/entity/OTPVerification.java)

#### [NEW] Security & JWT
- [SecurityConfig.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/config/SecurityConfig.java): Spring Security configuration with JWT filter, stateless sessions, and CORS.
- [JwtAuthenticationFilter.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/config/JwtAuthenticationFilter.java): Intercepts requests, validates JWT, sets security context.
- [JwtTokenProvider.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/config/JwtTokenProvider.java): Generates, parses, and validates JWTs.

#### [NEW] DTOs & Exceptions
- Standardized DTO request/response packages.
- [GlobalExceptionHandler.java](file:///g:/Online%20Banking/backend/src/main/java/com/bank/exception/GlobalExceptionHandler.java) utilizing `@ControllerAdvice` to handle custom errors and validations.

#### [NEW] Services & Controllers
- Authentication, Customer operations, Admin management, and Banking transactions.

---

### 3. Frontend Component (React + Vite)
We will build a responsive single page application (SPA) styled with custom premium dark/light mode accents using CSS and Bootstrap 5.

#### [NEW] [package.json](file:///g:/Online%20Banking/frontend/package.json)
React 19, Vite 7, React Router Dom, Axios, Bootstrap, Chart.js / React-Chartjs-2.

#### [NEW] API Integration & Context
- [axiosInstance.js](file:///g:/Online%20Banking/frontend/src/api/axiosInstance.js): Centralized API caller. Attaches JWT to requests automatically.
- [AuthContext.jsx](file:///g:/Online%20Banking/frontend/src/context/AuthContext.jsx): Stores user status, token, and exposes log in, log out, profile methods.

#### [NEW] Pages & Dashboards
- **Auth Flow**: Login, Register, ForgotPassword, ResetPassword.
- **Admin Dashboard**: Analytics, Customer list, KYC verification, Service management, Reports, Feedbacks.
- **Customer Dashboard**: Balances, Quick Deposit/Withdraw/Transfer, Transaction History, Beneficiary Management, Feedback submission.

---

### 4. Database Initialization
- [schema.sql](file:///g:/Online%20Banking/database/schema.sql)
- [data.sql](file:///g:/Online%20Banking/database/data.sql) containing sample customers, accounts, and pre-configured admin login (`admin`/`admin123`).

---

## Verification Plan

### Automated Verification
- We will write JUnit integration tests for critical services (e.g. Transactions, OTP verification).
- Run clean backend build: `mvn clean test` (using IntelliJ's mvn path).
- Validate frontend compilation: `npm run build`.

### Manual Verification
- Verify backend API endpoints with CURL/Postman scripts.
- Test customer onboarding: registration, OTP verification, password change.
- Test transactions: deposit, transfer, withdraw, checking balance, verification of transaction history.
- Verify role restrictions: non-admin trying to access admin endpoints gets 403 Forbidden.



Create customer input for the form    


Username      : mamatha_cs
Full Name     : Mamatha C S
Email         : mamatha.cs@gmail.com
Mobile Number : 9876543210
Password      : Mamatha@123
Address       : 123 MG Road, Mysore, Karnataka
Date of Birth : 2005-01-27
PAN Number    : ABCDE1234F
Aadhaar Number: 123456789012