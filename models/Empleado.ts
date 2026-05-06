import mongoose, { Schema, model, models } from "mongoose";

const EmpleadoSchema = new Schema(
  {
    nombre: { type: String, required: true },
    cargo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    especialidad: { type: String, required: true }, // Ej: Frontend, Backend, UX [cite: 76]
    horasSemanales: { type: Number, default: 40 }, // Capacidad total
    proyectosAsignados: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Proyecto" },
    ],
  },
  { timestamps: true },
);

const Empleado = models.Empleado || model("Empleado", EmpleadoSchema);

export default Empleado;
