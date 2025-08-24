import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--dark-text)', 
      color: 'white', 
      padding: '3rem 0 1rem',
      marginTop: '3rem'
    }}>
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-md-4 mb-4">
            <div className="footer-section">
              <div className="d-flex align-items-center mb-3">
                <img 
                  src="/images/lvs-logo.png" 
                  alt="LVS Machine Tools" 
                  style={{ height: '40px', marginRight: '0.5rem' }}
                />
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  color: 'var(--primary-blue)'
                }}>
                  L.V.S. MACHINE TOOLS
                </span>
              </div>
              <p style={{ 
                color: '#cccccc', 
                lineHeight: '1.6', 
                marginBottom: '1.5rem' 
              }}>
                We are a reputed and renowned company occupied in manufacturing, trading and supplying a world class collection of Jewellery CNC Bangle Faceting Machine and all types of Jewellery SPM Machineries.
              </p>
              <Link 
                to="/about" 
                className="btn btn-outline"
                style={{ 
                  borderColor: 'var(--primary-blue)', 
                  color: 'var(--primary-blue)' 
                }}
              >
                Read More
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <div className="footer-section">
              <h5 style={{ 
                color: 'white', 
                fontWeight: '600', 
                marginBottom: '1rem',
                fontSize: '1.1rem'
              }}>
                Quick Links
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to="/" 
                    style={{ 
                      color: '#cccccc', 
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                    onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                  >
                    Home
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to="/about" 
                    style={{ 
                      color: '#cccccc', 
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                    onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                  >
                    About Us
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to="/products" 
                    style={{ 
                      color: '#cccccc', 
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                    onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                  >
                    Products
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to="/categories" 
                    style={{ 
                      color: '#cccccc', 
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                    onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                  >
                    Categories
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Services */}
          <div className="col-md-2 mb-4">
            <div className="footer-section">
              <h5 style={{ 
                color: 'white', 
                fontWeight: '600', 
                marginBottom: '1rem',
                fontSize: '1.1rem'
              }}>
                Services
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to="/quality" 
                    style={{ 
                      color: '#cccccc', 
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                    onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                  >
                    Quality
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to="/inquiry" 
                    style={{ 
                      color: '#cccccc', 
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                    onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                  >
                    Inquiry
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to="/contact" 
                    style={{ 
                      color: '#cccccc', 
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                    onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                  >
                    Contact Us
                  </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to="/cart" 
                    style={{ 
                      color: '#cccccc', 
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                    onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                  >
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <div className="footer-section">
              <h5 style={{ 
                color: 'white', 
                fontWeight: '600', 
                marginBottom: '1rem',
                fontSize: '1.1rem'
              }}>
                Contact Information
              </h5>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  marginBottom: '1rem',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    color: 'var(--primary-blue)', 
                    fontSize: '1.2rem',
                    minWidth: '20px'
                  }}>
                    📍
                  </span>
                  <div style={{ color: '#cccccc', lineHeight: '1.5' }}>
                    A-20, Shanker Tekri, Industrial Estate, Shed No. A-20, Hirji Mistry Road, Near Punjab National Bank, Jamnagar - 361004, Gujarat - INDIA
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '1rem',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    color: 'var(--primary-blue)', 
                    fontSize: '1.2rem',
                    minWidth: '20px'
                  }}>
                    📞
                  </span>
                  <div style={{ color: '#cccccc' }}>
                    +91 288 2561871 / +91 98252 65401
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '1rem',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    color: 'var(--primary-blue)', 
                    fontSize: '1.2rem',
                    minWidth: '20px'
                  }}>
                    ✉️
                  </span>
                  <a 
                    href="mailto:lvsmachinetools@gmail.com"
                    style={{ 
                      color: '#cccccc', 
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                    onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                  >
                    lvsmachinetools@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div style={{ 
          borderTop: '1px solid #444', 
          paddingTop: '1.5rem', 
          marginTop: '2rem' 
        }}>
          <div className="row align-items-center">
            <div className="col-md-6">
              <p style={{ 
                color: '#cccccc', 
                margin: 0, 
                fontSize: '0.9rem' 
              }}>
                © 2024 L.V.S. Machine Tools. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div style={{ display: 'flex', justifyContent: 'end', gap: '1rem' }}>
                <Link 
                  to="/privacy" 
                  style={{ 
                    color: '#cccccc', 
                    textDecoration: 'none', 
                    fontSize: '0.9rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                  onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms" 
                  style={{ 
                    color: '#cccccc', 
                    textDecoration: 'none', 
                    fontSize: '0.9rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                  onMouseLeave={(e) => e.target.style.color = '#cccccc'}
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
