import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, signup as signupService, logout as logoutService, getMe, getToken } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await getMe();
          if (response.success && response.user) {
            setUser(response.user);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
          }
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await loginService(email, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      // Provide user-friendly error messages
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('connect to server')) {
          errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8000';
        } else if (error.message.includes('Invalid email or password')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await signupService(name, email, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error) {
      // Log error for debugging
      console.error('Signup error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('connect to server')) {
          errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8000';
        } else if (error.message.includes('User already exists')) {
          errorMessage = 'An account with this email already exists. Please login instead.';
        } else if (error.message.includes('Server error occurred')) {
          errorMessage = error.message; // Use the detailed message from authService
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await logoutService();
      setUser(null);
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local state
      setUser(null);
      localStorage.removeItem('token');
      return { success: true };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

