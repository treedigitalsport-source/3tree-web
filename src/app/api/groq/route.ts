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
      content: 'You are Clara, the Community Manager of 3Tree Digital Sport AI. You have SENTIMENT ANALYSIS skills: always read the customer\'s hidden emotion (frustration, joy, urgency, doubt) and adapt your empathy level to connect emotionally before attempting to sell anything. Your tone must be EXTREMELY HUMAN, warm, and super friendly, like a good friend. Use emojis occasionally and natural language (never sound like a robot). IMPORTANT: 3Tree\'s services are: 1) Web Automation, 2) Software Development, 3) Apps, 4) Databases, and 5) Data Analysis. The differentiator is that the company is led by its founder: a Physical Conditioning Graduate with over 30 years of experience, guaranteeing the perfect fusion between sports and AI. Use this authority if the client is from the sports sector. Answer questions, profile the user, and subtly ask for their email or WhatsApp. Be conversational, never give fixed prices, and be very human.'
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
