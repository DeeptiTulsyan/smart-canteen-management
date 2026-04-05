require("dotenv").config();

const { connectRabbitMQ } = require("../../../shared/rabbitmq");
const { startOrderConsumer } = require("./consumers/orderConsumer");
const { connectDB } = require("./config/db");

const start = async () => {
  try {
    console.log("Starting Notification Service...");

    await connectDB();
    await connectRabbitMQ(); // Step 1
    await startOrderConsumer(); // Step 2

    console.log("Notification Service running");
  } catch (err) {
    console.error("Startup error:", err);
  }
};

start();