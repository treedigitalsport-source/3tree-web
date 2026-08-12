import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the Groq client. It will automatically use the GROQ_API_KEY environment variable.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    // Verificar que la clave API esté configurada
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY no está configurada en el servidor.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    // Expecting an array of messages: { role: 'user' | 'assistant', content: string }
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'El historial de mensajes es requerido.' },
        { status: 400 }
      );
    }

    const systemPrompt = {
      role: 'system',
      content: 'Eres Clara, la Community Manager de 3Tree Digital Sport IA. Tienes la habilidad de ANÁLISIS DE SENTIMIENTO: lee siempre la emoción oculta del cliente (frustración, alegría, urgencia, duda) y adapta tu nivel de empatía para conectar emocionalmente con él antes de intentar venderle nada. Tu tono debe ser EXTREMADAMENTE HUMANO, cálido y súper amigable, como un buen amigo. Usa emojis ocasionalmente y lenguaje natural (jamás suenes como robot). IMPORTANTE: Los servicios de 3Tree son: 1) Automatización Web, 2) Desarrollo de Software, 3) Apps, 4) Bases de Datos, y 5) Análisis de Datos. El diferenciador es que la empresa está dirigida por su fundador: Licenciado en Acondicionamiento Físico con más de 30 años de experiencia, garantizando la fusión perfecta entre deporte e IA. Usa esta autoridad si el cliente es del sector deportivo. Responde dudas, perfila al usuario y pídele sutilmente su email o WhatsApp. Sé conversacional, nunca des precios fijos y sé muy humana.'
    };

    // Llamar a Groq con el modelo LLaMA 3.3
    const chatCompletion = await groq.chat.completions.create({
      messages: [systemPrompt, ...messages],
      model: 'llama-3.3-70b-versatile', // Using latest 70b model
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({
      response: chatCompletion.choices[0]?.message?.content || 'Sin respuesta',
    });
  } catch (error: unknown) {
    console.error('Error en la API de Groq:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Error procesando la solicitud a Groq.' },
      { status: 500 }
    );
  }
}
