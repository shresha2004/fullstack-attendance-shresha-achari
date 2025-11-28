import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!emailOrId || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { emailOrId, password });
      if (res.data.user.role !== "admin") {
        toast.error("Not an admin account");
        setLoading(false);
        return;
      }

      login(res.data);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-20 flex items-center justify-center z-50 p-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-block p-3 bg-red-100 rounded-full mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m6 2a2 2 0 11-4 0m-6 0a2 2 0 11-4 0m3 2v10a1 1 0 01-1 1H7a1 1 0 01-1-1V8m6 0a1 1 0 011-1h2a1 1 0 011 1v10a1 1 0 01-1 1h-2a1 1 0 01-1-1V8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-sm text-gray-600 mt-2">Manage your system</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email or Admin ID</label>
            <input
              type="text"
              placeholder="admin@example.com or UCUBE-5000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803c1.079-1.493 2.574-2.765 4.32-3.68m7.32 0a9.97 9.97 0 012.167 4.408c-.883 1.65-1.404 3.513-1.404 5.492 0 .826.067 1.635.197 2.428M5 13l4.147-4.147m0 0L13 5m-1.843 1.843L9 7.971V5m4 4l4.147-4.147m0 0L17 13m-1.843-1.843L13 9.171" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="text-white" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLoginModal;
