// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";

// Citizen
import CitizenLogin from "./pages/CitizenLogin";
import CitizenSignup from "./pages/CitizenSignup";
import CitizenDashboard from "./pages/CitizenDashboard";

// Authority
import AuthorityLogin from "./pages/AuthorityLogin";
import AuthoritySignup from "./pages/AuthoritySignup";
import AuthorityDashboard from "./pages/AuthorityDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap everything in Layout */}
        <Route element={<Layout />}>
          {/* Landing */}
          <Route path="/" element={<Landing />} />

          {/* Citizen Flow */}
          <Route path="/citizen-login" element={<CitizenLogin />} />
          <Route path="/citizen-signup" element={<CitizenSignup />} />
          <Route path="/citizen-dashboard" element={<CitizenDashboard />} />

          {/* Authority Flow */}
          <Route path="/authority-login" element={<AuthorityLogin />} />
          <Route path="/authority-signup" element={<AuthoritySignup />} />
          <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
