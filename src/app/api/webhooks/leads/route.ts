import { NextResponse } from "next/server";
import { randomUUID, createHmac, timingSafeEqual } from "crypto";
import { EventBus } from "../../../../lib/runtime/event-bus/index";
import { MCPBridge } from "../../../../lib/runtime/mcp/index";
import type { CanonicalEventEnvelope, LeadQualifiedPayload } from "../../../../lib/runtime/event-bus/index";
import {
  LeadIngestionSchema,
  computeLeadIdempotencyKey,
  type LeadIngestionResponse,
} from "./schemas";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// 🛡️ AUTENTICACIÓN HMAC-SHA256 (GAP-INFRA-10)
function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret || !signatureHeader) return false;

  const cleanSignature = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice(7)
    : signatureHeader;

  try {
    const computedHmacHex = createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const sigBuffer = Buffer.from(cleanSignature, "hex");
    const hmacBuffer = Buffer.from(computedHmacHex, "hex");

    if (sigBuffer.length !== hmacBuffer.length) return false;
    return timingSafeEqual(sigBuffer, hmacBuffer);
  } catch {
    return false;
  }
}

// 🛡️ RATE LIMITER MIL-SPEC POR IP (Máximo 10 peticiones por minuto)
const webhookRateLimitMap = new Map<string, number[]>();

function checkWebhookRate(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const timestamps = webhookRateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);
  if (validTimestamps.length >= 10) return false;
  validTimestamps.push(now);
  webhookRateLimitMap.set(ip, validTimestamps);
  if (webhookRateLimitMap.size > 1000) {
    for (const [k, v] of webhookRateLimitMap.entries()) {
      if (v.every((t) => now - t > windowMs)) webhookRateLimitMap.delete(k);
    }
  }
  return true;
}

// 🛡️ CACHE DE IDEMPOTENCIA EN MEMORIA (Ventana deslizante de 10 minutos)
const processedIdempotencyKeys = new Map<string, { leadId: string; timestamp: number }>();

function checkAndMarkIdempotency(key: string, leadId: string): string | null {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  
  if (processedIdempotencyKeys.size > 2000) {
    for (const [k, v] of processedIdempotencyKeys.entries()) {
      if (now - v.timestamp > windowMs) processedIdempotencyKeys.delete(k);
    }
  }

  const existing = processedIdempotencyKeys.get(key);
  if (existing && now - existing.timestamp < windowMs) {
    return existing.leadId;
  }

  processedIdempotencyKeys.set(key, { leadId, timestamp: now });
  return null;
}

