const express = require("express");
const { sentLoginOtp, createUser, signin } = require("../controller/authController");
const router = express.Router();


router.post('/send/login-signup-otp',sentLoginOtp); //use for login and signup
router.post('/signup', createUser
);
router.post('/signin', signin);
module.exports=router