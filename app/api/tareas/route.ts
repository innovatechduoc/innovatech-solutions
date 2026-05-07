// app/api/tareas/route.ts
import { NextResponse } from "next/server";
import { connectProjectsDB, connectResourcesDB } from "@/lib/mongodb";
import { getTareaModel } from "@/models/Tarea";
import { getEmpleadoModel } from "@/models/Empleado"; // Necesario para el populate

export async function GET(req: Request) {
  try {
    // 1. Conectamos a la BD de Proyectos
    const dbProjects = await connectProjectsDB();
    const Tarea = getTareaModel(dbProjects);

    // 2. IMPORTANTE: Para que .populate() funcione, Mongoose necesita conocer el modelo Empleado.
    // Aunque los empleados estén en otra BD, registramos el esquema en esta conexión
    // para que sepa cómo mapear los datos.
    const dbResources = await connectResourcesDB();
    getEmpleadoModel(dbResources);

    const { searchParams } = new URL(req.url);
    const proyectoId = searchParams.get("proyectoId");

    const filtro = proyectoId ? { proyectoId } : {};

    // Ejecutamos la búsqueda con populate
    const tareas = await Tarea.find(filtro).populate("responsableId");

    return NextResponse.json(tareas, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await connectProjectsDB();
    const Tarea = getTareaModel(db);

    const data = await req.json();
    const nuevaTarea = await Tarea.create(data);

    return NextResponse.json(nuevaTarea, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear tarea: " + error.message },
      { status: 400 },
    );
  }
}
