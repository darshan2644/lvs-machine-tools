import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Get order data from navigation state or localStorage
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // Try to get latest order from localStorage
      const savedOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
      if (savedOrders.length > 0) {
        setOrderData(savedOrders[savedOrders.length - 1]);
      }
    }
  }, [location.state]);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleViewOrders = () => {
    navigate('/my-orders');
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
            <p className="text-gray-600 mb-6">We couldn't find your order details.</p>
            <button onClick={handleContinueShopping} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed! 🎉</h1>
          <p className="text-gray-600 mb-6">
            Thank you for choosing LVS Machine & Tools. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details */}
        {orderData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-semibold text-gray-900">{orderData.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-semibold text-gray-900">{orderData.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{orderData.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <p className="font-semibold text-green-600">{orderData.orderStatus}</p>
              </div>
            </div>

            {orderData.trackingNumber && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Tracking Number</p>
                <p className="font-semibold text-blue-600">{orderData.trackingNumber}</p>
              </div>
            )}

            {(orderData.razorpayPaymentId || orderData.paymentId) && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Payment ID</p>
                <p className="font-semibold text-gray-900">{orderData.razorpayPaymentId || orderData.paymentId}</p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-semibold text-gray-900">{orderData.paymentMethod}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-bold text-2xl text-green-600">{formatPrice(orderData.totalAmount)}</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        {orderData?.items && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Address */}
        {orderData?.deliveryAddress && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
            <div className="text-gray-700">
              <p className="font-medium">{orderData.customerName}</p>
              <p>{orderData.deliveryAddress.address}</p>
              <p>{orderData.deliveryAddress.city}, {orderData.deliveryAddress.state} - {orderData.deliveryAddress.pincode}</p>
              <p>📞 {orderData.customerPhone}</p>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">What happens next?</h3>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p>Order received and being processed</p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p>Our team will contact you within 24 hours for verification</p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p>Estimated delivery: {orderData.estimatedDelivery || '5-7 business days'}</p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p>Track your order status in "My Orders" section</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleViewOrders}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Track Orders
          </button>
          <button
            onClick={handleContinueShopping}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600 mb-2">
            Contact our customer support team for any assistance.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-blue-600">
            <span>📞 +91 98765 43210</span>
            <span>📧 support@lvsmachinetools.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
