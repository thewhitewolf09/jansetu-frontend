import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();
export default AuthContext; // 👈 important for useAuth.js

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const citizen = localStorage.getItem("citizenUser");
    const authority = localStorage.getItem("authorityUser");

    if (citizen) {
      setUser({ ...JSON.parse(citizen), type: "citizen" });
    } else if (authority) {
      setUser({ ...JSON.parse(authority), type: "authority" });
    }
  }, []);

  const login = (data, type) => {
    if (type === "citizen") {
      localStorage.setItem("citizenUser", JSON.stringify(data));
      localStorage.removeItem("authorityUser");
    } else {
      localStorage.setItem("authorityUser", JSON.stringify(data));
      localStorage.removeItem("citizenUser");
    }
    setUser({ ...data, type });
  };

  const logout = () => {
    localStorage.removeItem("citizenUser");
    localStorage.removeItem("authorityUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
