// app/api/auth/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Usuario from "@/models/Usuario";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // 1. Verificamos que el usuario exista en la base de datos
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return NextResponse.json(
        { error: "Correo o contraseña incorrectos" },
        { status: 400 }, // Error genérico por seguridad
      );
    }

    // 2. Comparamos la contraseña escrita con la encriptada en la BD
    const contrasenaValida = await bcrypt.compare(password, usuario.password);

    if (!contrasenaValida) {
      return NextResponse.json(
        { error: "Correo o contraseña incorrectos" },
        { status: 400 }, // Error genérico por seguridad
      );
    }

    // 3. Si todo es correcto, le damos paso (Retornamos éxito)
    return NextResponse.json(
      {
        mensaje: "Autenticación exitosa",
        token: "token-generico-temporal", // Tu frontend espera un token para el localStorage
        rol: usuario.rol,
      },
      { status: 200 }, // 200 OK
    );
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
