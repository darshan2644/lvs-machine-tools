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
    }
  }],
  totalPrice: { 
    type: Number, 
    required: true 
  },
  tax: { 
    type: Number, 
    required: true 
  },
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
    default: 'placed',
    enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled']
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  cancelledAt: Date,
  deliveredAt: Date
});

module.exports = mongoose.model('Order', OrderSchema);
