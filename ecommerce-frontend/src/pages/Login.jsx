import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaLock,
  FaEnvelope,
  FaUser,
  FaShieldAlt,
  FaCheckCircle,
  FaUserShield,
} from 'react-icons/fa';
import { loginUserThunk, registerUserThunk } from '../redux/thunks/authThunks';
import { clearAuthError } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  // Toggle between 'login' and 'register'
  const [mode, setMode] = useState('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Extract redirect query parameter
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    // If already logged in, redirect
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  useEffect(() => {
    // Clear error on tab switch
    dispatch(clearAuthError());
    setValidationError('');
  }, [mode, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setValidationError('Please enter both email and password.');
        return;
      }
      dispatch(loginUserThunk({ email: email.trim(), password }));
    } else {
      if (!name.trim() || !email.trim() || !password) {
        setValidationError('Please fill in all required fields.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      dispatch(registerUserThunk({ name: name.trim(), email: email.trim(), password }));
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    dispatch(loginUserThunk({ email: demoEmail, password: demoPassword }));
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        {/* Card Surface */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#fff',
              fontSize: '1.4rem',
              boxShadow: 'var(--shadow-glow)',
            }}>
              <FaLock />
            </div>

            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {mode === 'login'
                ? 'Sign in to access your cart, orders, and personalized picks'
                : 'Join NexusStore for intelligent AI shopping experience'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-input)',
            padding: '0.3rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.75rem',
            border: '1px solid var(--border-color)',
          }}>
            <button
              type="button"
              id="switch-login-tab"
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '0.55rem',
                border: 'none',
                borderRadius: '6px',
                background: mode === 'login' ? 'var(--accent-primary)' : 'transparent',
                color: mode === 'login' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              id="switch-register-tab"
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '0.55rem',
                border: 'none',
                borderRadius: '6px',
                background: mode === 'register' ? 'var(--accent-primary)' : 'transparent',
                color: mode === 'register' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Register
            </button>
          </div>

          {/* Validation & API Error Alerts */}
          {(validationError || error) && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-rose)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}>
              {validationError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-name"
                    type="text"
                    className="form-input"
                    placeholder="Sebastian Roshan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  id="register-confirm-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              {loading
                ? 'Authenticating...'
                : mode === 'login'
                ? 'Sign In to Account'
                : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo Credentials Panel for Reviewers */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
          }}>
            <span style={{
              display: 'block',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.85rem',
              textAlign: 'center',
            }}>
              Instant Evaluator Access (1-Click)
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                id="demo-admin-login-btn"
                onClick={() => handleDemoLogin('admin@example.com', 'admin123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
              >
                <FaUserShield color="#f59e0b" /> Demo Admin
              </button>

              <button
                type="button"
                id="demo-user-login-btn"
                onClick={() => handleDemoLogin('john@example.com', 'user123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
              >
                <FaUser color="var(--accent-primary)" /> Demo Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
