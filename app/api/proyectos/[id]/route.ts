import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proyecto from "@/models/Proyecto";

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
