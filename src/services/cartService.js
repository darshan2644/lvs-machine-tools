import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Get user ID from localStorage or use demo user
const getUserId = () => {
  return localStorage.getItem('userId') || 'demo-user-123';
};

// Add product to cart
export const addToCart = async (productId, quantity = 1, price) => {
  try {
    const userId = getUserId();
    const response = await axios.post(`${API_BASE}/cart/add`, {
      userId,
      productId,
      quantity,
      price
    });

    if (response.data.success) {
      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      return { success: true, message: 'Product added to cart!' };
    } else {
      return { success: false, message: response.data.message || 'Failed to add product to cart' };
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, message: 'Failed to add product to cart' };
  }
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  try {
    const userId = getUserId();
    const response = await axios.delete(`${API_BASE}/cart/remove`, {
      data: { userId, productId }
    });

    if (response.data.success) {
      return { success: true, message: 'Product removed from cart' };
    } else {
      return { success: false, message: response.data.message || 'Failed to remove product from cart' };
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, message: 'Failed to remove product from cart' };
  }
};

// Update cart item quantity
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const userId = getUserId();
    const response = await axios.put(`${API_BASE}/cart/update`, {
      userId,
      productId,
      quantity
    });

    if (response.data.success) {
      return { success: true };
    } else {
      return { success: false, message: response.data.message || 'Failed to update quantity' };
    }
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return { success: false, message: 'Failed to update quantity' };
  }
};

// Get cart items
export const getCartItems = async () => {
  try {
    const userId = getUserId();
    const response = await axios.get(`${API_BASE}/cart/${userId}`);

    if (response.data.success) {
      return { success: true, items: response.data.items || [] };
    } else {
      return { success: false, items: [] };
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return { success: false, items: [] };
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const userId = getUserId();
    const response = await axios.delete(`${API_BASE}/cart/clear/${userId}`);

    if (response.data.success) {
      return { success: true, message: 'Cart cleared successfully' };
    } else {
      return { success: false, message: response.data.message || 'Failed to clear cart' };
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, message: 'Failed to clear cart' };
  }
};

// Buy now function
export const buyNow = async (productId, quantity = 1, price) => {
  try {
    const userId = getUserId();
    const response = await axios.post(`${API_BASE}/orders/buynow`, {
      userId,
      productId,
      quantity,
      price
    });

    if (response.data.success) {
      // Save order to localStorage as backup
      const orderDetails = {
        _id: response.data.orderId,
        orderId: response.data.orderId,
        userId: userId,
        orderStatus: 'Order Placed',
        createdAt: new Date().toISOString(),
        items: [{
          productId: productId,
          quantity: quantity,
          price: price
        }],
        totalAmount: price * quantity,
        paymentMethod: 'cod'
      };

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
      existingOrders.push(orderDetails);
      localStorage.setItem('lvsOrders', JSON.stringify(existingOrders));
      console.log('Buy Now order saved to localStorage:', orderDetails);

      // Dispatch order placed event
      window.dispatchEvent(new CustomEvent('orderPlaced', {
        detail: { orderId: response.data.orderId, type: 'buyNow' }
      }));
      console.log('Order placed event dispatched for buy now');
      
      return { 
        success: true, 
        orderId: response.data.orderId,
        razorpayOrderId: response.data.razorpayOrderId
      };
    } else {
      return { success: false, message: response.data.message || 'Failed to create order' };
    }
  } catch (error) {
    console.error('Error in buy now:', error);
    return { success: false, message: 'Failed to create order' };
  }
};

// Place order from cart
export const placeOrder = async (paymentMethod = 'cod') => {
  try {
    const userId = getUserId();
    const cartResponse = await getCartItems();
    
    if (!cartResponse.success || cartResponse.items.length === 0) {
      return { success: false, message: 'Cart is empty' };
    }

    const orderData = {
      userId,
      items: cartResponse.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price
      })),
      paymentMethod
    };

    const response = await axios.post(`${API_BASE}/orders/place`, orderData);

    if (response.data.success) {
      // Save order to localStorage as backup
      const orderDetails = {
        _id: response.data.orderId,
        orderId: response.data.orderId,
        userId: userId,
        orderStatus: 'Order Placed',
        createdAt: new Date().toISOString(),
        items: cartResponse.items,
        totalAmount: cartResponse.items.reduce((total, item) => total + (item.price * item.quantity), 0),
        paymentMethod: paymentMethod
      };

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
      existingOrders.push(orderDetails);
      localStorage.setItem('lvsOrders', JSON.stringify(existingOrders));
      console.log('Order saved to localStorage:', orderDetails);

      // Dispatch order placed event
      window.dispatchEvent(new CustomEvent('orderPlaced', {
        detail: { orderId: response.data.orderId, type: 'cart' }
      }));
      console.log('Order placed event dispatched for cart order');
      
      return { 
        success: true, 
        orderId: response.data.orderId,
        razorpayOrderId: response.data.razorpayOrderId
      };
    } else {
      return { success: false, message: response.data.message || 'Failed to place order' };
    }
  } catch (error) {
    console.error('Error placing order:', error);
    return { success: false, message: 'Failed to place order' };
  }
};

// Get cart count
export const getCartCount = async () => {
  try {
    const cartResponse = await getCartItems();
    if (cartResponse.success) {
      return cartResponse.items.reduce((total, item) => total + item.quantity, 0);
    }
    return 0;
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    console.log('📧 Sending order confirmation email...', orderData);
    
    const response = await axios.post(`${API_BASE}/email/order-confirmation`, orderData);
    
    if (response.data.success) {
      console.log('✅ Order confirmation email sent successfully');
      return { success: true, messageId: response.data.messageId };
    } else {
      console.error('❌ Failed to send order confirmation email:', response.data.error);
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message || 'Network error' };
  }
};

