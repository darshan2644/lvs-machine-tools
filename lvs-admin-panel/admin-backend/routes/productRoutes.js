import express from 'express';
import { getAllProducts, createProduct } from '../controllers/productController.js';

const router = express.Router();

// GET /api/products
router.get('/', getAllProducts);

// POST /api/products
router.post('/', createProduct);

export default router;
