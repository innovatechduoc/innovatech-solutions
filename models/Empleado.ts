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

// Al final de tu modelo Empleado.ts
export const getEmpleadoModel = (conn: any) => {
  // El tercer parámetro "recursos" fuerza a Mongoose a usar esa colección exacta
  return (
    conn.models.Empleado || conn.model("Empleado", EmpleadoSchema, "recursos")
  );
};
