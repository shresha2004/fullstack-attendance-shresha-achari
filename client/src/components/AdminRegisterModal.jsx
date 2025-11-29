import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosClient";
import { Spinner } from "../components/Spinner";
import { sendOTPEmail, generateOTP } from "../services/emailService";

const AdminRegisterModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: OTP verification
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;

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

  const sendOTP = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !key) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (key !== ADMIN_KEY) {
      toast.error("Invalid Admin Key");
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
        role: "admin",
        key,
      });

      toast.success("Registration successful!");
      setTimeout(() => {
        setStep(1);
        setOtp("");
        setGeneratedOTP("");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setKey("");
        onClose();
      }, 1500);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto pointer-events-auto">
      <form onSubmit={step === 1 ? sendOTP : verifyOTP} className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 my-8 pointer-events-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Register</h2>
            <p className="text-xs text-gray-600 mt-1">{step === 1 ? 'Create admin account' : 'Verify email'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={otpLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={otpLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={otpLoading}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Admin Key</label>
              <input
                type="password"
                placeholder="Enter admin key"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={otpLoading}
              />
            </div>

            <button
              type="submit"
              disabled={otpLoading}
              className="col-span-2 mt-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {otpLoading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Sending OTP...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-600 text-center mb-4">
              We've sent a 6-digit OTP to <span className="font-semibold text-gray-900">{email}</span>
            </p>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                placeholder="000000"
                maxLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-center text-lg tracking-widest font-semibold"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Verifying...
                </>
              ) : (
                "Verify & Register"
              )}
            </button>

            <button
              type="button"
              onClick={resendOTP}
              disabled={otpLoading}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-70 disabled:cursor-not-allowed"
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
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Back
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminRegisterModal;
