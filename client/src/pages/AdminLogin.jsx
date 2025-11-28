import { useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailOrId || !password) {
      setError("Please enter both email/admin ID and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { emailOrId, password });

      if (res.data.user?.role !== "admin") {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }

      login(res.data);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <form onSubmit={submit} className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">A</div>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-2">Admin Sign In</h2>
          <p className="text-sm text-center text-gray-500 mb-6">Enter your email or Admin ID (AD-XXXXX)</p>

          {error && (
            <div role="alert" className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="admin-email">Email or Admin ID</label>
          <input
            id="admin-email"
            type="text"
            aria-label="Admin email or ID"
            value={emailOrId}
            onChange={(e) => setEmailOrId(e.target.value)}
            placeholder="you@company.com or AD-XXXXX"
            className="w-full border border-gray-200 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-200"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="admin-password">Password</label>
          <div className="relative mb-4">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              aria-label="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full border border-gray-200 rounded-md p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-200"
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-2 text-gray-500 text-sm px-2 py-1 rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:opacity-60`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : null}
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">Powered by uCube Attendance</p>
      </div>
    </div>
  );
};

export default AdminLogin;
