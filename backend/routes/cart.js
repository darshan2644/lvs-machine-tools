const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add product to cart
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity = 1, price } = req.body;

    if (!userId || !productId || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, productId, price'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if item already exists in cart
    let cartItem = await Cart.findOne({ userId, productId });
    
    if (cartItem) {
      // Update quantity
      cartItem.quantity += parseInt(quantity);
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await Cart.create({
        userId,
        productId,
        quantity: parseInt(quantity),
        price: parseFloat(price)
      });
    }

    res.json({
      success: true,
      message: 'Item added to cart',
      item: cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
});

// Get cart items for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await Cart.find({ userId })
      .populate('productId', 'name price image categoryName description')
      .sort({ addedAt: -1 });

    res.json({
      success: true,
      items: cartItems,
      count: cartItems.length
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart items',
      error: error.message
    });
  }
});

// Remove item from cart
router.post('/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, productId'
      });
    }

    await Cart.deleteOne({ userId, productId });

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// Update cart item quantity
router.put('/update', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, productId, quantity'
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await Cart.deleteOne({ userId, productId });
      return res.json({
        success: true,
        message: 'Item removed from cart'
      });
    }

    const cartItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { quantity: parseInt(quantity) },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart updated',
      item: cartItem
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
});

// Clear entire cart
router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    await Cart.deleteMany({ userId });

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

module.exports = router;
