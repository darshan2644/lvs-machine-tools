import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ShoppingCart from './ShoppingCart';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav style={{ 
      backgroundColor: 'var(--white)', 
      boxShadow: isScrolled ? 'var(--shadow-lg)' : 'var(--shadow)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '1rem 0',
      transition: 'all 0.3s ease'
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link to="/" className="d-flex align-items-center" style={{ textDecoration: 'none' }}>
            <img 
              src="/images/lvs-logo.png" 
              alt="LVS Machine & Tools" 
              style={{ height: '40px', marginRight: '0.5rem' }}
            />
            <div>
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: 'var(--primary-blue)',
                lineHeight: '1'
              }}>
                LVS Machine & Tools
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="d-none d-md-flex" style={{ gap: '2rem' }}>
            <Link 
              to="/" 
              style={{ 
                color: 'var(--dark-text)', 
                textDecoration: 'none', 
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--light-bg)';
                e.target.style.color = 'var(--primary-blue)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--dark-text)';
              }}
            >
              Home
            </Link>
            
            <Link 
              to="/categories" 
              style={{ 
                color: 'var(--dark-text)', 
                textDecoration: 'none', 
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--light-bg)';
                e.target.style.color = 'var(--primary-blue)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--dark-text)';
              }}
            >
              Categories
            </Link>
            
            <Link 
              to="/products" 
              style={{ 
                color: 'var(--dark-text)', 
                textDecoration: 'none', 
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--light-bg)';
                e.target.style.color = 'var(--primary-blue)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--dark-text)';
              }}
            >
              Products
            </Link>
            
            <Link 
              to="/about" 
              style={{ 
                color: 'var(--dark-text)', 
                textDecoration: 'none', 
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--light-bg)';
                e.target.style.color = 'var(--primary-blue)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--dark-text)';
              }}
            >
              About
            </Link>
            
            <Link 
              to="/contact" 
              style={{ 
                color: 'var(--dark-text)', 
                textDecoration: 'none', 
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--light-bg)';
                e.target.style.color = 'var(--primary-blue)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--dark-text)';
              }}
            >
              Contact
            </Link>
          </div>

          {/* Right Side - Cart and User */}
          <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
            {/* Shopping Cart */}
            <ShoppingCart />
            
            {/* User Authentication */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={toggleUserMenu}
                  className="btn btn-outline"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.5rem 1rem'
                  }}
                >
                  <span style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary-blue)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <span className="d-none d-md-inline">{user?.name || 'User'}</span>
                </button>
                
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '200px',
                    padding: '0.5rem 0',
                    marginTop: '0.5rem'
                  }}>
                    <Link 
                      to="/profile" 
                      style={{
                        display: 'block',
                        padding: '0.5rem 1rem',
                        color: 'var(--dark-text)',
                        textDecoration: 'none',
                        borderBottom: '1px solid var(--border-color)'
                      }}
                      onClick={() => setShowUserMenu(false)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--light-bg)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--danger-red)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--light-bg)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMenu}
              className="d-md-none btn btn-outline"
              style={{ padding: '0.5rem' }}
            >
              <span style={{ fontSize: '1.5rem' }}>☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="d-md-none" style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--light-bg)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link 
                to="/" 
                style={{ 
                  color: 'var(--dark-text)', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  borderRadius: 'var(--border-radius)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/categories" 
                style={{ 
                  color: 'var(--dark-text)', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  borderRadius: 'var(--border-radius)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/products" 
                style={{ 
                  color: 'var(--dark-text)', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  borderRadius: 'var(--border-radius)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                style={{ 
                  color: 'var(--dark-text)', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  borderRadius: 'var(--border-radius)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                style={{ 
                  color: 'var(--dark-text)', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  borderRadius: 'var(--border-radius)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