// Process COD order with email
export const processCODOrderWithEmail = async (orderData, customerInfo) => {
  try {
    console.log('💳 Processing COD order with email notification...');
    
    // Generate order ID
    const orderId = `LVS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create complete order object
    const completeOrder = {
      _id: orderId,
      orderId: orderId,
      userId: getUserId(),
      orderStatus: 'Order Placed',
      createdAt: new Date().toISOString(),
      orderDate: new Date().toISOString(),
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      paymentMethod: 'Cash on Delivery (COD)',
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerEmail: customerInfo.email,
      shippingAddress: {
        fullName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        pincode: customerInfo.pincode,
        phone: customerInfo.phone
      },
      estimatedDelivery: 'Within 5-7 business days'
    };

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
    existingOrders.push(completeOrder);
    localStorage.setItem('lvsOrders', JSON.stringify(existingOrders));
    console.log('✅ COD order saved to localStorage:', completeOrder);

    // Also save to backend database
    try {
      const backendOrderData = {
        userId: getUserId(),
        items: orderData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone
        },
        shippingAddress: {
          fullName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          pincode: customerInfo.pincode,
          phone: customerInfo.phone
        },
        paymentMethod: 'cod',
        totalPrice: orderData.totalAmount,
        tax: orderData.totalAmount * 0.18,
        subtotal: orderData.totalAmount
      };

      console.log('💾 Saving order to backend:', backendOrderData);
      const backendResponse = await axios.post(`${API_BASE}/orders/place`, backendOrderData);
      
      if (backendResponse.data.success) {
        console.log('✅ Order also saved to backend database');
      } else {
        console.warn('⚠️ Failed to save order to backend, but localStorage backup exists');
      }
    } catch (backendError) {
      console.warn('⚠️ Backend save failed, but localStorage backup exists:', backendError.message);
    }

    // Send confirmation email
    const emailResult = await sendOrderConfirmationEmail(completeOrder);
    if (emailResult.success) {
      console.log('✅ Order confirmation email sent successfully');
    } else {
      console.warn('⚠️ Email sending failed, but order was placed:', emailResult.error);
    }

    // Dispatch order placed event
    window.dispatchEvent(new CustomEvent('orderPlaced', {
      detail: { orderId: orderId, type: 'cod', emailSent: emailResult.success }
    }));

    return { 
      success: true, 
      orderId: orderId,
      emailSent: emailResult.success,
      order: completeOrder
    };

  } catch (error) {
    console.error('❌ Error processing COD order:', error);
    return { success: false, error: error.message };
  }
};

// Test email function
export const sendTestEmail = async (email) => {
  try {
    console.log('📧 Sending test email to:', email);
    
    const response = await axios.post(`${API_BASE}/email/test`, { email });
    
    if (response.data.success) {
      console.log('✅ Test email sent successfully');
      return { success: true, messageId: response.data.messageId };
    } else {
      console.error('❌ Failed to send test email:', response.data.error);
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    return { success: false, error: error.message || 'Network error' };
  }
};

// Sync localStorage orders to backend (useful for data recovery)
export const syncOrdersToBackend = async () => {
  try {
    const localOrders = JSON.parse(localStorage.getItem('lvsOrders') || '[]');
    
    if (localOrders.length === 0) {
      return { success: true, message: 'No local orders to sync' };
    }

    console.log('🔄 Syncing', localOrders.length, 'orders to backend...');
    
    let syncedCount = 0;
    let failedCount = 0;

    for (const order of localOrders) {
      try {
        // Check if order already exists in backend
        const existsResponse = await axios.get(`${API_BASE}/orders/user/${getUserId()}`);
        const backendOrders = existsResponse.data.orders || [];
        const orderExists = backendOrders.some(bo => bo.orderId === order.orderId);

        if (!orderExists) {
          // Convert localStorage order to backend format
          const backendOrderData = {
            userId: order.userId || getUserId(),
            orderId: order.orderId,
            items: order.items.map(item => ({
              productId: item.productId || item._id,
              quantity: item.quantity,
              price: item.price
            })),
            customerInfo: order.customerInfo || {
              firstName: order.customerName?.split(' ')[0] || 'Customer',
              lastName: order.customerName?.split(' ')[1] || '',
              email: order.customerEmail || 'customer@example.com',
              phone: order.shippingAddress?.phone || ''
            },
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod || 'cod',
            totalPrice: order.totalAmount,
            orderStatus: order.orderStatus || 'Order Placed',
            createdAt: order.createdAt
          };

          const response = await axios.post(`${API_BASE}/orders/place`, backendOrderData);
          
          if (response.data.success) {
            syncedCount++;
            console.log('✅ Synced order:', order.orderId);
          } else {
            failedCount++;
            console.warn('⚠️ Failed to sync order:', order.orderId);
          }
        } else {
          console.log('ℹ️ Order already exists in backend:', order.orderId);
        }
      } catch (orderError) {
        failedCount++;
        console.error('❌ Error syncing individual order:', order.orderId, orderError.message);
      }
    }

    return {
      success: true,
      message: `Sync complete: ${syncedCount} synced, ${failedCount} failed`,
      syncedCount,
      failedCount
    };

  } catch (error) {
    console.error('❌ Error syncing orders to backend:', error);
    return { success: false, error: error.message };
  }
};
