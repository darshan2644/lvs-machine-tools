import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/products" className="btn btn-primary">View All Products</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`}>{product.categoryName}</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-grid">
            <div className="product-image-section">
              <div className="main-image">
                <img 
                  src={product.image || '/images/placeholder-product.svg'} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.svg';
                  }}
                />
              </div>
              <div className="image-gallery">
                <div className="thumbnail active">
                  <img 
                    src={product.image || '/images/placeholder-product.svg'} 
                    alt={product.name}
                  />
                </div>
              </div>
            </div>

            <div className="product-info-section">
              <div className="product-category">
                <Link to={`/products?category=${product.category}`}>
                  {product.categoryName}
                </Link>
              </div>
              
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-description">
                <p>{product.description}</p>
              </div>

              <div className="product-specifications">
                <h3>Specifications</h3>
                {product.specifications ? (
                  <div className="specs-grid">
                    <div className="spec-item">
                      <strong>Control System:</strong> {product.specifications.control}
                    </div>
                    <div className="spec-item">
                      <strong>Axes:</strong> {product.specifications.axes}
                    </div>
                    <div className="spec-item">
                      <strong>Key Features:</strong>
                      <ul>
                        {product.specifications.features?.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="spec-item">
                      <strong>Applications:</strong>
                      <ul>
                        {product.specifications.applications?.map((app, index) => (
                          <li key={index}>{app}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <ul>
                    <li>High-precision manufacturing</li>
                    <li>Professional grade quality</li>
                    <li>Durable construction</li>
                    <li>Expert technical support included</li>
                    <li>Warranty coverage available</li>
                  </ul>
                )}
              </div>

              <div className="product-actions">
                <button className="btn btn-primary btn-large">
                  <span>Request Quote</span>
                  <i className="btn-icon">💬</i>
                </button>
                <button className="btn btn-secondary btn-large">
                  <span>Contact Sales</span>
                  <i className="btn-icon">📞</i>
                </button>
              </div>

              <div className="product-info-cards">
                <div className="info-card">
                  <div className="info-icon">🚚</div>
                  <div className="info-content">
                    <h4>Free Shipping</h4>
                    <p>On orders over $500</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">🛡️</div>
                  <div className="info-content">
                    <h4>Warranty</h4>
                    <p>Manufacturer warranty included</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">🔧</div>
                  <div className="info-content">
                    <h4>Expert Support</h4>
                    <p>Technical assistance available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="container">
            <h2 className="section-title">Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="related-product-card">
                  <div className="related-product-image">
                    <img 
                      src={relatedProduct.image || '/images/placeholder-product.svg'} 
                      alt={relatedProduct.name}
                    />
                  </div>
                  <div className="related-product-info">
                    <h4 className="related-product-title">{relatedProduct.name}</h4>
                    <p className="related-product-description">
                      {relatedProduct.description.substring(0, 80)}...
                    </p>
                    <Link 
                      to={`/product/${relatedProduct._id}`} 
                      className="btn btn-outline btn-small"
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
