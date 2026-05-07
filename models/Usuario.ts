import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Recuerda encriptarla con bcrypt
    rol: { type: String, enum: ["Admin", "Manager", "User"], default: "User" },
    empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: "Empleado" }, // Vinculación con el recurso humano
    profilePhoto: { type: String, default: null }, // Base64 image stored in cloud (MongoDB)
  },
  { timestamps: true },
);

export const getUsuarioModel = (conn: mongoose.Connection) => {
  return conn.models.Usuario || conn.model("Usuario", UsuarioSchema);
};
