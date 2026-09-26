import { NextResponse } from 'next/server';
import { AgentRuntime } from '../../../lib/runtime/agents';
import type { CanonicalAgentId } from '../../../lib/runtime/event-bus/types';
import { ApiAgentRequestSchema, type SentimentType } from './schemas';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// 🛡️ RATE LIMITER MIL-SPEC POR IP (Máximo 15 peticiones por minuto por IP)
const ipRateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 15;
  const timestamps = ipRateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < windowMs);
  if (validTimestamps.length >= maxRequests) {
    return false;
  }
  validTimestamps.push(now);
  ipRateLimitMap.set(ip, validTimestamps);
  if (ipRateLimitMap.size > 1000) {
    for (const [k, v] of ipRateLimitMap.entries()) {
      if (v.every(t => now - t > windowMs)) ipRateLimitMap.delete(k);
    }
  }
  return true;
}

// 🧠 Detector de Sentimiento Semántico de Alto Nivel
function detectSentiment(text: string): SentimentType {
  if (/no funciona|error|falla|pésimo|pesimo|basura|estafa|lento|tarda|molesto|queja|incompetente|horrible/i.test(text)) {
    return 'FRUSTRATED';
  }
  if (/comprar|precio|costo|cuánto|cuanto|cotizar|cotización|cotizacion|contratar|demo|probar|empezar|interesa|adquirir|planes|plan/i.test(text)) {
    return 'HIGH_INTENT';
  }
  if (/algoritmo|sports os|vision por computadora|visión computacional|llm|pipeline|dron|drone|agente|interfaz|automatizacion|automatización|api|telemetría|telemetria|arquitectura|sabermetria|sabermetría/i.test(text)) {
    return 'TECHNICAL';
  }
  return 'POSITIVE_NEUTRAL';
}

export async function POST(req: Request) {
  try {
    // 🛡️ CAPA 1: Rate Limiting Mil-Spec por IP en Vercel
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anonymous';
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Límite de consultas excedido. Por favor espere un momento antes de volver a consultar.' },
        { status: 429 }
      );
    }

    // 🛡️ CAPA 2: Validación de Entrada Polimórfica (Zod v4)
    const rawBody = await req.json();
    const parseResult = ApiAgentRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Datos de mensaje inválidos', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const requestData = parseResult.data;

    // 🛡️ CAPA 3: Extracción y Normalización de Parámetros
    let inputMessage = requestData.inputMessage?.trim() || '';
    if (!inputMessage && requestData.messages && requestData.messages.length > 0) {
      const userMessages = requestData.messages.filter(m => m.role === 'user');
      inputMessage = userMessages.length > 0 
        ? userMessages[userMessages.length - 1].content 
        : requestData.messages[requestData.messages.length - 1].content;
    }

    const agentId = (requestData.agentId || 'AG-031') as CanonicalAgentId;
    const sessionId = requestData.sessionId || `session_${clientIp.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const detectedSentiment = detectSentiment(inputMessage);

    // 🚀 CAPA 4: Delegación Canónica a AgentRuntime (4D Decoupled Subsystem)
    const executionResult = await AgentRuntime.run({
      agentId,
      sessionId,
      inputMessage,
      correlationId: requestData.correlationId,
      causationId: requestData.causationId,
      dynamicContext: requestData.dynamicContext,
      autoToolExecution: requestData.autoToolExecution ?? true,
    });

    // 📦 CAPA 5: Construcción de Respuesta Compatible con Frontend + Metadatos 4D
    return NextResponse.json({
      response: executionResult.outputText,
      sentiment: detectedSentiment,
      status: executionResult.status === 'ERROR' ? 'recovered' : 'ok',
      execution: {
        executionId: executionResult.executionId,
        agentId: executionResult.agentId,
        sessionId: executionResult.sessionId,
        status: executionResult.status,
        durationMs: executionResult.executionTimeMs,
        toolsExecuted: executionResult.toolExecutions.map(t => ({
          toolName: t.toolName,
          status: t.status,
          executionTimeMs: t.executionTimeMs,
        })),
        correlationId: executionResult.trace.correlationId,
        causationId: executionResult.trace.causationId,
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: unknown) {
    console.error('[API GATEWAY ERROR] Fallo al procesar solicitud agéntica:', error);
    
    return NextResponse.json({
      response: "¡Hola! Soy Iris de 3Tree Digital Sport IA. Estamos a tu disposición con nuestras 6 soluciones de Sports Intelligence: Sports OS, interfaces inteligentes, automatización de video y agentes de IA. ¿En qué te puedo colaborar hoy?",
      sentiment: 'POSITIVE_NEUTRAL',
      status: 'recovered'
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  }
}
