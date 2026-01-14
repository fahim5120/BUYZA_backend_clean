// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
  findUserCartHandler,
  addItemToCart,
  deleteCartItemHandler,
  updateCartItemHandler,
} = require("../controller/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");






router.get("/", authMiddleware, findUserCartHandler);
router.put("/add", authMiddleware, addItemToCart);
router.delete("/item/:cartItemId", authMiddleware, deleteCartItemHandler);
router.put("/item/:cartItemId", authMiddleware, updateCartItemHandler);




module.exports = router;
