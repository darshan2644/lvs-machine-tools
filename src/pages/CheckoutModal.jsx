import React, { useState } from 'react';
import axios from 'axios';

const CheckoutModal = ({ 
  cartItems, 
  subtotal, 
  tax, 
  delivery, 
  total, 
  onClose, 
  onOrderPlaced, 
  userId 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  console.log('CheckoutModal props:', { cartItems, subtotal, tax, delivery, total, userId });

  const handleConfirmOrder = async () => {
    try {
      setProcessing(true);
      setError('');

      console.log('Starting order confirmation...');

      const orderData = {
        userId,
        items: cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: total,
        tax,
        paymentMethod
      };

      const response = await axios.post('http://localhost:5000/api/orders/place', orderData);

      if (response.data.success) {
        if (paymentMethod === 'razorpay' && response.data.razorpayOrderId) {
          // Initialize Razorpay payment
          initializeRazorpayPayment(response.data.razorpayOrderId, response.data.orderId);
        } else {
          // For COD or card payments
          onOrderPlaced(response.data.orderId);
        }
      } else {
        setError(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const initializeRazorpayPayment = (razorpayOrderId, orderId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_R6nbI9QseeYoTQ',
      amount: Math.round(total * 100),
      currency: 'INR',
      name: 'LVS Machine & Tools',
      description: 'Order Payment',
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          // Verify payment
          await axios.post('http://localhost:5000/api/orders/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          
          onOrderPlaced(orderId);
        } catch (error) {
          console.error('Payment verification failed:', error);
          setError('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: 'Customer',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#FFD700'
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      setError('Payment gateway not available. Please try again later.');
    }
  };

  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal">
        <div className="modal-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item._id} className="order-item">
                  <img 
                    src={item.productId.images?.[0] || '/images/placeholder-product.svg'} 
                    alt={item.productId.name}
                  />
                  <div className="item-info">
                    <p>{item.productId.name}</p>
                    <p>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="item-total">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Tax (GST 18%):</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Delivery:</span>
                <span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Payment Method</h3>
            
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Razorpay (UPI, Cards, Wallets)</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Credit/Debit Card</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={processing}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleConfirmOrder}
            disabled={processing}
          >
            {processing ? 'Processing...' : `Confirm Order - ₹${total.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
