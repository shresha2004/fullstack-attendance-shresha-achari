import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Hide navbar on auth pages
  const hideNavbarRoutes = ['/', '/login', '/register', '/admin/login', '/admin/register', '/employee/login', '/employee/register'];
  if (hideNavbarRoutes.includes(location.pathname) || !user) {
    return null;
  }

  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Attendance', path: '/admin/attendance', icon: '📋' },
  ];

  const employeeMenuItems = [
    { label: 'Dashboard', path: '/employee', icon: '📊' },
    { label: 'Attendance', path: '/employee/attendance', icon: '📋' },
  ];

  const menuItems = isAdminRoute ? adminMenuItems : employeeMenuItems;

  return (
    <nav className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`py-4 px-4 font-medium text-sm border-b-2 transition ${
                location.pathname === item.path
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
