const express = require("express");
const router = express.Router();

const { sellerMiddleware } = require("../middlewares/sellerAuthMiddleware");
const {
  getProductBySellerId,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controller/ProductController");

router.get("/", sellerMiddleware, getProductBySellerId);

router.post("/", sellerMiddleware, createProduct);

router.delete("/:productId", sellerMiddleware, deleteProduct);

// Update a product
router.patch("/:productId", sellerMiddleware, updateProduct);

module.exports = router;
