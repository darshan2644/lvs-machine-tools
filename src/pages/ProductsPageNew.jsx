import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addToCart } from '../services/cartService';
import { useToast } from '../components/ToastProvider';
import './ProductsPageNew.css';

const ProductsPageNew = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();

  // Get category from URL params if available
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          console.error('Failed to fetch products:', data.message);
          showError('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        showError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showError]);

  // Handle add to cart with proper product ID
  const handleAddToCart = async (product) => {
    try {
      const result = await addToCart(product._id, 1, product.price);
      if (result.success) {
        showSuccess(result.message);
      } else {
        showError(result.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add product to cart');
    }
  };

  // Get unique categories for filter
  const categories = [
    { id: 'all', name: 'All Products' },
    ...Array.from(new Set(products.map(p => p.category))).map(cat => ({
      id: cat,
      name: products.find(p => p.category === cat)?.categoryName || cat
    }))
  ];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="container">
          <h1>Our Products</h1>
          <p>Discover our comprehensive range of precision machinery and tools</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          {/* Filters */}
          <div className="products-filters">
            <div className="search-bar">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="category-filter">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className="products-grid">
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>No products found matching your criteria.</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div 
                    key={product._id}
                    className="product-card"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    {/* Product Image */}
                    <div className="product-image">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.svg';
                        }}
                      />
                      <div className="product-overlay">
                        <span>View Details</span>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      {product.price && (
                        <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
                      )}
                    </div>
                    
                    {/* Product Actions */}
                    <div className="product-actions">
                      <button 
                        className="btn-wishlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Add to Wishlist:', product.name);
                          showSuccess(`${product.name} added to wishlist!`);
                        }}
                        title="Add to Wishlist"
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>
                      
                      <button 
                        className="btn-add-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={!product.price}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPageNew;