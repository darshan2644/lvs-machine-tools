import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToCart, buyNow } from '../services/cartService';

// Sample products for fallback
const sampleProducts = [
  {
    _id: 'cnc-9axis',
    name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
    description: 'High-precision 9-axis CNC machine with automatic tool changing capability for universal cutting and engraving operations.',
    price: 250000,
    image: '/images/cnc-9axis-main.png',
    category: 'cnc-machines',
    categoryName: 'CNC Machines'
  },
  {
    _id: 'bangle-cnc-main',
    name: 'Bangle CNC Cutting Machine',
    description: 'Leading Manufacturer of Bangle CNC Cutting Machine with high precision cutting technology for jewelry manufacturing.',
    price: 105000,
    image: '/images/bangle-cnc-main.png',
    category: 'bangle-cnc-cutting',
    categoryName: 'Bangle CNC Cutting'
  },
  {
    _id: 'cnc-bangle-standard',
    name: 'CNC Bangle Cutting Machine',
    description: 'Professional CNC bangle cutting machine for precision jewelry manufacturing with standard model specifications.',
    price: 95000,
    image: '/images/cnc-bangle-main.png',
    category: 'bangle-cnc-cutting',
    categoryName: 'Bangle CNC Cutting'
  }
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(sampleProducts);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  
  // Function to handle add to cart
  const handleAddToCart = async (product) => {
    console.log('Add to cart clicked for product:', product);
    try {
      const result = await addToCart(product._id, 1, product.price);
      console.log('Add to cart result:', result);
      if (result.success) {
        alert('Product added to cart successfully!');
      } else {
        alert(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  // Function to handle buy now
  const handleBuyNow = async (product) => {
    console.log('Buy now clicked for product:', product);
    try {
      const result = await buyNow(product._id, 1, product.price);
      console.log('Buy now result:', result);
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/categories'),
        axios.get('http://localhost:5000/api/products')
      ]);
      
      setCategories(categoriesRes.data.data || []);
      setProducts(productsRes.data.data || sampleProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use sample data on error
      setCategories([
        { _id: 'cnc-machines', name: 'CNC Machines', slug: 'cnc-machines' },
        { _id: 'bangle-cnc-cutting', name: 'Bangle CNC Cutting', slug: 'bangle-cnc-cutting' }
      ]);
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Set initial category from URL parameters
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams, fetchData]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="loading-spinner mb-3"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)', 
        color: 'white', 
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '1rem' 
          }}>
            Our <span style={{ color: '#FFD700' }}>Product Range</span>
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            opacity: '0.9', 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            Explore our comprehensive collection of professional machine tools and industrial equipment
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section style={{ padding: '2rem 0', backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: '400px' }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="category-filter d-flex justify-content-md-end">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: '200px' }}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem 0' }}>
              <h3 style={{ color: 'var(--light-text)', marginBottom: '1rem' }}>No products found</h3>
              <p style={{ color: 'var(--light-text)' }}>No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="row">
              {filteredProducts.map((product) => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card" style={{ height: '100%', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                    <div 
                      className="product-image" 
                      onClick={() => navigate(`/product/${product._id}`)}
                      style={{ 
                        height: '250px', 
                        overflow: 'hidden', 
                        borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
                        position: 'relative'
                      }}
                    >
                      <img 
                        src={product.image || '/images/placeholder-product.svg'} 
                        alt={product.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.svg';
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                      {product.categoryName && (
                        <span className="badge" style={{
                          position: 'absolute',
                          top: '1rem',
                          left: '1rem',
                          backgroundColor: 'var(--primary-blue)',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--border-radius)',
                          fontSize: '0.75rem'
                        }}>
                          {product.categoryName}
                        </span>
                      )}
                    </div>
                    <div className="card-body p-3">
                      <h5 className="card-title" style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        color: 'var(--dark-text)',
                        lineHeight: '1.3',
                        height: '2.6rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {product.name}
                      </h5>
                      <p className="card-text" style={{ 
                        color: 'var(--light-text)', 
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                        height: '2.7rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {product.description || 'Professional machine tool for industrial applications'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="product-price" style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700', 
                          color: 'var(--primary-blue)' 
                        }}>
                          {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Ask Price'}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-primary btn-sm flex-fill"
                          onClick={() => {
                            console.log('Buy Now clicked!', product);
                            handleBuyNow({
                              _id: product._id,
                              name: product.name,
                              price: product.price || 0,
                              image: product.image,
                              category: product.categoryName,
                              brand: 'LVS'
                            });
                          }}
                          style={{ fontWeight: '500' }}
                        >
                          Buy Now
                        </button>
                        <button 
                          className="btn btn-outline btn-sm flex-fill"
                          onClick={() => {
                            console.log('Add to Cart clicked!', product);
                            handleAddToCart({
                              _id: product._id,
                              name: product.name,
                              price: product.price || 0,
                              image: product.image,
                              category: product.categoryName,
                              brand: 'LVS'
                            });
                          }}
                          style={{ fontWeight: '500' }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
