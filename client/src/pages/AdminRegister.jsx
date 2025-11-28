import { useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const ADMIN_SECRET = "a";

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !adminKey) {
      setError("Please provide email, password and admin key.");
      return;
    }

    if (adminKey !== ADMIN_SECRET) {
      setError("Invalid Admin Key");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        email,
        password,
        role: "admin",
      });
     
      login(res.data);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-4 text-center">Admin Registration</h2>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Admin Key"
          className="w-full border p-3 rounded mb-4"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
