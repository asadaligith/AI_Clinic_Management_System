# AI Clinic Management SaaS - Complete Documentation

> Full-stack MERN application for managing clinic operations with role-based access control.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Setup & Installation](#4-setup--installation)
5. [Environment Configuration](#5-environment-configuration)
6. [Running the Project](#6-running-the-project)
7. [User Roles & Permissions](#7-user-roles--permissions)
8. [API Reference](#8-api-reference)
9. [Frontend Pages & Routes](#9-frontend-pages--routes)
10. [Database Models](#10-database-models)
11. [How to Test the Project](#11-how-to-test-the-project)
12. [Complete User Workflow Guide](#12-complete-user-workflow-guide)
13. [Appointment Status Transitions](#13-appointment-status-transitions)
14. [Architecture & Design Patterns](#14-architecture--design-patterns)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Project Overview

AI Clinic Management SaaS is a full-stack web application designed to manage clinic operations including patient registration, appointment booking, doctor management, and role-based dashboards.

**Key Features:**
- JWT-based authentication with role-based access control (RBAC)
- 4 user roles: Admin, Doctor, Receptionist, Patient
- Patient registration with optional login account creation
- Appointment booking with doctor selection
- Appointment status workflow (pending -> confirmed -> completed/cancelled)
- Live dashboard statistics for every role
- Admin user management (activate/deactivate doctors and receptionists)
- Responsive sidebar-based dashboard layout
- Paginated lists with search and filter capabilities

---

## 2. Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 4.21 | Web framework |
| MongoDB | Atlas | Database |
| Mongoose | 8.9 | MongoDB ODM |
| JWT (jsonwebtoken) | 9.0 | Authentication tokens |
| bcryptjs | 2.4 | Password hashing |
| express-validator | 7.3 | Input validation |
| morgan | 1.10 | HTTP request logging |
| cors | 2.8 | Cross-origin resource sharing |
| dotenv | 16.4 | Environment variables |
| nodemon | 3.1 | Dev auto-restart |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI library |
| Vite | 6.0 | Build tool & dev server |
| React Router | 6.28 | Client-side routing |
| Axios | 1.7 | HTTP client |
| react-hot-toast | 2.4 | Toast notifications |

---

## 3. Project Structure

```
AI_Clinic_Management_Systam/
|-- package.json                    # Root monorepo scripts
|-- .gitignore
|
|-- backend/
|   |-- package.json
|   |-- .env                        # Backend environment variables
|   |-- .env.example
|   |-- src/
|       |-- server.js               # Entry point - starts Express server
|       |-- app.js                  # Express app setup, middleware, routes
|       |-- config/
|       |   |-- constants.js        # ROLES, APPOINTMENT_STATUS, etc.
|       |   |-- db.js               # MongoDB connection
|       |-- middleware/
|       |   |-- auth.js             # JWT protect + role authorize
|       |   |-- errorHandler.js     # Global error handler
|       |   |-- validate.js         # express-validator rules
|       |-- models/
|       |   |-- User.js             # User schema (name, email, password, role)
|       |   |-- Patient.js          # Patient schema (name, age, gender, userId)
|       |   |-- Appointment.js      # Appointment schema (patient, doctor, date, status)
|       |-- controllers/
|       |   |-- authController.js   # Register, Login, GetMe
|       |   |-- patientController.js # Patient CRUD + getMyProfile
|       |   |-- appointmentController.js # Appointment CRUD + status updates
|       |   |-- adminController.js  # User management (list, update)
|       |   |-- statsController.js  # Role-specific dashboard statistics
|       |-- routes/
|       |   |-- healthRoute.js      # GET /api/v1/health
|       |   |-- authRoutes.js       # /api/v1/auth/*
|       |   |-- patientRoutes.js    # /api/v1/patients/*
|       |   |-- appointmentRoutes.js # /api/v1/appointments/*
|       |   |-- adminRoutes.js      # /api/v1/admin/*
|       |   |-- doctorRoutes.js     # /api/v1/doctors
|       |   |-- statsRoutes.js      # /api/v1/stats
|       |-- utils/
|           |-- ApiError.js         # Custom error class
|           |-- ApiResponse.js      # Standardized response format
|           |-- asyncHandler.js     # Async/await error wrapper
|
|-- frontend/
    |-- package.json
    |-- vite.config.js              # Vite config with API proxy
    |-- .env                        # Frontend environment variables
    |-- .env.example
    |-- src/
        |-- main.jsx                # React entry point
        |-- App.jsx                 # Root component with Router + Toaster
        |-- index.css               # Global styles
        |-- api/
        |   |-- axios.js            # Axios instance with JWT interceptor
        |   |-- authApi.js          # Login, Register, GetMe
        |   |-- patientApi.js       # Patient CRUD + getMyProfile
        |   |-- appointmentApi.js   # Appointment CRUD + getDoctors
        |   |-- adminApi.js         # Admin user management
        |   |-- statsApi.js         # Dashboard stats
        |-- context/
        |   |-- AuthContext.jsx     # Global auth state (user, login, logout)
        |-- routes/
        |   |-- AppRoutes.jsx       # All route definitions
        |   |-- ProtectedRoute.jsx  # Auth-required route wrapper
        |   |-- RoleRoute.jsx       # Role-required route wrapper
        |-- layouts/
        |   |-- MainLayout.jsx      # Public pages (Navbar + Outlet)
        |   |-- DashboardLayout.jsx # Dashboard pages (Sidebar + Header + Outlet)
        |-- components/
        |   |-- Navbar.jsx          # Public navigation bar
        |   |-- Sidebar.jsx         # Dashboard sidebar with role-based menus
        |   |-- DashboardHeader.jsx # Dashboard top bar
        |   |-- PlaceholderPage.jsx # Generic placeholder component
        |   |-- icons/
        |       |-- SidebarIcon.jsx # SVG icon renderer
        |-- config/
        |   |-- sidebarMenus.js     # Sidebar menu items per role
        |-- utils/
        |   |-- roleRedirect.js     # Role to dashboard path mapping
        |-- hooks/
        |   |-- useApi.js           # Generic API call hook
        |-- styles/
        |   |-- dashboard.css       # All dashboard styles
        |-- pages/
            |-- Home.jsx            # Landing page
            |-- Login.jsx           # Login form
            |-- Register.jsx        # Registration form
            |-- Dashboard.jsx       # Role redirect (/dashboard -> /role/dashboard)
            |-- NotFound.jsx        # 404 page
            |-- Unauthorized.jsx    # 403 page
            |-- dashboards/
            |   |-- AdminDashboard.jsx
            |   |-- DoctorDashboard.jsx
            |   |-- ReceptionistDashboard.jsx
            |   |-- PatientDashboard.jsx
            |-- admin/
            |   |-- ManageDoctors.jsx
            |   |-- ManageReceptionists.jsx
            |   |-- SystemStats.jsx
            |-- receptionist/
            |   |-- RegisterPatient.jsx
            |   |-- BookAppointment.jsx
            |-- patient/
            |   |-- MyProfile.jsx
            |   |-- MyAppointments.jsx
            |   |-- BookAppointment.jsx
            |-- shared/
                |-- PatientList.jsx
                |-- PatientProfile.jsx
                |-- AppointmentList.jsx
```

---

## 4. Setup & Installation

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** Atlas account (or local MongoDB instance)
- **Git** (optional, for cloning)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd AI_Clinic_Management_Systam
```

### Step 2: Install All Dependencies
```bash
# Install both backend and frontend dependencies at once
npm run install:all
```

Or install them separately:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables
See [Section 5: Environment Configuration](#5-environment-configuration) below.

---

## 5. Environment Configuration

### Backend (.env)
Create `backend/.env` file:
```env
NODE_ENV=development
PORT=5000

# MongoDB Connection String
# Option A: MongoDB Atlas (SRV format)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# Option B: Direct connection (if SRV DNS fails on your network)
# MONGO_URI=mongodb://<username>:<password>@<shard1>:27017,<shard2>:27017,<shard3>:27017/?tls=true&authSource=admin&retryWrites=true&w=majority

# JWT Settings
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
Create `frontend/.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=AI Clinic Management
```

### Important Notes:
- **JWT_SECRET**: Change this to a strong random string in production
- **MONGO_URI**: Replace with your actual MongoDB connection string
- **CORS_ORIGIN**: Must match your frontend URL exactly
- The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically

---

## 6. Running the Project

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Output: `Server running in development mode on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Output: `Local: http://localhost:5173/`

### Or Use Root Scripts:
```bash
# From project root
npm run dev:backend    # Start backend
npm run dev:frontend   # Start frontend (in another terminal)
```

### Production Build:
```bash
# Build frontend
npm run build:frontend

# Start backend in production
npm run start:backend
```

### Verify the Setup:

1. **Health Check** - Open browser or use curl:
   ```
   GET http://localhost:5000/api/v1/health
   ```
   Expected Response:
   ```json
   {
     "status": "success",
     "message": "Server is healthy",
     "data": { "uptime": "...", "timestamp": "..." }
   }
   ```

2. **Frontend** - Open browser:
   ```
   http://localhost:5173
   ```
   You should see the landing page.

---

## 7. User Roles & Permissions

### Role Hierarchy

| Feature | Admin | Doctor | Receptionist | Patient |
|---|:---:|:---:|:---:|:---:|
| View admin dashboard | Yes | No | No | No |
| Manage doctors (activate/deactivate) | Yes | No | No | No |
| Manage receptionists (activate/deactivate) | Yes | No | No | No |
| View all patients list | Yes | Yes | Yes | No |
| View single patient profile | Yes | Yes | Yes | No |
| Register new patient | Yes | No | Yes | No |
| Update patient record | Yes | No | Yes | No |
| View own patient profile | No | No | No | Yes |
| Book appointment (for patient) | Yes | No | Yes | No |
| Book own appointment | No | No | No | Yes |
| View all appointments | Yes | No | Yes | No |
| View own appointments (doctor) | No | Yes | No | No |
| View own appointments (patient) | No | No | No | Yes |
| Update appointment status | Yes | Yes* | No | No |
| Delete appointment | Yes | No | Yes | No |
| View dashboard stats | Yes | Yes | Yes | Yes |
| View system stats | Yes | No | No | No |

> *Doctors can only update status of their own appointments

### Dashboard URLs by Role
| Role | Dashboard URL |
|---|---|
| Admin | `/admin/dashboard` |
| Doctor | `/doctor/dashboard` |
| Receptionist | `/receptionist/dashboard` |
| Patient | `/patient/dashboard` |

---

## 8. API Reference

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Headers
All protected routes require:
```
Authorization: Bearer <jwt_token>
```

### Standard Response Format
**Success:**
```json
{
  "status": "success",
  "message": "Optional message",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Error description",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

---

### 8.1 Health Check
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Server health check |

---

### 8.2 Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| GET | `/auth/me` | Yes | Get current user profile |

**POST /auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "doctor"          // optional: admin, doctor, receptionist, patient
}
```
Response:
```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "doctor" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**POST /auth/login**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### 8.3 Patient Management

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| POST | `/patients` | Yes | receptionist, admin | Create patient (+ optional user account) |
| GET | `/patients` | Yes | admin, doctor, receptionist | List patients (search, filter, paginate) |
| GET | `/patients/my-profile` | Yes | patient | Get own patient profile |
| GET | `/patients/:id` | Yes | admin, doctor, receptionist | Get single patient |
| PUT | `/patients/:id` | Yes | receptionist, admin | Update patient |

**POST /patients** (Create with optional login account)
```json
{
  "name": "Jane Smith",
  "age": 30,
  "gender": "female",
  "contact": "+92 300 1234567",
  "email": "jane@example.com",     // optional - creates User account
  "password": "patient123"          // required if email is provided
}
```

**GET /patients?search=jane&gender=female&page=1&limit=10**

---

### 8.4 Appointment Management

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| POST | `/appointments` | Yes | receptionist, admin, patient | Create appointment |
| GET | `/appointments` | Yes | admin, doctor, receptionist, patient | List appointments (role-scoped) |
| PUT | `/appointments/:id/status` | Yes | doctor, admin | Update appointment status |
| DELETE | `/appointments/:id` | Yes | receptionist, admin | Delete appointment |
| GET | `/appointments/doctors` | Yes | receptionist, admin, patient | Get doctors for dropdown |

**POST /appointments** (by receptionist/admin)
```json
{
  "patientId": "64abc...",
  "doctorId": "64def...",
  "date": "2026-03-15T10:30:00.000Z",
  "reason": "General checkup"
}
```

**POST /appointments** (by patient - patientId auto-resolved)
```json
{
  "doctorId": "64def...",
  "date": "2026-03-15T10:30:00.000Z",
  "reason": "Follow-up visit"
}
```

**PUT /appointments/:id/status**
```json
{
  "status": "confirmed"
}
```

**GET /appointments?status=pending&date=2026-03-15&page=1&limit=10**

---

### 8.5 Admin - User Management

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| GET | `/admin/users` | Yes | admin | List users with filters |
| PUT | `/admin/users/:id` | Yes | admin | Update user (toggle active, change role) |

**GET /admin/users?role=doctor&search=john&isActive=true&page=1&limit=10**

**PUT /admin/users/:id**
```json
{
  "isActive": false
}
```

---

### 8.6 Doctors List

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| GET | `/doctors` | Yes | All | List active doctors |

---

### 8.7 Dashboard Statistics

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| GET | `/stats` | Yes | All | Get role-appropriate stats |

**Response varies by role:**

Admin:
```json
{ "stats": { "totalDoctors": 5, "totalPatients": 120, "totalAppointments": 340, "appointmentsToday": 12 } }
```

Doctor:
```json
{ "stats": { "todaysAppointments": 8, "totalPatients": 45, "pendingAppointments": 3 } }
```

Receptionist:
```json
{ "stats": { "todaysAppointments": 15, "totalPatients": 120, "registeredToday": 4 } }
```

Patient:
```json
{ "stats": { "upcomingVisits": 2, "totalAppointments": 7, "completedVisits": 5 } }
```

---

## 9. Frontend Pages & Routes

### Public Routes (with Navbar)
| Path | Page | Description |
|---|---|---|
| `/` | Home | Landing page |
| `/login` | Login | Login form |
| `/register` | Register | Registration form with role selector |
| `/unauthorized` | Unauthorized | 403 access denied |
| `*` | NotFound | 404 page |

### Protected Routes (with Sidebar + Header)

**Admin Routes** (role: admin)
| Path | Page | Description |
|---|---|---|
| `/admin/dashboard` | AdminDashboard | Stats + quick actions |
| `/admin/manage-doctors` | ManageDoctors | Doctor list with activate/deactivate |
| `/admin/manage-receptionists` | ManageReceptionists | Receptionist list with activate/deactivate |
| `/admin/patients` | PatientList | All patients table |
| `/admin/patients/:id` | PatientProfile | Single patient detail |
| `/admin/appointments` | AppointmentList | All appointments table |
| `/admin/system-stats` | SystemStats | System analytics |

**Doctor Routes** (roles: admin, doctor)
| Path | Page | Description |
|---|---|---|
| `/doctor/dashboard` | DoctorDashboard | Stats + quick actions |
| `/doctor/appointments` | AppointmentList | Doctor's appointments |
| `/doctor/patients` | PatientList | Patient list |
| `/doctor/patients/:id` | PatientProfile | Patient detail |

**Receptionist Routes** (roles: admin, receptionist)
| Path | Page | Description |
|---|---|---|
| `/receptionist/dashboard` | ReceptionistDashboard | Stats + quick actions |
| `/receptionist/register-patient` | RegisterPatient | Patient registration form |
| `/receptionist/patients` | PatientList | Patient list |
| `/receptionist/patients/:id` | PatientProfile | Patient detail |
| `/receptionist/book-appointment` | BookAppointment | Appointment booking form |
| `/receptionist/appointments` | AppointmentList | All appointments |

**Patient Routes** (roles: admin, patient)
| Path | Page | Description |
|---|---|---|
| `/patient/dashboard` | PatientDashboard | Stats + quick actions |
| `/patient/book-appointment` | BookAppointment | Self-book appointment |
| `/patient/appointments` | MyAppointments | Own appointments (card view) |
| `/patient/profile` | MyProfile | Own patient profile |

---

## 10. Database Models

### User Model
```
Collection: users
Fields:
  - name          String (required, max 100)
  - email         String (required, unique, lowercase)
  - password      String (required, min 6, bcrypt hashed, select: false)
  - role          String (enum: admin/doctor/receptionist/patient, default: patient)
  - subscriptionPlan  String (enum: free/pro, default: free)
  - isActive      Boolean (default: true)
  - createdAt     Date (auto)
  - updatedAt     Date (auto)
```

### Patient Model
```
Collection: patients
Fields:
  - name          String (required, max 100)
  - age           Number (required, 0-150)
  - gender        String (required, enum: male/female/other)
  - contact       String (required, regex validated)
  - email         String (optional, lowercase)
  - userId        ObjectId -> User (optional, links to login account)
  - createdBy     ObjectId -> User (required, who registered this patient)
  - createdAt     Date (auto)
  - updatedAt     Date (auto)

Indexes: text(name), createdBy(1), userId(1)
```

### Appointment Model
```
Collection: appointments
Fields:
  - patientId     ObjectId -> Patient (required)
  - doctorId      ObjectId -> User (required)
  - date          Date (required)
  - reason        String (optional, max 500)
  - status        String (enum: pending/confirmed/completed/cancelled, default: pending)
  - createdBy     ObjectId -> User (required)
  - createdAt     Date (auto)
  - updatedAt     Date (auto)

Indexes: {doctorId, date}(1), patientId(1), status(1)
```

---

## 11. How to Test the Project

### Step-by-Step Testing Guide

#### Test 1: Health Check
```bash
curl http://localhost:5000/api/v1/health
```
Expected: `200 OK` with `"Server is healthy"`

#### Test 2: Register an Admin User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@clinic.com",
    "password": "admin123",
    "role": "admin"
  }'
```
Save the `token` from the response.

#### Test 3: Register a Doctor
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Ahmed Khan",
    "email": "dr.ahmed@clinic.com",
    "password": "doctor123",
    "role": "doctor"
  }'
```

#### Test 4: Register a Receptionist
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sara Reception",
    "email": "sara@clinic.com",
    "password": "recep123",
    "role": "receptionist"
  }'
```

#### Test 5: Login as Receptionist
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sara@clinic.com",
    "password": "recep123"
  }'
```
Save the `token`.

#### Test 6: Register a Patient (as Receptionist, with login account)
```bash
curl -X POST http://localhost:5000/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <receptionist_token>" \
  -d '{
    "name": "Ali Patient",
    "age": 28,
    "gender": "male",
    "contact": "+92 300 1111111",
    "email": "ali@patient.com",
    "password": "patient123"
  }'
```
This creates both a Patient record AND a User account (role=patient).

#### Test 7: Login as Patient
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ali@patient.com",
    "password": "patient123"
  }'
```

#### Test 8: Patient Views Own Profile
```bash
curl http://localhost:5000/api/v1/patients/my-profile \
  -H "Authorization: Bearer <patient_token>"
```

#### Test 9: Book Appointment (as Receptionist)
```bash
curl -X POST http://localhost:5000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <receptionist_token>" \
  -d '{
    "patientId": "<patient_id>",
    "doctorId": "<doctor_user_id>",
    "date": "2026-03-15T10:30:00.000Z",
    "reason": "General checkup"
  }'
```

#### Test 10: Patient Self-Books Appointment
```bash
curl -X POST http://localhost:5000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <patient_token>" \
  -d '{
    "doctorId": "<doctor_user_id>",
    "date": "2026-03-20T14:00:00.000Z",
    "reason": "Follow-up"
  }'
```
Note: Patient does NOT need to send `patientId` - it is auto-resolved from their account.

#### Test 11: Doctor Updates Appointment Status
```bash
curl -X PUT http://localhost:5000/api/v1/appointments/<appointment_id>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <doctor_token>" \
  -d '{ "status": "confirmed" }'
```

#### Test 12: Check Dashboard Stats
```bash
curl http://localhost:5000/api/v1/stats \
  -H "Authorization: Bearer <admin_token>"
```

#### Test 13: Admin Lists All Doctors
```bash
curl "http://localhost:5000/api/v1/admin/users?role=doctor" \
  -H "Authorization: Bearer <admin_token>"
```

#### Test 14: Admin Deactivates a Doctor
```bash
curl -X PUT http://localhost:5000/api/v1/admin/users/<doctor_user_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{ "isActive": false }'
```

### Frontend Testing (Browser)

1. Open `http://localhost:5173`
2. Click **Register** and create accounts for each role
3. **Login as Receptionist** -> Register patients, book appointments
4. **Login as Doctor** -> View appointments, change status (pending -> confirmed -> completed)
5. **Login as Patient** -> View profile, book appointment, see own appointments
6. **Login as Admin** -> View stats, manage doctors/receptionists, view all data

---

## 12. Complete User Workflow Guide

### Workflow 1: Full Clinic Day

```
1. ADMIN registers the system
   |-- Creates admin account via /register
   |-- Views dashboard with live stats
   |-- Manages doctor/receptionist accounts

2. RECEPTIONIST starts the day
   |-- Logs in -> sees today's appointments count
   |-- Registers walk-in patient (with optional login account)
   |-- Books appointments for patients with available doctors
   |-- Views all appointments list

3. DOCTOR checks schedule
   |-- Logs in -> sees today's appointments + pending count
   |-- Views appointment list (filtered to own appointments only)
   |-- Confirms pending appointments (pending -> confirmed)
   |-- Completes appointments after consultation (confirmed -> completed)
   |-- Views patient records

4. PATIENT accesses portal
   |-- Logs in with account created by receptionist
   |-- Views own dashboard with upcoming visits count
   |-- Books new appointment (selects doctor + date)
   |-- Views own appointment history
   |-- Views own profile information
```

### Workflow 2: Patient Registration Flow

```
Receptionist fills "Register Patient" form:
  |
  |-- Basic info only (name, age, gender, contact)
  |   -> Creates Patient record only
  |   -> Patient CANNOT login (no user account)
  |
  |-- With email + password
      -> Creates Patient record + User account (role=patient)
      -> Patient CAN login and access patient dashboard
      -> Patient is linked via userId field
```

### Workflow 3: Appointment Lifecycle

```
Created (status: pending)
  |
  |-- Doctor/Admin confirms -> status: confirmed
  |-- Doctor/Admin/Anyone cancels -> status: cancelled (terminal)
  |
Confirmed
  |
  |-- Doctor/Admin completes -> status: completed (terminal)
  |-- Doctor/Admin cancels -> status: cancelled (terminal)
```

---

## 13. Appointment Status Transitions

```
   +----------+
   | pending  |
   +----+-----+
        |
   +----+------+----------+
   |                       |
   v                       v
+----------+         +-----------+
| confirmed|         | cancelled |
+----+-----+         +-----------+
     |                (TERMINAL)
+----+------+----------+
|                       |
v                       v
+-----------+     +-----------+
| completed |     | cancelled |
+-----------+     +-----------+
 (TERMINAL)        (TERMINAL)
```

**Valid Transitions:**
| From | To | Who Can Do It |
|---|---|---|
| pending | confirmed | Doctor (own), Admin |
| pending | cancelled | Doctor (own), Admin |
| confirmed | completed | Doctor (own), Admin |
| confirmed | cancelled | Doctor (own), Admin |

**Invalid Transitions (blocked by backend):**
- completed -> anything
- cancelled -> anything
- pending -> completed (must confirm first)
- confirmed -> pending (cannot go backwards)

---

## 14. Architecture & Design Patterns

### Backend Architecture

```
Request -> Express Middleware Stack:
  1. CORS
  2. JSON body parser
  3. Morgan logger (dev only)
  4. Route matching
     |-- protect middleware (JWT verification)
     |-- authorize middleware (role check)
     |-- validate middleware (input validation)
     |-- Controller (business logic)
         |-- Model (database operations)
         |-- ApiResponse (standardized response)
  5. Error Handler (catches all thrown errors)
```

**Key Patterns:**
- **asyncHandler**: Wraps async route handlers to catch rejected promises
- **ApiError**: Custom error class with HTTP status codes and factory methods
- **ApiResponse**: Standardized `{ status, message, data }` format for all responses
- **Role-based scoping**: Controllers filter data based on `req.user.role`
- **Populate**: Mongoose populate for relational data (patientId, doctorId, createdBy)

### Frontend Architecture

```
App.jsx
  |-- AuthContext.Provider (global auth state)
  |-- BrowserRouter
      |-- AppRoutes
          |-- MainLayout (public pages)
          |   |-- Navbar
          |   |-- <Outlet /> (Home, Login, Register, etc.)
          |
          |-- ProtectedRoute -> Dashboard (role redirect)
          |
          |-- RoleRoute (role check)
              |-- DashboardLayout
                  |-- Sidebar (role-based menus)
                  |-- DashboardHeader
                  |-- <Outlet /> (role-specific pages)
```

**Key Patterns:**
- **AuthContext**: Global auth state with localStorage persistence
- **Axios Interceptors**: Auto-attach JWT token, auto-redirect on 401
- **RoleRoute**: Component-level role-based route protection
- **Shared Pages**: PatientList, AppointmentList reused across roles with role-aware rendering
- **Role-scoped API**: Same API endpoints return different data based on user role

### Authentication Flow

```
1. User submits login form
2. POST /auth/login -> returns { user, token }
3. AuthContext.login() saves user + token to localStorage
4. Axios interceptor auto-attaches token to all future requests
5. On app load, AuthContext checks localStorage + calls GET /auth/me to validate
6. On 401 response, interceptor clears token and redirects to /login
```

---

## 15. Troubleshooting

### Common Issues

**Issue: "EADDRINUSE: address already in use :::5000"**
```bash
# Kill the process using port 5000
npx kill-port 5000
# Then restart the server
cd backend && npm run dev
```

**Issue: MongoDB SRV DNS resolution fails (ECONNREFUSED)**
- Some networks block SRV DNS lookups
- The project uses Google DNS (`8.8.8.8`) in `db.js` as a workaround
- If still failing, use a direct `mongodb://` connection string instead of `mongodb+srv://`

**Issue: "Email already registered" when registering patient**
- The email provided for the patient already exists in the Users collection
- Either use a different email or skip email/password to create patient without login

**Issue: "Cannot change status from X to Y"**
- Appointment status transitions are enforced
- Only valid transitions: pending->confirmed, pending->cancelled, confirmed->completed, confirmed->cancelled
- Terminal statuses (completed/cancelled) cannot be changed

**Issue: Patient sees "Profile Not Linked"**
- The patient registered via `/auth/register` directly (not through receptionist)
- A receptionist must register the patient via `/patients` with matching email to link accounts

**Issue: CORS error in browser**
- Ensure `CORS_ORIGIN` in `backend/.env` matches your frontend URL exactly
- Default: `http://localhost:5173`

**Issue: Frontend shows blank page after login**
- Check browser console for errors
- Ensure the backend is running on port 5000
- Ensure `VITE_API_BASE_URL` in `frontend/.env` is correct

---

## Quick Reference Card

| Action | URL | Method |
|---|---|---|
| Start backend | `cd backend && npm run dev` | Terminal |
| Start frontend | `cd frontend && npm run dev` | Terminal |
| Open app | `http://localhost:5173` | Browser |
| Health check | `http://localhost:5000/api/v1/health` | GET |
| API docs base | `http://localhost:5000/api/v1` | - |
| Admin dashboard | `http://localhost:5173/admin/dashboard` | Browser |
| Doctor dashboard | `http://localhost:5173/doctor/dashboard` | Browser |
| Receptionist dashboard | `http://localhost:5173/receptionist/dashboard` | Browser |
| Patient dashboard | `http://localhost:5173/patient/dashboard` | Browser |
