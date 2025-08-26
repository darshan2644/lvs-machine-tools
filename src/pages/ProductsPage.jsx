import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToCart } from '../services/cartService';
import './ProductsPage.css';

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
  }, [fetchData]);

  useEffect(() => {
    // Set initial category from URL parameters
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

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
    <div className="elegant-products-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <p className="hero-subtitle">PROFESSIONAL TOOLS</p>
            <h1 className="hero-title">
              Machine & <span className="text-brown">Tool</span> Collection
            </h1>
            <p className="hero-description">
              Discover our premium range of industrial equipment and precision machinery for professional manufacturing.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-wrapper animate-slide-in-left">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="elegant-search"
              />
            </div>
            <div className="category-wrapper">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="elegant-select"
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
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="no-products animate-fade-in">
              <h3>No products found</h3>
              <p>Try adjusting your search or category filters.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="elegant-product-card animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={(e) => {
                    // Only navigate if clicking outside buttons
                    if (!e.target.closest('.product-actions')) {
                      navigate(`/product/${product._id}`);
                    }
                  }}
                >
                  <div className="product-image-container">
                    <img 
                      src={product.image || '/images/placeholder-product.svg'} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.svg';
                      }}
                    />
                    {product.categoryName && (
                      <span className="category-badge">
                        {product.categoryName}
                      </span>
                    )}
                  </div>
                  
                  <div className="product-content">
                    <div className="product-header">
                      <span className="product-category">MACHINE</span>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-description">
                        {product.description || 'A professional machine tool designed for precision manufacturing with advanced industrial capabilities.'}
                      </p>
                    </div>
                    
                    <div className="product-footer">
                      <div className="price-section">
                        <span className="price">
                          {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Contact for Price'}
                        </span>
                        <span className="price-old">
                          {product.price ? `₹${(product.price * 1.2).toLocaleString('en-IN')}` : ''}
                        </span>
                      </div>
                      
                      <div className="product-actions">
                        <button 
                          className="btn-add-cart"
                          onClick={(e) => {
                            e.stopPropagation();
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
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.1 16.4H17M17 13V16.4H17M9 19.5A1.5 1.5 0 1 1 10.5 21A1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 21.5 21A1.5 1.5 0 0 1 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
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
