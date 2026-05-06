// app/api/proyectos/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proyecto from "@/models/Proyecto";
import Empleado from "@/models/Empleado";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // Forzamos a que la variable Empleado se "toque" para que el
    // compilador no la ignore y el modelo se registre.
    const _forceRegister = Empleado.modelName;

    // Ahora el populate debería encontrar "Empleado" sin problemas
    const proyectos = await Proyecto.find({}).populate("equipo").lean(); // .lean() hace que la consulta sea más ligera y rápida

    return NextResponse.json(proyectos);
  } catch (error: any) {
    console.error("DETALLE DEL ERROR EN GET:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const nuevoProyecto = await Proyecto.create(data);
    return NextResponse.json(nuevoProyecto, { status: 201 });
  } catch (error) {
    console.error("Error de Mongoose:", error);
    return NextResponse.json(
      { error: "Error al crear proyecto" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    // AQUÍ ESTÁ EL CAMBIO: Debemos esperar a que params se resuelva
    const { id } = await params;

    // Borramos el proyecto de MongoDB usando su ID único
    const proyectoEliminado = await Proyecto.findByIdAndDelete(id);

    if (!proyectoEliminado) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Proyecto eliminado con éxito" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el proyecto" },
      { status: 500 },
    );
  }
}
