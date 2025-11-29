import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeRegister from './pages/EmployeeRegister';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeLeaves from './pages/EmployeeLeaves';
import AdminLeaves from './pages/AdminLeaves';
import EmployeeAttendance from './pages/EmployeeAttendance';
import AdminAttendance from './pages/AdminAttendance';
import Forbidden from './pages/Forbidden';

const toastConfig = {
  position: 'top-right',
  reverseOrder: false,
  toastOptions: {
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
      borderRadius: '12px'
    },
    success: {
      style: { background: '#10b981' },
      iconTheme: { primary: '#fff', secondary: '#10b981' }
    },
    error: {
      style: { background: '#ef4444' },
      iconTheme: { primary: '#fff', secondary: '#ef4444' }
    }
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Toaster {...toastConfig} />
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Navbar />
        <main className="flex-grow">
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
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeLeaves />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/attendance"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
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
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLeaves />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/attendance"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAttendance />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Forbidden />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  </AuthProvider>
);
