import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const SMTP_HOST = process.env.SMTP_HOST ?? "smtp-relay.brevo.com";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USERNAME;
const SMTP_PASS = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM ?? process.env.SMTP_USERNAME ?? "no-reply@ferreteria.com";

export async function POST() {
  if (!SMTP_USER || !SMTP_PASS) {
    return NextResponse.json(
      { error: "Faltan credenciales SMTP en las variables de entorno." },
      { status: 500 }
    );
  }

  // Detectar uso del email SMTP-proporcionado por Brevo como remitente visible.
  // Esto suele ser rechazado por el proveedor si ese remitente no está verificado.
  const hostedSmtpDomain = "smtp-brevo.com";
  if (SMTP_FROM && (SMTP_FROM.endsWith(`@${hostedSmtpDomain}`) || SMTP_FROM === SMTP_USER)) {
    return NextResponse.json(
      {
        error:
          `El remitente (${SMTP_FROM}) parece ser la dirección SMTP proporcionada por Brevo. ` +
          "Registra o verifica un remitente/dominio en Brevo y actualiza la variable `SMTP_FROM`."
      },
      { status: 400 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: SMTP_FROM,
      to: "bi.gonzalezr@duocuc.cl",
      subject: "Hola Mundo desde Ferretería Don Lucho",
      text: "Hola mundo",
    });

    return NextResponse.json({ success: true, message: "Correo enviado correctamente." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido al enviar correo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
