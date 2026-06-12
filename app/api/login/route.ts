import { NextRequest, NextResponse } from "next/server";
import { connectIdentityDB } from "../../../lib/mongodb";
import { getUsuarioModel } from "../../../models/Usuario";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const db = await connectIdentityDB();

    const Usuario = getUsuarioModel(db);

    const user = await Usuario.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Correo electrónico no registrado" },
        { status: 404 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 },
      );
    }

    const token = `temp-token-${user._id}`;

    return NextResponse.json(
      {
        success: true,
        token: token,
        rol: user.role,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error en el login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
