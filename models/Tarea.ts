// models/Tarea.ts
import mongoose from "mongoose";

const TareaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String },
    estado: {
      type: String,
      enum: ["Pendiente", "En Desarrollo", "Completada"],
      default: "Pendiente",
    },
    proyectoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
      required: true,
    },
    responsableId: { type: mongoose.Schema.Types.ObjectId, ref: "Empleado" },
  },
  { timestamps: true },
);

// LA CLAVE: Exportar la función inyectora
export const getTareaModel = (conn: mongoose.Connection) => {
  return conn.models.Tarea || conn.model("Tarea", TareaSchema);
};
