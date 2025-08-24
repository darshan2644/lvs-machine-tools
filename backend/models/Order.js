const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: 'Product'
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 1 
    },
    price: { 
      type: Number, 
      required: true 
    },
    name: String,
    image: String
  }],
  totalPrice: { 
    type: Number, 
    required: true 
  },
  tax: { 
    type: Number, 
    required: true 
  },
  subtotal: Number,
  shipping: Number,
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['razorpay', 'card', 'cod']
  },
  paymentStatus: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'success', 'failed', 'refunded']
  },
  orderStatus: { 
    type: String, 
    default: 'Order Placed',
    enum: ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
  },
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  estimatedDelivery: {
    type: Date,
    required: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    message: String
  }],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    phone: String
  },
  customerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    company: String
  },
  paymentDetails: mongoose.Schema.Types.Mixed,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  packedAt: Date,
  shippedAt: Date,
  outForDeliveryAt: Date,
  deliveredAt: Date,
  cancelledAt: Date
});

module.exports = mongoose.model('Order', OrderSchema);
