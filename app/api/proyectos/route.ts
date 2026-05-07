// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectProjectsDB } from "../../../lib/mongodb";
import { getProyectoModel } from "../../../models/Proyecto";

// GET: Leer todos los proyectos
export async function GET() {
  try {
    // 1. Nos conectamos solo a la BD de proyectos
    const db = await connectProjectsDB();

    // 2. Registramos el modelo en esta conexión
    const Proyecto = getProyectoModel(db);

    // 3. Tu lógica de búsqueda original...
    const proyectos = await Proyecto.find({}).sort({ createdAt: -1 });
    return NextResponse.json(proyectos, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Crear un nuevo proyecto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await connectProjectsDB();
    const Proyecto = getProyectoModel(db);
    const newProject = await Proyecto.create(body);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
