import { NextRequest, NextResponse } from "next/server";
import { connectProjectsDB } from "@/lib/mongodb";
import { getProyectoModel } from "@/models/Proyecto";

// 1. Declaramos que params es una Promesa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 2. Usamos await para extraer el id real
    const { id } = await params;

    // 3. Tu lógica de base de datos normal
    const db = await connectProjectsDB();
    const Proyecto = getProyectoModel(db);

    const deletedProject = await Proyecto.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const db = await connectProjectsDB();
    const Proyecto = getProyectoModel(db);

    // Actualizamos el proyecto con los nuevos datos (estado y progress)
    const updatedProject = await Proyecto.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }, // Para que devuelva el documento actualizado
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
