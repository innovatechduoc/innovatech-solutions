import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Tarea from "@/models/Tarea";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const proyectoId = searchParams.get("proyectoId");

  // Si se pasa un proyectoId, filtramos las tareas de ese proyecto
  const filtro = proyectoId ? { proyectoId } : {};
  const tareas = await Tarea.find(filtro).populate("responsableId");

  return NextResponse.json(tareas);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const nuevaTarea = await Tarea.create(data);
    return NextResponse.json(nuevaTarea, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear tarea" },
      { status: 400 },
    );
  }
}
