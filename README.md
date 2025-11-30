# 📊 UCUBE.AI - Attendance Management System

> A modern, full-stack attendance and leave management system built with React, Node.js, Express, and MongoDB.

## 📑 Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [Database Schema](#-database-schema)
3. [Screenshots](#-screenshots)
4. [Prerequisites](#-prerequisites)
5. [Installation](#-installation)
6. [Docker Setup](#-docker-setup)
7. [Environment Variables](#-environment-variables)
8. [API Documentation](#-api-documentation)
9. [Running the Application](#-running-the-application)
10. [Features](#-features)
11. [Tech Stack](#-tech-stack)
12. [Project Structure](#-project-structure)


---

## 🏗️ Architecture Overview

Below is the  architecture of the UCUBE.AI Attendance System:


![WhatsApp Image 2025-11-29 at 21 01 31_f47f28c2](https://github.com/user-attachments/assets/590b101b-69be-4d4b-8de8-4cc57aee841e)


### Architecture Components:
- **Frontend**: React + Vite running on port 5173
- **Backend**: Express.js API server running on port 5000
- **Database**: MongoDB Atlas for data persistence
- **Authentication**: JWT (JSON Web Tokens)

---

## 📦 Database Schema

### Database Relationship Diagram


![WhatsApp Image 2025-11-29 at 21 01 31_5adbc3dc](https://github.com/user-attachments/assets/b9e00821-b648-40b5-8013-1b2cdf6b27d4)



## Deployed link
```
https://fullstack-attendance-shresha-achari.vercel.app
```
### Core Collections:

#### **Users Collection**
- Stores admin and employee information
- Auto-generated employee IDs (UCUBE-XXXX format)
- Password hashing with bcryptjs
- JWT authentication support

#### **Attendance Collection**
- Records clock-in and clock-out times
- UTC timestamp tracking
- Unique constraint on user + date

#### **Leaves Collection**
- Leave applications with status (Pending/Approved/Rejected)
- 5-day per month limit with validation
- Pending + Approved leaves counting

---

## 📸 Screenshots

### 1. Landing Page

<img width="1900" height="910" alt="image" src="https://github.com/user-attachments/assets/335552fb-01bf-4262-935e-bac3020fa92b" />


Clean entry point with employee and admin login/register options with animated background.

### 2. Employee Dashboard

<img width="1898" height="909" alt="image" src="https://github.com/user-attachments/assets/79688d28-47b2-4737-b53c-f2b7e9877ab3" />


Main hub showing today's clock-in/out status, monthly statistics, and leave balance.

### 3. Admin Dashboard

<img width="1899" height="909" alt="image" src="https://github.com/user-attachments/assets/59b891e5-11a1-4bdc-a7b2-51718b96d952" />


Overview of absent employees today, pending leave applications, and employee management.

### 4. Employee Login Modal

<img width="1900" height="914" alt="image" src="https://github.com/user-attachments/assets/463753e5-f740-4e08-a03d-32099c894951" />


Secure login with email/employee ID and password authentication.

### 5. Admin Login Modal

<img width="1900" height="910" alt="image" src="https://github.com/user-attachments/assets/3a659d7f-f99d-43de-923c-90d50f3cb4f5" />

Admin-only login portal with role-based access control.

### 6. Employee Registration

<img width="1901" height="910" alt="image" src="https://github.com/user-attachments/assets/45dad617-634c-4ed1-880a-a45a4d97d455" />


Employee account creation with employee key verification.

### 7. Admin Registration

<img width="1902" height="907" alt="image" src="https://github.com/user-attachments/assets/c8db6884-03b0-4154-8dfc-cd4bec00547b" />


Admin account creation with admin key verification.

### 8. Attendance Page (Employee)

<img width="1897" height="911" alt="image" src="https://github.com/user-attachments/assets/4d7a26f4-5c53-4dc2-bcff-94f63a1c0dd2" />


Monthly attendance records with filterable clock-in/out logs.

### 9. Attendance Page (Admin)

<img width="1902" height="909" alt="image" src="https://github.com/user-attachments/assets/7ab01255-0515-4255-b8f3-fd75b357bcbc" />


View all employees' attendance, search by employee, filter by date range.

### 10. Leave Application (Employee)

<img width="1896" height="905" alt="image" src="https://github.com/user-attachments/assets/f0f9c779-ecda-41f3-83b3-a5485a7da022" />


Apply for leave with date range and reason, real-time leave balance display.

### 11. Leave Management (Admin)

<img width="1899" height="912" alt="image" src="https://github.com/user-attachments/assets/a2ea9926-efdc-4fd3-b6b3-9ce030945d34" />


View pending leaves with approve/reject functionality and detailed leave history.

### 12. Employee Leave History

<img width="1898" height="902" alt="image" src="https://github.com/user-attachments/assets/1d405248-f913-419b-810a-569530e9e74e" />


Personal leave history with status tracking (Pending/Approved/Rejected).

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software:
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **MongoDB**: Local or MongoDB Atlas account
- **Git**: For version control

### Accounts Needed:
- **MongoDB Atlas**: Free tier account for database hosting
- **GitHub**: Optional, for version control

### System Requirements:
- **RAM**: Minimum 4GB
- **Storage**: Minimum 500MB free space
- **Operating System**: Windows, macOS, or Linux

### Verify Installation:
```bash
node --version    # Should show v16.0.0 or higher
npm --version     # Should show v7.0.0 or higher
git --version     # Should show git version
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/shresha2004/fullstack-attendance-shresha-achari.git
cd fullstack-attendance-shresha-achari
```

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Verify installation
npm list
```

**Backend Dependencies:**
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: Authentication
- bcryptjs: Password hashing
- cors: Cross-origin resource sharing
- dotenv: Environment variables

### Step 3: Frontend Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install

# Verify installation
npm list
```

**Frontend Dependencies:**
- react: UI library
- react-router-dom: Client-side routing
- axios: HTTP client
- react-hot-toast: Notifications
- tailwindcss: CSS framework
- vite: Build tool

### Step 4: Database Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster
4. Add IP address to whitelist (0.0.0.0/0 for development)
5. Create a database user with password
6. Get the connection string (URI)

---

## 🐳 Docker Setup

### Prerequisites for Docker
- **Docker**: v20.0 or higher
- **Docker Compose**: v1.29 or higher

### Running with Docker

#### Build and Run
```bash
# From root directory
docker-compose up --build
```

This will:
- Build the frontend image
- Build the backend image
- Start MongoDB container
- Start all services on their respective ports

#### Containers
- **Frontend**: Running on port 3000
- **Backend**: Running on port 5000
- **MongoDB**: Running on port 27017

#### Docker Compose Configuration
```yaml
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=attendance_db

  backend:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGO_URI=mongodb://mongodb:27017/attendance_db

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

---

## 🔐 OTP Verification Feature

### Email OTP Verification
The application implements **OTP (One-Time Password) verification** via email for enhanced security.

#### Implementation Details:
- **Service**: EmailJS for email delivery
- **Frontend**: React handles OTP sending and verification
- **Security**: Time-limited OTP codes sent to user email

#### Environment Variables Required (client/.env)
```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

#### How It Works:
1. User initiates action requiring OTP
2. EmailJS sends OTP code to user's email
3. User receives OTP in inbox
4. User enters OTP in verification modal
5. OTP is validated and action is completed

#### EmailJS Setup:
1. Create account at [EmailJS](https://www.emailjs.com)
2. Create email service
3. Create email template
4. Get Service ID, Template ID, and Public Key
5. Add to frontend `.env` file

---

### Backend Environment Variables (server/.env)

```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables (client/.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# EmailJS Configuration (OTP Verification)
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Auth Keys
VITE_EMPLOYEE_KEY=employ@UCUBE
VITE_ADMIN_KEY=admin@UCUBE
```

### Environment Variables Description:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-min-32-chars` |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d`, `24h` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment type | `development`, `production` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `VITE_API_URL` | Backend API endpoint | `http://localhost:5000/api` |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID for OTP | `service_xxxxx` |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID for emails | `template_xxxxx` |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | `your_public_key` |
| `VITE_EMPLOYEE_KEY` | Employee registration key | `employ@UCUBE` |
| `VITE_ADMIN_KEY` | Admin registration key | `admin@UCUBE` |

---

## 📡 API Documentation

### Base URL
```
Local: http://localhost:5000/api
Production: https://your-backend.vercel.app/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### API Endpoints

#### **Authentication Routes** (`/api/auth`)

| Method | Endpoint | Description | Body | Status |
|--------|----------|-------------|------|--------|
| POST | `/register` | Register new user | `{name, email, password, role}` | 201 |
| POST | `/login` | User login | `{emailOrId, password}` | 200 |

**Register Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "employee"
  }'
```

**Login Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrId": "john@example.com",
    "password": "password123"
  }'
```

---

#### **Attendance Routes** (`/api/attendance`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| POST | `/clock-in` | Clock in for work | Required | 201 |
| POST | `/clock-out` | Clock out from work | Required | 200 |
| GET | `/me` | Get own attendance | Required | 200 |
| GET | `/` | Get all attendance (Admin) | Admin | 200 |
| GET | `/employees` | Get all employees (Admin) | Admin | 200 |

**Clock In Example:**
```bash
curl -X POST http://localhost:5000/api/attendance/clock-in \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

**Get My Attendance:**
```bash
curl -X GET "http://localhost:5000/api/attendance/me?month=11&year=2025" \
  -H "Authorization: Bearer <token>"
```

---

#### **Leave Routes** (`/api/leaves`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| POST | `/` | Apply for leave | Required | 201 |
| GET | `/me` | Get own leaves | Required | 200 |
| GET | `/` | Get all leaves (Admin) | Admin | 200 |
| PATCH | `/:id/status` | Update leave status (Admin) | Admin | 200 |

**Apply Leave Example:**
```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-12-01",
    "endDate": "2025-12-03",
    "reason": "Personal work"
  }'
```

---

#### **Statistics Routes** (`/api/stats`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| GET | `/me` | Get employee stats | Required | 200 |
| GET | `/admin` | Get admin stats | Admin | 200 |

**Get Employee Stats:**
```bash
curl -X GET http://localhost:5000/api/stats/me \
  -H "Authorization: Bearer <token>"
```

---

#### **Debug Routes** (`/api/debug`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| GET | `/me` | Debug user info | Required | 200 |

---

## 🎯 Running the Application

### Local Development

#### Terminal 1: Start Backend
```bash
cd server
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

#### Terminal 2: Start Frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### Using Docker Compose
```bash
# From root directory
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

### Production Build

#### Build Frontend
```bash
cd client
npm run build
# Creates dist/ folder
```

#### Build Backend
```bash
cd server
npm start
# Runs on configured PORT
```

---

## ✨ Features

### Employee Features
- ✅ **Clock In/Out**: Real-time attendance tracking
- ✅ **Attendance History**: View monthly attendance records
- ✅ **Leave Application**: Apply for leaves with validation
- ✅ **Leave Balance**: Real-time leave balance tracking (5 days/month limit)
- ✅ **Leave History**: View approved, pending, and rejected leaves
- ✅ **Dashboard**: Personal statistics and quick actions
- ✅ **Profile**: View employee ID and personal information

### Admin Features
- ✅ **Dashboard**: Overview of absent employees and pending leaves
- ✅ **Employee Management**: View all employees
- ✅ **Attendance Tracking**: Monitor all employee attendance
- ✅ **Leave Approval**: Approve or reject leave applications
- ✅ **Statistics**: Monthly attendance and leave statistics
- ✅ **Filter & Search**: Advanced filtering by employee, date range

### General Features
- ✅ **Authentication**: Secure JWT-based authentication
- ✅ **Role-Based Access**: Employee and Admin roles
- ✅ **OTP Verification**: Email-based OTP for security
- ✅ **Input Validation**: Zod schema validation
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **Responsive Design**: Works on all devices
- ✅ **Notifications**: Toast notifications for user feedback
- ✅ **Dark Mode Support**: Dark theme compatibility
- ✅ **Docker Support**: Containerized deployment

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2
- **Build Tool**: Vite 7.2
- **Routing**: React Router DOM 7.9
- **HTTP Client**: Axios 1.13
- **Styling**: Tailwind CSS 4.1
- **UI Components**: React Hot Toast 2.6
- **Animations**: Vanta.js

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **Validation**: Zod
- **CORS**: Express CORS middleware
- **Environment**: dotenv

### DevOps & Deployment
- **Version Control**: Git & GitHub
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Vercel 
- **Database**: MongoDB Atlas

---

## 📁 Project Structure

```
fullstack-attendance-shresha-achari/
│
├── client/                          # React Frontend
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── EmployeeLeaves.jsx
│   │   │   ├── AdminLeaves.jsx
│   │   │   ├── EmployeeAttendance.jsx
│   │   │   └── AdminAttendance.jsx
│   │   ├── components/              # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── Modals/
│   │   ├── context/                 # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── routes/                  # Route components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── api/                     # API configuration
│   │   │   └── axiosClient.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Express Backend
│   ├── app.js                       # Main entry point
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/                 # Route handlers
│   │   ├── authController.js
│   │   ├── attendanceController.js
│   │   ├── leaveController.js
│   │   ├── statsController.js
│   │   └── debugController.js
│   ├── middleware/                  # Express middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   └── Leave.js
│   ├── routes/                      # Route definitions
│   │   ├── authRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── statsRoutes.js
│   │   └── debugRoutes.js
│   ├── utils/                       # Utility functions
│   │   └── generateToken.js
│   ├── views/                       # EJS templates
│   │   └── index.ejs
│   ├── public/                      # Static files
│   │   └── favicon.ico
│   ├── vercel.json                  # Vercel config
│   ├── .env                         # Environment variables
│   └── package.json
│
└── README.md                        # This file
```

---

## 🔐 Security Features

- ✅ **Password Hashing**: bcryptjs with salt rounds
- ✅ **JWT Tokens**: Secure token-based authentication
- ✅ **CORS Configuration**: Restricted origin access
- ✅ **MongoDB Injection Prevention**: Mongoose parameterized queries
- ✅ **Error Handling**: No sensitive data in error messages
- ✅ **Environment Variables**: Secrets not hardcoded

---

## 📊 Database Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  employeeId: String (auto-generated: UCUBE-XXXX),
  role: String (enum: ['admin', 'employee']),
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Schema
```javascript
{
  user: ObjectId (ref: User),
  date: Date (UTC),
  clockInTime: Date,
  clockOutTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Leave Schema
```javascript
{
  user: ObjectId (ref: User),
  startDate: Date,
  endDate: Date,
  reason: String,
  status: String (enum: ['Pending', 'Approved', 'Rejected']),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: The `uri` parameter to `openUri()` must be a string
```
**Solution**: Check your `.env` file has correct `MONGO_URI`

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: Ensure `CLIENT_URL` in backend `.env` matches frontend domain

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process or change PORT in `.env`

### Token Expired
```
Error: Not authorized, token failed
```
**Solution**: Login again to refresh token

---

## 📈 Future Enhancements

- [ ] Email notifications for leave approvals
- [ ] Real-time notifications with Socket.io
- [ ] Geolocation-based attendance
- [ ] Biometric integration
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Two-factor authentication
- [ ] Automated leave carry-over
- [ ] Performance metrics dashboard
