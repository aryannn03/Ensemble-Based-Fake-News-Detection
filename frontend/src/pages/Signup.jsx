import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/Signup.css';

const Signup = () => {
  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                     = useState('');
  const [loading, setLoading]                 = useState(false);
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);

  const { signup, isAuthenticated, loading: authLoading } = useAuth();
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

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await signup(name, email, password);
      if (result?.success) {
        navigate('/');
      } else {
        setError('Signup failed. Please check your details or try again later.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = () => {
    if (!password) return { label: '', color: '', width: '0%' };
    if (password.length < 6)  return { label: 'Too short', color: '#ef4444', width: '25%' };
    if (password.length < 8)  return { label: 'Weak',      color: '#f59e0b', width: '50%' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
                              return { label: 'Fair',      color: '#3b82f6', width: '75%' };
    return                           { label: 'Strong',    color: '#10b981', width: '100%' };
  };
  const strength = getStrength();

  if (authLoading) {
    return (
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-loading">
            <span className="signup-spinner"></span>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-card">

        {/* Header */}
        <div className="signup-header">
          <span className="signup-icon">🚀</span>
          <h1>Create Account</h1>
          <p>Join the Fake News Detector platform</p>
        </div>

        {/* Alert */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="signup-form">

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
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
            {/* Password strength bar */}
            {password && (
              <div className="strength-bar-wrapper">
                <div className="strength-bar-track">
                  <div
                    className="strength-bar-fill"
                    style={{ width: strength.width, background: strength.color }}
                  ></div>
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? '😴' : '🫣'}
              </button>
            </div>
            {/* Match indicator */}
            {confirmPassword && (
              <p className="match-indicator" style={{ color: password === confirmPassword ? '#10b981' : '#ef4444' }}>
                {password === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} className="signup-button">
            {loading ? (
              <><span className="signup-spinner"></span> Creating Account...</>
            ) : (
              '🚀 Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="signup-link">Sign in</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;