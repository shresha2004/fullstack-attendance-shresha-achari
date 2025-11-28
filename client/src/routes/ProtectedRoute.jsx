import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) {
    // If route is for admin, send to admin login, else to employee login
    if (allowedRoles && allowedRoles.includes('admin')) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/employee/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
