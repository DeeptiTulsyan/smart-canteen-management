// shared/eventSchema.js

import { EVENTS } from "./constants.js";

export const validateEvent = (data) => {
  if (!data.event) throw new Error("Event type is required");

  if (!Object.values(EVENTS).includes(data.event)) {
    throw new Error("Invalid event type");
  }

  if (!data.orderId) throw new Error("orderId is required");
  if (!data.studentId) throw new Error("studentId is required");
  if (!data.timestamp) throw new Error("timestamp is required");

  return true;
};

export const createEvent = (eventType, payload) => {
  return {
    event: eventType,
    ...payload,
    timestamp: new Date().toISOString()
  };
};