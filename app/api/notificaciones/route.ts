import { NextResponse } from "next/server";
import { connectProjectsDB } from "@/lib/mongodb";
import { getNotificacionModel } from "@/models/Notificacion"; // Ajusta la ruta si tu carpeta models está dentro de lib

export async function GET(request: Request) {
  try {
    // 1. Usamos la conexión específica
    const db = await connectProjectsDB();
    // 2. Registramos el modelo en esa conexión
    const Notificacion = getNotificacionModel(db);

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || "5");

    const notificaciones = await Notificacion.find({})
      .sort({ createdAt: -1 })
      .limit(Number.isNaN(limit) ? 5 : limit)
      .lean();

    return NextResponse.json(notificaciones, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener notificaciones" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Aplicamos el mismo patrón
    const db = await connectProjectsDB();
    const Notificacion = getNotificacionModel(db);

    const body = await request.json();
    const { title, message, type = "system", metadata = {} } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "title y message son requeridos" },
        { status: 400 },
      );
    }

    const notification = await Notificacion.create({
      title,
      message,
      type,
      metadata,
      isRead: false,
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear notificación" },
      { status: 400 },
    );
  }
}

export async function PATCH() {
  try {
    // Aplicamos el mismo patrón
    const db = await connectProjectsDB();
    const Notificacion = getNotificacionModel(db);

    const result = await Notificacion.updateMany(
      { isRead: false },
      { $set: { isRead: true } },
    );

    return NextResponse.json(
      {
        updatedCount: result.modifiedCount ?? result.nModified ?? 0,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al marcar notificaciones como leídas" },
      { status: 500 },
    );
  }
}
