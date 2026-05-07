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
