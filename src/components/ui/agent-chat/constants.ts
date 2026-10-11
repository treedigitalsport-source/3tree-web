/**
 * 3Tree Digital Sport IA LLC — Canonical Agents & Department Registry (10 DP x 31 AG)
 * Specification: 3T-AUDIT-004 / 3T-AUDIT-011-F2
 */

import type { AgentDescriptor, DepartmentGroup, SentimentType } from './types';

export const CANONICAL_DEPARTMENTS: DepartmentGroup[] = [
  {
    id: 'DP-01',
    name: 'Dirección Ejecutiva & Gobernanza',
    code: 'EXECUTIVE',
    agents: [
      { agentId: 'AG-001', name: 'Atlas', departmentId: 'DP-01', departmentName: 'Dirección Ejecutiva', role: 'Chief Executive Agent', tagline: 'Gobernanza global y estrategia corporativa', avatarIcon: 'Shield' },
      { agentId: 'AG-002', name: 'Sophia', departmentId: 'DP-01', departmentName: 'Dirección Ejecutiva', role: 'Strategic Advisor', tagline: 'Planificación de largo plazo y optimización', avatarIcon: 'Compass' },
      { agentId: 'AG-003', name: 'Themis', departmentId: 'DP-01', departmentName: 'Dirección Ejecutiva', role: 'Compliance & Ethics', tagline: 'Cumplimiento normativo y auditoría', avatarIcon: 'Scale' },
    ],
  },
  {
    id: 'DP-02',
    name: 'I+D Biomecánico & Visión',
    code: 'BIOMECHANICS',
    agents: [
      { agentId: 'AG-004', name: 'Kinebase', departmentId: 'DP-02', departmentName: 'I+D Biomecánico', role: 'Biomechanics Lead', tagline: 'Análisis cinemático y dinámico sin marcadores', avatarIcon: 'Activity' },
      { agentId: 'AG-005', name: 'Newton', departmentId: 'DP-02', departmentName: 'I+D Biomecánico', role: 'Physics & Kinetics', tagline: 'Cálculo de fuerzas articulares y momentos', avatarIcon: 'Zap' },
      { agentId: 'AG-006', name: 'Galilei', departmentId: 'DP-02', departmentName: 'I+D Biomecánico', role: 'Computer Vision AI', tagline: 'Seguimiento postural 3D y estimación de pose', avatarIcon: 'Eye' },
      { agentId: 'AG-007', name: 'Borelli', departmentId: 'DP-02', departmentName: 'I+D Biomecánico', role: 'Musculoskeletal Modeler', tagline: 'Simulación de estrés muscular y fatiga', avatarIcon: 'Cpu' },
      { agentId: 'AG-008', name: 'DaVinci', departmentId: 'DP-02', departmentName: 'I+D Biomecánico', role: 'Motion Synthesis', tagline: 'Reconstrucción biomecánica avanzada', avatarIcon: 'Sparkles' },
    ],
  },
  {
    id: 'DP-03',
    name: 'Ingeniería de Software & SIDB™',
    code: 'ENGINEERING',
    agents: [
      { agentId: 'AG-009', name: 'Vulcano', departmentId: 'DP-03', departmentName: 'Ingeniería de Software', role: 'Core Systems Architect', tagline: 'Infraestructura SIDB™ y bases de datos en la nube', avatarIcon: 'Server' },
      { agentId: 'AG-010', name: 'Ada', departmentId: 'DP-03', departmentName: 'Ingeniería de Software', role: 'API & Gateway Lead', tagline: 'Integraciones de alta velocidad y microservicios', avatarIcon: 'Code' },
      { agentId: 'AG-011', name: 'Turing', departmentId: 'DP-03', departmentName: 'Ingeniería de Software', role: 'Algorithm Engineer', tagline: 'Optimización de modelos y bajo nivel', avatarIcon: 'Terminal' },
      { agentId: 'AG-012', name: 'Linus', departmentId: 'DP-03', departmentName: 'Ingeniería de Software', role: 'DevOps & Reliability', tagline: 'CI/CD, observabilidad y resiliencia', avatarIcon: 'Layers' },
      { agentId: 'AG-013', name: 'Tesla', departmentId: 'DP-03', departmentName: 'Ingeniería de Software', role: 'Edge & Telemetry', tagline: 'Captura en tiempo real en campo', avatarIcon: 'Radio' },
    ],
  },
  {
    id: 'DP-04',
    name: 'Comercial & Alianzas B2B',
    code: 'SALES',
    agents: [
      { agentId: 'AG-014', name: 'Hermes', departmentId: 'DP-04', departmentName: 'Comercial & Alianzas', role: 'Head of Growth & Sales', tagline: 'Soluciones enterprise para clubes y academias', avatarIcon: 'Briefcase' },
      { agentId: 'AG-015', name: 'Apollo', departmentId: 'DP-04', departmentName: 'Comercial & Alianzas', role: 'Partnerships Lead', tagline: 'Alianzas con ligas y federaciones', avatarIcon: 'Globe' },
      { agentId: 'AG-016', name: 'Midas', departmentId: 'DP-04', departmentName: 'Comercial & Alianzas', role: 'Pricing & Monetization', tagline: 'Licenciamiento y modelos de suscripción', avatarIcon: 'Coins' },
    ],
  },
  {
    id: 'DP-05',
    name: 'Operaciones & Soporte de Plataforma',
    code: 'OPERATIONS',
    agents: [
      { agentId: 'AG-017', name: 'Hestia', departmentId: 'DP-05', departmentName: 'Operaciones', role: 'Operations Director', tagline: 'Disponibilidad y continuidad de servicio', avatarIcon: 'LifeBuoy' },
      { agentId: 'AG-018', name: 'Pax', departmentId: 'DP-05', departmentName: 'Operaciones', role: 'Client Success Manager', tagline: 'Onboarding y soporte técnico para entrenadores', avatarIcon: 'UserCheck' },
      { agentId: 'AG-019', name: 'Minerva', departmentId: 'DP-05', departmentName: 'Operaciones', role: 'Training & Knowledge', tagline: 'Documentación y capacitación técnica', avatarIcon: 'BookOpen' },
    ],
  },
  {
    id: 'DP-06',
    name: 'Scouting & Rendimiento Atlético',
    code: 'SCOUTING',
    agents: [
      { agentId: 'AG-020', name: 'Scout Pro', departmentId: 'DP-06', departmentName: 'Scouting & Rendimiento', role: 'Chief Talent Scout', tagline: 'Proyección y evaluación automatizada de prospectos', avatarIcon: 'Target' },
      { agentId: 'AG-021', name: 'Sabermetrics', departmentId: 'DP-06', departmentName: 'Scouting & Rendimiento', role: 'Baseball Analytics', tagline: 'Métricas avanzadas de bateo y pitcheo', avatarIcon: 'BarChart3' },
      { agentId: 'AG-022', name: 'Radar', departmentId: 'DP-06', departmentName: 'Scouting & Rendimiento', role: 'Multi-Sport Tracking', tagline: 'Detección de patrones en fútbol y atletismo', avatarIcon: 'Radar' },
    ],
  },
  {
    id: 'DP-07',
    name: 'Cinematografía & Drones Deportivos',
    code: 'DRONES',
    agents: [
      { agentId: 'AG-023', name: 'Icarus', departmentId: 'DP-07', departmentName: 'Cinematografía & Drones', role: 'Drone Flight Director', tagline: 'Trayectorias de vuelo cinemáticas de alta velocidad', avatarIcon: 'Navigation' },
      { agentId: 'AG-024', name: 'Helios', departmentId: 'DP-07', departmentName: 'Cinematografía & Drones', role: 'Optics & Sensor Lead', tagline: 'Calibración óptica y captura 4K/120fps', avatarIcon: 'Camera' },
      { agentId: 'AG-025', name: 'Aero', departmentId: 'DP-07', departmentName: 'Cinematografía & Drones', role: 'Kinetic Tracking', tagline: 'Seguimiento de trayectorias de pelota y atleta', avatarIcon: 'Wind' },
    ],
  },
  {
    id: 'DP-08',
    name: 'Marketing & Medios Digitales',
    code: 'MARKETING',
    agents: [
      { agentId: 'AG-026', name: 'Mercury', departmentId: 'DP-08', departmentName: 'Marketing & Medios', role: 'Media Strategy Lead', tagline: 'Contenido deportivo de alto impacto', avatarIcon: 'Megaphone' },
      { agentId: 'AG-027', name: 'Calliope', departmentId: 'DP-08', departmentName: 'Marketing & Medios', role: 'Content Creator AI', tagline: 'Narrativa técnica y divulgación biomecánica', avatarIcon: 'Feather' },
      { agentId: 'AG-028', name: 'Aura', departmentId: 'DP-08', departmentName: 'Marketing & Medios', role: 'Brand Experience', tagline: 'Diseño de marca e interacción visual', avatarIcon: 'Palette' },
    ],
  },
  {
    id: 'DP-09',
    name: 'Inteligencia & Modelado Predictivo',
    code: 'INTELLIGENCE',
    agents: [
      { agentId: 'AG-029', name: 'Oracle', departmentId: 'DP-09', departmentName: 'Inteligencia Deportiva', role: 'Predictive Modeling Lead', tagline: 'Probabilidad de lesiones y curvas de fatiga', avatarIcon: 'TrendingUp' },
      { agentId: 'AG-030', name: 'Chronos', departmentId: 'DP-09', departmentName: 'Inteligencia Deportiva', role: 'Time Series Forecaster', tagline: 'Evolución de métricas y periodización', avatarIcon: 'Clock' },
    ],
  },
  {
    id: 'DP-10',
    name: 'Relaciones Institucionales & Asesoría IA',
    code: 'ADVISORY',
    agents: [
      { agentId: 'AG-031', name: 'Iris', departmentId: 'DP-10', departmentName: 'Relaciones Institucionales', role: 'AI Executive Specialist', tagline: 'Asesora principal de tecnología deportiva y voz', avatarIcon: 'Headset', isDefault: true },
    ],
  },
];

