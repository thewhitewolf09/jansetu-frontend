// src/pages/CitizenLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, KeyRound, Smartphone } from "lucide-react";
import { useAuth } from "../context/useAuth";

function CitizenLogin() {
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("aadhaar");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  // Auto-redirect if already logged in
  if (user && user.type === "citizen") {
    navigate("/citizen-dashboard");
  }

  const handleSendOtp = () => {
    if (aadhaar.length === 12) {
      setStep("otp");
      alert("Mock OTP sent: 1234");
    } else {
      alert("Please enter a valid 12-digit Aadhaar number.");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp !== "1234") {
      alert("Invalid OTP. Try again.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "citizen", aadhaar }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();
      login({ ...data, aadhaarVerified: true }, "citizen");

      navigate("/citizen-dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    login({ name: "Demo User", aadhaarVerified: false }, "citizen");
    navigate("/citizen-dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 space-y-6 animate-fadeIn">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Citizen Login</h1>
          <p className="text-gray-500 text-sm mt-1">
            Secure Aadhaar-based login for citizens
          </p>
        </div>

        {/* Aadhaar Step */}
        {step === "aadhaar" && (
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                maxLength="12"
                placeholder="Enter 12-digit Aadhaar Number"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium shadow-md transition"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <div className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                maxLength="4"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium shadow-md transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center justify-center">
          <span className="h-px w-1/3 bg-gray-200" />
          <span className="text-xs text-gray-400 px-2">or</span>
          <span className="h-px w-1/3 bg-gray-200" />
        </div>

        {/* Guest Mode */}
        <div className="text-center">
          <button
            onClick={handleGuest}
            className="flex items-center gap-2 justify-center w-full text-sm text-orange-600 border border-orange-300 py-2 rounded-lg hover:bg-orange-50 transition"
          >
            <Smartphone className="w-4 h-4" />
            Continue as Guest (Demo Mode)
          </button>
        </div>

        {/* Signup link */}
        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/citizen-signup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CitizenLogin;
