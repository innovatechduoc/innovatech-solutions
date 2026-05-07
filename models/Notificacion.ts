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

// Al final de tu modelo Notificacion.ts
export const getNotificacionModel = (conn: any) => {
  return (
    conn.models.Notificacion || conn.model("Notificacion", NotificacionSchema)
  );
};
