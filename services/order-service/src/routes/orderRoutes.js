const express = require("express");
const router = express.Router();
const {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderById
} = require("../controllers/orderController");

// optional: add JWT middleware later
// const verifyToken = require("../middleware/authMiddleware");

// Create new order
router.post("/", createOrder);

// Update order status
router.patch("/:id", updateOrderStatus);

// Get all orders
router.get("/", getAllOrders);

// Get single order by orderId
router.get("/:id", getOrderById);

module.exports = router;