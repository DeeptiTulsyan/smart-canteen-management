const Order = require("../models/Order");
// const { getMenuItemById } = require("../services/menuService");
// const { debitWallet } = require("../services/walletService");
// const { publishEvent } = require("../producers/orderProducer");

class OrderController {
  static async createOrder(req, res) {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: "Items are required"
        });
      }

      for (const item of items) {
        if (!item.menuId || !item.qty) {
          return res.status(400).json({
            message: "Each item must contain menuId and qty"
          });
        }
      }

      // Temporary mock data for testing only Order Service
      const studentId = "22BCE1023";
      const email = "student@email.com";

      const enrichedItems = items.map((item) => {
        return {
          name: "Veg Sandwich",
          price: 80,
          qty: item.qty
        };
      });

      const total = enrichedItems.reduce((sum, item) => {
        return sum + item.price * item.qty;
      }, 0);

      // Temporary skip for now
      // await debitWallet(studentId, total);

      const order = new Order({
        orderId: "ORD" + Date.now(),
        studentId,
        email,
        items: enrichedItems,
        total,
        status: "PLACED"
      });

      await order.save();

      const eventData = {
        event: "ORDER_PLACED",
        orderId: order.orderId,
        studentId: order.studentId,
        email: order.email,
        items: order.items,
        total: order.total,
        status: order.status,
        timestamp: new Date()
      };

      // Temporary skip for now
      // await publishEvent(eventData);

      return res.status(201).json({
        message: "Order placed successfully",
        order
      });
    } catch (error) {
      console.error("Create Order Error:", error.message);

      return res.status(500).json({
        message: error.message || "Error creating order"
      });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const orderId = req.params.id;

      const allowedStatuses = ["PLACED", "PREPARING", "READY", "CANCELLED"];

      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status"
        });
      }

      const order = await Order.findOne({ orderId });

      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      order.status = status;
      await order.save();

      let eventName = null;

      if (status === "READY") {
        eventName = "ORDER_READY";
      } else if (status === "CANCELLED") {
        eventName = "ORDER_CANCELLED";
      }

      if (eventName) {
        const eventData = {
          event: eventName,
          orderId: order.orderId,
          studentId: order.studentId,
          email: order.email,
          items: order.items,
          total: order.total,
          status: order.status,
          timestamp: new Date()
        };

        // Temporary skip for now
        // await publishEvent(eventData);
      }

      return res.status(200).json({
        message: "Order status updated successfully",
        order
      });
    } catch (error) {
      console.error("Update Order Error:", error.message);

      return res.status(500).json({
        message: error.message || "Error updating order status"
      });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await Order.find();

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Get All Orders Error:", error.message);

      return res.status(500).json({
        message: "Error fetching orders"
      });
    }
  }

  static async getOrderById(req, res) {
    try {
      const orderId = req.params.id;

      const order = await Order.findOne({ orderId });

      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error("Get Order By ID Error:", error.message);

      return res.status(500).json({
        message: "Error fetching order"
      });
    }
  }
}

module.exports = OrderController;