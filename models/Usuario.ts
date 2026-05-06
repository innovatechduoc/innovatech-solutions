import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Recuerda encriptarla con bcrypt
    rol: { type: String, enum: ["Admin", "Manager", "User"], default: "User" },
    empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: "Empleado" }, // Vinculación con el recurso humano
  },
  { timestamps: true },
);

export default mongoose.models.Usuario ||
  mongoose.model("Usuario", UsuarioSchema);
