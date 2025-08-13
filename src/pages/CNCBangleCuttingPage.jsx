import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BangleCNCPage.css';

const CNCBangleCuttingPage = () => {
  const [selectedImage, setSelectedImage] = useState('/images/cnc-bangle-main.png');

  const productImages = [
    { src: '/images/cnc-bangle-main.png', alt: 'CNC Bangle Cutting Machine - Main View' },
    { src: '/images/cnc-bangle-1.png', alt: 'CNC Bangle Cutting Machine - View 1' },
    { src: '/images/cnc-bangle-2.png', alt: 'CNC Bangle Cutting Machine - View 2' },
    { src: '/images/cnc-bangle-3.png', alt: 'CNC Bangle Cutting Machine - View 3' },
    { src: '/images/cnc-bangle-4.png', alt: 'CNC Bangle Cutting Machine - View 4' }
  ];

  return (
    <div className="bangle-cnc-page">
      {/* Hero Section */}
      <section className="product-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>CNC Bangle Cutting Machine</span>
          </div>
          
          <div className="product-header">
            <h1 className="product-title">
              CNC Bangle Cutting Machine
            </h1>
            <p className="product-subtitle">
              Advanced CNC technology for precise bangle cutting operations with professional grade components.
            </p>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="product-details">
        <div className="container">
          <div className="product-layout">
            {/* Product Gallery */}
            <div className="product-gallery">
              <div className="main-image">
                <img 
                  src={selectedImage} 
                  alt="CNC Bangle Cutting Machine"
                  className="main-product-image"
                />
              </div>
              
              <div className="thumbnail-gallery">
                {productImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImage === image.src ? 'active' : ''}`}
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img src={image.src} alt={image.alt} />
                  </div>
                ))}
              </div>

              {/* Video Section */}
              <div className="video-section">
                <h3>Product Video</h3>
                <div className="video-container">
                  <iframe
                    src="https://www.youtube.com/embed/QpAfWrWEKso"
                    title="CNC Bangle Cutting Machine Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="product-info">
              <div className="product-summary">
                <h2>CNC Bangle Cutting Machine</h2>
                <div className="product-price-display">
                  <span className="current-price">Ask Price</span>
                  <span className="price-note">Professional Model</span>
                </div>
                <p className="product-description">
                  Advanced CNC technology for precise bangle cutting operations with professional grade components.
                  Our machine offers superior accuracy and reliability for commercial bangle manufacturing.
                </p>
                
                <div className="product-actions">
                  <button className="btn btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    Send Inquiry
                  </button>
                  <button className="btn btn-outline">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    Call Now
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="features-section">
                <h3>Key Features</h3>
                <ul className="features-list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Professional grade CNC cutting technology
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    High precision cutting for commercial use
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Advanced control system
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Durable construction with quality components
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Low maintenance requirements
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Efficient production capabilities
                  </li>
                </ul>
              </div>

              {/* Specifications */}
              <div className="specifications-section">
                <h3>Specifications</h3>
                <div className="spec-table">
                  <div className="spec-row">
                    <span className="spec-label">Model</span>
                    <span className="spec-value">Professional Model</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Application</span>
                    <span className="spec-value">Bangle Cutting</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Material</span>
                    <span className="spec-value">Metal, Plastic, Wood</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Control System</span>
                    <span className="spec-value">CNC Computer Control</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Power Supply</span>
                    <span className="spec-value">As Per Requirement</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Automation Grade</span>
                    <span className="spec-value">Semi-Automatic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="company-info">
        <div className="container">
          <div className="company-details">
            <h2>About LVS Machine & Tools</h2>
            <p>
              We are a leading manufacturer and supplier of high-quality CNC machines and industrial equipment. 
              Our CNC Bangle Cutting Machines are designed to meet the precise requirements of the jewelry and 
              bangle manufacturing industry, offering reliability, precision, and cost-effectiveness.
            </p>
            <div className="company-stats">
              <div className="stat">
                <span className="stat-number">15+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CNCBangleCuttingPage;
