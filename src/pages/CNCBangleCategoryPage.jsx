import React from 'react';
import { Link } from 'react-router-dom';
import './BangleCNCPage.css';

const CNCBangleCategoryPage = () => {
  const products = [
    {
      id: 1,
      name: 'CNC Bangle Cutting Machine',
      model: 'Standard Model',
      price: 'Ask Price',
      image: '/images/bangle-cnc-1.png',
      link: '/cnc-bangle-cutting-machine',
      features: ['High precision cutting', 'Computer controlled', 'Versatile operation'],
      description: 'Professional CNC bangle cutting machine for precision jewelry manufacturing.'
    },
    {
      id: 2,
      name: 'CNC Bangle Flat And Half Round Cutting Machine',
      model: 'UBFM-37',
      price: '₹ 1,05,000',
      image: '/images/bangle-cnc-2.png',
      link: '/cnc-bangle-flat-half-round',
      features: ['Dual cutting capability', 'Flat and half round', 'UBFM-37 specifications'],
      description: 'Versatile machine for both flat and half round bangle cutting applications.'
    },
    {
      id: 3,
      name: 'CNC Bangle MR-5',
      model: 'MR-5',
      price: '₹ 1,05,000',
      image: '/images/bangle-cnc-3.png',
      link: '/cnc-bangle-mr5',
      features: ['Advanced MR-5 technology', 'Enhanced automation', 'High-speed cutting'],
      description: 'Latest MR-5 model with enhanced automation and precision cutting capabilities.'
    },
    {
      id: 4,
      name: 'Bangle Cutting Machine Semi-Automatic',
      model: 'Semi-Auto',
      price: '₹ 1,05,000',
      image: '/images/bangle-cnc-4.png',
      link: '/bangle-cutting-semi-auto',
      features: ['Semi-automatic operation', 'Cost-effective', 'Easy to operate'],
      description: 'Perfect balance of automation and manual control for medium-scale production.'
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
            <span>CNC Bangle and Ring Cutting</span>
          </div>
          
          <div className="product-header">
            <h1 className="product-title">
              CNC Bangle and Ring Cutting Machines
            </h1>
            <p className="product-subtitle">
              Comprehensive range of CNC machines for precision bangle and ring cutting applications. 
              Professional-grade equipment for jewelry manufacturing and bangle production.
            </p>
          </div>
        </div>
      </section>

      {/* Category Introduction */}
      <section className="category-intro">
        <div className="container">
          <div className="intro-content">
            <h2>Our CNC Bangle Cutting Solutions</h2>
            <p>
              At LVS Machine & Tools, we offer a comprehensive range of CNC bangle and ring cutting machines 
              designed to meet diverse manufacturing needs. From standard models to advanced automated systems, 
              our machines deliver precision, reliability, and efficiency for jewelry and bangle production.
            </p>
            
            {/* Video Section */}
            <div className="category-video">
              <h3>See Our Machines in Action</h3>
              <div className="video-container">
                <iframe
                  src="https://www.youtube.com/embed/QpAfWrWEKso"
                  title="CNC Bangle Cutting Machines Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-grid-section">
        <div className="container">
          <h2>Our CNC Bangle Cutting Machines</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <Link to={product.link} className="view-details-btn">
                      View Details
                    </Link>
                  </div>
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-model">Model: {product.model}</p>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-features">
                    <h4>Key Features:</h4>
                    <ul>
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="product-price">
                    <span className="price">{product.price}</span>
                    {product.price !== 'Ask Price' && <span className="price-unit">per Piece</span>}
                  </div>
                  
                  <div className="product-actions">
                    <Link to={product.link} className="btn btn-primary">
                      View Details
                    </Link>
                    <button className="btn btn-outline">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      Inquiry
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="category-features">
        <div className="container">
          <h2>Why Choose Our CNC Bangle Cutting Machines?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                </svg>
              </div>
              <h3>Precision Engineering</h3>
              <p>Advanced CNC technology ensures accurate and consistent cutting results for all bangle types.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                </svg>
              </div>
              <h3>High Efficiency</h3>
              <p>Optimized for fast production cycles while maintaining superior quality standards.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3>Easy Maintenance</h3>
              <p>Designed for minimal maintenance requirements with accessible components and user-friendly operation.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3>Quality Assurance</h3>
              <p>Every machine undergoes rigorous testing to ensure reliable performance and longevity.</p>
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
              With over 15 years of experience in manufacturing high-quality CNC machines, LVS Machine & Tools 
              has established itself as a trusted name in the jewelry and bangle manufacturing industry. 
              Our CNC bangle cutting machines are designed to meet the evolving needs of modern manufacturers, 
              combining cutting-edge technology with reliable performance.
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
                <span className="stat-number">4</span>
                <span className="stat-label">Machine Models</span>
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

export default CNCBangleCategoryPage;
