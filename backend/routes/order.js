const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    // Create order directly without adding to cart
    const order = await Order.create({
      userId,
      items: [{
        productId,
        quantity: parseInt(quantity),
        price: parseFloat(price)
      }],
      totalPrice: finalPrice,
      tax: tax,
      paymentMethod: 'cod', // Default to COD for buy now
      paymentStatus: 'pending',
      orderStatus: 'placed'
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

// Place order
router.post('/place', async (req, res) => {
  try {
    const { userId, items, totalPrice, tax, paymentMethod } = req.body;

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
    const order = await Order.create({
      userId,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: parseFloat(totalPrice),
      tax: parseFloat(tax) || 0,
      paymentMethod,
      paymentStatus,
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

module.exports = router;
