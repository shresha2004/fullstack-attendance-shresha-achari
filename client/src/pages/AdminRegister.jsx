import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredAdminId, setRegisteredAdminId] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const ADMIN_SECRET = import.meta.env.VITE_ADMIN_KEY;

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !adminKey) {
      toast.error("Please fill all fields");
      return;
    }

    if (adminKey !== ADMIN_SECRET) {
      toast.error("Invalid Admin Key");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "admin",
      });

      setRegisteredAdminId(res.data.user.employeeId);
      login(res.data);
      toast.success("Admin registration successful!");

      // Navigate after 3 seconds to let user copy the ID
      setTimeout(() => {
        navigate("/admin");
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registeredAdminId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (registeredAdminId) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
        {/* Modal Popup */}
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
            <div className="text-center">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
              
              <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-200 mt-6">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2 font-semibold">Admin Name</p>
                <p className="text-lg font-semibold text-gray-900 mb-4">{name}</p>
                
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2 font-semibold">Admin ID</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-2xl font-bold text-red-700">{registeredAdminId}</p>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-1 whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copiedId ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 text-center">Redirecting to dashboard in 3 seconds...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-red-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Registration</h2>
          <p className="text-sm text-gray-600 mt-2">Create your admin account</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Admin Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="admin@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Key</label>
            <input
              type="password"
              placeholder="Enter admin key"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="text-white" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/admin/login" className="text-red-600 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;
