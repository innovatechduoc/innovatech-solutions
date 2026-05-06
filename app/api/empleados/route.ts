import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Empleado from "@/models/Empleado";
import Notificacion from "@/models/Notificacion";

// GET: Sirve para obtener la lista de todos los empleados
export async function GET() {
  try {
    await connectDB(); // Siempre abrimos la conexión primero
    const empleados = await Empleado.find({}); // Busca todos los registros

    return NextResponse.json(empleados, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener empleados" },
      { status: 500 },
    );
  }
}

// POST: Sirve para guardar un empleado nuevo en la base de datos
export async function POST(request: Request) {
  try {
    await connectDB();

    // Obtenemos los datos que nos enviará el frontend
    const body = await request.json();

    // Le decimos a Mongoose que cree el registro usando nuestro Molde
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
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el empleado" },
      { status: 400 },
    );
  }
}
