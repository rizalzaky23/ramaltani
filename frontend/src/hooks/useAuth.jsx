import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const DEFAULT_DEMO_FARMER = {
  id: 'usr-001',
  name: 'Budi Santoso',
  email: 'farmer@ramaltani.demo',
  role: 'farmer',
  regionId: 'reg-001',
  phone: '+6281234567890',
  location: 'Klaten',
  commodity: 'Padi',
  landSize: 1.5,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const stored = localStorage.getItem('ramaltani_user');
    const token = localStorage.getItem('ramaltani_token');

    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('ramaltani_user');
        localStorage.removeItem('ramaltani_token');
      }
    } else if (!localStorage.getItem('ramaltani_explicit_logout')) {
      // Auto-initialize demo farmer session for seamless navigation
      localStorage.setItem('ramaltani_user', JSON.stringify(DEFAULT_DEMO_FARMER));
      localStorage.setItem('ramaltani_token', 'demo_jwt_token_budi_santoso');
      setUser(DEFAULT_DEMO_FARMER);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    localStorage.removeItem('ramaltani_explicit_logout');
    const response = await authAPI.login(email, password);
    const { user: userData, token } = response.data.data;

    localStorage.setItem('ramaltani_token', token);
    localStorage.setItem('ramaltani_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    localStorage.removeItem('ramaltani_explicit_logout');
    const response = await authAPI.register(formData);
    const { user: userData, token } = response.data.data;

    localStorage.setItem('ramaltani_token', token);
    localStorage.setItem('ramaltani_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('ramaltani_token');
    localStorage.removeItem('ramaltani_user');
    localStorage.setItem('ramaltani_explicit_logout', 'true');
    setUser(null);
  };

  const isRole = (...roles) => user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
