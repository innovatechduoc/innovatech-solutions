import mongoose from "mongoose";

const NotificacionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["project", "employee", "system"],
      default: "system",
    },
    isRead: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.Notificacion ||
  mongoose.model("Notificacion", NotificacionSchema);
