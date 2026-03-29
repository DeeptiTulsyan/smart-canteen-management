// shared/rabbitmq.js

import amqp from "amqplib";
import { QUEUE_NAME } from "./constants.js";

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, {
      durable: true
    });

    console.log("✅ RabbitMQ connected");
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error);
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ not initialized");
  }
  return channel;
};