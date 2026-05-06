import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Usuario from "@/models/Usuario";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Buscamos al usuario y verificamos su existencia
    const usuario = await Usuario.findOne({ email });

    if (!usuario || usuario.password !== password) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    // En producción, aquí generarías un JWT real
    const token = "simulated-jwt-token-for-" + usuario.rol;

    return NextResponse.json(
      {
        message: "Login exitoso",
        token,
        rol: usuario.rol,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 },
    );
  }
}
