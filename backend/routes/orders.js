const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { sendOrderConfirmationEmail, sendOrderNotificationToBusiness } = require('../services/emailService');

// GET /api/orders - Get all orders for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['user-id'];
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: orders,
      message: 'Orders fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Generate unique order ID
    const orderId = 'LVS' + Date.now();
    
    // Set estimated delivery (7 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
    
    // Create order with initial status
    const newOrder = new Order({
      ...orderData,
      orderId,
      estimatedDelivery,
      statusHistory: [{
        status: 'Order Placed',
        timestamp: new Date(),
        message: 'Order has been placed successfully'
      }]
    });

    const savedOrder = await newOrder.save();
    
    // Prepare email data in the format expected by email service
    const emailOrderData = {
      orderId: savedOrder.orderId,
      customerName: `${savedOrder.customerInfo.firstName} ${savedOrder.customerInfo.lastName}`,
      customerEmail: savedOrder.customerInfo.email,
      orderDate: savedOrder.createdAt,
      totalAmount: savedOrder.totalPrice,
      paymentMethod: savedOrder.paymentMethod,
      estimatedDelivery: savedOrder.estimatedDelivery,
      items: savedOrder.items,
      shippingAddress: savedOrder.shippingAddress,
      // Additional fields for PDF generation
      customerInfo: savedOrder.customerInfo,
      createdAt: savedOrder.createdAt,
      orderStatus: 'Order Placed'
    };
    
    // Send emails asynchronously (don't wait for completion to avoid delays)
    Promise.all([
      sendOrderConfirmationEmail(emailOrderData),
      sendOrderNotificationToBusiness(emailOrderData)
    ]).then(([customerEmailResult, businessEmailResult]) => {
      console.log('📧 Customer email result:', customerEmailResult);
      console.log('📧 Business notification result:', businessEmailResult);
    }).catch(emailError => {
      console.error('📧 Email sending error (non-blocking):', emailError);
    });
    
    res.json({
      success: true,
      data: savedOrder,
      message: 'Order created successfully and confirmation emails sent'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ orderId: id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order,
      message: 'Order fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// PATCH /api/orders/:id/cancel - Cancel an order
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;
    
    const order = await Order.findOne({ orderId: id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order can be cancelled
    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }
    
    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Delivered orders cannot be cancelled'
      });
    }
    
    // Update order status
    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      message: cancelReason || 'Cancelled by customer'
    });
    
    await order.save();
    
    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
});

module.exports = router;