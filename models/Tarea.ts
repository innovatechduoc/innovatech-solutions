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
    responsableId: { type: mongoose.Schema.Types.ObjectId, ref: "Empleado" }, // Asignación de responsables [cite: 79]
  },
  { timestamps: true },
);

export default mongoose.models.Tarea || mongoose.model("Tarea", TareaSchema);
