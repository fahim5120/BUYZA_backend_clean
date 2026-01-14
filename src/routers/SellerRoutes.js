const express = require('express');
const { getSellerProfile, createSeller, getAllSellers, updateSeller, verifyLoginOtp, sendLoginOtp } = require('../controller/SellerController');
const { sellerMiddleware } = require('../middlewares/sellerAuthMiddleware');
const router = express.Router();


router.get('/profile',sellerMiddleware,getSellerProfile);
router.post('/',createSeller);
router.get('/',getAllSellers);
router.patch('/',sellerMiddleware, updateSeller);

router.post("/send/login-otp", sendLoginOtp);  //
router.post('/verify/login-otp',verifyLoginOtp);


module.exports=router

 
