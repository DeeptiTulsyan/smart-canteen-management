const amqp = require("amqplib");

const publishEvent = async (eventData) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.QUEUE_NAME);

    channel.sendToQueue(
      process.env.QUEUE_NAME,
      Buffer.from(JSON.stringify(eventData))
    );

    console.log("Event published:", eventData.event);

    setTimeout(() => {
      connection.close();
    }, 500);

  } catch (error) {
    console.error("Error publishing event:", error);
  }
};

module.exports = { publishEvent };