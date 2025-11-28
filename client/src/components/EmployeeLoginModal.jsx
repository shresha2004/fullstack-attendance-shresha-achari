import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";

const EmployeeLoginModal = ({ isOpen, onClose }) => {
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      if (res.data.user.role !== "employee") {
        toast.error("Not an employee account");
        setLoading(false);
        return;
      }

      login(res.data);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/employee"), 1500);
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
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Employee Login</h2>
            <p className="text-sm text-gray-600 mt-2">Access your attendance dashboard</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Email or Employee ID</label>
            <input
              type="text"
              placeholder="employee@example.com or UCUBE-1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default EmployeeLoginModal;
