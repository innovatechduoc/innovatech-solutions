import { NextResponse, NextRequest } from "next/server";
import { connectResourcesDB } from "@/lib/mongodb";
import { getEmpleadoModel } from "@/models/Empleado";

export async function GET() {
  try {
    const db = await connectResourcesDB();

    const Empleado = getEmpleadoModel(db);

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
    const db = await connectResourcesDB();
    const Empleado = getEmpleadoModel(db);

    const body = await request.json();
    const nuevoEmpleado = await Empleado.create(body);

    return NextResponse.json(nuevoEmpleado, { status: 201 });
  } catch (error: any) {
    console.error("Error exacto de Mongoose:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
