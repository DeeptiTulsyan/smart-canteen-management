import Notification from "../../models/Notification.js";

export const handleNotification = async (data) => {
  const { event, orderId, email, studentId } = data;

  let message = "";
  let status = "";

  if (event === "ORDER_PLACED") {
    message = "Your order is confirmed";
    status = "PLACED";
  }

  if (event === "ORDER_READY") {
    message = "Your order is ready";
    status = "READY";
  }

  if (event === "ORDER_CANCELLED") {
    message = "Your order is cancelled";
    status = "CANCELLED";
  }

  // ✅ ADD THIS LOG
  console.log("👉 About to save notification:", {
    orderId,
    studentId,
    email,
    message,
    status
  });

  // 👉 Save to DB
  const savedNotification = await Notification.create({
    orderId,
    studentId,
    email,
    message,
    status
  });

  // ✅ ADD THIS LOG
  console.log("✅ Saved in DB:", savedNotification);

  // 👉 Console output (for demo)
  console.log(`📩 ${message} (Order: ${orderId})`);
};