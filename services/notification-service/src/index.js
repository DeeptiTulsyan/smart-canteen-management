import dotenv from "dotenv";
dotenv.config();

import { connectRabbitMQ } from "../../../shared/rabbitmq.js";
import { startOrderConsumer } from "./consumers/orderConsumer.js";
import { connectDB } from "./config/db.js";

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