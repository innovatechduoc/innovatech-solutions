import { NextResponse } from "next/server";
import { connectResourcesDB } from "@/lib/mongodb";
import { getEmpleadoModel } from "@/models/Empleado";
import { getNotificacionModel } from "@/models/Notificacion";

export async function GET() {
  try {
    const db = await connectResourcesDB();
    const Empleado = getEmpleadoModel(db);

    const empleados = await Empleado.find({});

    return NextResponse.json(empleados, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener empleados" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectResourcesDB();
    const Empleado = getEmpleadoModel(db);
    const Notificacion = getNotificacionModel(db);

    const body = await request.json();

    const nuevoEmpleado = await Empleado.create(body);

    await Notificacion.create({
      type: "employee",
      title: "Nuevo usuario agregado",
      message: `Se registró a ${body.nombre || "un nuevo empleado"} en el sistema.`,
      metadata: {
        nombre: body.nombre || null,
        especialidad: body.especialidad || null,
        email: body.email || null,
      },
    });

    return NextResponse.json(nuevoEmpleado, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear el empleado" },
      { status: 400 },
    );
  }
}
