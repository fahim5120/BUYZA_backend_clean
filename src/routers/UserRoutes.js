const express = require('express');
const { getUserProfileByJwt, addUserAddress } = require('../controller/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();



router.get('/profile',authMiddleware,getUserProfileByJwt );
router.put("/address", authMiddleware, addUserAddress);

module.exports = router;
