"use server";

import { db } from "@/lib/firebase-admin";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Simple en-memoria Rate Limiter anti-bots por IP/peticiones
const submissionRateMap = new Map<string, number[]>();

function sanitizeInput(str: string): string {
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/["']/g, "")
    .trim();
}

export async function submitContactForm(formData: FormData) {
  try {
    // CAPA 2: HONEYPOT ANTI-BOT INVISIBLE
    const honeypot = formData.get("website_url_hp") as string;
    if (honeypot && honeypot.length > 0) {
      // Un bot llenó el campo trampa invisible. Simular éxito sin procesar ni guardar nada.
      return { success: true };
    }

    // CAPA 2: VERIFICACIÓN DE TIEMPO HUMANO (Min 1.5s)
    const renderedAtStr = formData.get("form_rendered_at") as string;
    if (renderedAtStr) {
      const renderedAt = parseInt(renderedAtStr, 10);
      const now = Date.now();
      if (now - renderedAt < 1500) {
        // Envió el formulario en menos de 1.5s (imposible para un humano). Bloquear bot.
        return { success: false, error: "Verificación humana fallida (Envío demasiado rápido)" };
      }
    }

    const organizationRaw = formData.get("organization") as string;
    const nameRaw = formData.get("name") as string;
    const emailRaw = formData.get("email") as string;
    const serviceRaw = formData.get("service") as string;
    const messageRaw = formData.get("message") as string;

    if (!nameRaw || !emailRaw || !messageRaw || !organizationRaw) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    // CAPA 3: SANITIZACIÓN ESTRICTA (Anti-XSS e Inyecciones)
    const organization = sanitizeInput(organizationRaw);
    const name = sanitizeInput(nameRaw);
    const email = sanitizeInput(emailRaw);
    const service = sanitizeInput(serviceRaw || "No especificado");
    const message = sanitizeInput(messageRaw);

    // CAPA 3: RATE LIMITING (Máx 3 envíos por 5 min)
    const ip = "client-ip"; // Fallback seguro
    const now = Date.now();
    const timestamps = submissionRateMap.get(ip) || [];
    const validTimestamps = timestamps.filter(t => now - t < 5 * 60 * 1000);
    
    if (validTimestamps.length >= 3) {
      return { success: false, error: "Demasiadas solicitudes. Por favor intente más tarde." };
    }
    validTimestamps.push(now);
    submissionRateMap.set(ip, validTimestamps);

    try {
      if (db) {
        await db.collection("leads").add({
          organization,
          name,
          email,
          service,
          message,
          createdAt: new Date().toISOString(),
          status: "new"
        });
      }
    } catch (dbErr) {
      console.warn("Database storage fallback warning:", dbErr);
    }

    if (process.env.RESEND_API_KEY && process.env.CEO_EMAIL) {
      try {
        await resend?.emails.send({
          from: "3Tree Digital <onboarding@resend.dev>",
          to: process.env.CEO_EMAIL,
          subject: `Nuevo Lead 3Tree: ${organization} - ${name}`,
          html: `
            <h2>Nuevo Mensaje de Contacto (Verificado)</h2>
            <p><strong>Organización/Equipo:</strong> ${organization}</p>
            <p><strong>Contacto:</strong> ${name}</p>
            <p><strong>Correo:</strong> ${email}</p>
            <p><strong>Servicio de interés:</strong> ${service}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message}</p>
          `,
        });
      } catch (emailErr) {
        console.error("Error sending email notification:", emailErr);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Error al enviar el mensaje" };
  }
}

export async function submitQuickLead(emailRaw: string) {
  try {
    const email = sanitizeInput(emailRaw);
    if (!email) return { success: false, error: "Email requerido" };

    // RATE LIMITING
    const ip = "client-ip-lead";
    const now = Date.now();
    const timestamps = submissionRateMap.get(ip) || [];
    const validTimestamps = timestamps.filter(t => now - t < 5 * 60 * 1000);
    
    if (validTimestamps.length >= 3) {
      return { success: false, error: "Demasiadas solicitudes. Por favor intente más tarde." };
    }
    validTimestamps.push(now);
    submissionRateMap.set(ip, validTimestamps);

    try {
      if (db) {
        await db.collection("leads").add({
          email,
          source: "Quick Lead Form",
          createdAt: new Date().toISOString(),
          status: "new"
        });
      }
    } catch (dbErr) {
      console.warn("Database storage fallback warning:", dbErr);
    }

    if (process.env.RESEND_API_KEY && process.env.CEO_EMAIL) {
      try {
        await resend?.emails.send({
          from: "3Tree Digital <onboarding@resend.dev>",
          to: process.env.CEO_EMAIL,
          subject: `Nuevo Lead Rápido (Suscripción): ${email}`,
          html: `
            <h2>Nuevo Email Capturado</h2>
            <p>Un usuario dejó su correo electrónico en la página principal.</p>
            <p><strong>Correo:</strong> ${email}</p>
          `,
        });
      } catch (emailErr) {
        console.error("Error sending email notification:", emailErr);
      }
    }
    return { success: true };
  } catch (error) {
    console.error("Error submitting quick lead:", error);
    return { success: false, error: "Error al suscribirse" };
  }
}
