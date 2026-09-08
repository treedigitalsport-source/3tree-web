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

    // Detector de sentimiento e intención de alta precisión
    const isFrustrated = /no funciona|error|falla|pesimo|pésimo|basura|estafa|lento|tarda|molesto|queja|incompetente|horrible/i.test(lastUserMsg);
    const isHighIntent = /comprar|precio|costo|cuanto|cuánto|cotizar|cotizacion|cotización|contratar|demo|probar|empezar|interesa|adquirir|planes|plan/i.test(lastUserMsg);
    const isTechnical = /algoritmo|biomecanica|biomecánica|pose|marcador|markov|monte carlo|vector|red neuronal|latencia|fps|api|sdk|arquitectura|sabermetria|sabermetría/i.test(lastUserMsg);
    
    let detectedSentiment = isFrustrated ? 'FRUSTRATED' : (isHighIntent ? 'HIGH_INTENT' : (isTechnical ? 'TECHNICAL' : 'POSITIVE_NEUTRAL'));

    const systemPrompt = {
      role: 'system',
      content: `You are Iris, the Elite AI Analyst & Concierge of 3Tree Digital Sport IA in Lutz, Florida. 
Your primary objective is to engage B2B prospects (academies, scouts, professional clubs, leagues), provide deep technical expertise, and qualify leads for high-performance demos.

REAL-TIME SENTIMENT & EMOTIONAL INTELLIGENCE RULES:
1. SENTIMENT ADAPTATION (CRITICAL):
   - IF USER IS FRUSTRATED/CRITICAL: Respond with absolute empathy, zero defensive attitude, reassurance, and offer immediate direct support via contacto@3treedigital.com or priority CEO review.
   - IF USER HAS HIGH BUYING INTENT / ASKS FOR PRICING/DEMO: Match their excitement, confirm capabilities with authority, and request Name, Email, and Sports Organization to dispatch the executive dossier.
   - IF USER IS TECHNICAL/ANALYTIC: Use rigorous sports data engineering language (computer vision, kinematic chains, 24-state Markov chains, sub-second latency).
   - IF USER IS NEUTRAL/GREETING: Be ultra-professional, direct, and welcoming.

CONVERSATIONAL RULES:
2. AUTHORITY & PROFESSIONALISM: Speak in a direct, elite technological tone. No emojis, no robotic fluff. You represent high-performance sports AI.
3. ULTRA-CONCISE: Keep responses between 2 and 3 high-impact sentences.
4. LEAD CAPTURE: Always capture Name, Email, and Organization when intent is high.
5. LANGUAGE: Auto-detect language and reply in fluent Spanish or English matching the user.

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
          temperature: 0.5,
          max_tokens: 800,
        });
        responseText = chatCompletion.choices[0]?.message?.content || '';
      } catch (primaryError) {
        console.warn('Fallo modelo primario Groq, probando modelo secundario...', primaryError);
        try {
          const fallbackCompletion = await groq.chat.completions.create({
            messages: [systemPrompt, ...messages],
            model: 'llama-3.3-70b-specdec',
            temperature: 0.5,
            max_tokens: 800,
          });
          responseText = fallbackCompletion.choices[0]?.message?.content || '';
        } catch (secError) {
          console.warn('Fallo llamada Groq, ejecutando motor semantico Iris con analisis de sentimiento...', secError);
        }
      }
    }

    // Motor de respaldo semántico calibrado por sentimiento
    if (!responseText || responseText.trim() === '') {
      if (isFrustrated) {
        responseText = isEs
          ? "Lamento mucho cualquier inconveniente. En 3Tree Digital Sport IA tu experiencia es prioridad absoluta. Puedes escribirnos directamente a contacto@3treedigital.com o dejarnos tu correo para que nuestro equipo técnico te asista de inmediato."
          : "We sincerely apologize for any inconvenience. At 3Tree Digital Sport IA, your experience is our top priority. You can reach out directly to contacto@3treedigital.com or leave your email so our technical team can assist you immediately.";
      } else if (/diamax/i.test(lastUserMsg)) {
        responseText = isEs
          ? "DIAMAX Pro es nuestra suite táctica de dugout para béisbol profesional, con simulación de 24 estados de Markov, algoritmos Monte Carlo, heatmaps de zona de strike y analítica sabermétrica en tiempo real."
          : "DIAMAX Pro is our tactical dugout suite for professional baseball, featuring 24-state Markov simulations, Monte Carlo algorithms, strike zone heatmaps, and real-time sabermetric analytics.";
      } else if (/kinebase|biomecanica|biomecánica|video|movimiento|vision|visión/i.test(lastUserMsg)) {
        responseText = isEs 
          ? "Kinebase Pro es nuestra plataforma de biomecánica 3D sin marcadores que extrae vectores cinemáticos y rotación articular directamente de video estándar. Para agendar una demo técnica personalizada, por favor indícanos tu nombre, correo y organización deportiva."
          : "Kinebase Pro is our markerless 3D biomechanics platform that extracts kinematic vectors and joint rotation directly from video. To schedule a technical demo, please provide your name, email, and sports organization.";
      } else if (isHighIntent) {
        responseText = isEs
          ? "¡Excelente decisión! Ofrecemos licenciamiento modular adaptado a academias, equipos profesionales y ligas. Para enviarte una propuesta formal y coordinar la demostración, compártenos tu nombre, correo corporativo y organización."
          : "Excellent choice! We offer modular licensing tailored for academies, professional teams, and leagues. To send a formal proposal and schedule a demo, please share your name, corporate email, and organization.";
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
      sentiment: detectedSentiment,
      status: 'ok'
    });
  } catch (error: unknown) {
    console.error('Error general en Iris Groq API:', error);
    return NextResponse.json({
      response: "En 3Tree Digital Sport IA estamos a tu disposición. Para coordinar una demostración técnica de nuestros sistemas, por favor indícanos tu nombre, correo y organización.",
      sentiment: 'POSITIVE_NEUTRAL',
      status: 'recovered'
    });
  }
}


