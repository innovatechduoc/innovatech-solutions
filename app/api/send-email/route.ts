import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const SMTP_HOST = process.env.SMTP_HOST ?? "smtp-relay.brevo.com";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USERNAME;
const SMTP_PASS = process.env.SMTP_PASSWORD;
const SMTP_FROM =
  process.env.SMTP_FROM ??
  process.env.SMTP_USERNAME ??
  "no-reply@innovatech.com";

export async function POST(request: Request) {
  if (!SMTP_USER || !SMTP_PASS) {
    return NextResponse.json(
      { error: "Faltan credenciales SMTP en las variables de entorno." },
      { status: 500 },
    );
  }

  // Validación de seguridad para Brevo
  const hostedSmtpDomain = "smtp-brevo.com";
  if (
    SMTP_FROM &&
    (SMTP_FROM.endsWith(`@${hostedSmtpDomain}`) || SMTP_FROM === SMTP_USER)
  ) {
    return NextResponse.json(
      {
        error: `El remitente (${SMTP_FROM}) parece ser la dirección SMTP proporcionada por Brevo. Registra un remitente verificado en Brevo.`,
      },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Se requiere un correo." },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      // Esto evita que tu aplicación se quede "congelada" si Brevo no responde
      connectionTimeout: 10000,
    });

    console.log("Verificando conexión SMTP...");
    await transporter.verify();
    console.log("Conexión SMTP exitosa.");

    await transporter.sendMail({
      from: SMTP_FROM,
      to: "innovatech.duoc@gmail.com",
      subject: "Solicitud de Cambio de Contraseña",
      text: `La cuenta ${email} necesita cambiar su contraseña.`,
    });

    return NextResponse.json({ success: true, message: "Correo enviado." });
  } catch (error: any) {
    // ESTO es lo que debes mirar en la terminal de VSC cuando falle
    console.error("DETALLE DEL ERROR SMTP:", error);

    return NextResponse.json(
      { error: error.message || "Error desconocido al enviar el correo." },
      { status: 500 },
    );
  }
}
