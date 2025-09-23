import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info Section */}
          <div className="footer-section company-section">
            <div className="company-header">
              <div className="logo-container">
                <img 
                  src="/images/lvs-logo.png" 
                  alt="LVS Machine Tools" 
                  className="footer-logo"
                />
              </div>
              <h3 className="company-name">L.V.S. MACHINE TOOLS</h3>
            </div>
            <p className="company-description">
              We are a reputed and renowned company occupied in manufacturing, trading and 
              supplying a world class collection of Jewellery CNC Bangle Faceting Machine 
              and all types of Jewellery SPM Machineries.
            </p>
            <Link to="/about" className="read-more-btn">
              Read More
            </Link>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4 className="section-title">
              <span className="title-underline">Quick Links</span>
            </h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="footer-section">
            <h4 className="section-title">
              <span className="title-underline">Services</span>
            </h4>
            <ul className="footer-links">
              <li><Link to="/quality">Quality</Link></li>
              <li><Link to="/inquiry">Inquiry</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div className="footer-section contact-section">
            <h4 className="section-title">
              <span className="title-underline">Contact Information</span>
            </h4>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <div className="contact-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
                <div className="contact-details">
                  <p>A-20, Shanker Tekri, Industrial Estate, Shed No. A-20, Hirji Mistry Road, Near Punjab National Bank, Jamnagar - 361004, Gujarat - INDIA</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <div className="contact-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="contact-details">
                  <p>+91 288 2561871 / +91 98252 65401</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <div className="contact-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="contact-details">
                  <a href="mailto:lvsmachinetools@gmail.com">
                    lvsmachinetools@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2024 L.V.S. Machine Tools. All rights reserved.
            </p>
            <div className="footer-legal">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;