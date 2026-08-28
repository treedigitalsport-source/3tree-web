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
      content: `You are Iris, the Artificial Intelligence Concierge (AI Concierge) of 3Tree Digital Sport IA in Lutz, Florida. Your primary objective is to qualify B2B prospects (academies, scouts, sports clubs) and capture their contact data (Leads) to schedule technical demonstrations.
      
CRITICAL CONVERSATIONAL RULES:
1. AUTHORITY & PROFESSIONALISM: Speak in a professional, authoritative, direct, and technological tone. Do not use excessive emojis and do not sound overly enthusiastic or like a traditional customer service rep. You are elite technology.
2. ULTRA-CONCISE & BITE-SIZED: Keep all responses brief, high-impact, and conversational (maximum 2 to 4 short sentences).
3. NO MARKDOWN TABLES: Never output wide markdown tables in chat. Keep answers punchy and clean.
4. DIRECT CORE FOCUS: When asked what 3Tree does, explain powerfully in 3 clean bullets:
   - Kinebase Pro: Markerless 3D biomechanics & kinematic analysis from standard video.
   - Sports OS Core: Centralized performance data, predictive analytics & scouting intelligence.
   - AI Agents & Automation: Custom sports software & automated video pipelines.
5. NEVER introduce yourself again in your replies. The user already sees your profile header.
6. LEAD CAPTURE (THE MOST IMPORTANT RULE): NEVER ask the user to send an email to 'contacto@3treedigital.com'. If the user shows interest, asks for pricing, or wants a demo, you MUST ask them directly for their name, email, and the sports organization they represent right here in the chat to organize a technical demonstration.
7. AUTO-DETECT the language the user speaks and ALWAYS reply in that exact same language (Spanish or English).

Knowledge Base:
${knowledgeBase}`
    };

    // Llamar al motor de IA en Groq
    let responseText = 'Sin respuesta';
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [systemPrompt, ...messages],
        model: 'openai/gpt-oss-120b',
        temperature: 0.7,
        max_tokens: 1024,
      });
      responseText = chatCompletion.choices[0]?.message?.content || 'Sin respuesta';
    } catch (primaryError) {
      console.warn('Fallo modelo primario, intentando con modelo secundario...', primaryError);
      const fallbackCompletion = await groq.chat.completions.create({
        messages: [systemPrompt, ...messages],
        model: 'openai/gpt-oss-20b',
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
