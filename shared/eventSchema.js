const { EVENTS } = require("./constants");

const validateEvent = (data) => {
  if (!data.event) throw new Error("Event type is required");

  if (!Object.values(EVENTS).includes(data.event)) {
    throw new Error("Invalid event type");
  }

  if (!data.orderId) throw new Error("orderId is required");
  if (!data.studentId) throw new Error("studentId is required");
  if (!data.timestamp) throw new Error("timestamp is required");

  return true;
};

const createEvent = (eventType, payload) => {
  return {
    event: eventType,
    ...payload,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  validateEvent,
  createEvent
};