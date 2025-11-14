const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Category = require('../../models/Category');

// Get all products for admin
router.get('/', async (req, res) => {
  try {
    let products = [];
    try {
      products = await Product.find().populate('category');
    } catch (dbError) {
      console.log('Database error, using mock products data:', dbError.message);
      // Mock products data when database is not available
      products = [
        {
          _id: 'prod1',
          name: 'Horizontal & Vertical Flat Surface Engraving & Cutting Machine',
          description: 'Dual-orientation machine for flat surface engraving and cutting in both horizontal and vertical positions.',
          price: 155000,
          image: '/images/placeholder-product.svg',
          inStock: true,
          category: { _id: 'cat1', name: 'CNC Machines' },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'prod2',
          name: 'Continuous Pipe Cutting Machine',
          description: 'High-efficiency machine for continuous pipe cutting operations.',
          price: 75000,
          image: '/images/placeholder-product.svg',
          inStock: true,
          category: { _id: 'cat2', name: 'Cutting Machines' },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'prod3',
          name: '5 Axis CNC Vertical Acrylic Bangle Cutting Machine',
          description: '5-axis CNC machine specialized for vertical cutting of acrylic bangles.',
          price: 25000,
          image: '/images/placeholder-product.svg',
          inStock: true,
          category: { _id: 'cat1', name: 'CNC Machines' },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }
    
    res.json({ 
      success: true, 
      products: products || [],
      count: products ? products.length : 0
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching products',
      error: error.message 
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching product',
      error: error.message 
    });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image || '/images/placeholder-product.svg',
      inStock: req.body.inStock !== undefined ? req.body.inStock : true,
      specifications: req.body.specifications || {},
      features: req.body.features || []
    };

    const product = new Product(productData);
    const savedProduct = await product.save();
    
    // Populate category before sending response
    await savedProduct.populate('category');
    
    res.status(201).json({ 
      success: true, 
      product: savedProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error creating product',
      error: error.message 
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ 
      success: true, 
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error updating product',
      error: error.message 
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ 
      success: true, 
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting product',
      error: error.message 
    });
  }
});

// Bulk operations
router.post('/bulk-delete', async (req, res) => {
  try {
    const { productIds } = req.body;
    const result = await Product.deleteMany({ _id: { $in: productIds } });
    res.json({ 
      success: true, 
      message: `${result.deletedCount} products deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting products',
      error: error.message 
    });
  }
});

module.exports = router;