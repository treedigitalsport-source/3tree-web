"use server";

import { db } from "../../lib/firebase-admin";
import { Resend } from "resend";
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { EventBus } from "../../lib/runtime/event-bus/index";
import { MCPBridge } from "../../lib/runtime/mcp/index";
import type { CanonicalEventEnvelope, LeadQualifiedPayload } from "../../lib/runtime/event-bus/index";

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

async function resolveClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown-client";
  } catch {
    return "127.0.0.1";
  }
}

export async function submitContactForm(formData: FormData) {
  try {
    // CAPA 1: HONEYPOT ANTI-BOT INVISIBLE
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

    // CAPA 4: RATE LIMITING REAL POR IP EN VERCEL (Máx 5 envíos por 5 min)
    const ip = await resolveClientIp();
    const now = Date.now();
    const timestamps = submissionRateMap.get(ip) || [];
    const validTimestamps = timestamps.filter(t => now - t < 5 * 60 * 1000);
    
    if (validTimestamps.length >= 5) {
      return { success: false, error: "Demasiadas solicitudes desde su conexión. Por favor intente más tarde." };
    }
    validTimestamps.push(now);
    submissionRateMap.set(ip, validTimestamps);

    const correlationId = randomUUID();
    const leadId = `lead-${now}-${randomUUID().slice(0, 8)}`;
    const idempotencyKey = `contact-${randomUUID()}`;

    // 🚀 CAPA 5: Publicación Canónica al Event Bus (EVT-001)
    const inboundLeadEvent: CanonicalEventEnvelope<LeadQualifiedPayload> = {
      eventId: `evt-001-${randomUUID()}`,
      idempotencyKey,
      eventType: "lead.inbound.qualified",
      version: "1.0.0",
      timestampUtc: new Date().toISOString(),
      issuerAgentId: "AG-031", // Iris / Web Contact Boundary
      targetAgentId: "AG-025", // Hermes (Director Comercial)
      priority: "P0_CRITICAL",
      metadata: {
        correlationId,
        retryCount: 0,
        environment: "production",
      },
      payload: {
        leadId: randomUUID(),
        prospectName: name,
        contactEmail: email,
        organization,
        organizationType: "ACADEMY",
        rosterVolume: 30,
        intentScore: 90,
        painPoints: [service],
        conversationSummary: message.length >= 10 ? message : `Inquiry for ${service} from ${organization}`,
        qualifiedAt: new Date().toISOString(),
      },
    };

    await EventBus.dispatcher.dispatch(inboundLeadEvent);

    // 🚀 CAPA 6: Invocación Delegada en MCP Tool Bridge (Hermes AG-025)
    try {
      await MCPBridge.execute({
        invocationId: `inv-${randomUUID()}`,
        idempotencyKey: `mcp-${idempotencyKey}`,
        toolName: "classify_lead",
        callerAgentId: "AG-025",
        targetDepartmentId: "DP-10",
        params: {
          email,
          status: "VIP",
        },
        metadata: {
          correlationId,
          timeoutMs: 5000,
          environment: "production",
        },
      });
    } catch (mcpErr) {
      console.warn("[CONTACT FORM] MCP classification warning:", mcpErr);
    }

    // Persistencia legacy fallback
    try {
      if (db) {
        await db.collection("leads").add({
          organization,
          name,
          email,
          service,
          message,
          createdAt: new Date().toISOString(),
          status: "new",
          correlationId,
        });
      }
    } catch (dbErr) {
      console.warn("Database storage fallback warning:", dbErr);
    }

    // Notificación por correo
    if (process.env.RESEND_API_KEY && process.env.CEO_EMAIL) {
      try {
        await resend?.emails.send({
          from: "3Tree Digital <onboarding@resend.dev>",
          to: process.env.CEO_EMAIL,
          subject: `Nuevo Lead 3Tree: ${organization} - ${name}`,
          html: `
            <h2>Nuevo Mensaje de Contacto (Verificado & EventBus)</h2>
            <p><strong>Organización/Equipo:</strong> ${organization}</p>
            <p><strong>Contacto:</strong> ${name}</p>
            <p><strong>Correo:</strong> ${email}</p>
            <p><strong>Servicio de interés:</strong> ${service}</p>
            <p><strong>Correlation ID:</strong> ${correlationId}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message}</p>
          `,
        });
      } catch (emailErr) {
        console.error("Error sending email notification:", emailErr);
      }
    }

    return { success: true, leadId, correlationId };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Error al enviar el mensaje" };
  }
}

export async function submitQuickLead(emailRaw: string) {
  try {
    const email = sanitizeInput(emailRaw);
    if (!email) return { success: false, error: "Email requerido" };

    // RATE LIMITING REAL POR IP EN VERCEL
    const ip = await resolveClientIp();
    const now = Date.now();
    const timestamps = submissionRateMap.get(ip) || [];
    const validTimestamps = timestamps.filter(t => now - t < 5 * 60 * 1000);
    
    if (validTimestamps.length >= 5) {
      return { success: false, error: "Demasiadas solicitudes desde su conexión. Por favor intente más tarde." };
    }
    validTimestamps.push(now);
    submissionRateMap.set(ip, validTimestamps);

    const correlationId = randomUUID();
    const leadId = `lead-${now}-${randomUUID().slice(0, 8)}`;
    const idempotencyKey = `quick-${randomUUID()}`;

    // 🚀 Publicación Canónica al Event Bus (EVT-001)
    const quickLeadEvent: CanonicalEventEnvelope<LeadQualifiedPayload> = {
      eventId: `evt-001-${randomUUID()}`,
      idempotencyKey,
      eventType: "lead.inbound.qualified",
      version: "1.0.0",
      timestampUtc: new Date().toISOString(),
      issuerAgentId: "AG-031",
      targetAgentId: "AG-025",
      priority: "P1_HIGH",
      metadata: {
        correlationId,
        retryCount: 0,
        environment: "production",
      },
      payload: {
        leadId: randomUUID(),
        prospectName: "Newsletter Subscriber",
        contactEmail: email,
        organization: "Direct Subscriber",
        organizationType: "INDIVIDUAL_ATHLETE",
        rosterVolume: 1,
        intentScore: 65,
        painPoints: ["Newsletter & Updates"],
        conversationSummary: "Quick Lead captured from footer/hero newsletter subscription",
        qualifiedAt: new Date().toISOString(),
      },
    };

    await EventBus.dispatcher.dispatch(quickLeadEvent);

    try {
      if (db) {
        await db.collection("leads").add({
          email,
          source: "Quick Lead Form",
          createdAt: new Date().toISOString(),
          status: "new",
          correlationId,
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
            <p><strong>Correlation ID:</strong> ${correlationId}</p>
          `,
        });
      } catch (emailErr) {
        console.error("Error sending email notification:", emailErr);
      }
    }
    return { success: true, leadId, correlationId };
  } catch (error) {
    console.error("Error submitting quick lead:", error);
    return { success: false, error: "Error al suscribirse" };
  }
}
