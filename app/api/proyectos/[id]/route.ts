// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectProjectsDB } from "../../../../lib/mongodb";
import { getProyectoModel } from "../../../../models/Proyecto";
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectProjectsDB();
    const { id } = params;
    const db = await connectProjectsDB();
    const Proyecto = getProyectoModel(db);
    const proyectoEliminado = await Proyecto.findByIdAndDelete(id);

    if (!proyectoEliminado) {
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

export async function GET() {
  try {
    console.log("Intentando conectar a Mongo...");
    const db = await connectProjectsDB();
    const Proyecto = getProyectoModel(db);

    console.log("Buscando proyectos en la colección...");
    const proyectos = await Proyecto.find({});

    console.log("Proyectos encontrados:", proyectos.length);
    return NextResponse.json(proyectos, { status: 200 });
  } catch (error: any) {
    console.error("ERROR EN LA API DE PROYECTOS:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
