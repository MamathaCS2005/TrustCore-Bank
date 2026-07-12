import React, { createContext, useContext, useState, useCallback } from 'react';
import { login as loginApi } from '../api/authApi';
import { saveSession, getUser, clearSession } from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());

  const login = useCallback(async (username, password, rememberMe = false) => {
    const response = await loginApi(username, password, rememberMe);
    const data = response.data;
    saveSession(data.token, data, rememberMe);
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isCustomer = user?.role === 'ROLE_CUSTOMER';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
