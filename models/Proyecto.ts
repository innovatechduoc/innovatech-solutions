// models/Proyecto.ts
import mongoose from "mongoose";
// IMPORTANTE: Importamos el archivo, no necesariamente el objeto,
// para forzar el registro del esquema.
import "./Empleado";

const ProyectoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    cliente: { type: String, required: true },
    estado: {
      type: String,
      enum: ["Planificación", "En Progreso", "Finalizado"],
      default: "Planificación",
    },
    fechaInicio: { type: Date, required: true },
    fechaFinEstimada: { type: Date },
    // El nombre "Empleado" aquí debe coincidir EXACTAMENTE con
    // el nombre que pusiste en mongoose.model("Empleado", ...)
    equipo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Empleado" }],
  },
  { timestamps: true },
);

export default mongoose.models.Proyecto ||
  mongoose.model("Proyecto", ProyectoSchema);
