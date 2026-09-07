"use client";

import React, { createContext, useContext, useState } from 'react';

const dict = {
  en: {
    nav: ["Solutions", "Technology", "Journal", "News", "Intelligence", "About"],
    cta: "Explore Solution",
    tagline: "AI Sports Intelligence Company",
    heroLine1: "We Design",
    heroLine2: "The Future",
    heroLine3: "Of Sports.",
    heroDesc: "We develop artificial intelligence and data systems that transform athletic performance and decision-making.",
    biomechanics: "Markerless Biomechanics",
    scouting: "Analytics & Sports Big Data",
    whoDaresWins: "Who Dares Wins",
    viewWork: "View Our Work",
    getInTouch: "Get In Touch",
    scroll: "Scroll",
    marquee1: ["UI/UX Architecture", "Sport Analytics", "Brand Identity", "Sports OS Core", "Data Visualization", "Intelligent Interfaces", "AI Integration", "Performance Tech"],
    stats: [
      { value: "26", label: "Years Field Experience" },
      { value: "100%", label: "Data-Driven Focus" },
      { value: "24/7", label: "Autonomous Analysis" },
      { value: "0", label: "Human Bias" },
    ],
    whatWeDo: "Solutions",
    ourExpertise: ["Our", "Solutions"],
    services: [
      { title: "Sports OS Core", desc: "Proprietary operating system architecture designed to centralize performance data, computer vision models, and predictive analytics for elite clubs and academies." },
      { title: "Intelligent Sports Interfaces", desc: "High-precision digital environments and tactical control panels built for coaches, scouts, and athletes in real time." },
      { title: "Automation", desc: "Streamline your workflows with custom automation pipelines, saving time and eliminating human error in sports scouting." },
      { title: "AI Implementation", desc: "Integration of predictive LLMs and computer vision into your ecosystem. We deploy artificial intelligence that actually works." },
      { title: "Cinematic Drone", desc: "High-speed drone tracking and aerial videography. We capture breathtaking angles for performance analysis and commercial sports marketing." },
      { title: "AI Agents", desc: "Custom autonomous AI agents built for your business. We design intelligent assistants that operate 24/7, automating complex workflows and elevating fan & athlete engagement." },
    ],
    caseStudy: "Case Study 01",
    pro: "Pro",
    exploreScroll: "A revolution in baseball analytics. Scroll to explore.",
    phase1: "Phase 01",
    phase1Desc: "Advanced Mechanics Tracking. Precision analysis of every movement.",
    phase2: "Phase 02",
    phase2Desc: "Real-time heatmap analysis and biomechanics tracking. Empowering elite teams.",
    phase3: "Phase 03",
    phase3Desc: "Precision tracking on the ice. Velocity and impact metrics.",
    haveProject1: "Have a",
    haveProject2: "project",
    haveProject3: "in mind?",
    letsTalk: "Let's Talk",
    marquee2: ["Baseball", "Hockey", "Soccer", "Surf", "Boxing", "Martial Arts", "Football", "Tennis", "Golf", "eSports", "MMA", "Swimming", "Track & Field"],
    ourJournal: "Our Journal",
    theEdge: ["The", "Edge"],
    exploreJournal: "Explore Journal",
    startProject: "Explore Solution",
    letsBuild: "Let's Build",
    theFuture: "The Future.",
    contactDesc: "Have an idea for a sports platform, data system, or new technology? Tell us about your project.",
    formName: "Your Name",
    formEmail: "Email Address",
    formIdea: "Tell us your idea",
    sendMessage: "Send Message",
    footerText: "© 2026 3Tree Digital Sport IA. All rights reserved.",
    footerLinks: ["Privacy", "Terms", "Cookies", "About us"],
    langToggle: "ES",
    project1Title: ["Gridiron", "AI"],
    project2Title: ["Data", "Analytics"],
    project3Title: ["Sports", "Analytics"],
    placeholderName: "e.g. John Doe",
    placeholderEmail: "e.g. john@company.com",
    placeholderIdea: "e.g. We want a scouting app...",
    scoutAi: "Kinebase",
    
    // Diario translations
    diarioTitle: "The Journal",
    diarioSubtitle1: "Editorial",
    diarioSubtitle2: "Insights",
    newEntry: "New Article",
    entryTitle: "Article Title...",
    entryBody: "Write your thoughts, ideas or notes...",
    saveEntry: "Save Article",
    cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete this article?",
    delete: "Delete",
    edit: "Edit",
    noEntries: "No articles published yet.",
    searchPlaceholder: "Search articles, concepts, biomechanics...",
    readTime: "min read",
    share: "Share",
    backToJournal: "Back to Journal",
    author: "Editorial Board",
    category: "Sports Tech",
    readArticle: "Read Analysis",
    publishedOn: "Published on",

    // Podcast / TV translations
    podcast: {
      tagline: "GLOBAL BROADCAST NETWORK",
      title: "IN THE PLAY",
      subtitle: "3TREE SPORTS NETWORK",
      description: "Original sports intelligence production. In-depth analysis, live biomechanics breakdowns, and conversations with the visionaries shaping the future of global athletic performance.",
      liveStreamTitle: "LIVE STREAM // CHANNEL 01",
      liveStreamBadge: "4K HDR LIVE",
      nowPlaying: "NOW PLAYING",
      listenSpotify: "Listen on Spotify",
      watchYoutube: "Watch on YouTube",
      applePodcasts: "Apple Podcasts",
      latestEpisodes: "Latest Broadcasts",
      season: "Season 01",
      episode: "EP",
      duration: "Duration",
      watchEpisode: "Watch Broadcast",
      listenAudio: "Audio Feed",
      host: "Network Host",
      guest: "Special Guest",
      topics: "Key Topics",
      transcript: "Show Notes & Telemetry",
      subscribe: "Subscribe to Network",
      subscribeDesc: "Get instant access to live broadcasts, unreleased telemetry data, and private scout debriefs.",
      enterEmail: "Enter your official email...",
      joinNetwork: "Join Network",
      upcomingLive: "Upcoming Live Broadcasts",
      setReminder: "Set Reminder",
      liveIn: "Broadcasting in",
      previousEpisodes: "Archived Broadcasts"
    },

    // About Us translations
    about: {
      title: "WHO WE ARE",
      subtitle: "3TREE DIGITAL SPORT IA · AI SPORTS INTELLIGENCE COMPANY",
      tagline: "Sport Tech Revolution · Technology, AI, Data and Automation for Sports.",
      heroText1: "Headquartered in Lutz, Florida, with a global vision, 3Tree Digital Sport IA is an AI Sports Intelligence company focused on transforming the way technology, data, and Artificial Intelligence are applied to sports. We design and develop intelligent systems, mobile applications, AI agents, automation systems, data solutions, drone-based technologies, sports branding, and digital experiences for the sports ecosystem.",
      heroText2: "Our objective is simple: Convert technology and data into practical intelligence for sports.",
      heroText3: "We were not born in traditional corporate boardrooms. Our vision was forged through more than 26 years of hands-on experience in sports and high-performance training, where we witnessed a recurring reality: thousands of athletes work tirelessly to develop their skills, yet access to technology, structured data, and professional-grade tools remains unequal. That reality led us to a fundamental question: What if technology, Artificial Intelligence, and data could become accessible tools for every level of sports? That question became the foundation of 3Tree Digital Sport IA.",
      uvpTitle: "OUR PHILOSOPHY",
      uvpQuote: "We believe the future of sports intelligence lives at the intersection of human experience, data, and Artificial Intelligence. The human eye provides context and intuition. Data provides measurable metrics. AI provides the power to process, connect, and scale that information. We do not replace human intelligence - we amplify it.",
      tableHeaders: ["Dimension", "Conventional Approach", "The 3Tree Approach"],
      tableRows: [
        { dim: "Technology", old: "Disconnected tools built around single isolated needs.", new: "Integrated digital solutions constructed around the sports ecosystem." },
        { dim: "Data Analytics", old: "Scattered data across spreadsheets and isolated silos. Slow and manual processes.", new: "Structured data converted into actionable sports intelligence with AI-assisted workflows." },
        { dim: "Development", old: "Generic platforms without real understanding of the athletic field.", new: "High-performance systems built from deep domain expertise and real field experience." },
        { dim: "Automation", old: "Repetitive manual tasks consuming coaching time.", new: "Autonomous workflows and AI agents handling scouting, video pipelines, and analytics 24/7." },
        { dim: "Accessibility", old: "Elite technology restricted only to billionaire franchises.", new: "Scalable architecture designed to expand elite capabilities to academies and athletes worldwide." }
      ],
      pillarsTitle: "STRATEGIC PILLARS",
      pillars: [
        { title: "Markerless 3D Biomechanics", desc: "High-precision 3D kinematic reconstruction at 240 fps directly from standard video with Kinebase Pro. Zero suits, zero physical sensors. Precise joint angles, torque, and injury prevention." },
        { title: "Sports OS Core & Data Engine", desc: "Proprietary sports intelligence architecture centralizing performance metrics, telemetry, and scouting databases for professional clubs and elite academies." },
        { title: "Predictive Scouting & LLM Models", desc: "Eliminating human bias with computer vision and language models that convert subjective observations into structured talent profiles and performance trajectories." },
        { title: "AI Agents & Autonomous Pipelines", desc: "Customized AI assistants and automated video pipelines that process footage, distribute tactical insights, and run workflows 24/7." }
      ],
      roadmapTitle: "OUR ROADMAP",
      roadmap: [
        { phase: "THE ORIGINS", desc: "Born from the frustration of seeing talent, data, and opportunities disconnected. Our roots are anchored in sports, training, and over 26 years of real field experience. Technology is most powerful when it solves real human challenges." },
        { phase: "THE PRESENT", desc: "Building the infrastructure. We are deploying the ecosystem that unifies intelligent systems, markerless biomechanics, predictive scouting, automation, and AI agents into practical tools for sports organizations." },
        { phase: "THE FUTURE", desc: "Setting the global standard for Sports Intelligence. An ecosystem where coaches, scouts, athletes, and clubs operate on intelligent infrastructure that connects talent with global opportunities." }
      ],
      closingBanner: {
        company: "3TREE DIGITAL SPORT IA",
        badge: "AI SPORTS INTELLIGENCE COMPANY",
        tags: "SPORT TECH · AI · DATA · SPORTS OS · AUTOMATION",
        moto: "Sport Tech Revolution",
        sub: "Technology designed to understand, connect, and transform sports."
      }
    },

    // Impact translations
    impact: {
      preTitle: "The Future of Sports",
      title1: "Sports",
      title2: "Intelligence",
      desc: "Artificial Intelligence is no longer science fiction, it's the new competitive advantage. We are an AI Sports Intelligence Company driven by Computer Vision, Big Data, and LLMs that eradicates human bias from scouting.",
      scroll: "Scroll",
      pillarsTitle1: "The 3",
      pillarsTitle2: "Pillars",
      pillarsDesc: "The technological architecture behind our unfair advantage.",
      pillars: [
        { 
          title: "Computer Vision", 
          desc: "Markerless biomechanical analysis (Kinebase Pro). We measure angles, torque, and rotational speed extracting exact data directly from the pixel. Goodbye to the bias of the clinical eye." 
        },
        { 
          title: "Predictive LLMs", 
          desc: "We transform subjective notes and raw metrics into structured talent profiles. Our language models predict performance curves and alert about injury risks." 
        },
        { 
          title: "Automated Workflows", 
          desc: "We democratize visibility. Automated video pipelines that edit, stabilize, and process raw footage, instantly sending it to the global scouting feed." 
        }
      ],
      oldParadigmTitle: "The Old Paradigm",
      oldParadigm: [
        "Subjective Human Scouting",
        "Expensive Video Editors",
        "Hidden Talent Pools",
        "Unstructured Notebooks"
      ],
      newParadigmTitle: "The 3Tree Paradigm",
      newParadigm: [
        "Markerless Biomechanics",
        "Autonomous AI Editing",
        "Global Data-Driven Feed",
        "LLM Tactical Reporting"
      ]
    }
  },
  es: {
    nav: ["Soluciones", "Tecnología", "Diario", "Noticiero", "Inteligencia", "Nosotros"],
    cta: "Explorar Solución",
    tagline: "AI Sports Intelligence Company",
    heroLine1: "Diseñamos",
    heroLine2: "El Futuro",
    heroLine3: "Del Deporte.",
    heroDesc: "Desarrollamos inteligencia artificial y sistemas de datos que transforman el rendimiento deportivo y la toma de decisiones.",
    biomechanics: "Biomecánica Markerless",
    scouting: "Analítica y Big Data Deportivo",
    whoDaresWins: "Quien se atreve, gana",
    viewWork: "Ver Nuestro Trabajo",
    getInTouch: "Contáctanos",
    scroll: "Bajar",
    marquee1: ["Arquitectura UI/UX", "Análisis Deportivo", "Identidad de Marca", "Núcleo Sports OS", "Visualización de Datos", "Interfaces Inteligentes", "Integración IA", "Tecnología de Rendimiento"],
    stats: [
      { value: "26", label: "Años de Experiencia en Campo" },
      { value: "100%", label: "Enfoque Basado en Datos" },
      { value: "24/7", label: "Análisis Autónomo" },
      { value: "0", label: "Sesgo Humano" },
    ],
    whatWeDo: "Soluciones",
    ourExpertise: ["Nuestras", "Soluciones"],
    services: [
      { title: "Núcleo Sports OS", desc: "Arquitectura propietaria de sistema operativo diseñada para centralizar datos de rendimiento, modelos de visión computacional y analítica predictiva para clubes y academias de élite." },
      { title: "Interfaces Deportivas Inteligentes", desc: "Entornos digitales de alta precisión y paneles tácticos en tiempo real construidos para entrenadores, scouts y atletas." },
      { title: "Automatización", desc: "Optimiza tus flujos de trabajo con pipelines automáticos personalizados, ahorrando tiempo y eliminando el error humano en el scouting." },
      { title: "Implementación de IA", desc: "Integración de LLMs predictivos y visión por computadora en tu ecosistema. Desplegamos inteligencia artificial que realmente funciona." },
      { title: "Dron Cinemático", desc: "Grabación aérea de alta velocidad con drones. Capturamos ángulos impresionantes para análisis de rendimiento y marketing deportivo." },
      { title: "Agentes de IA", desc: "Asistentes autónomos de IA personalizados para tu negocio. Operan 24/7 automatizando flujos complejos y elevando el engagement deportivo." },
    ],
    caseStudy: "Caso de Estudio 01",
    pro: "Pro",
    exploreScroll: "Una revolución en analítica deportiva. Desliza para explorar.",
    phase1: "Fase 01",
    phase1Desc: "Seguimiento Mecánico Avanzado. Análisis de precisión de cada movimiento articular.",
    phase2: "Fase 02",
    phase2Desc: "Mapas de calor en tiempo real y telemetría biomecánica. Potenciando equipos de élite.",
    phase3: "Fase 03",
    phase3Desc: "Seguimiento cinemático de precisión. Métricas de velocidad e impacto.",
    haveProject1: "¿Tienes un",
    haveProject2: "proyecto",
    haveProject3: "en mente?",
    letsTalk: "Hablemos",
    marquee2: ["Béisbol", "Hockey", "Fútbol", "Surf", "Boxeo", "Artes Marciales", "Fútbol Americano", "Tenis", "Golf", "eSports", "MMA", "Natación", "Atletismo"],
    ourJournal: "Nuestro Diario",
    theEdge: ["La", "Vanguardia"],
    exploreJournal: "Explorar Diario",
    startProject: "Explorar Solución",
    letsBuild: "Construyamos",
    theFuture: "El Futuro.",
    contactDesc: "¿Tienes una idea para una plataforma deportiva, sistema de datos o nueva tecnología? Cuéntanos sobre tu proyecto.",
    formName: "Tu Nombre",
    formEmail: "Correo Electrónico",
    formIdea: "Cuéntanos tu idea",
    sendMessage: "Enviar Mensaje",
    footerText: "© 2026 3Tree Digital Sport IA. Todos los derechos reservados.",
    footerLinks: ["Privacidad", "Términos", "Cookies", "Quiénes Somos"],
    langToggle: "EN",
    project1Title: ["Gridiron", "IA"],
    project2Title: ["Data", "Analítica"],
    project3Title: ["Deportes", "Analítica"],
    placeholderName: "Ej. Juan Pérez",
    placeholderEmail: "Ej. juan@academia.com",
    placeholderIdea: "Ej. Queremos una plataforma de scouting con IA...",
    scoutAi: "Kinebase",
    
    // Diario translations
    diarioTitle: "El Diario",
    diarioSubtitle1: "Reflexiones",
    diarioSubtitle2: "Editoriales",
    newEntry: "Nuevo Artículo",
    entryTitle: "Título del Artículo...",
    entryBody: "Escribe tus reflexiones, ideas o notas técnicas...",
    saveEntry: "Guardar Artículo",
    cancel: "Cancelar",
    confirmDelete: "¿Estás seguro de que deseas eliminar este artículo?",
    delete: "Eliminar",
    edit: "Editar",
    noEntries: "No hay artículos publicados aún.",
    searchPlaceholder: "Buscar artículos, conceptos, biomecánica...",
    readTime: "min de lectura",
    share: "Compartir",
    backToJournal: "Volver al Diario",
    author: "Consejo Editorial",
    category: "Sport Tech",
    readArticle: "Leer Análisis",
    publishedOn: "Publicado el",

    // Podcast / TV translations
    podcast: {
      tagline: "RED GLOBAL DE TRANSMISIÓN",
      title: "IN THE PLAY",
      subtitle: "3TREE SPORTS NETWORK",
      description: "Producción original de inteligencia deportiva. Análisis profundos, desgloses biomecánicos en vivo y conversaciones con visionarios que moldean el futuro del alto rendimiento deportivo.",
      liveStreamTitle: "TRANSMISIÓN EN VIVO // CANAL 01",
      liveStreamBadge: "4K HDR EN VIVO",
      nowPlaying: "EN EMISIÓN",
      listenSpotify: "Escuchar en Spotify",
      watchYoutube: "Ver en YouTube",
      applePodcasts: "Apple Podcasts",
      latestEpisodes: "Últimas Transmisiones",
      season: "Temporada 01",
      episode: "EP",
      duration: "Duración",
      watchEpisode: "Ver Emisión",
      listenAudio: "Canal de Audio",
      host: "Conductor",
      guest: "Invitado Especial",
      topics: "Temas Clave",
      transcript: "Notas del Programa y Telemetría",
      subscribe: "Suscribirse a la Red",
      subscribeDesc: "Obtén acceso instantáneo a transmisiones en vivo, datos de telemetría exclusivos y reportes privados de scouting.",
      enterEmail: "Ingresa tu correo oficial...",
      joinNetwork: "Unirse a la Red",
      upcomingLive: "Próximas Transmisiones en Vivo",
      setReminder: "Programar Recordatorio",
      liveIn: "Al aire en",
      previousEpisodes: "Episodios Anteriores"
    },

    // About Us translations
    about: {
      title: "QUIÉNES SOMOS",
      subtitle: "3TREE DIGITAL SPORT IA · AI SPORTS INTELLIGENCE COMPANY",
      tagline: "Sport Tech Revolution · Tecnología, Inteligencia Artificial, Datos y Automatización para el Deporte.",
      heroText1: "Con sede en Lutz, Florida, y una visión global, 3Tree Digital Sport IA es una compañía de AI Sports Intelligence enfocada en transformar la manera en que la tecnología, los datos y la Inteligencia Artificial se aplican al deporte. Diseñamos y desarrollamos sistemas inteligentes, aplicaciones móviles, agentes de IA, sistemas de automatización, soluciones de datos, tecnologías basadas en drones, branding deportivo y experiencias digitales para el ecosistema deportivo.",
      heroText2: "Nuestro objetivo es simple: Convertir la tecnología y los datos en inteligencia práctica para el deporte.",
      heroText3: "No nacimos en salas de juntas corporativas tradicionales. Nuestra visión se forjó a través de más de 26 años de experiencia vinculada al deporte y al entrenamiento de alto rendimiento, donde presenciamos una realidad recurrente: miles de atletas trabajan incansablemente para desarrollar sus habilidades, pero el acceso a la tecnología, a los datos estructurados y a herramientas de nivel profesional sigue siendo desigual. Esa realidad nos llevó a una pregunta fundamental: ¿Qué pasaría si la tecnología, la Inteligencia Artificial y los datos pudieran convertirse en herramientas accesibles para todos los niveles del deporte? Esa pregunta se convirtió en la base de 3Tree Digital Sport IA.",
      uvpTitle: "NUESTRA FILOSOFÍA",
      uvpQuote: "Creemos que el futuro de la inteligencia deportiva reside en la intersección de la experiencia humana, los datos y la Inteligencia Artificial. El ojo humano aporta experiencia y contexto. Los datos aportan información medible. La IA aporta la capacidad de procesar, conectar y transformar esa información a escala. No reemplazamos la inteligencia humana - la amplificamos.",
      tableHeaders: ["Dimensión", "Enfoque Convencional", "El Enfoque 3Tree"],
      tableRows: [
        { dim: "Tecnología", old: "Herramientas desconectadas diseñadas alrededor de necesidades individuales.", new: "Soluciones digitales integradas construidas alrededor del ecosistema deportivo." },
        { dim: "Análisis de Datos", old: "Información distribuida en múltiples sistemas, hojas de cálculo y plataformas aisladas. Procesos manuales lentos y difíciles de escalar.", new: "Datos estructurados transformados en inteligencia deportiva utilizable. Análisis asistido por IA y automatización diseñada para acelerar flujos de trabajo." },
        { dim: "Desarrollo", old: "Plataformas genéricas sin comprensión profunda del entorno deportivo.", new: "Sistemas de alto rendimiento construidos en torno a necesidades deportivas específicas y experiencia real de campo." },
        { dim: "Automatización", old: "Procesos repetitivos gestionados de forma manual que consumen tiempo valioso.", new: "Flujos de trabajo autónomos y agentes de IA diseñados para scouting, video y analítica 24/7." },
        { dim: "Accesibilidad", old: "Tecnología avanzada a menudo concentrada exclusivamente en organizaciones millonarias.", new: "Arquitectura escalable diseñada para expandir capacidades de élite a academias y atletas de todo el mundo." }
      ],
      pillarsTitle: "PILARES ESTRATÉGICOS",
      pillars: [
        { title: "Biomecánica 3D Sin Marcadores", desc: "Reconstrucción cinemática 3D a 240 fps con Kinebase Pro directamente desde video estándar sin requerir trajes ni sensores físicos. Análisis preciso de ángulos articulares, torques y prevención de lesiones." },
        { title: "Sports OS Core & Data Engine", desc: "Arquitectura propietaria de inteligencia deportiva que centraliza métricas de rendimiento, telemetría y bases de datos analíticas para clubes, academias y organizaciones profesionales." },
        { title: "Scouting Predictivo & Modelos LLM", desc: "Eliminación del sesgo humano mediante modelos de lenguaje y visión computacional que transforman notas subjetivas en perfiles de talento estructurados y curvas de rendimiento." },
        { title: "Agentes de IA & Automatización", desc: "Asistentes de IA personalizados y pipelines de video automatizados que procesan datos, distribuyen material táctico y optimizan flujos de trabajo 24/7 sin intervención manual." }
      ],
      roadmapTitle: "NUESTRA HOJA DE RUTA",
      roadmap: [
        { phase: "LOS ORÍGENES", desc: "Nacidos de la frustración de ver el talento, la información y las oportunidades desconectadas. Nuestros orígenes están arraigados en el deporte, el entrenamiento y más de 26 años de experiencia real. Aprendimos que la tecnología es más valiosa cuando comienza por comprender a las personas y los problemas que debe resolver." },
        { phase: "EL PRESENTE", desc: "Construyendo la infraestructura. Desarrollamos el ecosistema tecnológico que integra sistemas inteligentes, biomecánica markerless, scouting predictivo, automatización y agentes de IA en herramientas prácticas para el deporte." },
        { phase: "EL FUTURO", desc: "Establecer el nuevo estándar global para Sports Intelligence. Un ecosistema donde entrenadores, scouts, atletas, academias y ligas operen sobre infraestructura inteligente que conecte talento con oportunidades globales." }
      ],
      closingBanner: {
        company: "3TREE DIGITAL SPORT IA",
        badge: "AI SPORTS INTELLIGENCE COMPANY",
        tags: "SPORT TECH · IA · DATOS · SPORTS OS · AUTOMATIZACIÓN",
        moto: "Revolución Sport Tech",
        sub: "Tecnología creada para entender, conectar y transformar los deportes."
      }
    },

    // Impact translations
    impact: {
      preTitle: "El Futuro del Deporte",
      title1: "Inteligencia",
      title2: "Deportiva IA",
      desc: "La Inteligencia Artificial ya no es ciencia ficción, es la nueva ventaja competitiva. Somos una AI Sports Intelligence Company impulsada por Visión Computacional, Big Data y Modelos de Lenguaje (LLMs) que erradica el sesgo humano del scouting.",
      scroll: "Bajar",
      pillarsTitle1: "Los 3",
      pillarsTitle2: "Pilares",
      pillarsDesc: "La arquitectura tecnológica detrás de nuestra ventaja competitiva.",
      pillars: [
        { 
          title: "Visión Computacional", 
          desc: "Análisis biomecánico sin marcadores (Kinebase Pro). Medimos ángulos, torque y velocidad de rotación extrayendo datos exactos directamente del píxel. Adiós al sesgo del ojo clínico." 
        },
        { 
          title: "LLMs Predictivos", 
          desc: "Transformamos notas subjetivas y métricas crudas en perfiles de talento estructurados. Nuestros modelos de lenguaje predicen curvas de rendimiento y alertan sobre riesgos de lesión." 
        },
        { 
          title: "Flujos Automatizados", 
          desc: "Democratizamos la visibilidad. Pipelines automatizados de video que editan, estabilizan y procesan material crudo, enviándolo instantáneamente al feed global de scouting." 
        }
      ],
      oldParadigmTitle: "El Viejo Paradigma",
      oldParadigm: [
        "Scouting Humano Subjetivo",
        "Editores de Video Costosos",
        "Talentos Ocultos Sin Visibilidad",
        "Libretas No Estructuradas"
      ],
      newParadigmTitle: "El Paradigma 3Tree",
      newParadigm: [
        "Biomecánica Sin Marcadores",
        "Edición Autónoma con IA",
        "Feed Global Basado en Datos",
        "Reportes Tácticos con LLMs"
      ]
    }
  }
};

type Lang = 'en' | 'es';

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof dict.en;
  toggleLang: () => void;
};

const LangContext = createContext<LangContextType>({
  lang: 'es',
  setLang: () => {},
  t: dict.es,
  toggleLang: () => {}
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('es');

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: dict[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}