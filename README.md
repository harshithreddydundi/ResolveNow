# ResolveNow – Enterprise Issue Escalation & Service Desk Management System
> *"Resolve faster. Serve better."*

![ResolveNow Enterprise](https://img.shields.io/badge/Architecture-Distributed%20Microservices-indigo.svg)
![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.7-brightgreen.svg)
![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2025.1.2-blue.svg)
![React](https://img.shields.io/badge/React-19%20(Pure%20JSX)-61DAFB.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791.svg)
![Automated Tests](https://img.shields.io/badge/Automated%20Tests-22%2F22%20Passed-success.svg)

---

## 1. Executive Overview

**ResolveNow** is a production-grade, full-stack enterprise issue escalation and service desk management system engineered to orchestrate incident intake, cross-departmental SLA triage, automated lifecycle transitions, and real-time browser notifications across distributed business units.

Built with an enterprise-grade microservice architecture on **Java 21**, **Spring Boot 4.0.7**, and **Spring Cloud 2025.1.2**, the platform features service discovery via **Netflix Eureka**, an asynchronous non-blocking **API Gateway**, **JJWT** authentication, **PostgreSQL 17** persistence, **Server-Sent Events (SSE)** for real-time reactivity, and a **pure JavaScript / JSX** frontend built with Vite, Tailwind CSS, Framer Motion, and Recharts.

---

## 2. Microservice Mesh Topology

```
                                  +-------------------------------------------------------+
                                  |           React 19 Frontend Web Client (JSX)          |
                                  |             http://localhost:5173 / :3000             |
                                  +---------------------------+---------------------------+
                                                              | (REST / SSE Ingress)
                                                              v
+-----------------------+         +-------------------------------------------------------+
| Eureka Service Server | <-----> |           Spring Cloud API Gateway (:8080)            |
| http://localhost:8761 |         +---------------------------+---------------------------+
+-----------------------+                                     |
               |                                              |
               +----------------------+-----------------------+-----------------------+
               |                      |                       |                       |
               v                      v                       v                       v
      +------------------+   +------------------+    +------------------+    +------------------+
      |   Auth Service   |   |Complaint Service |    |Assignment Service|    |Notification Svc  |
      |      (:8081)     |   |      (:8082)     |    |      (:8083)     |    |      (:8084)     |
      +--------+---------+   +--------+---------+    +--------+---------+    +--------+---------+
               |                      |                       |                       |
               +----------------------+-----------------------+-----------------------+
                                      |
                                      v
                      +-------------------------------+
                      | PostgreSQL 17 (resolvenow_db) |
                      |    localhost:5432 / Docker    |
                      +-------------------------------+
```

### Microservices Matrix

| Service Name | Port | Description | Primary Technologies | Swagger OpenAPI Endpoint |
| :--- | :---: | :--- | :--- | :--- |
| **Eureka Server** | `8761` | Service Registry & Discovery Mesh | Spring Cloud Netflix Eureka | `http://localhost:8761` |
| **API Gateway** | `8080` | Reactive Netty Ingress, Routing & CORS | Spring Cloud Gateway WebFlux | `http://localhost:8080` |
| **Auth Service** | `8081` | JWT Issuance, Verification & RBAC | Spring Security, JJWT 0.13, JPA | `http://localhost:8081/swagger-ui.html` |
| **Complaint Service**| `8082` | Ticket Lifecycle State Machine & SSE | Spring Web, JPA, SSE Emitter | `http://localhost:8082/swagger-ui.html` |
| **Assignment Svc** | `8083` | Workload Tracking & Ticket Rebalancing| Spring Web, JPA, RestClient | `http://localhost:8083/swagger-ui.html` |
| **Notification Svc**| `8084` | Event-Driven User Alerts & Live Stream| Spring Web, JPA, User SSE | `http://localhost:8084/swagger-ui.html` |
| **Frontend Web** | `5173` | Enterprise UI (React + Tailwind + JSX) | React 19, Vite, Recharts, Lucide | `http://localhost:5173` |

---

## 3. Pre-Seeded Test Credentials

The database automatically seeds realistic user accounts across all 4 system roles upon initial startup:

| Role | Name | Email | Password | Department | Access Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | System Administrator | `admin@resolvenow.com` | `Admin@123` | Administration | Complete cluster oversight, user registry, department allocation, analytics |
| **MANAGER** | Sarah Jenkins | `manager.tech@resolvenow.com` | `Manager@123` | Technical Support | Department queue triage, agent dispatch, reassignments, team workload |
| **MANAGER** | David Miller | `manager.billing@resolvenow.com`| `Manager@123` | Billing & Finance | Financial dispute triage, payment escalation, departmental analytics |
| **AGENT** | Alex Rivera | `agent.tech1@resolvenow.com` | `Agent@123` | Technical Support | Assigned ticket resolution queue, status updates, activity notes |
| **AGENT** | Emily Zhao | `agent.tech2@resolvenow.com` | `Agent@123` | Technical Support | Assigned ticket queue, technical diagnostics, escalation requests |
| **AGENT** | Marcus Vance | `agent.billing1@resolvenow.com` | `Agent@123` | Billing & Finance | Billing inquiry queue, invoices, refunds, dispute resolution |
| **AGENT** | Chloe Bennett | `agent.service1@resolvenow.com` | `Agent@123` | Customer Service | General support tickets, customer inquiries, feedback triage |
| **AGENT** | Liam Cooper | `agent.facility1@resolvenow.com` | `Agent@123` | Facility | Physical infrastructure, facilities, hardware issue handling |
| **CUSTOMER** | Alice Morgan | `customer1@resolvenow.com` | `Customer@123` | Customer | Grievance logging, real-time ticket tracking, resolution verification |
| **CUSTOMER** | Robert Hughes | `customer2@resolvenow.com` | `Customer@123` | Customer | Service request submission, feedback, activity timeline inspection |
| **CUSTOMER** | Jessica Tan | `customer3@resolvenow.com` | `Customer@123` | Customer | Incident reports, dispute escalation, reopen verification |

> **Pro-Tip**: The login page (`/login`) includes **1-Click Quick Login Buttons** for each role, allowing instant evaluation without manual typing!

---

## 4. Key Functional Features

### A. Dynamic Ticket Lifecycle & State Machine
Tickets transition strictly according to valid business workflow rules:
```
           [ OPEN ]
              |
              v (Assigned to Agent)
         [ ASSIGNED ]
              |
              v (Agent begins work)
        [ IN_PROGRESS ]
          |         |
          |         +---> [ ESCALATED ] ---> [ IN_PROGRESS ]
          v
        [ RESOLVED ]
          |        \
          |         +---> [ REOPENED ] ---> [ IN_PROGRESS ]
          v
        [ CLOSED ]
```
- Illegal transitions (e.g. `OPEN -> CLOSED` without resolution) are rejected with HTTP 400 Bad Request.
- Automatic audit history logged for every change (actor, timestamp, previous status, updated status, remarks).

### B. Dual Real-Time SSE (Server-Sent Events) Architecture
1. **Global Ticket Stream** (`/api/complaints/stream`): Broadcasts ticket creation, priority changes, reassignments, and state transitions to all active supervisors and dashboards without polling.
2. **User Notification Stream** (`/api/notifications/stream/{userId}`): Delivers instantaneous push alerts to individual users for assigned tickets, status advances, and manager escalations with live badge counters.

### C. Role-Based Portals (Pure JSX)
- **Customer Portal**: Create grievances with categorized priority/department selectors, browse submitted tickets, view interactive timeline milestones.
- **Agent Workspace**: Queue of assigned tickets, quick action drawer to advance status (`START WORK`, `RESOLVE`), log notes, or escalate.
- **Manager Command Center**: Department ticket triage, workload balance charts per agent, 1-click reassignment modal, SLA risk warnings.
- **Admin Command Center**: Executive analytics with Recharts (velocity trends, status pie, priority bars, SLA compliance), User & Access management modal, Department staffing directory, Microservice mesh health monitor.

---

## 5. Automated Tests

All services include comprehensive unit and integration tests covering security, JWT, state machine transitions, and database queries.

```bash
# Execute automated test suite across all 7 modules
cd backend
mvn test
```

### Verified Test Results:
- `EurekaServerApplicationTests`: **1/1 Passed**
- `ApiGatewayApplicationTests`: **1/1 Passed**
- `AuthServiceTests`: **5/5 Passed** (Registration, BCrypt validation, Duplicate detection, Token generation, User lookup)
- `ComplaintServiceTests`: **6/6 Passed** (Auto-numbering `RN-2026-XXXXXX`, State transitions, Audit logging, Resolution validation, Customer filtering)
- `AssignmentServiceTests`: **4/4 Passed** (Agent assignment, Workload tracking, Reassignment history, Department filtering)
- `NotificationServiceTests`: **4/4 Passed** (Creation, Unread count, Mark as read, SSE delivery)
- **Reactor Summary**: `BUILD SUCCESS` (0 failures, 0 errors, 22/22 tests passed).

---

## 6. How to Run Locally

### Prerequisites
- **Java 21 LTS** installed and on `PATH`
- **Maven 3.9+** installed and on `PATH`
- **Node.js 20+** and **npm** installed
- **PostgreSQL 17** running locally on port 5432 (Database `resolvenow_db`)

### Option 1: One-Click Startup Script (Windows)
Run the pre-configured startup script:
```powershell
.\start-dev.bat
```
This automatically launches Eureka Server, waits for discovery readiness, boots the API Gateway, initializes the 4 microservices, and starts the Vite React dev server.

### Option 2: Step-by-Step Manual Launch

#### Step 1: Initialize Database
Create the database in PostgreSQL:
```sql
CREATE DATABASE resolvenow_db;
```
*(Credentials default to `postgres` / `Kousik@123` or configure via `DB_PASSWORD` environment variable in `application.properties`)*.

#### Step 2: Start Eureka Server (:8761)
```bash
cd backend/eureka-server
mvn spring-boot:run
```
*Wait ~10 seconds until Eureka is accessible at http://localhost:8761*.

#### Step 3: Start API Gateway (:8080)
```bash
cd backend/api-gateway
mvn spring-boot:run
```

#### Step 4: Start Backend Microservices
In separate terminal windows:
```bash
# Auth Service (:8081)
cd backend/auth-service && mvn spring-boot:run

# Complaint Service (:8082)
cd backend/complaint-service && mvn spring-boot:run

# Assignment Service (:8083)
cd backend/assignment-service && mvn spring-boot:run

# Notification Service (:8084)
cd backend/notification-service && mvn spring-boot:run
```

#### Step 5: Start Frontend Web Client (:5173)
```bash
cd frontend/resolvenow-web
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 7. Running with Docker Compose

To run the entire ecosystem (PostgreSQL + 6 Microservices + Frontend Nginx) in isolated containers:

```bash
# 1. Package JAR artifacts
cd backend
mvn clean package -DskipTests

# 2. Build and launch all 8 containers
cd ..
docker-compose up --build
```

Access points:
- **Web Application**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **PostgreSQL**: `localhost:5432`

---

## 8. API Gateway Routing Table

All external client traffic flows through the API Gateway on port `8080`:

| Ingress Route Pattern | Target Microservice | Allowed Methods | Authentication |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `lb://AUTH-SERVICE` | POST | Public |
| `/api/auth/register` | `lb://AUTH-SERVICE` | POST | Public |
| `/api/auth/**` | `lb://AUTH-SERVICE` | GET, POST, PUT, DELETE | Bearer JWT |
| `/api/complaints/**` | `lb://COMPLAINT-SERVICE` | GET, POST, PATCH, DELETE | Bearer JWT |
| `/api/complaints/stream` | `lb://COMPLAINT-SERVICE` | GET (SSE) | Public / Bearer |
| `/api/assignments/**` | `lb://ASSIGNMENT-SERVICE` | GET, POST, PUT | Bearer JWT |
| `/api/notifications/**` | `lb://NOTIFICATION-SERVICE` | GET, PATCH, DELETE | Bearer JWT |
| `/api/notifications/stream/**` | `lb://NOTIFICATION-SERVICE`| GET (SSE) | Public / Bearer |

---

## 9. Technology Stack Summary

- **Backend**: Java 21, Spring Boot 4.0.7, Spring Cloud 2025.1.2, Spring Data JPA, Spring Security, Spring Cloud Gateway (WebFlux / Netty), SpringDoc OpenAPI 3.0.2.
- **Security**: JJWT 0.13.0, BCrypt Password Encoder, Role-based route guards.
- **Real-Time Communication**: Server-Sent Events (SSE) via `SseEmitter` with auto-reconnection and client toast dispatch.
- **Database**: PostgreSQL 17, Hibernate 6, HikariCP Connection Pool.
- **Frontend**: React 19 (Pure JSX, strictly NO TypeScript), Vite 8, Tailwind CSS, Lucide React, Framer Motion, Recharts, Axios.
- **Testing**: JUnit 5, Spring Boot Starter Test, AssertJ, Mockito.
- **Containerization**: Multi-stage Dockerfiles, Docker Compose 3.8, Nginx Alpine.

---

## 10. Engineering Team & Core Developers

| Developer | Role & Key Specializations |
| :--- | :--- |
| **Sriram Kousik Sripathi** | Lead Developer &bull; Full Stack Microservices Architect (Spring Cloud Mesh, Eureka Discovery, Netty Gateway Ingress, JJWT Security, PostgreSQL 17 JPA Repositories) |
| **Harshith Reddy Dundi** | Lead Developer &bull; Distributed Systems &amp; UI Architect (React 19 Pure JSX Frontend, Tailwind CSS, Framer Motion, Dual SSE Streaming Pipeline, Workload Balancing) |
| **Nallapu Santosh Reddy** | Lead Developer &bull; Cloud Infrastructure &amp; QA Engineer (PostgreSQL 17 Schema Tuning, Assignment Service Workload Rebalancing, Notification Delivery &amp; Automated Testing) |

---

## 11. License & Academic Submission
Developed for enterprise service desk automation and academic submission.
All rights reserved © 2026 ResolveNow Team.

