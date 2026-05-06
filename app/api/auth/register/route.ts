// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Usuario from "@/models/Usuario";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password, nombre, rol } = await req.json();

    // 1. Verificamos si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 },
      );
    }

    // 2. Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Creamos el usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      email,
      password: hashedPassword,
      nombre,
      rol: rol || "Admin",
    });

    return NextResponse.json(
      {
        mensaje: "Usuario creado exitosamente",
        usuario: { email: nuevoUsuario.email, rol: nuevoUsuario.rol },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error al registrar:", error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 },
    );
  }
}
