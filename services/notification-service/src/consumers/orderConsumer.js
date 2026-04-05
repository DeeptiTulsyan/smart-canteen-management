import { getChannel } from "../../../../shared/rabbitmq.js";
import { QUEUE_NAME } from "../../../../shared/constants.js";
import { handleNotification } from "../handlers/notificationService.js";

export const startOrderConsumer = async () => {
  const channel = getChannel();

  console.log("Listening to queue...");

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    console.log("Event received:", data.event);

    await handleNotification(data);

    channel.ack(msg); // VERY IMPORTANT
  });
};