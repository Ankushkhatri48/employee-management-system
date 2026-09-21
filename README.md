# Employee Management System REST API

A production-ready Java Spring Boot REST API for managing employees, designed from scratch for **Free Online Cloud Deployment** and local development.

---

## 🌐 Live Demo & Repository

- **Live Public API:** `YOUR_DEPLOYED_URL` *(e.g., https://employee-management-api.onrender.com)*
- **GitHub Repository:** `YOUR_GITHUB_REPOSITORY_URL` *(e.g., https://github.com/your-username/employee-management-system)*

---

## 🚀 Key Features

- **Standard 3-Tier Layered Architecture:** Controller ➔ Service ➔ Repository ➔ Database.
- **Full CRUD Operations:** Create, Read, Update, and Delete employees.
- **Specialized Endpoints:** Filter employees by department, query employee salary breakdown.
- **Smoke / Health Check:** `GET /api/health` for monitoring cloud status.
- **Cloud Native & 12-Factor Ready:**
  - Reads cloud `PORT` dynamically.
  - Injects database credentials securely via environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
  - Zero hardcoded passwords or file paths.
- **Clean Exception Handling:** Consistent JSON error payloads with standard HTTP status codes (200, 201, 400, 404, 500).
- **CORS Enabled:** Seamless integration with React, Angular, Vue, or Postman.

---

## 🛠️ Tech Stack

- **Language:** Java 17+
- **Framework:** Spring Boot 3.3.x
  - Spring Web (REST controllers)
  - Spring Data JPA (Hibernate ORM)
  - Validation (Jakarta Validation)
- **Database:** MySQL 8.x (Local MySQL or Cloud Free-tier MySQL / TiDB / Aiven)
- **Build Tool:** Maven (includes `./mvnw` wrapper)
- **Hosting Targets:** Render, Railway, or Koyeb (Spring Boot) + Aiven or TiDB Cloud (MySQL)

---

## 📡 REST API Endpoints

| HTTP Method | Endpoint | Description | Sample Request / Query |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Service health status | - |
| **GET** | `/api/employees` | Get all employees | - |
| **POST** | `/api/employees` | Create a new employee | JSON body with employee details |
| **GET** | `/api/employees/{id}` | Get employee by ID | `/api/employees/1` |
| **PUT** | `/api/employees/{id}` | Update employee details | JSON body with updated details |
| **DELETE**| `/api/employees/{id}` | Delete employee by ID | `/api/employees/1` |
| **GET** | `/api/employees/department/{dept}` | Filter by department | `/api/employees/department/IT` |
| **GET** | `/api/employees/{id}/salary` | View employee salary | `/api/employees/1/salary` |

---

## 📝 Sample API Payloads

### 1. Health Check
`GET https://YOUR_DEPLOYED_URL/api/health`
```json
{
  "status": "Employee Management API is running"
}
```

### 2. Create Employee
`POST https://YOUR_DEPLOYED_URL/api/employees`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "department": "IT",
  "salary": 75000.0
}
```
**Response (201 Created):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "department": "IT",
  "salary": 75000.0
}
```

### 3. Search by Department
`GET https://YOUR_DEPLOYED_URL/api/employees/department/IT`
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "department": "IT",
    "salary": 75000.0
  }
]
```

### 4. Salary View
`GET https://YOUR_DEPLOYED_URL/api/employees/1/salary`
```json
{
  "employeeId": 1,
  "employeeName": "John Doe",
  "department": "IT",
  "salary": 75000.0
}
```

---

## 💻 Local Quickstart

### Prerequisites
- JDK 17 or higher installed (`java -version`)
- MySQL Server installed and running locally
- Git

### 1. Create MySQL Database
In your local MySQL client (e.g., MySQL Workbench or CLI):
```sql
CREATE DATABASE employee_db;
```

### 2. Configure Local Database Credentials (Optional)
The default configuration in `src/main/resources/application.properties` connects to:
- URL: `jdbc:mysql://localhost:3306/employee_db`
- Username: `root`
- Password: *(empty)*

If your local MySQL has a password, you can run the application with your local credentials without modifying the committed file:
```bash
# Windows PowerShell
$env:DB_PASSWORD="your_password"; mvn spring-boot:run

# Linux / Mac Bash
DB_PASSWORD="your_password" ./mvnw spring-boot:run
```

### 3. Run the Application
```bash
# Using Maven Wrapper
./mvnw spring-boot:run

# Or with system Maven
mvn spring-boot:run
```
The server will start at: `http://localhost:8080`

---

## ☁️ Online Deployment

Complete step-by-step instructions for 100% free online deployment can be found in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).
