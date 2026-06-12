import { NextResponse, NextRequest } from "next/server";
import { connectIdentityDB } from "@/lib/mongodb";
import { getUsuarioModel } from "@/models/Usuario";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email no proporcionado" },
        { status: 400 },
      );
    }

    const db = await connectIdentityDB();
    const Usuario = getUsuarioModel(db);

    const usuario = await Usuario.findOne({ email }).select("-password");

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ usuario, empleado: null }, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener el perfil:", error.message);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
