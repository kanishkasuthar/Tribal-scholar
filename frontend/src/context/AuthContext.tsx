import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'INSTITUTE' | 'ADMIN';
  mobile?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<User>;
  sendOtp: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string; demoOtp?: string; devOtp?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<User>;
  register: (email: string, password: string, name: string, role?: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('tribal_scholar_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tribal_scholar_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('tribal_scholar_user', JSON.stringify(res.data.user));
          }
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const extractErrorMessage = (err: any, fallback: string): string => {
    if (err.response?.data?.message && typeof err.response.data.message === 'string') {
      return err.response.data.message;
    }
    if (err.message && typeof err.message === 'string' && !err.message.includes('status code')) {
      return err.message;
    }
    return fallback;
  };

  const login = async (email: string, password: string, role?: string): Promise<User> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await api.post('/auth/login', { email: cleanEmail, password, role });
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('tribal_scholar_token', token);
        localStorage.setItem('tribal_scholar_user', JSON.stringify(user));
        return user;
      } else {
        throw new Error(res.data.message || 'Authentication failed');
      }
    } catch (err: any) {
      throw new Error(extractErrorMessage(err, 'Invalid email address or password. Please try again.'));
    }
  };

  const sendOtp = async (email: string, password: string, name: string) => {
    try {
      const res = await api.post('/auth/send-otp', { email: email.trim(), password, name: name.trim() });
      if (res.data.success) {
        return res.data;
      } else {
        throw new Error(res.data.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      throw new Error(extractErrorMessage(err, 'Unable to send verification code. Please check your credentials and try again.'));
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<User> => {
    try {
      const res = await api.post('/auth/verify-otp', { email: email.trim(), otp: otp.trim() });
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('tribal_scholar_token', token);
        localStorage.setItem('tribal_scholar_user', JSON.stringify(user));
        return user;
      } else {
        throw new Error(res.data.message || 'OTP Verification failed');
      }
    } catch (err: any) {
      throw new Error(extractErrorMessage(err, 'Incorrect or expired OTP code. Please try again.'));
    }
  };

  const register = async (email: string, password: string, name: string, role = 'STUDENT'): Promise<User> => {
    try {
      const res = await api.post('/auth/register', { email: email.trim(), password, name: name.trim(), role });
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('tribal_scholar_token', token);
        localStorage.setItem('tribal_scholar_user', JSON.stringify(user));
        return user;
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } catch (err: any) {
      throw new Error(extractErrorMessage(err, 'Something went wrong while creating your account. Please try again.'));
    }
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tribal_scholar_token');
    localStorage.removeItem('tribal_scholar_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        sendOtp,
        verifyOtp,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
