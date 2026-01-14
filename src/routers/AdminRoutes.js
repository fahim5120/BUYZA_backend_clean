const express = require('express');
const { updateSellerAccountStatus } = require('../controller/SellerController');
const router = express.Router();


//for chnge the accont status of seller 
router.patch('/seller/:id/status/:status',updateSellerAccountStatus);



module.exports=router