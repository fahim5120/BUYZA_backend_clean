const express = require('express');
const router = express.Router();
const { searchProduct, getAllProducts, getProductById } = require('../controller/ProductController');





// Search for products by query
router.get('/search',  searchProduct);

// Get all products with filters
router.get('/', getAllProducts);

// Get product by ID
router.get('/:productId', getProductById);

module.exports = router;
