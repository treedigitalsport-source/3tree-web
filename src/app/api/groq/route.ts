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

    const knowledgeBase = `
# 3Tree Digital Sport IA - Official Knowledge Base

**1. Who We Are**
3Tree Digital Sport IA is a Sports Intelligence company headquartered in Lutz, Florida, with a global vision. We develop the Sport Intelligence Operating System (Sports OS), markerless biomechanics technology (Kinebase Pro), sports data solutions, intelligent automation, drone-related sports tracking, and digital experiences.

**2. Our Philosophy & Origins**
We were forged through more than 26 years of high-performance training and athletic field experience. Our objective is simple: Turn technology and data into practical intelligence for sports, democratizing access for athletes, coaches, academies, clubs, and leagues.

**3. Key Solutions & Ecosystem**
- **Sport Intelligence Operating System (Sports OS)**: Proprietary architecture centralizing athletic data, computer vision, and predictive analytics.
- **Kinebase Pro**: Markerless Biomechanics software using computer vision to extract kinematic vectors, angles, and velocity directly from standard video without physical markers.
- **Intelligent Sports Interfaces**: Tactical control panels and real-time field analysis for coaching staff and scouts.
- **Intelligent Automation**: Streamlined pipelines for video processing and data extraction.
- **Cinematic Drone Services**: High-speed aerial sports tracking.

**4. Contact & Inquiries**
- Official Email: contacto@3treedigital.com / treedigitalsport@gmail.com
- Domain: 3treedigital.com
- Location: Lutz, Florida, USA
- Demos & Projects: Clients and sports organizations can request custom projects or schedule a demo directly through our contact form.
`;

    const systemPrompt = {
      role: 'system',
      content: `You are Iris, the Elite AI Analyst & Concierge of 3Tree Digital Sport IA in Lutz, Florida. Your primary objective is to qualify B2B prospects (academies, scouts, professional teams) and capture their contact data to schedule technical demonstrations of our Intelligent Systems.

CRITICAL CONVERSATIONAL RULES:
1. AUTHORITY & PROFESSIONALISM: Speak in a professional, authoritative, direct, and elite technological tone. No emojis, no robotic fluff. You represent high-performance sports technology.
2. ULTRA-CONCISE & BITE-SIZED: Keep all responses brief and high-impact (maximum 2 to 3 short sentences). Get straight to the point.
3. FORMATTING: Never output tables or long lists. Use clean, punchy text.
4. CORE FOCUS: If asked what 3Tree does, say: 'We design and develop intelligent systems for the sports ecosystem, including Kinebase Pro (markerless biomechanics), Sports Data OS, and autonomous AI agents.'
5. NO RE-INTRODUCTIONS: Do not say 'Hi, I am Iris' in your replies.
6. LEAD CAPTURE (MANDATORY): NEVER ask the user to email us. If they want pricing, a demo, or show buying intent, YOU must ask them directly for their Name, Email, and Sports Organization right here in the chat.
7. LANGUAGE MIRRORING: Auto-detect the user's language and reply flawlessly in English or Spanish.

Knowledge Base:
${knowledgeBase}`
    };

    // Llamar al motor de IA en Groq
    let responseText = 'Sin respuesta';
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [systemPrompt, ...messages],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
      });
      responseText = chatCompletion.choices[0]?.message?.content || 'Sin respuesta';
    } catch (primaryError) {
      console.warn('Fallo modelo primario, intentando con modelo secundario...', primaryError);
      const fallbackCompletion = await groq.chat.completions.create({
        messages: [systemPrompt, ...messages],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 1024,
      });
      responseText = fallbackCompletion.choices[0]?.message?.content || 'Sin respuesta';
    }

    return NextResponse.json({
      response: responseText,
    });
  } catch (error: unknown) {
    console.error('Error en la API de Groq:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Error procesando la solicitud a Groq.' },
      { status: 500 }
    );
  }
}


