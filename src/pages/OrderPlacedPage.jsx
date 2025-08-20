import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const OrderPlacedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="checkout-page">
      <div className="container">
        <div className="order-success">
          <h1>Thank You for Shopping!</h1>
          <p>Your order has been placed successfully and recorded in our database.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPlacedPage;
