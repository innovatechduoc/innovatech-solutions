import { NextRequest, NextResponse } from "next/server";
import { connectIdentityDB } from "../../../lib/mongodb"; // Importa la conexión de identidad
import { getUsuarioModel } from "../../../models/Usuario"; // Importa la nueva función
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Nos conectamos solo a la BD de identidad
    const db = await connectIdentityDB();

    // 2. Le pasamos esa conexión a nuestro modelo
    const Usuario = getUsuarioModel(db);

    // 3. El resto de tu código queda igual...
    const user = await Usuario.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Correo electrónico no registrado" },
        { status: 404 },
      );
    }

    // <-- 2. AQUI ESTÁ LA MAGIA: Comparamos la contraseña plana con el hash de la BD
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
