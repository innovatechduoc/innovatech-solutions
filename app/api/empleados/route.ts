import { NextResponse } from "next/server";
// 1. Importamos la conexión específica para Recursos Humanos (HR)
import { connectResourcesDB } from "@/lib/mongodb";
// 2. Importamos las funciones inyectoras en lugar de los modelos directos
import { getEmpleadoModel } from "@/models/Empleado";
import { getNotificacionModel } from "@/models/Notificacion";

export async function GET() {
  try {
    // Conectamos a la base de datos de HR
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
    // Conectamos a la base de datos de HR
    const db = await connectResourcesDB();
    const Empleado = getEmpleadoModel(db);
    const Notificacion = getNotificacionModel(db);

    const body = await request.json();

    // Creamos el empleado en la base de datos de HR
    const nuevoEmpleado = await Empleado.create(body);

    // Creamos la notificación (se guardará en la misma base de datos de HR)
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
