const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// In-memory storage for demo (replace with database in production)
let wishlistData = {};

// Get user's wishlist
router.get('/', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const userWishlist = wishlistData[userId] || [];
    
    res.json({
      success: true,
      wishlist: userWishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist'
    });
  }
});

// Add product to wishlist
router.post('/add', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, product } = req.body;

    if (!productId || !product) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and product data are required'
      });
    }

    // Initialize user wishlist if it doesn't exist
    if (!wishlistData[userId]) {
      wishlistData[userId] = [];
    }

    // Check if product already exists in wishlist
    const existingIndex = wishlistData[userId].findIndex(
      item => (item._id || item.id) === productId
    );

    if (existingIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add product to wishlist
    wishlistData[userId].push({
      ...product,
      addedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Product added to wishlist successfully',
      wishlist: wishlistData[userId]
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to wishlist'
    });
  }
});

// Remove product from wishlist
router.delete('/remove', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Initialize user wishlist if it doesn't exist
    if (!wishlistData[userId]) {
      wishlistData[userId] = [];
    }

    // Remove product from wishlist
    const initialLength = wishlistData[userId].length;
    wishlistData[userId] = wishlistData[userId].filter(
      item => (item._id || item.id) !== productId
    );

    const removed = wishlistData[userId].length < initialLength;

    res.json({
      success: true,
      message: removed ? 'Product removed from wishlist' : 'Product not found in wishlist',
      wishlist: wishlistData[userId]
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist'
    });
  }
});

// Clear entire wishlist
router.delete('/clear', auth, (req, res) => {
  try {
    const userId = req.user.id;
    wishlistData[userId] = [];

    res.json({
      success: true,
      message: 'Wishlist cleared successfully',
      wishlist: []
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist'
    });
  }
});

// Get wishlist count
router.get('/count', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const userWishlist = wishlistData[userId] || [];
    
    res.json({
      success: true,
      count: userWishlist.length
    });
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist count'
    });
  }
});

module.exports = router;