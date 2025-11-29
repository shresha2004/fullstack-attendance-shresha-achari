import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { sendOTPEmail, generateOTP } from "../services/emailService";

const EmployeeRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empKey, setEmpKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmployeeId, setRegisteredEmployeeId] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: OTP verification
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const EMPLOYEE_SECRET = import.meta.env.VITE_EMPLOYEE_KEY;

  const validatePassword = (pwd) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    if (pwd.length < minLength) return "Password must be at least 8 characters";
    if (!hasUpperCase) return "Password must contain uppercase letter";
    if (!hasLowerCase) return "Password must contain lowercase letter";
    if (!hasNumbers) return "Password must contain a number";
    if (!hasSpecialChar) return "Password must contain a special character";
    return null;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registeredEmployeeId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const sendOTP = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !empKey) {
      toast.error("Please fill all fields");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (empKey !== EMPLOYEE_SECRET) {
      toast.error("Invalid Employee Key");
      return;
    }

    setOtpLoading(true);
    try {
      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);
      
      const sent = await sendOTPEmail(email, newOTP);
      if (sent) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error("Failed to send OTP. Please check EmailJS configuration.");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();

    if (otp !== generatedOTP) {
      toast.error("Invalid OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "employee",
      });

      setRegisteredEmployeeId(res.data.user.employeeId);
      login(res.data);
      toast.success("Registration successful!");
      
      // Navigate after 2 seconds to let user see the ID
      setTimeout(() => {
        navigate("/employee");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setOtpLoading(true);
    try {
      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);
      
      const sent = await sendOTPEmail(email, newOTP);
      if (sent) {
        toast.success("OTP resent to your email!");
        setOtp("");
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Error resending OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  if (registeredEmployeeId) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-100">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Your Employee ID has been generated</p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl mb-6 border-2 border-green-200">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-3 font-semibold">Employee ID</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl font-bold text-green-700">{registeredEmployeeId}</p>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copiedId ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">Save this ID for future logins. You can also use your email to login.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Spinner size="sm" className="text-blue-600" />
            <p>Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <form onSubmit={step === 1 ? sendOTP : verifyOTP} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Employee Registration</h2>
          <p className="text-sm text-gray-600 mt-2">{step === 1 ? 'Create your account' : 'Verify your email'}</p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={otpLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpLoading}
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
                disabled={otpLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Key</label>
              <input
                type="password"
                placeholder="Enter employee key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={empKey}
                onChange={(e) => setEmpKey(e.target.value)}
                disabled={otpLoading}
              />
            </div>

            <button
              type="submit"
              disabled={otpLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {otpLoading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Sending OTP...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-4">
              We've sent a 6-digit OTP to <span className="font-semibold text-gray-900">{email}</span>
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                placeholder="000000"
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest font-semibold"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Verifying...
                </>
              ) : (
                'Verify & Register'
              )}
            </button>

            <button
              type="button"
              onClick={resendOTP}
              disabled={otpLoading}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {otpLoading ? 'Resending...' : 'Resend OTP'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setGeneratedOTP("");
              }}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Back
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/employee/login" className="text-blue-600 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default EmployeeRegister;
