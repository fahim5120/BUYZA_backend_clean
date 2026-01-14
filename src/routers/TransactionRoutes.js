const express = require('express');
const router = express.Router();
const{sellerMiddleware} = require('../middlewares/sellerAuthMiddleware');
const transactionController = require('../controller/TransactionController');

router.get('/seller',sellerMiddleware,transactionController.getTransactionBySeller);

module.exports = router;
