import { NextRequest, NextResponse } from "next/server";
import { connectProjectsDB } from "../../../lib/mongodb";
import { getProyectoModel } from "../../../models/Proyecto";

export async function GET() {
  try {
    const db = await connectProjectsDB();

    const Proyecto = getProyectoModel(db);

    const proyectos = await Proyecto.find({}).sort({ createdAt: -1 });
    return NextResponse.json(proyectos, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
