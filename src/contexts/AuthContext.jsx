import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const logoutTimer = useRef(null);

  // --- Kiểm tra server và khôi phục user ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await axios.get("http://localhost:3001/cars?_t=" + Date.now());
      } catch {
        console.warn("Server is down, logging out...");
        logout();
        return;
      }

      const savedUser = localStorage.getItem("currentUser");
      const savedExpire = localStorage.getItem("expirationTime");

      if (savedUser && savedExpire) {
        const expireTime = new Date(savedExpire);
        if (expireTime > new Date()) {
          setUser(JSON.parse(savedUser));
          startAutoLogout(expireTime);
        } else {
          logout();
        }
      }
    };

    initAuth();
    return () => clearTimeout(logoutTimer.current);
  }, []);

  // --- Tự động logout khi hết hạn ---
  const startAutoLogout = (expireTime) => {
    clearTimeout(logoutTimer.current);
    const remaining = expireTime.getTime() - Date.now();
    logoutTimer.current = setTimeout(() => {
      alert("Your session has expired. Please log in again.");
      logout();
    }, remaining);
  };

  // --- Đăng nhập ---
  const login = (userData) => {
    const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 tiếng
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("expirationTime", expireTime.toISOString());
    startAutoLogout(expireTime);
  };

  // --- Đăng xuất ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("expirationTime");
    clearTimeout(logoutTimer.current);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
