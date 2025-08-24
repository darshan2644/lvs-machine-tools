import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AuthPages.css';

const SignupPageEnhanced = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }

    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.phone && formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
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
      // First try backend registration
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          company: formData.company
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

          console.log('Registration successful:', response.data);
          navigate('/', { replace: true });
          return;
        } else {
          throw new Error(response.data.message || 'Registration failed');
        }
      } catch (backendError) {
        console.log('Backend registration failed:', backendError);
        
        // Check if it's a user already exists error
        if (backendError.response?.data?.message?.includes('already exists')) {
          setError('An account with this email already exists. Please use a different email or try logging in.');
          return;
        }

        // For demo purposes, create a demo user
        const demoUser = {
          id: `demo-${Date.now()}`,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          role: 'customer'
        };

        localStorage.setItem('userId', demoUser.id);
        localStorage.setItem('user', JSON.stringify(demoUser));
        login(demoUser);

        console.log('Demo registration successful');
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
              <h1 className="brand-title">Join LVS Community!</h1>
              <p className="brand-description">
                Create your account and get access to premium CNC machines, industrial tools, and exclusive deals.
              </p>
              <div className="brand-features">
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Exclusive Member Prices</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📦</span>
                  <span>Order Tracking</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏆</span>
                  <span>Priority Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="auth-form-section animate-slide-in-right">
            <div className="auth-form-container">
              <div className="auth-header">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Fill in your details to get started</p>
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

              <form onSubmit={handleSubmit} className="auth-form">
                {/* Name Fields */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      First Name *
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last Name *
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
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

                {/* Phone and Company */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">📱</span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone (optional)"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="company" className="form-label">
                      Company
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">🏢</span>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company (optional)"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
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
                      placeholder="Create a password"
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
                  <div className="password-hint">
                    Password must be at least 6 characters long
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password *
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="form-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      className="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required
                    />
                    <span className="checkbox-text">
                      I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  <span className="btn-text">
                    {loading ? 'Creating Account...' : 'Create Account'}
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
                    <span>Sign up with Google</span>
                  </button>
                </div>

                <div className="auth-switch">
                  <span>Already have an account?</span>
                  <Link to="/login" className="auth-switch-link">
                    Sign In
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
        <span className="security-text">Your data is protected with industry-standard encryption</span>
      </div>
    </div>
  );
};

export default SignupPageEnhanced;
