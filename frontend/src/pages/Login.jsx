import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { forgotPassword } from '../services/authService';
import '../style/Login.css';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || (!forgotMode && !password)) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      if (forgotMode) {
        const result = await forgotPassword(email);
        if (result.success) {
          setMessage(result.message || 'Password reset link sent to your email');
        } else {
          setError(result.message || 'Failed to send reset link. Please try again.');
        }
      } else {
        const result = await login(email, password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-loading">
            <span className="login-spinner"></span>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <span className="login-icon">🛡️</span>
          <h1>{forgotMode ? 'Reset Password' : 'Welcome Back'}</h1>
          <p>{forgotMode ? 'Enter your email to receive a reset link' : 'Sign in to Fake News Detector'}</p>
        </div>

        {/* Alerts */}
        {error   && <div className="alert alert-error">⚠️ {error}</div>}
        {message && <div className="alert alert-success">✅ {message}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your e-mail"
                required
              />
            </div>
          </div>

          {!forgotMode && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? '😴' : '🫣'}
                </button>
              </div>
            </div>
          )}

          {!forgotMode && (
            <p className="forgot-link">
              <span onClick={() => { setForgotMode(true); setError(''); setMessage(''); }}>
                Forgot Password?
              </span>
            </p>
          )}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <><span className="login-spinner"></span> Processing...</>
            ) : forgotMode ? (
              '📧 Send Reset Link'
            ) : (
              '🔑 Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          {forgotMode ? (
            <p>
              <span className="login-link" onClick={() => { setForgotMode(false); setMessage(''); setError(''); }}>
                ← Back to Login
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="login-link">Sign up</Link>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;