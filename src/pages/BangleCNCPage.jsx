import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BangleCNCPage.css';

const BangleCNCPage = () => {
  const [selectedImage, setSelectedImage] = useState('/images/bangle-cnc-main.png');

  const productImages = [
    { src: '/images/bangle-cnc-main.png', alt: 'Bangle CNC Cutting Machine - Main View' },
    { src: '/images/bangle-cnc-1.png', alt: 'Bangle CNC Cutting Machine - View 1' },
    { src: '/images/bangle-cnc-2.png', alt: 'Bangle CNC Cutting Machine - View 2' },
    { src: '/images/bangle-cnc-3.png', alt: 'Bangle CNC Cutting Machine - View 3' },
    { src: '/images/bangle-cnc-4.png', alt: 'Bangle CNC Cutting Machine - View 4' }
  ];

  const machines = [
    {
      name: 'Bangle CNC Cutting Machine',
      model: 'Standard Model',
      price: '₹ 1,05,000',
      description: 'High-precision CNC cutting machine for bangle manufacturing'
    },
    {
      name: 'CNC Bangle Cutting Machine',
      model: 'Professional Model',
      price: 'Ask Price',
      description: 'Advanced CNC technology for precise bangle cutting operations'
    },
    {
      name: 'CNC Bangle Flat And Half Round Cutting Machine',
      model: 'UBFM-37',
      price: '₹ 1,05,000',
      description: 'Versatile machine for both flat and half round bangle cutting'
    },
    {
      name: 'Bangle Cutting Machine',
      model: 'Economy Model',
      price: 'Ask Price',
      description: 'Cost-effective solution for bangle cutting requirements'
    }
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
            <span>Bangle CNC Cutting Machine</span>
          </div>
          
          <div className="product-header">
            <h1 className="product-title">
              Bangle CNC Cutting Machine
            </h1>
            <p className="product-subtitle">
              Leading Manufacturer of Bangle CNC Cutting Machine, CNC Bangle Cutting Machine, 
              CNC Bangle Flat And Half Round Cutting Machine and Bangle Cutting Machine from Jamnagar, India.
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
                  alt="Bangle CNC Cutting Machine"
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
                    title="Bangle CNC Cutting Machine Demo"
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
                <h2>Bangle CNC Cutting Machine</h2>
                <p className="product-brand">Brand: LVS</p>
                <p className="product-model">Model: UBEFM-SS</p>
                <div className="product-price">
                  <span className="price-currency">₹</span>
                  <span className="price-amount">1,05,000</span>
                  <span className="price-label">/ Piece</span>
                </div>
                <p className="product-description">
                  8 Axis CNC Universal Flat and Half Round Bangle and Rings Cutting & Engraving Combine Head Machine. 
                  The Model-UBEFM SS is a very popular, user-friendly model with improved power and additional tooling.
                </p>
                
                <div className="product-actions">
                  <button className="btn btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    Get Latest Price
                  </button>
                  <button className="btn btn-outline">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Key Specifications */}
              <div className="specifications-section">
                <h3>Key Specifications</h3>
                <div className="spec-table">
                  <div className="spec-row">
                    <span className="spec-label">Horizontal Spindle Speed</span>
                    <span className="spec-value">40000 to 60000 rpm</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Brand</span>
                    <span className="spec-value">LVS</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Automation Grade</span>
                    <span className="spec-value">Automatic</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Voltage</span>
                    <span className="spec-value">230 V</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Model</span>
                    <span className="spec-value">UBEFM-SS</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Machine Weight</span>
                    <span className="spec-value">700 Kgs</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Frequency</span>
                    <span className="spec-value">50Hz / 60Hz</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Dimension</span>
                    <span className="spec-value">34" x 34" x 84"</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Country of Origin</span>
                    <span className="spec-value">Made in India</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="features-section">
                <h3>Specification & Features</h3>
                <ul className="features-list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    8 axis 5 NC horizontal & vertical servo motor & linear guideway
                  </li>
                  <li>
                    <svg viewBox="0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Servo motor spindle for horizontal and vertical spindle
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    The machine Software is developed by using own software
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    The machine accept design from Corel Draw and Auto CAD
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Machine operate system in very easily
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    X-Y-Z Positional accuracy and repeat ability motor through synchro
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Variable speed for high RPM ATC Spindle (40000 to 60000 rpm)
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Carbide roughing, high speed model magazine with fast horizontal tool changer
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Machine Models Section */}
      <section className="machine-models">
        <div className="container">
          <h2 className="section-title">Available Models</h2>
          <div className="models-grid">
            {machines.map((machine, index) => (
              <div key={index} className="model-card">
                <div className="model-image">
                  <img 
                    src={productImages[index % productImages.length].src} 
                    alt={machine.name}
                  />
                </div>
                <div className="model-info">
                  <h3 className="model-name">{machine.name}</h3>
                  <p className="model-description">{machine.description}</p>
                  <div className="model-details">
                    <span className="model-price">{machine.price}</span>
                    {machine.model && (
                      <span className="model-number">Model: {machine.model}</span>
                    )}
                  </div>
                  <button className="model-btn">Ask Price</button>
                </div>
              </div>
            ))}
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
              Our Bangle CNC Cutting Machines are designed to meet the precise requirements of the jewelry and 
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

export default BangleCNCPage;
