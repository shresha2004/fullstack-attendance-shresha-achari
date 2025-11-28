// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';


import LandingPage from "./pages/LandingPage";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeRegister from "./pages/EmployeeRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import ProtectedRoute from './routes/ProtectedRoute';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeLeaves from './pages/EmployeeLeaves';
import AdminLeaves from './pages/AdminLeaves';
import EmployeeAttendance from './pages/EmployeeAttendance';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>

       <Route path="/" element={<LandingPage />} />

<Route path="/employee/login" element={<EmployeeLogin />} />
<Route path="/employee/register" element={<EmployeeRegister />} />

<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/register" element={<AdminRegister />} />


       

        
    
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/leaves"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeLeaves />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/attendance"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLeaves />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
