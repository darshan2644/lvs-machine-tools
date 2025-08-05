import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/categories'),
        axios.get('http://localhost:5000/api/products/featured?limit=8')
      ]);
      
      setCategories(categoriesRes.data.data);
      setFeaturedProducts(productsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set mock data for development
      setCategories([
        { _id: '1', name: 'CNC Bangle And Ring Cutting Machine', description: 'Bangle CNC Cutting Machine, CNC Bangle Cutting Machine', icon: '💍', slug: 'cnc-bangle-ring-cutting' },
        { _id: '2', name: 'Faceting Machine', description: 'CNC BANGLE DOUBLE HEAD CUTTING MACHINE', icon: '�', slug: 'faceting-machine' },
        { _id: '3', name: 'Pendent And Ring Engraving & Cutting Machine', description: 'CNC Jewellery Engraving Machine', icon: '🔗', slug: 'pendant-ring-engraving' },
        { _id: '4', name: 'Dough Balls Cutting Machine', description: 'Round Balls Automatic Faceting Cutting Machine', icon: '⚙️', slug: 'dough-balls-cutting' },
        { _id: '5', name: 'Jewellery Cutting Machine', description: 'continuous pipe cutting machine', icon: '✨', slug: 'jewellery-cutting' },
        { _id: '6', name: 'Jewellery Engraving Machine', description: 'Professional jewellery engraving and cutting solutions', icon: '🎨', slug: 'jewellery-engraving' }
      ]);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const StarRating = ({ rating, reviewCount }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return (
      <div className="rating">
        <div className="stars">{stars}</div>
        <span className="review-count">({reviewCount})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">
                Professional <span className="text-accent">Machine Tools</span> & Equipment
              </h1>
              <p className="hero-subtitle">
                Your trusted partner for high-quality industrial machinery, precision tools, and professional equipment. 
                Serving manufacturers, fabricators, and craftsmen worldwide.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary">
                  <span>Shop Now</span>
                  <i className="btn-icon"></i>
                </button>
                <button className="btn btn-secondary">
                  <span>View Catalog</span>
                  <i className="btn-icon"></i>
                </button>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Products</div>
              </div>
              <div className="stat">
                <div className="stat-number">25+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories section">
        <div className="container">
          <h2 className="section-title">Product Categories</h2>
          <p className="section-subtitle">
            Explore our comprehensive range of professional machine tools and equipment
          </p>
          
          <div className="categories-grid grid grid-6">
            {categories.map((category) => (
              <div key={category._id} className="category-card card">
                <div className="category-icon">
                  <span className="icon-large">{category.icon}</span>
                </div>
                <h3 className="category-title">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <button className="btn btn-outline category-btn">
                  View Products
                </button>
              </div>
            ))}
          </div>
          
          <div className="section-actions">
            <Link to="/categories" className="btn btn-outline view-all-btn">
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="featured-products section">
          <div className="container">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Hand-picked premium machines and tools from leading manufacturers
            </p>
            
            <div className="products-grid grid grid-4">
              {featuredProducts.map((product) => (
                <div key={product._id} className="product-card card">
                  <div className="product-image">
                    <img 
                      src={product.images[0] || '/images/placeholder-product.jpg'} 
                      alt={product.name}
                      className="img-cover"
                    />
                    {product.featured && <span className="product-badge">Featured</span>}
                    {!product.inStock && <span className="product-badge out-of-stock">Out of Stock</span>}
                  </div>
                  
                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <h3 className="product-name">{product.name}</h3>
                    
                    {product.rating > 0 && (
                      <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                    )}
                    
                    <div className="product-price">
                      <span className="price-current">{formatPrice(product.price)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="price-original">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    
                    <div className="product-actions">
                      <button className="btn btn-primary product-btn">
                        View Details
                      </button>
                      <button className="btn btn-outline product-btn">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-5">
              <button className="btn btn-secondary">
                View All Products
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <h2 className="section-title">Why Choose LVS Tools?</h2>
          
          <div className="features-grid grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">
                <span className="icon-large">🚚</span>
              </div>
              <h3 className="feature-title">Fast Shipping</h3>
              <p className="feature-description">
                Free shipping on orders over $500. Express delivery available for urgent requirements.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <span className="icon-large">🛡️</span>
              </div>
              <h3 className="feature-title">Quality Guarantee</h3>
              <p className="feature-description">
                All products come with manufacturer warranty and our quality assurance guarantee.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <span className="icon-large">🔧</span>
              </div>
              <h3 className="feature-title">Expert Support</h3>
              <p className="feature-description">
                Our technical experts provide consultation and support for all your machinery needs.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <span className="icon-large">💰</span>
              </div>
              <h3 className="feature-title">Best Prices</h3>
              <p className="feature-description">
                Competitive pricing with regular discounts and special offers for bulk purchases.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <span className="icon-large">📞</span>
              </div>
              <h3 className="feature-title">24/7 Service</h3>
              <p className="feature-description">
                Round-the-clock customer service and technical support for your peace of mind.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <span className="icon-large">🎯</span>
              </div>
              <h3 className="feature-title">Custom Solutions</h3>
              <p className="feature-description">
                Tailored machinery solutions and custom configurations to meet your specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Upgrade Your Workshop?</h2>
            <p className="cta-subtitle">
              Get expert advice and find the perfect machines for your business
            </p>
            <div className="cta-actions">
              <button className="btn btn-primary">
                Contact Our Experts
              </button>
              <button className="btn btn-secondary">
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
