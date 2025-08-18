import React from 'react';
import { useShoppingCart } from '../hooks/useShoppingCart';
import './ShoppingCartDemo.css';

const ShoppingCartDemo = () => {
  const { addToCart } = useShoppingCart();

  // Sample products for demonstration
  const sampleProducts = [
    {
      id: '1',
      name: 'Bangle CNC Cutting Machine',
      price: 105000,
      image: '/images/bangle-cnc-main.png',
      category: 'CNC Machines',
      brand: 'LVS'
    },
    {
      id: '2',
      name: 'Advanced CNC Bangle Machine',
      price: 125000,
      image: '/images/bangle-cnc-2.jpg',
      category: 'CNC Machines',
      brand: 'LVS'
    },
    {
      id: '3',
      name: 'Heavy Duty CNC Machine',
      price: 185000,
      image: '/images/bangle-cnc-3.jpg',
      category: 'CNC Machines',
      brand: 'LVS'
    },
    {
      id: '4',
      name: 'Compact CNC Machine',
      price: 85000,
      image: '/images/bangle-cnc-4.jpg',
      category: 'CNC Machines',
      brand: 'LVS'
    },
    {
      id: '5',
      name: 'Precision Ring Cutting Machine',
      price: 95000,
      image: '/images/ring-cutting-machine.jpg',
      category: 'CNC Machines',
      brand: 'LVS'
    },
    {
      id: '6',
      name: 'Multi-Purpose CNC Machine',
      price: 145000,
      image: '/images/multi-purpose-cnc.jpg',
      category: 'CNC Machines',
      brand: 'LVS'
    }
  ];

  // Function to handle add to cart with feedback
  const handleAddToCart = (product) => {
    addToCart(product);
    
    // Show feedback notification
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.innerHTML = `
      <div class="feedback-content">
        <svg class="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="feedback-text">Added to cart!</span>
      </div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.classList.add('feedback-exit');
      setTimeout(() => {
        if (document.body.contains(feedback)) {
          document.body.removeChild(feedback);
        }
      }, 300);
    }, 2000);
  };

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="cart-demo-page">
      {/* Hero Section */}
      <section className="demo-hero">
        <div className="container">
          <h1 className="hero-title">
            LVS Machine & Tools
            <span className="hero-subtitle">Shopping Cart Demo</span>
          </h1>
          <p className="hero-description">
            Experience our advanced shopping cart system with real-time updates and seamless integration
          </p>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="instructions-section">
        <div className="container">
          <div className="instructions-card">
            <h2 className="instructions-title">How to Use the Shopping Cart</h2>
            <div className="instructions-grid">
              <div className="instruction-item">
                <div className="instruction-icon">🛒</div>
                <h3>Add Products</h3>
                <p>Click "Add to Cart" on any product to add it to your shopping cart</p>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">📱</div>
                <h3>View Cart</h3>
                <p>Click the cart icon in the top navigation to view your cart items</p>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">⚡</div>
                <h3>Real-time Updates</h3>
                <p>Cart badge and totals update automatically as you add or remove items</p>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">💾</div>
                <h3>Persistent Storage</h3>
                <p>Your cart items are saved automatically and persist across sessions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="demo-products-section">
        <div className="container">
          <h2 className="section-title">Featured CNC Machines</h2>
          <div className="demo-products-grid">
            {sampleProducts.map((product, index) => (
              <div key={product.id} className={`demo-product-card ${index === 0 || index === 5 ? 'featured' : ''}`}>
                <div className="demo-product-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="demo-image-placeholder" style={{ display: 'none' }}>
                    <div className="placeholder-icon">🔧</div>
                  </div>
                  {(index === 0 || index === 5) && (
                    <div className="demo-product-badge">
                      {index === 0 ? 'FEATURED' : 'BEST SELLER'}
                    </div>
                  )}
                </div>
                <div className="demo-product-info">
                  <div className="demo-product-brand">{product.brand}</div>
                  <h3 className="demo-product-title">{product.name}</h3>
                  <p className="demo-product-category">{product.category}</p>
                  <div className="demo-product-price">{formatPrice(product.price)}</div>
                  <button 
                    className="demo-add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <svg className="cart-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="m1 1 4 4 1 14 13 0-2-9H7"></path>
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Shopping Cart Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast & Responsive</h3>
              <p>Lightning-fast cart updates with smooth animations and transitions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Smart Quantity Management</h3>
              <p>Automatic quantity updates with increment/decrement controls</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Storage</h3>
              <p>Cart data is securely stored in browser localStorage</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Calculations</h3>
              <p>Automatic price calculations and subtotal updates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Beautiful UI</h3>
              <p>Modern design that matches your brand perfectly</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Optimized</h3>
              <p>Fully responsive design works on all devices</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShoppingCartDemo;
