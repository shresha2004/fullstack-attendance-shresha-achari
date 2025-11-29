import { useState, useEffect, useRef } from "react";
import EmployeeLoginModal from "../components/EmployeeLoginModal";
import EmployeeRegisterModal from "../components/EmployeeRegisterModal";
import AdminLoginModal from "../components/AdminLoginModal";
import AdminRegisterModal from "../components/AdminRegisterModal";

const LandingPage = () => {
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);
  const [showEmployeeRegister, setShowEmployeeRegister] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (vantaRef.current && window.VANTA) {
      window.VANTA.BIRDS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        backgroundColor: 0xf8f9fa,
        color1: 0x2563eb,
        color2: 0x1e40af,
        birdSize: 1.5,
        wingSpan: 30,
        quantity: 5,
      });
    }

    return () => {};
  }, []);

  return (
    <div ref={vantaRef} className="min-h-screen flex flex-col relative">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col justify-center items-center px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" />
                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2V2a1 1 0 112 0v1h1a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v1a2 2 0 01-2 2h-1v1a1 1 0 11-2 0v-1h-2v1a1 1 0 11-2 0v-1H7v1a1 1 0 11-2 0v-1H4a2 2 0 01-2-2v-1H1a1 1 0 110-2h1v-2H1a1 1 0 010-2h1V9H1a1 1 0 110-2h1V6a2 2 0 012-2h1V2a1 1 0 010-2zm12 2v12H1V4h18z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            UCUBE.AI
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-semibold">
            Employee Attendance System
          </p>

          <p className="text-gray-600 mb-12 text-lg max-w-2xl mx-auto leading-relaxed">
            Streamline workforce management with our modern attendance platform. Track attendance, manage leave requests, and optimize employee management with ease.
          </p>

          {/* 🔥 LOGIN + REGISTER MOVED UP */}
          <div className="space-y-6 mb-12">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Access</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowEmployeeLogin(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:shadow-lg transition"
                >
                  🔐 Employee Login
                </button>

                <button
                  onClick={() => setShowEmployeeRegister(true)}
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
                >
                  ✍️ Employee Register
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Administrator Access</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition"
                >
                  🔐 Admin Login
                </button>

                <button
                  onClick={() => setShowAdminRegister(true)}
                  className="px-8 py-4 border-2 border-red-600 text-red-600 rounded-lg font-bold text-lg hover:bg-red-50 transition"
                >
                  ✍️ Admin Register
                </button>
              </div>
            </div>
          </div>

          {/* 🔽 FEATURES MOVED DOWN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-2">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-2">⏰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-sm text-gray-600">Accurate clock in/out tracking</p>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-semibold text-gray-900 mb-2">Leave Management</h3>
              <p className="text-sm text-gray-600">Seamless leave approval process</p>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Detailed attendance reports</p>
            </div>
          </div>

          {/* MODALS */}
          <EmployeeLoginModal isOpen={showEmployeeLogin} onClose={() => setShowEmployeeLogin(false)} />
          <EmployeeRegisterModal isOpen={showEmployeeRegister} onClose={() => setShowEmployeeRegister(false)} />
          <AdminLoginModal isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} />
          <AdminRegisterModal isOpen={showAdminRegister} onClose={() => setShowAdminRegister(false)} />

          {/* Info Section */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-8">Why Choose UCUBE.AI?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-gray-900 font-medium">Easy to Use</p>
                <p className="text-sm text-gray-600">Intuitive interface for all users</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="text-2xl mb-2">🔒</div>
                <p className="text-gray-900 font-medium">Secure</p>
                <p className="text-sm text-gray-600">Enterprise-grade security</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-gray-900 font-medium">Fast</p>
                <p className="text-sm text-gray-600">Quick deployment & response</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="text-2xl mb-2">📈</div>
                <p className="text-gray-900 font-medium">Scalable</p>
                <p className="text-sm text-gray-600">Grows with your business</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
