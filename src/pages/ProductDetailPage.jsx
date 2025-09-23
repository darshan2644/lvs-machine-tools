import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToCart, buyNow } from '../services/cartService';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(4.5);

  // Function to handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      const result = await addToCart(product._id, quantity, product.price);
      if (result.success) {
        alert(`${product.name} added to cart successfully!`);
      } else {
        alert(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  // Function to handle buy now - Direct to checkout
  const handleBuyNow = async () => {
    if (!product) return;
    
    // Create a buy now item for direct checkout
    const buyNowItem = {
      _id: product._id,
      productId: {
        _id: product._id,
        name: product.name,
        image: product.image || product.images?.[0],
        images: product.images || [product.image],
        brand: 'LVS Tools',
        price: product.price
      },
      name: product.name,
      price: product.price || 0,
      quantity: quantity,
      image: product.image || product.images?.[0] || '/images/placeholder-product.svg'
    };
    
    console.log('Buy Now clicked for:', product.name, 'Quantity:', quantity);
    
    // Navigate to checkout page with buy now item
    navigate('/checkout', {
      state: {
        buyNowItem: buyNowItem,
        isBuyNow: true
      }
    });
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
    // Here you can add API call to save/remove from wishlist
  };

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      
      // Sample product data for fallback
      const sampleProduct = {
        _id: id,
        name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
        description: 'High-precision 9-axis CNC machine with automatic tool changing capability for universal cutting and engraving operations. Perfect for professional manufacturing environments.',
        price: 250000,
        image: '/images/cnc-9axis-main.png',
        images: ['/images/cnc-9axis-main.png', '/images/cnc-detail-1.png', '/images/cnc-detail-2.png'],
        category: 'cnc-machines',
        categoryName: 'CNC Machines',
        specifications: {
          control: 'Fanuc System',
          axes: '9-Axis',
          features: [
            'Automatic Tool Changer',
            'High-Speed Spindle',
            'Precision Ball Screws',
            'Advanced Control System',
            'Safety Interlocks'
          ],
          applications: [
            'Metal Cutting',
            'Precision Engraving',
            'Component Machining',
            'Prototype Development'
          ]
        }
      };
      
      try {
        const [productRes, allProductsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`),
          axios.get('http://localhost:5000/api/products')
        ]);
        
        setProduct(productRes.data.data);
        
        // Get related products from same category
        const related = allProductsRes.data.data
          .filter(p => p.category === productRes.data.data.category && p._id !== id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (apiError) {
        console.log('Using sample data due to API error');
        setProduct(sampleProduct);
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  if (loading) {
    return (
      <div className="elegant-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="elegant-error">
        <div className="error-content animate-fade-in">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">View All Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-product-detail">
      {/* Breadcrumb Navigation */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="elegant-breadcrumb animate-slide-in-left">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">•</span>
            <Link to="/products" className="breadcrumb-link">Products</Link>
            <span className="breadcrumb-separator">•</span>
            <Link to={`/products?category=${product.category}`} className="breadcrumb-link">
              {product.categoryName}
            </Link>
            <span className="breadcrumb-separator">•</span>
            <span className="breadcrumb-current">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="main-product-section">
        <div className="container">
          <div className="product-layout">
            {/* Product Images */}
            <div className="product-images animate-slide-in-left">
              <div className="main-image-container">
                <img 
                  src={product.images?.[selectedImage] || product.image || '/images/placeholder-product.svg'} 
                  alt={product.name}
                  className="main-product-image"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.svg';
                  }}
                />
                <div className="image-badges">
                  <span className="quality-badge">Premium Quality</span>
                </div>
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="image-thumbnails">
                  {product.images.map((img, index) => (
                    <div 
                      key={index}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={img} alt={`${product.name} view ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="product-info animate-slide-in-right">
              <div className="product-header">
                <span className="product-category-tag">{product.categoryName}</span>
                <h1 className="product-name">{product.name}</h1>
                
                {/* Rating and Reviews */}
                <div className="rating-section">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={star <= averageRating ? 'star filled' : 'star'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">({averageRating}) • 127 reviews</span>
                </div>
                
                <p className="product-description">{product.description}</p>
              </div>

              <div className="pricing-section">
                <div className="price-container">
                  <span className="current-price">
                    {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Contact for Price'}
                  </span>
                  {product.price && (
                    <span className="original-price">
                      ₹{(product.price * 1.15).toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.price && (
                    <span className="discount-badge">Save 13%</span>
                  )}
                </div>
                <div className="price-details">
                  <p className="delivery-info">
                    <strong>Free delivery</strong> on orders above ₹50,000
                  </p>
                  <p className="stock-status">
                    ✅ <span className="in-stock">In stock</span> - Order today
                  </p>
                </div>
              </div>

              <div className="quantity-section">
                <label className="quantity-label">Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-buy-now" onClick={handleBuyNow}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="currentColor"/>
                    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="currentColor"/>
                    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Buy Now
                </button>
                <button className="btn-add-to-cart" onClick={handleAddToCart}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.1 16.4H17M17 13V16.4H17M9 19.5A1.5 1.5 0 1 1 10.5 21A1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 21.5 21A1.5 1.5 0 0 1 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add to Cart
                </button>
                <button 
                  className={`btn-wishlist ${isInWishlist ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                  title="Add to Wishlist"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={isInWishlist ? "currentColor" : "none"}/>
                  </svg>
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              <div className="product-features">
                <div className="feature-item">
                  <div className="feature-icon">🚚</div>
                  <div className="feature-text">
                    <strong>Free Shipping</strong>
                    <span>On orders above ₹50,000</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🛡️</div>
                  <div className="feature-text">
                    <strong>2 Year Warranty</strong>
                    <span>Comprehensive coverage</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔧</div>
                  <div className="feature-text">
                    <strong>Expert Support</strong>
                    <span>24/7 technical assistance</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔄</div>
                  <div className="feature-text">
                    <strong>Easy Returns</strong>
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="tabs-container animate-fade-in">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews.length || 127})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === 'overview' && (
                <div className="tab-panel">
                  <h3>Product Overview</h3>
                  <p>{product.description}</p>
                  <div className="overview-highlights">
                    <h4>Key Highlights:</h4>
                    <ul>
                      <li>✅ Professional-grade industrial machine</li>
                      <li>✅ High precision and reliability</li>
                      <li>✅ Advanced control systems</li>
                      <li>✅ Comprehensive warranty coverage</li>
                      <li>✅ Expert technical support included</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="tab-panel">
                  <h3>Technical Specifications</h3>
                  {product.specifications ? (
                    <div className="specs-grid">
                      <div className="spec-item">
                        <strong>Control System:</strong>
                        <span>{product.specifications.control}</span>
                      </div>
                      <div className="spec-item">
                        <strong>Axes Configuration:</strong>
                        <span>{product.specifications.axes}</span>
                      </div>
                      {product.specifications.features && (
                        <div className="spec-item">
                          <strong>Key Features:</strong>
                          <ul>
                            {product.specifications.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {product.specifications.applications && (
                        <div className="spec-item">
                          <strong>Applications:</strong>
                          <ul>
                            {product.specifications.applications.map((app, index) => (
                              <li key={index}>{app}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="default-specs">
                      <div className="spec-item">
                        <strong>Build Quality:</strong>
                        <span>Industrial-grade construction with premium materials</span>
                      </div>
                      <div className="spec-item">
                        <strong>Precision:</strong>
                        <span>High-precision manufacturing for superior accuracy</span>
                      </div>
                      <div className="spec-item">
                        <strong>Reliability:</strong>
                        <span>Engineered for continuous operation and long-lasting performance</span>
                      </div>
                      <div className="spec-item">
                        <strong>Support:</strong>
                        <span>Comprehensive technical support and training included</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-panel">
                  <h3>Customer Reviews</h3>
                  <div className="reviews-summary">
                    <div className="rating-overview">
                      <div className="avg-rating">
                        <span className="rating-number">{averageRating}</span>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star} 
                              className={star <= averageRating ? 'star filled' : 'star'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span>Based on 127 reviews</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sample-reviews">
                    <div className="review-item">
                      <div className="review-header">
                        <strong>Rajesh Kumar</strong>
                        <div className="review-rating">
                          ★★★★★
                        </div>
                      </div>
                      <p>"Excellent machine quality and performance. Very satisfied with the purchase."</p>
                      <small>Verified Purchase • 2 months ago</small>
                    </div>
                    
                    <div className="review-item">
                      <div className="review-header">
                        <strong>Priya Shah</strong>
                        <div className="review-rating">
                          ★★★★☆
                        </div>
                      </div>
                      <p>"Good build quality and reliable performance. Technical support is very helpful."</p>
                      <small>Verified Purchase • 1 month ago</small>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="tab-panel">
                  <h3>Shipping & Returns</h3>
                  <div className="shipping-info">
                    <div className="info-section">
                      <h4>🚚 Shipping Information</h4>
                      <ul>
                        <li>Free shipping on orders above ₹50,000</li>
                        <li>Standard delivery: 7-14 business days</li>
                        <li>Express delivery available for urgent orders</li>
                        <li>Professional installation service available</li>
                      </ul>
                    </div>
                    
                    <div className="info-section">
                      <h4>🔄 Return Policy</h4>
                      <ul>
                        <li>30-day return policy for all products</li>
                        <li>Product must be in original condition</li>
                        <li>Return shipping costs may apply</li>
                        <li>Refund processed within 7-10 business days</li>
                      </ul>
                    </div>
                    
                    <div className="info-section">
                      <h4>🛡️ Warranty</h4>
                      <ul>
                        <li>2-year comprehensive warranty</li>
                        <li>Covers manufacturing defects</li>
                        <li>Free technical support</li>
                        <li>On-site service available</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications */}
      <section className="specifications-section">
        <div className="container">
          <div className="specs-container animate-fade-in">
            <h2 className="section-title">Quick Specifications</h2>
            
            {product.specifications ? (
              <div className="specs-grid">
                <div className="spec-card">
                  <h3>Control System</h3>
                  <p>{product.specifications.control}</p>
                </div>
                <div className="spec-card">
                  <h3>Axes Configuration</h3>
                  <p>{product.specifications.axes}</p>
                </div>
                <div className="spec-card">
                  <h3>Key Features</h3>
                  <ul>
                    {product.specifications.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="spec-card">
                  <h3>Applications</h3>
                  <ul>
                    {product.specifications.applications?.map((app, index) => (
                      <li key={index}>{app}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="default-specs">
                <div className="spec-item">
                  <h4>✨ High-Precision Manufacturing</h4>
                  <p>Advanced engineering for superior accuracy and reliability</p>
                </div>
                <div className="spec-item">
                  <h4>🔧 Professional Grade Quality</h4>
                  <p>Built to meet industrial standards with premium components</p>
                </div>
                <div className="spec-item">
                  <h4>🛡️ Durable Construction</h4>
                  <p>Robust design engineered for long-lasting performance</p>
                </div>
                <div className="spec-item">
                  <h4>🎯 Expert Technical Support</h4>
                  <p>Comprehensive support and training included with purchase</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="container">
            <h2 className="section-title">You Might Also Like</h2>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="related-product-card hover-lift">
                  <div className="related-image">
                    <img 
                      src={relatedProduct.image || '/images/placeholder-product.svg'} 
                      alt={relatedProduct.name}
                    />
                  </div>
                  <div className="related-info">
                    <h4>{relatedProduct.name}</h4>
                    <p>{relatedProduct.description?.substring(0, 60)}...</p>
                    <Link 
                      to={`/product/${relatedProduct._id}`} 
                      className="related-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