export async function POST(request: Request) {
  try {
    // 🛡️ CAPA 1: Rate Limiting Mil-Spec por IP
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!checkWebhookRate(clientIp)) {
      return NextResponse.json(
        { error: "Demasiadas peticiones. Intente más tarde.", status: 429 },
        { status: 429 }
      );
    }

    // 🛡️ CAPA 2: Autenticación de Firma HMAC-SHA256 (GAP-INFRA-10)
    const rawBodyText = await request.text();
    const signatureHeader =
      request.headers.get("x-signature") ||
      request.headers.get("x-hub-signature-256") ||
      request.headers.get("x-3tree-signature");

    if (!verifyWebhookSignature(rawBodyText, signatureHeader)) {
      return NextResponse.json(
        { error: "Acceso no autorizado: Firma HMAC inválida o ausente.", status: 401 },
        { status: 401 }
      );
    }

    // 🛡️ CAPA 3: Validación de Entrada Polimórfica (Zod v4)
    let rawBody: unknown;
    try {
      rawBody = JSON.parse(rawBodyText);
    } catch {
      return NextResponse.json(
        { error: "Payload no es JSON válido", status: 400 },
        { status: 400 }
      );
    }

    const parseResult = LeadIngestionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Payload inválido", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const payload = parseResult.data;
    const correlationId = payload.correlationId || randomUUID();
    const causationId = payload.causationId;

    // 🛡️ CAPA 3: Control de Idempotencia y Deduplicación
    const leadId = `lead-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const idempotencyKey = computeLeadIdempotencyKey(payload);
    const existingLeadId = checkAndMarkIdempotency(idempotencyKey, leadId);

    if (existingLeadId) {
      const duplicateResponse: LeadIngestionResponse = {
        success: true,
        leadId: existingLeadId,
        status: "DUPLICATE_IGNORED",
        correlationId,
        message: "Solicitud duplicada procesada previamente (Idempotent OK)",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(duplicateResponse);
    }

    const score =
      payload.sentiment === "HIGH_INTENT"
        ? 95
        : payload.sentiment === "TECHNICAL"
        ? 80
        : 60;

    const validEmail = payload.email && payload.email.includes("@") ? payload.email : "lead@3treedigital.com";
    const validName = (payload.name && payload.name.trim().length >= 2) ? payload.name.trim() : "Prospective Client";
    const validOrg = (payload.organization && payload.organization.trim().length >= 2) ? payload.organization.trim() : "Athletic Organization";
    const conversationSummary = payload.message && payload.message.length >= 10 
      ? payload.message 
      : "Inbound prospective lead inquiry from 3Tree web portal";

    // 🚀 CAPA 4: Publicación Canónica en Event Bus (EVT-001)
    const inboundLeadEvent: CanonicalEventEnvelope<LeadQualifiedPayload> = {
      eventId: `evt-001-${randomUUID()}`,
      idempotencyKey,
      eventType: "lead.inbound.qualified",
      version: "1.0.0",
      timestampUtc: new Date().toISOString(),
      issuerAgentId: "AG-031", // Iris (Gateway Perimetral)
      targetAgentId: "AG-025", // Hermes (Director de Ventas)
      priority: payload.sentiment === "HIGH_INTENT" ? "P0_CRITICAL" : "P1_HIGH",
      metadata: {
        correlationId,
        causationId,
        retryCount: 0,
        environment: "production",
      },
      payload: {
        leadId: randomUUID(),
        prospectName: validName,
        contactEmail: validEmail,
        organization: validOrg,
        organizationType: "ACADEMY",
        rosterVolume: 25,
        intentScore: score,
        painPoints: payload.message ? [payload.message.slice(0, 100)] : ["General Inquiry"],
        conversationSummary,
        qualifiedAt: new Date().toISOString(),
      },
    };

    await EventBus.dispatcher.dispatch(inboundLeadEvent);

    // 🚀 CAPA 5: Invocación Delegada en MCP Tool Bridge (Aduana RBAC)
    let mcpToolResult: unknown = null;
    if (payload.email && payload.email.includes("@")) {
      try {
        const leadStatus = score >= 80 ? "VIP" : "pending";
        const result = await MCPBridge.execute({
          invocationId: `inv-${randomUUID()}`,
          idempotencyKey: `mcp-${idempotencyKey}`,
          toolName: "classify_lead",
          callerAgentId: "AG-025", // Hermes (RBAC Authorized)
          targetDepartmentId: "DP-10",
          params: {
            email: payload.email,
            status: leadStatus,
          },
          metadata: {
            correlationId,
            causationId,
            timeoutMs: 5000,
            environment: "production",
          },
        });
        mcpToolResult = result;
      } catch (mcpErr) {
        console.warn("[LEAD INGESTION] MCP classification warning:", mcpErr);
      }
    }

    // 📦 CAPA 6: Respuesta Canónica
    const responsePayload: LeadIngestionResponse = {
      success: true,
      leadId,
      status: score >= 80 ? "PROCESSED_VIP" : "QUEUED_TO_EVENT_BUS",
      correlationId,
      message: "Lead processed and published to Canonical Event Bus successfully.",
      timestamp: new Date().toISOString(),
      details: {
        score,
        source: payload.source,
        mcpStatus: mcpToolResult ? "EXECUTED" : "SKIPPED",
      },
    };

    return NextResponse.json(responsePayload, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("[LEAD INGESTION ERROR] Fallo en pipeline de ingestión:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Fallo al procesar lead",
        status: "RECOVERED_FALLBACK",
      },
      { status: 500 }
    );
  }
}
