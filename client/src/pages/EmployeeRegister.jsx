import { useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EmployeeRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empKey, setEmpKey] = useState("");
  const [error, setError] = useState("");
  const [registeredEmployeeId, setRegisteredEmployeeId] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const EMPLOYEE_SECRET = "a";

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !empKey) {
      setError("Please fill all fields");
      return;
    }

    if (empKey !== EMPLOYEE_SECRET) {
      setError("Invalid Employee Key");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "employee",
      });

      setRegisteredEmployeeId(res.data.user.employeeId);
      login(res.data);
      
      // Navigate after 2 seconds to let user see the ID
      setTimeout(() => {
        navigate("/employee");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  if (registeredEmployeeId) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-green-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-2">Your Employee ID:</p>
          <div className="bg-green-100 p-4 rounded-lg mb-4">
            <p className="text-2xl font-bold text-green-700">{registeredEmployeeId}</p>
          </div>
          <p className="text-sm text-gray-500 mb-4">Save this ID for future logins. You can also use your email to login.</p>
          <p className="text-xs text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Employee Registration</h2>
        
        {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          placeholder="Employee Key"
          className="w-full border p-3 rounded mb-4"
          value={empKey}
          onChange={(e) => setEmpKey(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegister;
