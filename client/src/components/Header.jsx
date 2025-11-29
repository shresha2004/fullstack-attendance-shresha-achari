import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
 
  const hideHeaderRoutes = ['/admin/login', '/admin/register', '/employee/login', '/employee/register'];
  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    if (user?.role === 'admin') {
      navigate('/admin/login');
    } else if (user?.role === 'employee') {
      navigate('/employee/login');
    } else {
      navigate('/');
    }
    toast.success('Logged out successfully');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'employee' ? '/employee' : '/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" /><path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2V2a1 1 0 112 0v1h1a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v1a2 2 0 01-2 2h-1v1a1 1 0 11-2 0v-1h-2v1a1 1 0 11-2 0v-1H7v1a1 1 0 11-2 0v-1H4a2 2 0 01-2-2v-1H1a1 1 0 110-2h1v-2H1a1 1 0 010-2h1V9H1a1 1 0 110-2h1V6a2 2 0 012-2h1V2a1 1 0 010-2zm12 2v12H1V4h18z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">UCUBE.AI</h1>
              <p className="text-xs text-gray-500">Attendance System</p>
            </div>
          </div>

          {/* User Info and Logout */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.employeeId}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition hidden sm:block"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
