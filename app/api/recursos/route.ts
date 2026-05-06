import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Empleado from "@/models/Empleado";

export async function GET() {
  await connectDB();
  const recursos = await Empleado.find({});
  return NextResponse.json(recursos);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const nuevoRecurso = await Empleado.create(data);
    return NextResponse.json(nuevoRecurso, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear recurso" },
      { status: 400 },
    );
  }
}
