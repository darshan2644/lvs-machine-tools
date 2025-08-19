import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToCart, buyNow } from '../services/cartService';
import './ProductsPage.css';

// Sample products moved outside component to avoid dependency issues
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  
  // Function to handle add to cart
  const handleAddToCart = async (product) => {
    try {
      const result = await addToCart(product._id, 1, product.price);
      if (result.success) {
        // Show success feedback
        const feedback = document.createElement('div');
        feedback.className = 'fixed top-4 right-4 bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        feedback.innerHTML = `
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="font-semibold">Added to cart!</span>
          </div>
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
          feedback.style.transform = 'translateX(400px)';
          setTimeout(() => {
            if (document.body.contains(feedback)) {
              document.body.removeChild(feedback);
            }
          }, 300);
        }, 2000);
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Always include our sample products
      let allProducts = [...sampleProducts];
      let allCategories = [
        { _id: 'cnc-machines', name: 'CNC Machines', slug: 'cnc-machines' },
        { _id: 'bangle-cnc-cutting', name: 'Bangle CNC Cutting', slug: 'bangle-cnc-cutting' }
      ];
      
      // Try to fetch from backend but don't fail if it's not available
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/categories')
        ]);
        
        // Add backend products to our sample products
        if (productsRes.data.data) {
          allProducts = [...allProducts, ...productsRes.data.data];
        }
        
        // Add backend categories to our sample categories
        if (categoriesRes.data.data) {
          allCategories = [...allCategories, ...categoriesRes.data.data];
        }
      } catch {
        console.log('Backend not available, using sample products only');
      }
      
      setProducts(allProducts);
      setCategories(allCategories);
    } catch (error) {
      console.error('Error setting up products:', error);
      // Fallback to sample products only
      setProducts(sampleProducts);
      setCategories([
        { _id: 'cnc-machines', name: 'CNC Machines', slug: 'cnc-machines' },
        { _id: 'bangle-cnc-cutting', name: 'Bangle CNC Cutting', slug: 'bangle-cnc-cutting' }
      ]);
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
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="container">
          <h1 className="hero-title">
            Our <span className="text-yellow">Product Range</span>
          </h1>
          <p className="hero-description">
            Explore our comprehensive collection of professional machine tools and industrial equipment
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-wrapper">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>



      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="products-grid">
              {/* Featured 9 Axis CNC Machine */}
              <div className="product-card">
                <div className="product-image" onClick={() => navigate('/cnc-9axis-machine')}>
                  <img 
                    src="/images/cnc-9axis-main.png" 
                    alt="9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.svg';
                    }}
                  />
                  <div className="product-badge">FEATURED</div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">9 Axis CNC Universal Cutting Machine</h3>
                  <div className="product-price">₹2,50,000</div>
                  <div className="product-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleBuyNow({
                        _id: '68a4a5d12c779915538996a7',
                        name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
                        price: 250000,
                        image: '/images/cnc-9axis-main.png',
                        category: 'CNC Machines',
                        brand: 'LVS'
                      })}
                    >
                      Buy Now
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleAddToCart({
                        _id: '68a4a5d12c779915538996a7',
                        name: '9 Axis CNC Universal Cutting & Engraving Auto Tool Changer Machine',
                        price: 250000,
                        image: '/images/cnc-9axis-main.png',
                        category: 'CNC Machines',
                        brand: 'LVS'
                      })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Bangle CNC Cutting Machine */}
              <div className="product-card">
                <div className="product-image" onClick={() => navigate('/bangle-cnc-cutting-machine')}>
                  <img 
                    src="/images/bangle-cnc-main.png" 
                    alt="Bangle CNC Cutting Machine"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.svg';
                    }}
                  />
                  <div className="product-badge">NEW</div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">Bangle CNC Cutting Machine</h3>
                  <div className="product-price">₹1,05,000</div>
                  <div className="product-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleBuyNow({
                        _id: '68a4a5d12c779915538996a8',
                        name: 'Bangle CNC Cutting Machine',
                        price: 105000,
                        image: '/images/bangle-cnc-main.png',
                        category: 'Bangle CNC Cutting',
                        brand: 'LVS'
                      })}
                    >
                      Buy Now
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleAddToCart({
                        _id: '68a4a5d12c779915538996a8',
                        name: 'Bangle CNC Cutting Machine',
                        price: 105000,
                        image: '/images/bangle-cnc-main.png',
                        category: 'Bangle CNC Cutting',
                        brand: 'LVS'
                      })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* CNC Bangle Cutting Machine */}
              <div className="product-card">
                <div className="product-image" onClick={() => navigate('/cnc-bangle-cutting-machine')}>
                  <img 
                    src="/images/cnc-bangle-main.png" 
                    alt="CNC Bangle Cutting Machine"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.svg';
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-title">CNC Bangle Cutting Machine</h3>
                  <div className="product-price">₹95,000</div>
                  <div className="product-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleBuyNow({
                        _id: '68a4a5d12c779915538996a9',
                        name: 'CNC Bangle Cutting Machine',
                        price: 95000,
                        image: '/images/cnc-bangle-main.png',
                        category: 'Bangle CNC Cutting',
                        brand: 'LVS'
                      })}
                    >
                      Buy Now
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleAddToCart({
                        _id: '68a4a5d12c779915538996a9',
                        name: 'CNC Bangle Cutting Machine',
                        price: 95000,
                        image: '/images/cnc-bangle-main.png',
                        category: 'Bangle CNC Cutting',
                        brand: 'LVS'
                      })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              
              {filteredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image" onClick={() => navigate(`/product/${product._id}`)}>
                    <img 
                      src={product.image || '/images/placeholder-product.svg'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.svg';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-price">
                      {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Ask Price'}
                    </div>
                    <div className="product-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleBuyNow({
                          _id: product._id,
                          name: product.name,
                          price: product.price || 0,
                          image: product.image,
                          category: product.categoryName,
                          brand: 'LVS'
                        })}
                      >
                        Buy Now
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleAddToCart({
                          _id: product._id,
                          name: product.name,
                          price: product.price || 0,
                          image: product.image,
                          category: product.categoryName,
                          brand: 'LVS'
                        })}
                      >
                        Add to Cart
                      </button>
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
