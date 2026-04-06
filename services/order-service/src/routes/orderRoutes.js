const express = require("express");
const router = express.Router();
const {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderById
} = require("../controllers/orderController");

// optional: add JWT middleware later
const verifyToken = require("../middleware/authMiddleware");

// Create new order
router.post("/", verifyToken, createOrder);

// Update order status
router.patch("/:id", verifyToken, updateOrderStatus);

// Get all orders
router.get("/", verifyToken, getAllOrders);

// Get single order by orderId
router.get("/:id", verifyToken, getOrderById);

module.exports = router;