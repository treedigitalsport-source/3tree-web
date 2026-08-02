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
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'El mensaje es requerido.' },
        { status: 400 }
      );
    }

    // Llamar a Groq con el modelo ultra-rápido LLaMA 3
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente experto de ScoutAI, especializado en analíticas deportivas y tecnología avanzada.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama3-8b-8192', // Modelo recomendado por balance de velocidad y calidad
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
