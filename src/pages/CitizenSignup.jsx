// src/pages/CitizenSignup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Smartphone, KeyRound } from "lucide-react";
import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

function CitizenSignup() {
  const [aadhaar, setAadhaar] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // form → otp
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Mock OTP sending
  const handleSendOtp = () => {
    if (aadhaar.length === 12 && name && mobile.length === 10) {
      setStep("otp");
      alert("Mock OTP sent: 1234");
    } else {
      alert("Please fill in all details correctly.");
    }
  };

  // Call backend API after OTP verify
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
          type: "citizen",
          name,
          aadhaar,
          mobile,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Signup failed");
      }

      const data = await res.json();

      // ✅ Save in context (and localStorage inside context)
      login({ ...data, aadhaarVerified: true }, "citizen");

      navigate("/citizen-dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 space-y-6 animate-fadeIn">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Citizen Signup</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create your JanSetu citizen account
          </p>
        </div>

        {step === "form" && (
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                maxLength="10"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                maxLength="12"
                placeholder="12-digit Aadhaar Number"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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

export default CitizenSignup;
