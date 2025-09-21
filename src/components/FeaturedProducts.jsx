import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'High-Precision 5-Axis CNC Mill',
      description: 'Unrivaled accuracy for complex parts',
      image: '/images/cnc-9axis-main.png',
      category: 'cnc-machines',
      featured: true
    },
    {
      id: 2,
      name: 'Automated Laser Cutter Pro',
      description: 'Speed and efficiency for mass production',
      image: '/images/bangle-cnc-main.png',
      category: 'cutting-machines',
      featured: true
    },
    {
      id: 3,
      name: 'Robotic Welding Arm X200',
      description: 'Advanced automation for consistent quality',
      image: '/images/cnc-bangle-main.png',
      category: 'welding-equipment',
      featured: true
    },
    {
      id: 4,
      name: 'Precision Engraving System',
      description: 'Intricate detailing with micron-level precision',
      image: '/images/bangle-cnc-1.png',
      category: 'engraving-machines',
      featured: true
    },
    {
      id: 5,
      name: 'Industrial Wire Cutting Machine',
      description: 'High-speed wire cutting with extreme precision',
      image: '/images/cnc-9axis-1.png',
      category: 'wire-cutting',
      featured: true
    },
    {
      id: 6,
      name: 'Advanced Bangle Cutting System',
      description: 'Specialized machinery for jewelry manufacturing',
      image: '/images/cnc-bangle-1.png',
      category: 'bangle-cutting',
      featured: true
    }
  ];

  return (
    <section className="featured-products-section">
      <div className="featured-products-container">
        <div className="featured-products-header">
          <h2 className="featured-products-title">Our Latest Innovations</h2>
          <p className="featured-products-subtitle">
            Discover cutting-edge industrial machinery designed for precision, efficiency, and reliability
          </p>
        </div>
        
        <div className="featured-products-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="featured-product-card">
              <div className="product-image-wrapper">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-badge">
                  <span>Featured</span>
                </div>
              </div>
              
              <div className="product-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-actions">
                  <Link 
                    to={`/products/${product.category}`} 
                    className="product-link"
                  >
                    Learn More
                    <svg className="link-arrow" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="featured-products-cta">
          <Link to="/products" className="view-all-products-btn">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;