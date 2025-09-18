// src/components/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mic, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/useAuth"; // <-- custom hook
import logo from "../assets/jansetu_logo.png"; 

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/"); // back to landing
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Logo + tagline */}
          <Link to="/" className="flex items-center gap-3">
            {/* Logo Image */}
            <img
              src={logo} 
              alt="JanSetu Logo"
              className="w-15 h-15"
            />

            {/* Text */}
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-slate-800">
                JanSetu
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Citizen to Government Bridge
              </span>
            </div>
          </Link>

          {/* CENTER: Language + mic */}
          <div className="hidden md:flex items-center gap-2">
            <select
              id="lang"
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>

            <button
              type="button"
              title="Voice input"
              aria-label="Activate voice input"
              className="inline-flex items-center justify-center p-2 border rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <Mic className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* RIGHT: Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-700">
                  Hi, {user.name}{" "}
                  {user.type === "authority" && (
                    <span className="text-xs text-slate-500">
                      ({user.department})
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm shadow-md transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/citizen-login"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm shadow-md transition"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/authority-login"
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm shadow-md transition"
                >
                  Authority Login
                </Link>
                <Link
                  to="/citizen-dashboard"
                  className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm shadow-md transition"
                >
                  Demo Mode
                </Link>
              </>
            )}
          </div>

          {/* MOBILE: Menu toggle */}
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden flex flex-col gap-3 py-3">
            {/* Language + mic */}
            <div className="flex items-center gap-2 px-2">
              <select
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
              <button
                type="button"
                title="Voice input"
                className="p-2 border rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <Mic className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {user ? (
              <>
                <span className="px-3 text-sm text-slate-700">
                  Hi, {user.name}{" "}
                  {user.type === "authority" && (
                    <span className="text-xs text-slate-500">
                      ({user.department})
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm mx-2 shadow-md transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/citizen-login"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm text-center mx-2 shadow-md transition"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/authority-login"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm text-center mx-2 shadow-md transition"
                >
                  Authority Login
                </Link>
                <Link
                  to="/citizen-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm text-center mx-2 shadow-md transition"
                >
                  Demo Mode
                </Link>
              </>
            )}

            <div className="px-3 mt-2 text-xs text-slate-500">
              Need help?{" "}
              <span className="underline">support@jansetu.example</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
