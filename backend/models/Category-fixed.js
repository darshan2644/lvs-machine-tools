const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🔧'
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ order: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
