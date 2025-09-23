const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Razorpay = require('razorpay');
const { sendOrderConfirmationEmail } = require('../services/emailService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper function to generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LVS${timestamp.slice(-6)}${random}`;
};

// Helper function to calculate estimated delivery date
const getEstimatedDelivery = () => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from now
  return deliveryDate;
};

// Buy Now - Direct checkout for single product
router.post('/buynow', async (req, res) => {
  try {
    const { userId, productId, quantity = 1, price } = req.body;

    if (!userId || !productId || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, productId, price'
      });
    }

    const totalPrice = parseFloat(price) * parseInt(quantity);
    const tax = totalPrice * 0.18; // 18% GST
    const finalPrice = totalPrice + tax;
    const uniqueOrderId = generateOrderId();
    const estimatedDelivery = getEstimatedDelivery();

    // Create order directly without adding to cart
    const order = await Order.create({
      userId,
      orderId: uniqueOrderId,
      items: [{
        productId,
        quantity: parseInt(quantity),
        price: parseFloat(price)
      }],
      totalPrice: finalPrice,
      tax: tax,
      paymentMethod: 'cod', // Default to COD for buy now
      paymentStatus: 'pending',
      orderStatus: 'Order Placed',
      estimatedDelivery,
      statusHistory: [{
        status: 'Order Placed',
        timestamp: new Date(),
        message: 'Your order has been placed successfully'
      }]
    });

    res.json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
      order
    });
  } catch (error) {
    console.error('Buy now error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing buy now',
      error: error.message
    });
  }
});

// Place order - Enhanced version
router.post('/place', async (req, res) => {
  try {
    const { 
      userId, 
      items, 
      customerInfo,
      shippingAddress, 
      paymentMethod,
      paymentDetails,
      totalPrice, 
      tax,
      subtotal,
      shipping
    } = req.body;

    if (!userId || !items || !totalPrice || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    let paymentStatus = 'pending';
    let razorpayOrderId = null;

    // Handle Razorpay payment
    if (paymentMethod === 'razorpay') {
      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(totalPrice * 100), // Amount in paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            userId,
            orderType: 'purchase'
          }
        });
        razorpayOrderId = razorpayOrder.id;
        console.log('Razorpay order created:', razorpayOrderId);
      } catch (razorpayError) {
        console.error('Razorpay order creation failed:', razorpayError);
        return res.status(500).json({
          success: false,
          message: 'Payment gateway error',
          error: razorpayError.message
        });
      }
    } else if (paymentMethod === 'card') {
      // For demo purposes, mark as success
      paymentStatus = 'success';
    }

    // Create order
    const uniqueOrderId = generateOrderId();
    const estimatedDelivery = getEstimatedDelivery();
    
    const order = await Order.create({
      userId,
      orderId: uniqueOrderId,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name || 'Product',
        image: item.image || ''
      })),
      totalPrice: parseFloat(totalPrice),
      subtotal: parseFloat(subtotal) || 0,
      tax: parseFloat(tax) || 0,
      shipping: parseFloat(shipping) || 0,
      paymentMethod,
      paymentStatus,
      paymentDetails: paymentDetails || null,
      orderStatus: 'Order Placed',
      estimatedDelivery,
      statusHistory: [{
        status: 'Order Placed',
        timestamp: new Date(),
        message: 'Your order has been placed successfully'
      }],
      shippingAddress: shippingAddress || {},
      customerInfo: customerInfo || {},
      razorpayOrderId
    });

    // Clear cart after successful order
    await Cart.deleteMany({ userId });

    res.json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
      razorpayOrderId,
      order
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
});

// Track order
router.get('/track/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('items.productId', 'name price images brand');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking order',
      error: error.message
    });
  }
});

// Cancel order
router.post('/cancel/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!['placed', 'packed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Handle refund for prepaid orders
    if (order.paymentStatus === 'success' && order.razorpayPaymentId) {
      try {
        const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
          amount: Math.round(order.totalPrice * 100),
          notes: {
            reason: 'Order cancelled by customer',
            orderId: order._id
          }
        });
        
        order.paymentStatus = 'refunded';
        console.log('Refund initiated:', refund);
      } catch (refundError) {
        console.error('Refund failed:', refundError);
        // Continue with cancellation even if refund fails
      }
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
});

