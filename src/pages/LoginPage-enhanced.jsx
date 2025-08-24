import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AuthPages.css';

const LoginPageEnhanced = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // First try backend authentication
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        if (response.data.success) {
          // Store user data and token
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.user.id);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          // Update auth context
          login({
            id: response.data.user.id,
            name: `${response.data.user.firstName} ${response.data.user.lastName}`,
            email: response.data.user.email,
            role: response.data.user.role
          });

          console.log('Login successful:', response.data);
          navigate(from, { replace: true });
          return;
        } else {
          throw new Error(response.data.message || 'Login failed');
        }
      } catch (backendError) {
        console.log('Backend authentication failed, trying demo mode');
        
        // Demo authentication for development
        if (formData.email === 'demo@lvs.com' && formData.password === 'demo123') {
          const demoUser = {
            id: 'demo-user-123',
            name: 'Demo User',
            email: 'demo@lvs.com',
            role: 'customer'
          };

          localStorage.setItem('userId', demoUser.id);
          localStorage.setItem('user', JSON.stringify(demoUser));
          login(demoUser);

          console.log('Demo login successful');
          navigate(from, { replace: true });
          return;
        }

        // If backend is down and not demo credentials
        setError(backendError.response?.data?.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@lvs.com',
      password: 'demo123'
    });
  };

  return (
    <div className="elegant-auth-page">
      <div className="auth-container">
        <div className="auth-content">
          {/* Left Side - Branding */}
          <div className="auth-branding animate-slide-in-left">
            <div className="brand-content">
              <div className="brand-logo">
                <img 
                  src="/images/lvs-logo.png" 
                  alt="LVS Machine & Tools" 
                  className="logo-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="logo-fallback" style={{ display: 'none' }}>
                  <span className="logo-text">LVS</span>
                </div>
              </div>
              <h1 className="brand-title">Welcome Back!</h1>
              <p className="brand-description">
                Sign in to your account to continue shopping for premium CNC machines and industrial tools.
              </p>
              <div className="brand-features">
                <div className="feature-item">
                  <span className="feature-icon">🔧</span>
                  <span>Premium Quality Tools</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🚚</span>
                  <span>Fast Delivery</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💎</span>
                  <span>Expert Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="auth-form-section animate-slide-in-right">
            <div className="auth-form-container">
              <div className="auth-header">
                <h2 className="auth-title">Sign In</h2>
                <p className="auth-subtitle">Enter your credentials to access your account</p>
              </div>

              {error && (
                <div className="error-message animate-fade-in">
                  <div className="error-content">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="error-close">×</button>
                  </div>
                </div>
              )}

              {/* Demo Login Notice */}
              <div className="demo-notice">
                <div className="demo-content">
                  <span className="demo-icon">🧪</span>
                  <div className="demo-text">
                    <span>Demo Mode Available</span>
                    <button onClick={handleDemoLogin} className="demo-link">
                      Use demo credentials
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password *
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox" />
                    <span className="checkbox-text">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  <span className="btn-text">
                    {loading ? 'Signing In...' : 'Sign In'}
                  </span>
                  <span className="btn-icon">
                    {loading ? '⏳' : '→'}
                  </span>
                </button>
              </form>

              <div className="auth-footer">
                <div className="auth-divider">
                  <span>OR</span>
                </div>

                <div className="social-login">
                  <button className="social-btn google-btn">
                    <span className="social-icon">🔍</span>
                    <span>Continue with Google</span>
                  </button>
                </div>

                <div className="auth-switch">
                  <span>Don't have an account?</span>
                  <Link to="/signup" className="auth-switch-link">
                    Create Account
                  </Link>
                </div>

                <div className="auth-help">
                  <span>Need help?</span>
                  <Link to="/contact" className="help-link">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="security-badge">
        <span className="security-icon">🛡️</span>
        <span className="security-text">Secured with 256-bit SSL encryption</span>
      </div>
    </div>
  );
};

export default LoginPageEnhanced;
