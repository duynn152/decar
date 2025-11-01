import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get('/cars?_t=' + new Date().getTime()); // Check a known endpoint
      } catch (error) {
        console.warn('Server is down, logging out...');
        logout();
      }
    };

    checkServerStatus(); // Run on mount

    const storedUser = localStorage.getItem('currentUser');
    const storedExpiration = localStorage.getItem('expirationTime');

    if (storedUser && storedExpiration) {
      const expirationTime = new Date(storedExpiration);
      if (expirationTime > new Date()) {
        setUser(JSON.parse(storedUser));
        startLogoutTimer(expirationTime);
      } else {
        logout();
      }
    }
    return () => {
      clearTimeout(logoutTimerRef.current);
    };
  }, []);

  const startLogoutTimer = (expirationTime) => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    const remainingTime = expirationTime.getTime() - new Date().getTime();
    logoutTimerRef.current = setTimeout(logout, remainingTime);
  };

  const login = (userData) => {
    setUser(userData);
    const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('expirationTime', expirationTime.toISOString());
    startLogoutTimer(expirationTime);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expirationTime');
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
