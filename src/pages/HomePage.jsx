import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToCart, buyNow } from '../services/cartService';
import './HomePage.css';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        { _id: '1', name: 'CNC Bangle And Ring Cutting Machine', description: 'Bangle CNC Cutting Machine, CNC Bangle Cutting Machine', icon: 'machine', slug: 'cnc-bangle-ring-cutting' },
        { _id: '2', name: 'Faceting Machine', description: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine', icon: 'machine', slug: 'cnc-9axis-machine' },
        { _id: '3', name: 'Pendent And Ring Engraving & Cutting Machine', description: 'CNC Jewellery Engraving Machine', icon: 'cutting', slug: 'pendant-ring-engraving' },
        { _id: '4', name: 'Dough Balls Cutting Machine', description: 'Round Balls Automatic Faceting Cutting Machine', icon: 'gear', slug: 'dough-balls-cutting' },
        { _id: '5', name: 'Jewellery Cutting Machine', description: 'continuous pipe cutting machine', icon: 'diamond', slug: 'jewellery-cutting' },
        { _id: '6', name: 'Jewellery Engraving Machine', description: 'Professional jewellery engraving and cutting solutions', icon: 'engraving', slug: 'jewellery-engraving' }
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

  const handleAddToCart = async (product) => {
    try {
      const result = await addToCart(product._id, 1, product.price);
      if (result.success) {
        alert('Added to cart!');
      } else {
        alert(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleBuyNow = async (product) => {
    try {
      const result = await buyNow(product._id, 1, product.price);
      if (result.success) {
        navigate(`/order-tracking/${result.orderId}`);
      } else {
        alert(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error in buy now:', error);
      alert('Failed to place order');
    }
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
                <Link to="/products" className="btn btn-primary">
                  <span>Shop Now</span>
                  <i className="btn-icon">→</i>
                </Link>
                <Link to="/categories" className="btn btn-secondary">
                  <span>View Catalog</span>
                  <i className="btn-icon">📋</i>
                </Link>
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
          
          <div className="categories-grid grid grid-3">
            {categories.map((category) => (
              <div key={category._id} className="category-card card">
                {category.name === 'Faceting Machine' ? (
                  <div className="category-content">
                    <div className="category-icon">
                      <div className="machine-icon-special">
                        <img src="/images/lvs-logo.png" alt="LVS Logo" className="logo-overlay" />
                        <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                      </div>
                    </div>
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                  </div>
                ) : (
                  <div className="category-content">
                    <div className="category-icon">
                      {category.icon === 'machine' && (
                        <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                      )}
                      {category.icon === 'tool' && (
                        <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                        </svg>
                      )}
                      {category.icon === 'cutting' && (
                        <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="6" cy="6" r="3"></circle>
                          <circle cx="6" cy="18" r="3"></circle>
                          <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                          <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                          <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
                        </svg>
                      )}
                      {category.icon === 'gear' && (
                        <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
                        </svg>
                      )}
                      {category.icon === 'diamond' && (
                        <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 3h12l4 6-10 13L2 9l4-6z"></path>
                          <path d="M11 3 8 9l4 13 4-13-3-6"></path>
                          <path d="M2 9h20"></path>
                        </svg>
                      )}
                      {category.icon === 'engraving' && (
                        <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                          <path d="M2 2l7.586 7.586"></path>
                          <circle cx="11" cy="11" r="2"></circle>
                        </svg>
                      )}
                    </div>
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                  </div>
                )}
                <div className="category-btn-container">
                  {category.name === 'Faceting Machine' ? (
                    <Link to="/cnc-9axis-machine" className="btn btn-outline category-btn">
                      View Details
                    </Link>
                  ) : (
                    <Link to="/products" className="btn btn-outline category-btn">
                      View Products
                    </Link>
                  )}
                </div>
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
                      <button className="btn btn-outline product-btn" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                      <button className="btn btn-primary product-btn" onClick={() => handleBuyNow(product)}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-5">
              <Link to="/products" className="btn btn-secondary view-all-btn">
                <span>View All Products</span>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </Link>
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
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 3h15l2 3-2 3H1V3z"></path>
                  <path d="M16 12v9a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-9h16z"></path>
                  <circle cx="8" cy="8" r="2"></circle>
                </svg>
              </div>
              <h3 className="feature-title">Fast Shipping</h3>
              <p className="feature-description">
                Free shipping on orders over $500. Express delivery available for urgent requirements.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Quality Guarantee</h3>
              <p className="feature-description">
                All products come with manufacturer warranty and our quality assurance guarantee.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Expert Support</h3>
              <p className="feature-description">
                Our technical experts provide consultation and support for all your machinery needs.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className="feature-title">Best Prices</h3>
              <p className="feature-description">
                Competitive pricing with regular discounts and special offers for bulk purchases.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3 className="feature-title">24/7 Service</h3>
              <p className="feature-description">
                Round-the-clock customer service and technical support for your peace of mind.
              </p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="10" r="3"></circle>
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                </svg>
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
