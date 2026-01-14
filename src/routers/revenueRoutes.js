// routes/revenueRoutes.js
const express = require('express');
const revenueController = require('../controller/revenueController');
const {sellerMiddleware} = require('../middlewares/sellerAuthMiddleware');
// const RevenueController = require('../controllers/RevenueController'); // Adjust the import path as necessary

const router = express.Router();

// Define the route
router.get('/chart', sellerMiddleware, revenueController.getRevenueChart);

module.exports = router;
