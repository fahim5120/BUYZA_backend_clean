const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const {sellerMiddleware} = require("../middlewares/sellerAuthMiddleware");

router.get("/", sellerMiddleware, orderController.getSellersOrders);

// Update order status
router.patch(
  "/:orderId/status/:orderStatus",
  sellerMiddleware,
  orderController.updateOrderStatus
);

module.exports = router;
