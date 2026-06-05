// app/api/recursos/route.ts
import { NextResponse, NextRequest } from "next/server";
// ¡Cambio clave aquí! Importamos la nueva conexión
import { connectResourcesDB } from "@/lib/mongodb";
import { getEmpleadoModel } from "@/models/Empleado";

export async function GET() {
  try {
    // 1. Abrimos la conexión hacia la base de datos innovatech_hr
    const db = await connectResourcesDB();

    // 2. Registramos el modelo Empleado en ESA conexión específica
    const Empleado = getEmpleadoModel(db);

    // 3. Traemos los empleados
    const empleados = await Empleado.find({}).sort({ createdAt: -1 });

    return NextResponse.json(empleados, { status: 200 });
  } catch (error: any) {
    console.error("Error en recursos:", error.message);
    return NextResponse.json(
      { error: "Error al obtener recursos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Aplicamos la misma conexión en el POST
    const db = await connectResourcesDB();
    const Empleado = getEmpleadoModel(db);

    const body = await request.json();
    const nuevoEmpleado = await Empleado.create(body);

    return NextResponse.json(nuevoEmpleado, { status: 201 });
  } catch (error: any) {
    // ¡Añade esta línea para ver el chisme completo en tu terminal!
    console.error("Error exacto de Mongoose:", error.message); 
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
