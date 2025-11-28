import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6">

      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Employee Attendance System
      </h1>

      <p className="text-gray-600 mb-10 text-lg text-center max-w-xl">
        Manage attendance, leave, and admin approvals easily.
      </p>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <button
          onClick={() => navigate("/employee/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Employee Login
        </button>

        <button
          onClick={() => navigate("/employee/register")}
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg shadow hover:bg-blue-50"
        >
          Employee Register
        </button>

        <button
          onClick={() => navigate("/admin/login")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Admin Login
        </button>

        <button
          onClick={() => navigate("/admin/register")}
          className="px-6 py-3 border border-green-600 text-green-600 rounded-lg shadow hover:bg-green-50"
        >
          Admin Register
        </button>

      </div>
    </div>
  );
};

export default LandingPage;
