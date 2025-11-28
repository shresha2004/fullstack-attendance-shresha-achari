import { useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EmployeeRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empKey, setEmpKey] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const EMPLOYEE_SECRET = "a";

  const submit = async (e) => {
    e.preventDefault();

    
    if (empKey !== EMPLOYEE_SECRET)
      return alert("Invalid Employee Key");

    try {
      const res = await api.post("/auth/register", {
        email,
        password,
        role: "employee",
      });

      login(res.data);
      navigate("/employee");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Employee Registration</h2>

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
