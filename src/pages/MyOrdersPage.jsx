import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Load orders from localStorage
    const loadOrders = () => {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
        // Sort orders by date (newest first)
        const sortedOrders = savedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleTrackOrder = (trackingNumber) => {
    if (trackingNumber) {
      alert(`Tracking Number: ${trackingNumber}\n\nYou can track your order by calling our customer service at +91 98765 43210 with this tracking number.`);
    }
  };

  const handleReorder = (order) => {
    // Add items back to cart
    try {
      const currentCart = JSON.parse(localStorage.getItem('lvsCart') || '[]');
      const newCart = [...currentCart];
      
      order.items.forEach(item => {
        const existingItem = newCart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          newCart.push({ ...item });
        }
      });
      
      localStorage.setItem('lvsCart', JSON.stringify(newCart));
      alert('Items added to cart successfully!');
      navigate('/cart');
    } catch (error) {
      console.error('Error adding items to cart:', error);
      alert('Error adding items to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          // No Orders State
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          // Orders List
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderId}</h3>
                      <p className="text-sm text-gray-500">Placed on {formatDate(order.orderDate)}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus || 'Confirmed'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <p className="text-lg font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                    <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Items ({order.items?.length || 0})</h4>
                      <div className="space-y-2">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-sm text-gray-600 truncate">{item.name}</span>
                            <span className="text-sm text-gray-900">x{item.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <p className="text-sm text-blue-600 cursor-pointer" onClick={() => handleOrderClick(order)}>
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                      </p>
                      <p className="text-sm text-gray-500">
                        Est. delivery: {order.estimatedDelivery || 'TBD'}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-sm text-blue-600">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleOrderClick(order)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      {order.trackingNumber && (
                        <button
                          onClick={() => handleTrackOrder(order.trackingNumber)}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          Track Order
                        </button>
                      )}
                      <button
                        onClick={() => handleReorder(order)}
                        className="border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Order Details #{selectedOrder.orderId}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="px-6 py-4">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                    <div className="space-y-1">
                      <p><span className="text-gray-500">Order ID:</span> {selectedOrder.orderId}</p>
                      <p><span className="text-gray-500">Date:</span> {formatDate(selectedOrder.orderDate)}</p>
                      <p><span className="text-gray-500">Status:</span> <span className={`px-2 py-1 rounded text-sm ${getStatusColor(selectedOrder.orderStatus)}`}>{selectedOrder.orderStatus}</span></p>
                      <p><span className="text-gray-500">Payment:</span> {selectedOrder.paymentMethod}</p>
                      {selectedOrder.trackingNumber && (
                        <p><span className="text-gray-500">Tracking:</span> {selectedOrder.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                    <div className="space-y-1">
                      <p><span className="text-gray-500">Name:</span> {selectedOrder.customerName}</p>
                      <p><span className="text-gray-500">Email:</span> {selectedOrder.customerEmail}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.deliveryAddress?.address}</p>
                    <p>{selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}</p>
                    <p>{selectedOrder.deliveryAddress?.country}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-lg font-bold text-green-600">{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
