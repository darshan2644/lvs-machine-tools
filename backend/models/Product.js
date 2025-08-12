const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  categoryName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: null
  },
  image: {
    type: String,
    required: true
  },
  specifications: {
    axes: String,
    control: String,
    features: [String],
    applications: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  categoryName: 'text'
});

module.exports = mongoose.model('Product', productSchema);