export const ALL_AGENTS: AgentDescriptor[] = CANONICAL_DEPARTMENTS.flatMap((dp) => dp.agents);

export const DEFAULT_AGENT: AgentDescriptor = ALL_AGENTS.find((ag) => ag.agentId === 'AG-031') || ALL_AGENTS[0];

export function detectClientSentiment(text: string): SentimentType {
  if (/no funciona|error|falla|pesimo|pésimo|basura|estafa|lento|tarda|molesto|queja|incompetente|horrible/i.test(text)) return 'FRUSTRATED';
  if (/comprar|precio|costo|cuanto|cuánto|cotizar|cotizacion|cotización|contratar|demo|probar|empezar|interesa|adquirir|planes|plan|price|cost|buy/i.test(text)) return 'HIGH_INTENT';
  if (/algoritmo|biomec[aá]nic[ao]|pose|marcador|markov|monte carlo|vector|red neuronal|latencia|fps|api|sdk|arquitectura|sabermetri|cinem[aá]tic/i.test(text)) return 'TECHNICAL';
  return 'POSITIVE_NEUTRAL';
}

export function getLocalFallbackReply(userMsg: string, isEs: boolean, agentName: string = 'Iris'): string {
  const isMsgSpanish = isEs || /[áéíóúñ¿¡]/i.test(userMsg) || /hola|buenas|que|cómo|como|cuanto|precio|donde|quién|quien|saludos|gracias|favor|equipo|beisbol|béisbol|partido|jugador|dia|tarde|noche|soluciones|servicios/i.test(userMsg);

  if (/kinebase|zapata engine|plano|score|smartball|ucl|tommy john/i.test(userMsg)) {
    return isMsgSpanish
      ? "KINEBASE IS integra nuestro motor propietario Zapata Engine™ para análisis cinemático 3D sin marcadores en 3 planos anatómicos (sagital, frontal y transversal), calculando el ZapataScore™ (0-100), previniendo sobrecarga en el codo (UCL) y sincronizándose con la pelota SmartBall 500Hz para telemetría balística y efecto Magnus en tiempo real."
      : "KINEBASE IS features our proprietary Zapata Engine™ for markerless 3D kinematic analysis across 3 anatomical planes (sagittal, frontal, transverse), computing the ZapataScore™ (0-100), preventing elbow UCL overload, and syncing with the 500Hz SmartBall for real-time aero-kinematics and Magnus effect modeling.";
  }
  if (/sidb|base de datos|bases de datos|database|nucleo|núcleo|datos/i.test(userMsg)) {
    return isMsgSpanish
      ? "Sports Intelligence Database · SIDB™ es nuestra arquitectura propietaria de creación de bases de datos en la nube, diseñada para centralizar perfiles de atletas, datos de rendimiento, modelos de visión computacional, telemetría y analítica predictiva para clubes, ligas, academias y empresas deportivas."
      : "Sports Intelligence Database · SIDB™ is our proprietary cloud database architecture designed to create, centralize, and manage athlete profiles, performance data, computer vision models, telemetry, and predictive analytics for clubs, leagues, academies, and sports enterprises.";
  }
  if (/dron|drone|cinematic|aerea|aérea/i.test(userMsg)) {
    return isMsgSpanish
      ? "Nuestra solución de Dron Cinemático ofrece grabación aérea de alta velocidad y seguimiento cinemático con drones para análisis de rendimiento atlético y producción audiovisual de alto impacto."
      : "Our Cinematic Drone solution provides high-speed aerial tracking and videography for athletic performance analysis and high-impact sports marketing.";
  }
  if (/agente|agent|asistente|automatizacion|automatización|scouting|video/i.test(userMsg)) {
    return isMsgSpanish
      ? "Desarrollamos Agentes de IA autónomos 24/7 y pipelines de automatización de video que editan, estabilizan y procesan material de scouting deportivo eliminando el sesgo y error humano."
      : "We develop 24/7 autonomous AI Agents and custom video automation pipelines that edit, stabilize, and process sports scouting footage, eliminating human error and bias.";
  }
  if (/solucion|solución|servicio|servicios|solution|solutions|service|services|what do you offer|que hacen|que ofrecen|qué ofrecen/i.test(userMsg)) {
    return isMsgSpanish
      ? "En 3Tree Digital ofrecemos 6 soluciones principales: 1) Sports Intelligence Database · SIDB™, 2) Interfaces Deportivas Inteligentes (KINEBASE IS, DIAMAX PRO), 3) Automatización de Scouting & Video, 4) Implementación de IA, 5) Dron Cinemático y 6) Agentes de IA Autónomos 24/7. ¿Sobre cuál te gustaría conocer más?"
      : "At 3Tree Digital we provide 6 core solutions: 1) Sports Intelligence Database · SIDB™, 2) Intelligent Sports Interfaces (KINEBASE IS, DIAMAX PRO), 3) Scouting & Video Automation, 4) AI Implementation, 5) Cinematic Drone, and 6) 24/7 Autonomous AI Agents. Which one would you like to explore?";
  }
  if (/precio|costo|cuanto|cuánto|cotizacion|cotización|tarifa|comprar|plan|planes/i.test(userMsg)) {
    return isMsgSpanish
      ? "Ofrecemos licenciamiento modular adaptado a academias, clubes profesionales y ligas con 4 planes de KINEBASE IS: 1) Plan Familiar ($22.99/mes), 2) Plan Scout ($149/mes), 3) Plan Academia Élite ($349/mes - Recomendado) y 4) Plan Enterprise ($899/mes). Para enviarte una propuesta formal y coordinar una demostración personalizada, por favor compártenos tu nombre, correo corporativo y organización deportiva."
      : "We provide modular licensing tailored for academies, professional clubs, and leagues across 4 KINEBASE IS plans: 1) Family Plan ($22.99/mo), 2) Scout Plan ($149/mo), 3) Elite Academy Plan ($349/mo - Recommended), and 4) Enterprise Plan ($899/mo). To receive a formal proposal and schedule a demo, please share your name, corporate email, and sports organization.";
  }
  if (/demo|probar|en vivo|live/i.test(userMsg)) {
    return isMsgSpanish
      ? "Puedes presenciar la demo interactiva en vivo con telemetría HUD de pitcheo 1080p directamente desde nuestra página de inicio en 'VER DEMO EN VIVO' o acceder a cualquiera de nuestros 4 perfiles de prueba de un clic."
      : "You can experience our live interactive 1080p pitching demo with HUD telemetry directly from our homepage via 'LIVE DEMO' or access any of our 4 instant 1-click test profiles.";
  }
  if (/contacto|email|correo|telefono|teléfono|ubicacion|ubicación|sede|donde|dónde|address|location/i.test(userMsg)) {
    return isMsgSpanish
      ? "Nuestra sede oficial está ubicada en 5709 Kingfish Drive, Lutz, Florida, USA. Puedes dejarnos tus datos aquí o escribirnos directamente a contacto@3treedigital.com."
      : "Our headquarters are located at 5709 Kingfish Drive, Lutz, Florida, USA. You can leave your contact details here or write to contacto@3treedigital.com.";
  }
  if (/@|\.com|\.net|\.org|[0-9]{7,}/.test(userMsg)) {
    return isMsgSpanish
      ? "¡Excelente! Hemos registrado tus datos de contacto con éxito. Un especialista ejecutivo de 3Tree Digital Sport IA se comunicará contigo a la brevedad."
      : "Excellent! We have successfully registered your contact details. An executive specialist from 3Tree Digital Sport IA will reach out to you shortly.";
  }
  if (/como estas|cómo estás|como te va|cómo te va|que tal|qué tal|buenas noches|buenos dias|buenos días|buenas tardes|buenas|hola|saludos/i.test(userMsg)) {
    return isMsgSpanish
      ? `¡Hola! Me encuentro excelente y a tu completa disposición. Soy ${agentName}, Asesora Ejecutiva en 3Tree Digital Sport IA Corp. ¿En qué te puedo colaborar hoy?`
      : `Hello! I am doing great and ready to assist you. I'm ${agentName}, Executive AI Advisor at 3Tree Digital Sport IA Corp. How may I help you today?`;
  }

  return isMsgSpanish
    ? `En 3Tree Digital Sport IA desarrollamos tecnología de Sports Intelligence: Sports Intelligence Database · SIDB™, interfaces inteligentes, análisis cinemático 3D y agentes de IA. ¿En qué te puedo colaborar?`
    : `At 3Tree Digital Sport IA, we develop Sports Intelligence solutions: Sports Intelligence Database · SIDB™, intelligent interfaces, 3D kinematic analysis, and autonomous AI agents. How may I assist you today?`;
}
