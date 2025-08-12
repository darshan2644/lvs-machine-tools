import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CNC9AxisPage.css';

const CNC9AxisPage = () => {
  const [selectedImage, setSelectedImage] = useState('/images/cnc-9axis-main.png');
  const [showVideo, setShowVideo] = useState(false);

  const productImages = [
    '/images/cnc-9axis-main.png',
    '/images/cnc-9axis-1.png',
    '/images/cnc-9axis-2.png'
  ];

  const features = [
    "Window base user friendly software operates on personal computer.",
    "Programmable 9 axis CNC controller with for engraving, drilling and cutout of various design as well as side cutting with vertical and horizontal head respectively compatible with corel draw for designing.",
    "Variable spindle speed for horizontal and vertical.",
    "Automatic zero search of all Axis homing.",
    "Linear and circular programmable interpolation.",
    "Horizontal 10 tools and vertical 10 tools programmable with variable depth and spindle speed.",
    "Machine is totally operated on single phase power supply. Air conditioning required. Machine works under normal room temperature.",
    "All required pneumatic and vacuum.",
    "Facilitated with manual lubricating pump.",
    "No special programming is required for different diameters of bangle and ring.",
    "Designing can be placed wherever needed on the width of work-piece either circular or width wise.",
    "Effective 'auto electro brake system' which stops horizontal/vertical spindle instantly.",
    "Machine is enclosed in a very attractive cabinet having true glass sliding doors to collect scrap and prevent outside dust.",
    "Machine is provided with vacuum dust collector.",
    "Special high speed precision spindle is supplied on request.",
    "Case of power failure design can be continued from any point and complete machine is supported with UPS."
  ];

  const specifications = [
    { label: "Machine Dimension", value: "55 X 51 X 72 inches" },
    { label: "Machine Weight", value: "1000 KGS" }
  ];

  const additionalInfo = [
    { label: "Product Code", value: "UBFM*459" },
    { label: "Payment Terms", value: "L/C, D/A, D/P, T/T" }
  ];

  return (
    <div className="cnc-9axis-page">
      {/* Hero Section */}
      <section className="product-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine</span>
          </div>
          
          <div className="product-hero-content">
            <div className="product-media">
              <div className="main-image-container">
                {showVideo ? (
                  <div className="video-container">
                    <iframe
                      src="https://www.youtube.com/embed/JpXSqID3S0Y"
                      title="9 Axis CNC Machine Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <button 
                      className="close-video"
                      onClick={() => setShowVideo(false)}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="image-container">
                    <img 
                      src={selectedImage} 
                      alt="9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine"
                      className="main-product-image"
                    />
                    <button 
                      className="play-video-btn"
                      onClick={() => setShowVideo(true)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Watch Demo
                    </button>
                  </div>
                )}
              </div>
              
              <div className="thumbnail-gallery">
                {productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedImage(image);
                      setShowVideo(false);
                    }}
                  />
                ))}
                <button 
                  className={`thumbnail video-thumb ${showVideo ? 'active' : ''}`}
                  onClick={() => setShowVideo(true)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Video</span>
                </button>
              </div>
            </div>

            <div className="product-info">
              <div className="product-header">
                <h1 className="product-title">
                  9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine
                </h1>
                <div className="product-brand">
                  <img src="/images/lvs-logo.png" alt="LVS" className="brand-logo" />
                  <span>Speco Technologies</span>
                </div>
              </div>

              <div className="product-actions">
                <button className="btn btn-primary inquiry-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Send Inquiry
                </button>
                <button className="btn btn-secondary contact-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  Contact Us
                </button>
              </div>

              <div className="quick-specs">
                <h3>Quick Specifications</h3>
                <div className="specs-grid">
                  {specifications.map((spec, index) => (
                    <div key={index} className="spec-item">
                      <span className="spec-label">{spec.label}:</span>
                      <span className="spec-value">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="features-list">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="specifications-section">
        <div className="container">
          <div className="specs-content">
            <div className="specs-column">
              <h2>Specifications</h2>
              <div className="specs-table">
                {specifications.map((spec, index) => (
                  <div key={index} className="spec-row">
                    <span className="spec-label">{spec.label}</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="specs-column">
              <h2>Additional Information</h2>
              <div className="specs-table">
                {additionalInfo.map((info, index) => (
                  <div key={index} className="spec-row">
                    <span className="spec-label">{info.label}</span>
                    <span className="spec-value">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Interested in this Machine?</h2>
            <p>Get detailed specifications, pricing, and technical support for the 9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine.</p>
            <div className="cta-actions">
              <button className="btn btn-primary">
                Request Quote
              </button>
              <button className="btn btn-secondary">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CNC9AxisPage;
