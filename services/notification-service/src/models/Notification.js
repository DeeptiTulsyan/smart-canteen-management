import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },

  studentId: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["PLACED", "READY", "CANCELLED"],
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);