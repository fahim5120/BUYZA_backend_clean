const express = require('express');
const router = express.Router();
const DealController = require('../controller/DealController'); 

router.get('/', DealController.getAllDeals);

router.post('/', DealController.createDeals);

router.patch('/:id', DealController.updateDeal);

router.delete('/:id', DealController.deleteDeals);

module.exports = router; 
