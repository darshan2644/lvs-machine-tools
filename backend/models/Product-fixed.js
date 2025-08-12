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
    power: String,
    material: String,
    process: String,
    operation: String,
    orientation: String,
    heads: String,
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
  tags: [String],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
