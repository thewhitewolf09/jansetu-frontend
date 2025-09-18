// src/pages/AuthoritySignup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Briefcase, KeyRound } from "lucide-react";
import { useAuth } from "../context/useAuth";

function AuthoritySignup() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // form → otp
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSendOtp = () => {
    if (name && department && email.includes("@")) {
      setStep("otp");
      alert("Mock OTP sent: 1234");
    } else {
      alert("Please fill in all details correctly.");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp !== "1234") {
      alert("Invalid OTP. Try again.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "authority",
          name,
          department,
          email,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Signup failed");
      }

      const data = await res.json();

      // ✅ Save in AuthContext + localStorage
      login({ ...data }, "authority");

      navigate("/authority-dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 space-y-6 animate-fadeIn">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Authority Signup</h1>
          <p className="text-gray-500 text-sm mt-1">
            Register as a government authority on JanSetu
          </p>
        </div>

        {step === "form" && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Official Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Creating Account..." : "Verify & Create Account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthoritySignup;
