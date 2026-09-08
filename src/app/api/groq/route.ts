import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'El historial de mensajes es requerido.' },
        { status: 400 }
      );
    }

    const lastUserMsg = messages[messages.length - 1]?.content || '';
    const isEs = /[áéíóúñ¿¡]/i.test(lastUserMsg) || !/[a-z]/i.test(lastUserMsg) || /hola|buenas|precio|demo|servicios|que hacen|quienes son|beisbol/i.test(lastUserMsg);

    const apiKey = process.env.GROQ_API_KEY || '';

    const knowledgeBase = `
# 3Tree Digital Sport IA - Official Knowledge Base
**Location:** Lutz, Florida, USA
**Leadership:** High performance athletic & AI sports technology.
**Products:**
- Kinebase Pro: Markerless 3D Biomechanics & Computer Vision for pitching and hitting kinematics.
- Sport Intelligence Operating System (Sports OS): Centralized data, scouting, and real-time game analytics.
- DIAMAX Pro: Dugout tactical in-game decision engine, official scorekeeping, and 24-state Markov Monte Carlo simulation.
- Contact: contacto@3treedigital.com / treedigitalsport@gmail.com
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
6. LEAD CAPTURE (MANDATORY): If they want pricing, a demo, or show buying intent, ask them directly for their Name, Email, and Sports Organization.
7. LANGUAGE: Auto-detect language and reply in fluent Spanish or English matching the user.

Knowledge Base:
${knowledgeBase}`
    };

    let responseText = '';
    if (apiKey) {
      const groq = new Groq({ apiKey });
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [systemPrompt, ...messages],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.6,
          max_tokens: 800,
        });
        responseText = chatCompletion.choices[0]?.message?.content || '';
      } catch (primaryError) {
        console.warn('Fallo modelo primario Groq, probando modelo secundario...', primaryError);
        try {
          const fallbackCompletion = await groq.chat.completions.create({
            messages: [systemPrompt, ...messages],
            model: 'llama-3.3-70b-specdec',
            temperature: 0.6,
            max_tokens: 800,
          });
          responseText = fallbackCompletion.choices[0]?.message?.content || '';
        } catch (secError) {
          console.warn('Fallo llamada Groq, ejecutando motor semantico Iris...', secError);
        }
      }
    }

    // Si Groq no devolvió texto o falló la clave/modelo, usar motor de respuesta semántica de Iris
    if (!responseText || responseText.trim() === '') {
      if (/diamax/i.test(lastUserMsg)) {
        responseText = isEs
          ? "DIAMAX Pro es nuestra suite táctica de dugout para béisbol profesional, con simulación de 24 estados de Markov, algoritmos Monte Carlo, heatmaps de zona de strike y analítica sabermétrica en tiempo real."
          : "DIAMAX Pro is our tactical dugout suite for professional baseball, featuring 24-state Markov simulations, Monte Carlo algorithms, strike zone heatmaps, and real-time sabermetric analytics.";
      } else if (/kinebase|biomecanica|biomecánica|video|movimiento|vision|visión/i.test(lastUserMsg)) {
        responseText = isEs 
          ? "Kinebase Pro es nuestra plataforma de biomecánica 3D sin marcadores que extrae vectores cinemáticos y rotación articular directamente de video estándar. Para agendar una demo técnica personalizada, por favor indícanos tu nombre, correo y organización deportiva."
          : "Kinebase Pro is our markerless 3D biomechanics platform that extracts kinematic vectors and joint rotation directly from video. To schedule a technical demo, please provide your name, email, and sports organization.";
      } else if (/precio|costo|cuanto|cuánto|cotizacion|cotización|tarifa|comprar|plan|planes/i.test(lastUserMsg)) {
        responseText = isEs
          ? "Ofrecemos licenciamiento modular adaptado a academias, equipos profesionales y ligas. Para enviarte una propuesta formal, por favor compártenos tu nombre, correo corporativo y club u organización."
          : "We provide modular licensing tailored for academies, professional teams, and leagues. To receive a formal proposal, please share your name, corporate email, and organization.";
      } else if (/contacto|email|correo|telefono|teléfono|ubicacion|ubicación|sede|donde|dónde/i.test(lastUserMsg)) {
        responseText = isEs
          ? "Nuestra sede oficial está ubicada en 5709 Kingfish Drive, Lutz, Florida, USA. Puedes dejarnos tus datos aquí o escribirnos a contacto@3treedigital.com."
          : "Our headquarters are located at 5709 Kingfish Drive, Lutz, Florida, USA. You can leave your contact details here or write to contacto@3treedigital.com.";
      } else {
        responseText = isEs
          ? "En 3Tree Digital Sport IA desarrollamos tecnología y modelos de inteligencia artificial de alto rendimiento para el deporte profesional. ¿Te interesa Kinebase Pro (biomecánica), DIAMAX Pro (táctica y béisbol) o nuestros sistemas de Sports OS?"
          : "At 3Tree Digital Sport IA, we engineer elite sports technology and AI systems for professional athletics. Are you interested in Kinebase Pro (biomechanics), DIAMAX Pro (tactical baseball), or our Sports OS platforms?";
      }
    }

    return NextResponse.json({
      response: responseText,
      status: 'ok'
    });
  } catch (error: unknown) {
    console.error('Error general en Iris Groq API:', error);
    return NextResponse.json({
      response: "En 3Tree Digital Sport IA estamos a tu disposición. Para coordinar una demostración técnica de nuestros sistemas, por favor indícanos tu nombre, correo y organización.",
      status: 'recovered'
    });
  }
}


