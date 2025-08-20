const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' }
}, { _id: false });

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
  shippingAddress: {
    type: AddressSchema,
    required: true
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  tax: { 
    type: Number, 
    required: true 
  },
  shippingCost: {
    type: Number,
    default: 0
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
  razorpaySignature: String,
  trackingNumber: String,
  estimatedDeliveryDate: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  cancelledAt: Date,
  deliveredAt: Date
});

module.exports = mongoose.model('Order', OrderSchema);
