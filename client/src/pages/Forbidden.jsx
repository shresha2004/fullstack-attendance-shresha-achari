import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Forbidden = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'employee') {
      navigate('/employee');
    } else {
      navigate('/');
    }
  };

  const handleLogin = () => {
    if (user?.role === 'admin') {
      navigate('/admin/login');
    } else if (user?.role === 'employee') {
      navigate('/employee/login');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-2xl opacity-30"></div>
            <div className="relative bg-white rounded-full w-32 h-32 flex items-center justify-center border-4 border-red-200">
              <span className="text-6xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                404
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-gray-500 mb-8">
          This URL might be incorrect or the page may have been moved.
        </p>

        {/* Error Details */}
        <div className="p-6 bg-white rounded-2xl border-2 border-red-200 mb-8 inline-block">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-sm font-semibold text-gray-700">Invalid Route</p>
          </div>
          <p className="text-xs text-gray-600">
            This page is either forbidden or doesn't exist in the system.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleGoHome}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:shadow-lg transition"
          >
            {user ? (user.role === 'admin' ? 'Go to Admin Dashboard' : 'Go to Employee Dashboard') : 'Go to Home'}
          </button>

          {!user && (
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-50 transition"
            >
              Return to Home
            </button>
          )}

          {user && (
            <button
              onClick={handleLogin}
              className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-50 transition"
            >
              Login Page
            </button>
          )}
        </div>

        {/* Info Card */}
        <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-left">
          <h3 className="font-bold text-gray-900 mb-2">Helpful Tips:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Check if the URL is correct and try again</li>
            <li>✓ Use the navigation menu to find what you're looking for</li>
            <li>✓ Make sure you have the required permissions</li>
            <li>✓ Contact support if you think this is an error</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
