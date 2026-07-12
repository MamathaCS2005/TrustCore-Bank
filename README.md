# TrustCore Bank

A full-stack online banking application with Admin and Customer portals, built with Spring Boot (backend) and React + Vite (frontend).

## Features

**Admin Portal**
- Dashboard with system-wide analytics
- Customer management (CRUD)
- Account management (create, freeze/unfreeze/close)
- Transaction management (view all, reverse)
- KYC document verification (approve/reject)
- Banking services management
- Customer feedback management

**Customer Portal**
- Dashboard with account overview
- Deposit, withdraw, and transfer funds
- Transaction history
- Beneficiary management
- KYC document upload
- Feedback submission
- Profile and password management

**Authentication**
- Single login page with role-based redirection
- JWT-based stateless authentication
- Remember Me (extended 30-day token)
- Forgot Password with 6-digit OTP (email or demo mode)
- Strong password enforcement
- Role-based access control (Admin / Customer)

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Java JDK | 21+ | Backend runtime |
| Maven | 3.9+ | Backend build tool |
| Node.js | 18+ | Frontend runtime |
| npm | 9+ | Frontend package manager |
| MySQL | 8.0+ | Database |

---

## Project Structure

```
├── backend/                  # Spring Boot application
│   ├── src/main/java/        # Java source code
│   ├── src/main/resources/   # application.properties
│   └── pom.xml               # Maven dependencies
├── frontend/                 # React + Vite application
│   ├── src/                  # React source code
│   ├── package.json          # npm dependencies
│   └── vite.config.js        # Vite configuration
├── database/                 # SQL scripts
│   ├── schema.sql            # Table creation
│   └── data.sql              # Seed data
└── README.md
```

---

## Database Setup

1. Start MySQL and create the database:
```sql
CREATE DATABASE online_banking;
```

2. Run the schema and seed data scripts:
```bash
mysql -u root -p online_banking < database/schema.sql
mysql -u root -p online_banking < database/data.sql
```

Alternatively, skip step 2 — the backend uses `spring.jpa.hibernate.ddl-auto=update` which auto-creates tables on first run, and `DataInitializer` seeds the required roles.

---

## Backend Setup

### Configuration

Edit `backend/src/main/resources/application.properties` or set environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_PASSWORD` | MySQL root password | `your_db_password` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_URL` | JDBC connection URL | `jdbc:mysql://localhost:3306/online_banking...` |
| `JWT_SECRET` | 64-byte hex key for signing JWTs | placeholder |
| `OTP_DEMO_MODE` | `true` = OTP returned in API response; `false` = sent via email | `true` |
| `MAIL_USERNAME` | Gmail address for SMTP | `your-email@gmail.com` |
| `MAIL_PASSWORD` | Gmail App Password (16 chars) | `your-app-password` |

### Run

```bash
cd backend
mvn spring-boot:run
```

The backend starts on **http://localhost:8081**.

---

## Frontend Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Run (Development)

```bash
npm run dev
```

The frontend starts on **http://localhost:5178**.

### Build (Production)

```bash
npm run build
```

Output is in `frontend/dist/`.

---

## Running in IDEs

### IntelliJ IDEA
1. Open the project root folder.
2. IntelliJ auto-detects the Maven project (`backend/pom.xml`).
3. Set the JDK to 21+ in `File > Project Structure > SDKs`.
4. Run `OnlineBankingApplication.java` (right-click → Run).
5. For frontend: open Terminal → `cd frontend && npm install && npm run dev`.

### Eclipse / Spring Tool Suite (STS)
1. `File > Import > Maven > Existing Maven Projects` → select `backend/`.
2. Right-click project → `Run As > Spring Boot App`.
3. For frontend: use an external terminal → `cd frontend && npm install && npm run dev`.

### VS Code
1. Open the project root folder.
2. Install extensions: *Spring Boot Extension Pack*, *ES7+ React Snippets*.
3. Backend: open `backend/` in the Java Projects view → Run `OnlineBankingApplication`.
4. Frontend: open terminal → `cd frontend && npm install && npm run dev`.

---

## Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `lakshmimamatha725@gmail.com` | `123@obs` |
| Customer | `john_doe` | `password` |
| Customer | `jane_smith` | `password` |

---

## API Base URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5178 |
| Backend API | http://localhost:8081/api |

---

## OTP Demo Mode

When `app.otp.demo-mode=true` (default), the forgot-password API returns the OTP directly in the JSON response so you can test the flow without configuring email. Set to `false` and configure SMTP for production email delivery.

---

## Build Commands Reference

```bash
# Backend - compile only
cd backend && mvn compile

# Backend - run
cd backend && mvn spring-boot:run

# Backend - package as JAR
cd backend && mvn clean package -DskipTests
java -jar backend/target/online-banking-0.0.1-SNAPSHOT.jar

# Frontend - install deps
cd frontend && npm install

# Frontend - dev server
cd frontend && npm run dev

# Frontend - production build
cd frontend && npm run build
```

---

## Tech Stack

- **Backend:** Java 21, Spring Boot 3.4, Spring Security, Spring Data JPA, JWT (jjwt), MySQL, Maven
- **Frontend:** React 18, Vite 6, React Router 6, Axios, React Bootstrap, Bootstrap 5, Chart.js
- **Database:** MySQL 8.0
- **Authentication:** JWT (HS512), BCrypt password hashing, SecureRandom OTP generation