// Get order details by ID for tracking
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by MongoDB _id or custom orderId
    let order = await Order.findById(id).populate('items.productId');
    if (!order) {
      order = await Order.findOne({ orderId: id }).populate('items.productId');
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: {
        _id: order._id,
        orderId: order.orderId,
        userId: order.userId,
        items: order.items,
        totalPrice: order.totalPrice,
        tax: order.tax,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        statusHistory: order.statusHistory,
        shippingAddress: order.shippingAddress,
        estimatedDelivery: order.estimatedDelivery,
        createdAt: order.createdAt,
        packedAt: order.packedAt,
        shippedAt: order.shippedAt,
        outForDeliveryAt: order.outForDeliveryAt,
        deliveredAt: order.deliveredAt
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
});

// Update order status (for admin/tracking simulation)
router.patch('/:id/update', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Find order
    let order = await Order.findById(id);
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status and timestamp fields
    const currentTime = new Date();
    order.orderStatus = status;
    
    switch (status) {
      case 'Packed':
        order.packedAt = currentTime;
        break;
      case 'Shipped':
        order.shippedAt = currentTime;
        break;
      case 'Out for Delivery':
        order.outForDeliveryAt = currentTime;
        break;
      case 'Delivered':
        order.deliveredAt = currentTime;
        order.paymentStatus = 'success'; // Mark payment as success on delivery for COD
        break;
      case 'Cancelled':
        order.cancelledAt = currentTime;
        break;
    }

    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: currentTime,
      message: message || `Order ${status.toLowerCase()}`
    });

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: {
        _id: order._id,
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        statusHistory: order.statusHistory,
        estimatedDelivery: order.estimatedDelivery
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Cancel order endpoint
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    // Find order
    let order = await Order.findById(id);
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['Order Placed', 'Packed'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'This order cannot be cancelled as it has already been shipped or delivered.'
      });
    }

    // Update order status to cancelled
    const currentTime = new Date();
    order.orderStatus = 'Cancelled';
    order.cancelledAt = currentTime;
    order.cancelReason = cancelReason || 'Cancelled by customer';

    // Add to status history
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: currentTime,
      message: cancelReason || 'Order cancelled by customer'
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        _id: order._id,
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        cancelledAt: order.cancelledAt,
        cancelReason: order.cancelReason,
        statusHistory: order.statusHistory
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters'
      });
    }

    // Verify signature
    const crypto = require('crypto');
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Payment verification failed: Invalid signature');
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Find and update order
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update payment status
    order.paymentStatus = 'success';
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentDetails = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    };
    
    // Add payment success to status history
    order.statusHistory.push({
      status: 'Payment Confirmed',
      timestamp: new Date(),
      message: 'Payment confirmed successfully'
    });

    await order.save();

    console.log('Payment verified successfully for order:', order.orderId);

    // Send professional LVS receipt via email after payment confirmation
    try {
      // Populate product details for the email
      await order.populate('items.productId');
      
      const emailData = {
        orderId: order.orderId,
        customerEmail: order.customerInfo?.email,
        customerName: `${order.customerInfo?.firstName || ''} ${order.customerInfo?.lastName || ''}`.trim(),
        createdAt: order.createdAt,
        customerInfo: order.customerInfo,
        shippingAddress: order.shippingAddress,
        items: order.items.map(item => ({
          name: item.productId?.name || 'Product',
          description: item.productId?.description || '',
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: order.totalPrice,
        orderStatus: 'Payment Confirmed',
        paymentMethod: 'Online Payment',
        estimatedDelivery: order.estimatedDelivery?.toDateString() || 'Within 7-10 business days'
      };

      if (emailData.customerEmail) {
        await sendOrderConfirmationEmail(emailData);
        console.log('✅ Professional LVS receipt sent to:', emailData.customerEmail);
      }
    } catch (emailError) {
      console.error('❌ Error sending receipt email:', emailError);
      // Don't fail the payment verification if email fails
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      orderId: order._id,
      order
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
});

// Get user orders with tracking info
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders: orders.map(order => ({
        _id: order._id,
        orderId: order.orderId,
        items: order.items,
        totalPrice: order.totalPrice,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        estimatedDelivery: order.estimatedDelivery,
        createdAt: order.createdAt
      }))
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user orders',
      error: error.message
    });
  }
});

module.exports = router;
