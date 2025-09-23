import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import wishlistService from '../services/wishlistService';
import { useToast } from '../hooks/useToast';
import { useShoppingCart } from '../hooks/useShoppingCart';
import './WishlistPage.css';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();
  const { addToCart } = useShoppingCart();
  const navigate = useNavigate();

  // Load wishlist items
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const items = await wishlistService.getWishlist();
      setWishlistItems(items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      showError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const result = await wishlistService.removeFromWishlist(productId);
      if (result.success) {
        setWishlistItems(prev => 
          prev.filter(item => (item._id || item.id) !== productId)
        );
        showSuccess('Product removed from wishlist');
      } else {
        showError('Failed to remove product from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showError('Failed to remove product from wishlist');
    }
  };

  // Add to cart from wishlist
  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      showSuccess('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add product to cart');
    }
  };

  // Navigate to product details
  const handleViewDetails = (product) => {
    navigate(`/products/${product._id || product.id}`);
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        {/* Page Header */}
        <div className="wishlist-header">
          <h1 className="page-title">My Wishlist</h1>
          <p className="page-subtitle">
            {wishlistItems.length > 0 
              ? `You have ${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} in your wishlist`
              : 'Your wishlist is empty'
            }
          </p>
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Discover amazing products and save your favorites here!</p>
            <Link to="/products" className="continue-shopping-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3L5 11M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                <circle cx="9" cy="20" r="1"/>
                <circle cx="20" cy="20" r="1"/>
              </svg>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((product) => (
              <div key={product._id || product.id} className="wishlist-card">
                <div className="product-image">
                  <img 
                    src={product.images?.[0] || product.image || '/images/placeholder-product.svg'} 
                    alt={product.name} 
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.svg';
                    }}
                  />
                  <div className="product-overlay">
                    <button 
                      className="quick-view-btn"
                      onClick={() => handleViewDetails(product)}
                      title="View Details"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.categoryName || product.category}</p>
                  
                  <div className="product-price">
                    {product.salePrice && product.salePrice !== product.price ? (
                      <>
                        <span className="sale-price">₹{product.salePrice?.toLocaleString()}</span>
                        <span className="original-price">₹{product.price?.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="price">₹{product.price?.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="product-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3L5 11M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                        <circle cx="9" cy="20" r="1"/>
                        <circle cx="20" cy="20" r="1"/>
                      </svg>
                      Add to Cart
                    </button>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveFromWishlist(product._id || product.id)}
                      title="Remove from wishlist"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlistItems.length > 0 && (
          <div className="continue-shopping-section">
            <Link to="/products" className="continue-shopping-link">
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;