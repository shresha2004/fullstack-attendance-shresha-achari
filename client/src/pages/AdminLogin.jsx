import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";

const AdminLogin = () => {
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

      if (res.data.user?.role !== "admin") {
        toast.error("This account does not have admin access");
        setLoading(false);
        return;
      }

      login(res.data);
      toast.success("Admin login successful! Redirecting...");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-md">
        <form onSubmit={submit} className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Admin Access</h2>
          <p className="text-sm text-center text-gray-600 mb-8">Manage your organization</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email or Admin ID</label>
              <input
                type="text"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                placeholder="admin@company.com or UCUBE-5000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path fillRule="evenodd" d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10c1.274 4.057 5.064 7 9.542 7 2.11 0 4.126-.36 5.98-1.045l1.37 1.37a1 1 0 001.414-1.414h-.01zm5.039-3.935a1 1 0 10-1.414-1.414A9.971 9.971 0 0010 5c-4.478 0-8.268 2.943-9.542 7a9.958 9.958 0 001.05 2.75 1 1 0 11-1.557 1.294A11.993 11.993 0 01.458 10c1.274-4.057 5.064-7 9.542-7a11.89 11.89 0 014.712 1.01z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <a href="/admin/register" className="text-red-600 font-semibold hover:underline">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
