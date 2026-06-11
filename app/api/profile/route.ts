// app/api/profile/route.ts
import { NextResponse, NextRequest } from "next/server";
// Asumo que tienes algo como connectIdentityDB en tu lib/mongodb
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

    // 1. Conectamos a la base de datos de Identidad (donde están los Usuarios)
    const db = await connectIdentityDB();
    const Usuario = getUsuarioModel(db);

    // 2. Buscamos al usuario por su email
    // Usamos .select("-password") para no enviar la contraseña al frontend por seguridad
    const usuario = await Usuario.findOne({ email }).select("-password");

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    // 3. Devolvemos los datos. El frontend espera un objeto con { usuario, empleado }
    // Si más adelante quieres cruzarlo con el modelo Empleado, puedes hacerlo aquí
    return NextResponse.json({ usuario, empleado: null }, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener el perfil:", error.message);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
