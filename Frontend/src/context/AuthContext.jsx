// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  // On component mount, load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed && typeof parsed === "object") {
        setUser(parsed);
      }
    } catch (_e) {
      localStorage.removeItem("user");
    }
  }, []);

  // Simple state-only login (kept for compatibility)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // backend login
  const loginWithBackend = async ({ email, password, rememberMe }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.message || "Login failed");
      }

      // Backend returns ApiResponse { statusCode, data: { user, accessToken, refreshToken }, ... }
      const backendUser = result?.data?.user || result?.user || null;
      const accessToken = result?.data?.accessToken || result?.accessToken;

      if (backendUser) {
        setUser(backendUser);
        localStorage.setItem("user", JSON.stringify(backendUser));
      }
      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }

      return backendUser;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.warn("Logout request failed", error);
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login")
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithBackend, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
