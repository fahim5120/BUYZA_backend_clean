const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const {authMiddleware }= require("../middlewares/authMiddleware");

// Create a new order
router.post("/", authMiddleware, orderController.createOrder);

// Get user's order history
router.get("/user", authMiddleware, orderController.getUserOrderHistory);

// Cancel an order
router.put("/:orderId/cancel", authMiddleware, orderController.cancelOrder);

// Get order by ID
router.get("/:orderId", authMiddleware, orderController.getOrderById);

router.get(
  "/item/:orderItemId",
  authMiddleware,
  orderController.getOrderItemById
);



module.exports = router;
