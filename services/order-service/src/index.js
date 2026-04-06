require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { connectRabbitMQ } = require("../../../shared/rabbitmq");

const app = express();
app.use(express.json());

// routes
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const startServer = async () => {
  try {
    console.log("🚀 Starting Order Service...");

    // ✅ 1. Connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Order Service DB Connected");

    // ✅ 2. Connect RabbitMQ 
    await connectRabbitMQ();

    // ✅ 3. Start Server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Order Service running on ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1); // stop app if startup fails
  }
};

startServer();