"use client";

import React, { createContext, useContext, useState } from 'react';

const dict = {
  en: {
    nav: ["Services", "Ecosystem", "Journal", "News", "Impact", "About"],
    cta: "Start Project",
    tagline: "Sports Intelligence Company",
    heroLine1: "We Design",
    heroLine2: "The Future",
    heroLine3: "Of Sports.",
    heroDesc: "We fuse high-performance design, data analytics, and our Sport Intelligence Operating System for elite sports organizations.",
    biomechanics: "Markerless Biomechanics",
    scouting: "Predictive Scouting",
    viewWork: "View Our Work",
    getInTouch: "Get In Touch",
    scroll: "Scroll",
    marquee1: ["UI/UX Architecture", "Sport Analytics", "Brand Identity", "Sports OS Core", "Data Visualization", "Intelligent Interfaces", "AI Integration", "Performance Tech"],
    stats: [
      { value: 26, suffix: "", label: "Years Field Experience" },
      { value: 100, suffix: "%", label: "Data-Driven Focus" },
      { value: 0, suffix: "", label: "Human Bias" },
    ],
    whatWeDo: "What We Do",
    ourExpertise: ["Our", "Expertise"],
    services: [
      { title: "Sport Intelligence OS (Sports OS)", desc: "Proprietary operating system architecture designed to centralize performance data, computer vision models, and predictive analytics for elite clubs and academies." },
      { title: "Intelligent Sports Interfaces & Native Engines", desc: "High-precision digital environments and tactical control panels built for coaches, scouts, and athletes in real time." },
      { title: "Web Design", desc: "High-performance, premium web design. We craft visually stunning platforms with cutting-edge UI/UX." },
      { title: "Automation", desc: "Streamline your workflows with custom automation pipelines, saving time and eliminating human error in sports scouting." },
      { title: "AI Implementation", desc: "Integration of predictive LLMs and computer vision into your ecosystem. We deploy artificial intelligence that actually works." },
      { title: "Cinematic Drone Services", desc: "High-speed drone tracking and aerial videography. We capture breathtaking angles for performance analysis and commercial sports marketing." },
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
    startProject: "Start A Project",
    letsBuild: "Let's Build",
    theFuture: "The Future.",
    contactDesc: "Have an idea for a sports platform, data system, or new technology? Tell us about your project.",
    formName: "Your Name",
    formEmail: "Email Address",
    formIdea: "Tell us your idea",
    sendMessage: "Send Message",
    footerText: "© 2026 3Tree Digital Sport Tech. All rights reserved.",
    footerLinks: ["Privacy", "Terms", "Cookies", "About us"],
    langToggle: "ES",
    project1Title: ["Gridiron", "AI"],
    project2Title: ["System", "Data"],
    project3Title: ["Ice", "Analytics"],
    placeholderName: "e.g. John Doe",
    placeholderEmail: "e.g. john@company.com",
    placeholderIdea: "e.g. We want a scouting app...",
    whoDaresWins: "Who Dares Wins",
    scoutAi: "Kinebase",
    
    // Diario translations
    diarioTitle: "The Journal",
    diarioSubtitle1: "Editorial",
    diarioSubtitle2: "Insights",
    newEntry: "New Article",
    entryTitle: "Article Title...",
    entryBody: "Write your thoughts, ideas or notes...",
    saveEntry: "Save Article",
    recentEntries: "Recent Articles",
    reflection: "Design Reflection",
    lorem: "Deep analysis and investigative reporting at the intersection of professional sports, biomechanics, data science, and artificial intelligence.",
    
    // Sports News (Formerly In the Play)
    inThePlayTitle: "Sports News",
    inThePlayDesc: "The ultimate sports news broadcast.",
    uploadYourPlay: "View Latest News",
    uploadDesc: "Stay updated with our daily live dispatch covering the latest in the sports tech ecosystem.",
    uploadButton: "UPLOAD VIDEO",
    liveFeed: "LIVE FEED",
    watchVideos: "Watch Videos",
    uploadVideoMenu: "Upload Video",
    podcast: {
      title: "zon_ethos",
      subtitle: "Deep dives into Sports Tech, Data, and Future.",
      listenLatest: "Listen to Latest Episode",
      latestEpisode: "LATEST EPISODE",
      previousEpisodes: "Previous Episodes"
    },
    about: {
      title: "ABOUT US",
      subtitle: "3TREE DIGITAL SPORT IA · SPORTS INTELLIGENCE COMPANY",
      tagline: "Sport Tech Revolution · Technology, Artificial Intelligence, Data, and Automation for Sports.",
      heroText1: "Headquartered in Lutz, Florida, with a global vision, 3Tree Digital Sport IA is a Sports Intelligence company focused on transforming the way technology, data, and Artificial Intelligence are applied to sports. We design and develop advanced software, mobile applications, AI agents, automation systems, data solutions, drone-based technologies, sports branding, and digital experiences for the sports ecosystem.",
      heroText2: "Our objective is simple: Turn technology and data into practical intelligence for sports.",
      heroText3: "We were not born in traditional corporate boardrooms. Our vision was forged through more than 26 years of experience connected to sports and high-performance training, where we witnessed a recurring reality: thousands of athletes work relentlessly to develop their abilities, yet access to technology, structured data, and professional-level tools remains uneven. That reality led us to one fundamental question: What if technology, Artificial Intelligence, and data could become accessible tools for every level of sports? That question became the foundation of 3Tree Digital Sport IA.",
      uvpTitle: "OUR PHILOSOPHY",
      uvpQuote: "We believe the future of sports intelligence lies at the intersection of human experience, data, and Artificial Intelligence. The human eye provides experience and context. Data provides measurable information. AI provides the ability to process, connect, and transform that information at scale. We do not replace human intelligence — we amplify it.",
      tableHeaders: ["Dimension", "Conventional Approach", "The 3Tree Approach"],
      tableRows: [
        { dim: "Technology", old: "Disconnected tools designed around individual needs.", new: "Integrated digital solutions built around the sports ecosystem." },
        { dim: "Data Analysis", old: "Information distributed across systems, spreadsheets, and isolated platforms. Manual processes that can be slow and difficult to scale.", new: "Structured data transformed into usable sports intelligence. AI-assisted analysis and automation designed to accelerate workflows." },
        { dim: "Development", old: "Generic technology without deep understanding of the sports environment.", new: "Solutions built around sports-specific needs and real-world experience." },
        { dim: "Automation", old: "Repetitive processes handled manually.", new: "Intelligent workflows and AI agents designed to automate selected tasks." },
        { dim: "Accessibility", old: "Advanced technology often concentrated among organizations with greater resources.", new: "Technology designed to expand access across different levels of sports." }
      ],
      pillarsTitle: "STRATEGIC PILLARS",
      pillars: [
        { title: "Democratization of Sports Technology", desc: "We work to reduce technological barriers by creating accessible digital solutions that allow athletes, coaches, academies, clubs, leagues, and sports organizations to benefit from modern technology." },
        { title: "AI Agents for Sports", desc: "We develop intelligent agents capable of assisting with information processing, analysis, workflows, and repetitive tasks, helping sports professionals work more efficiently." },
        { title: "Data-Driven Intelligence", desc: "We transform structured data and sports information into insights that can support better understanding, planning, and decision-making." },
        { title: "Intelligent Automation", desc: "We connect technology, data, and workflows to reduce repetitive processes and create more efficient digital operations within the sports ecosystem." }
      ],
      roadmapTitle: "THE ROADMAP",
      roadmap: [
        { phase: "THE ORIGINS", desc: "Born from the frustration of seeing talent, information, and opportunity disconnected. Our origins are rooted in sports, training, and more than 26 years of real-world experience. We learned that technology is most valuable when it begins by understanding the people and problems it is designed to serve." },
        { phase: "THE PRESENT", desc: "Building the infrastructure. We are developing the technological ecosystem that brings together software, applications, Artificial Intelligence, data, automation, AI agents, digital experiences, and sports-focused technology. Our current mission is to transform complex technological capabilities into practical tools for the sports ecosystem." },
        { phase: "THE FUTURE", desc: "Our vision is to help establish a new global standard for Sports Intelligence. We envision a sports ecosystem where athletes, coaches, clubs, academies, leagues, and organizations can use data, Artificial Intelligence, automation, and technology to make better-informed decisions and operate more intelligently. We are building toward a future where sports technology is not simply a tool — but an intelligent infrastructure connecting data, people, and opportunity." }
      ],
      closingBanner: {
        company: "3TREE DIGITAL SPORT IA",
        badge: "SPORTS INTELLIGENCE COMPANY",
        tags: "SPORT TECH · AI · DATA · SPORTS OS · AUTOMATION",
        moto: "Sport Tech Revolution",
        sub: "Technology created to understand, connect, and transform sports."
      }
    },
    impact: {
      preTitle: "The Future of Sports",
      title1: "The Impact",
      title2: "Of AI",
      desc: "Artificial Intelligence is no longer science fiction, it's the new competitive advantage. We are a Sports Intelligence Company driven by Computer Vision, Big Data, and LLMs that eradicates human bias from scouting.",
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
    nav: ["Servicios", "Ecosistema", "Diario", "Noticiero", "Impacto", "Nosotros"],
    cta: "Iniciar Proyecto",
    tagline: "Sports Intelligence Company",
    heroLine1: "Diseñamos",
    heroLine2: "El Futuro",
    heroLine3: "Del Deporte.",
    heroDesc: "Fusionamos diseño de alto rendimiento, análisis de datos y desarrollo de vanguardia para la industria deportiva.",
    biomechanics: "Biomecánica Markerless",
    scouting: "Scouting Predictivo",
    viewWork: "Ver Trabajo",
    getInTouch: "Contáctanos",
    scroll: "Bajar",
    marquee1: ["Arquitectura UI/UX", "Análisis Deportivo", "Identidad de Marca", "Núcleo Sports OS", "Visualización de Datos", "Interfaces Inteligentes", "Integración IA", "Tecnología de Rendimiento"],
    stats: [
      { value: 26, suffix: "", label: "Años de Experiencia" },
      { value: 100, suffix: "%", label: "Enfoque en Datos" },
      { value: 24, suffix: "/7", label: "Análisis Autónomo" },
      { value: 0, suffix: "", label: "Sesgo Humano" },
    ],
    whatWeDo: "Lo Que Hacemos",
    ourExpertise: ["Nuestra", "Experiencia"],
    services: [
      { title: "Sistema Operativo de Inteligencia Deportiva (Sports OS)", desc: "Arquitectura de sistema operativo propietaria diseñada para centralizar datos de rendimiento, modelos de visión computacional y analítica predictiva para clubes y academias de élite." },
      { title: "Interfaces Deportivas Inteligentes y Motores Nativos", desc: "Entornos digitales de alta precisión y paneles de control táctico construidos para entrenadores, scouts y atletas en tiempo real." },
      { title: "Diseño Web", desc: "Diseño web premium y de alto rendimiento. Creamos plataformas visualmente impactantes con UI/UX de vanguardia." },
      { title: "Automatización", desc: "Optimizamos tus flujos de trabajo con pipelines automáticos, ahorrando tiempo y eliminando el error humano en el scouting deportivo." },
      { title: "Implementación de IA", desc: "Integración de LLMs predictivos y visión por computadora en tu ecosistema. Desplegamos inteligencia artificial que realmente funciona." },
      { title: "Servicios de Dron Cinemático", desc: "Grabación aérea de alta velocidad y seguimiento con drones. Capturamos ángulos impresionantes para análisis de rendimiento y publicidad deportiva." },
      { title: "Agentes de IA", desc: "Agentes autónomos de IA a la medida de tu negocio. Creamos asistentes inteligentes que operan 24/7, automatizando tareas complejas y mejorando el engagement de fans y atletas." },
    ],
    caseStudy: "Caso de Estudio 01",
    pro: "Pro",
    exploreScroll: "Una revolución en análisis de béisbol. Haz scroll para explorar.",
    phase1: "Fase 01",
    phase1Desc: "Seguimiento Avanzado de Mecánicas. Análisis de precisión de cada movimiento.",
    phase2: "Fase 02",
    phase2Desc: "Análisis de mapas de calor en tiempo real y seguimiento biomecánico. Empoderando equipos de élite.",
    phase3: "Fase 03",
    phase3Desc: "Seguimiento de precisión en el hielo. Métricas de velocidad e impacto.",
    haveProject1: "¿Tienes un",
    haveProject2: "proyecto",
    haveProject3: "en mente?",
    letsTalk: "Hablemos",
    marquee2: ["Béisbol", "Hockey", "Fútbol", "Surf", "Boxeo", "Artes Marciales", "Fútbol Americano", "Tenis", "Golf", "eSports", "MMA", "Natación", "Atletismo"],
    ourJournal: "Nuestro Diario",
    theEdge: ["La", "Vanguardia"],
    exploreJournal: "Explorar Diario",
    startProject: "Iniciar Proyecto",
    letsBuild: "Construyamos",
    theFuture: "El Futuro.",
    contactDesc: "¿Tienes una idea para una plataforma deportiva, sistema de datos o nueva tecnología? Cuéntanos sobre tu proyecto.",
    formName: "Tu Nombre",
    formEmail: "Correo Electrónico",
    formIdea: "Cuéntanos tu idea",
    sendMessage: "Enviar Mensaje",
    footerText: "© 2026 3Tree Digital Sport Tech. Todos los derechos reservados.",
    footerLinks: ["Privacidad", "Términos", "Cookies", "Quiénes somos"],
    langToggle: "EN",
    project1Title: ["Gridiron", "AI"],
    project2Title: ["Datos de", "Sistema"],
    project3Title: ["Analítica", "de Hielo"],
    placeholderName: "ej. Juan Pérez",
    placeholderEmail: "ej. juan@empresa.com",
    placeholderIdea: "ej. Queremos una app de scouting...",
    whoDaresWins: "Quien Arriesga Gana",
    scoutAi: "Kinebase",
    
    // Diario translations
    diarioTitle: "El Diario",
    diarioSubtitle1: "Editorial",
    diarioSubtitle2: "Insights",
    newEntry: "Nuevo Artículo",
    entryTitle: "Título del artículo...",
    entryBody: "Escribe tus pensamientos, ideas o notas...",
    saveEntry: "Guardar Artículo",
    recentEntries: "Artículos Recientes",
    reflection: "Reflexión de Diseño",
    lorem: "Análisis profundo y reportajes de investigación en la intersección del deporte profesional, la biomecánica, la ciencia de datos y la inteligencia artificial.",
    
    // Sports News (Formerly In the Play)
    inThePlayTitle: "Noticiero",
    inThePlayDesc: "La plataforma de noticias deportivas definitivas.",
    uploadYourPlay: "Ver Últimas Noticias",
    uploadDesc: "Mantente al día con nuestro noticiero en vivo sobre lo último en el ecosistema sport tech.",
    uploadButton: "SUBIR VIDEO",
    liveFeed: "FEED EN VIVO",
    watchVideos: "Ver Videos",
    uploadVideoMenu: "Subir Video",
    podcast: {
      title: "zon_ethos",
      subtitle: "Inmersiones profundas en tecnología deportiva, datos y futuro.",
      listenLatest: "Escuchar el Último Episodio",
      latestEpisode: "ÚLTIMO EPISODIO",
      previousEpisodes: "Episodios Anteriores"
    },
    about: {
      title: "QUIÉNES SOMOS",
      subtitle: "3TREE DIGITAL SPORT IA · SPORTS INTELLIGENCE COMPANY",
      tagline: "Sport Tech Revolution · Tecnología, Inteligencia Artificial, Datos y Automatización para el Deporte.",
      heroText1: "Con sede en Lutz, Florida, y una visión global, 3Tree Digital Sport IA es una compañía de Sports Intelligence enfocada en transformar la manera en que la tecnología, los datos y la Inteligencia Artificial se aplican al deporte. Diseñamos y desarrollamos software avanzado, aplicaciones móviles, agentes de IA, sistemas de automatización, soluciones de datos, tecnologías basadas en drones, branding deportivo y experiencias digitales para el ecosistema deportivo.",
      heroText2: "Nuestro objetivo es simple: Convertir la tecnología y los datos en inteligencia práctica para el deporte.",
      heroText3: "No nacimos en salas de juntas corporativas tradicionales. Nuestra visión se forjó a través de más de 26 años de experiencia vinculada al deporte y al entrenamiento de alto rendimiento, donde presenciamos una realidad recurrente: miles de atletas trabajan incansablemente para desarrollar sus habilidades, pero el acceso a la tecnología, a los datos estructurados y a herramientas de nivel profesional sigue siendo desigual. Esa realidad nos llevó a una pregunta fundamental: ¿Qué pasaría si la tecnología, la Inteligencia Artificial y los datos pudieran convertirse en herramientas accesibles para todos los niveles del deporte? Esa pregunta se convirtió en la base de 3Tree Digital Sport IA.",
      uvpTitle: "NUESTRA FILOSOFÍA",
      uvpQuote: "Creemos que el futuro de la inteligencia deportiva reside en la intersección de la experiencia humana, los datos y la Inteligencia Artificial. El ojo humano aporta experiencia y contexto. Los datos aportan información medible. La IA aporta la capacidad de procesar, conectar y transformar esa información a escala. No reemplazamos la inteligencia humana — la amplificamos.",
      tableHeaders: ["Dimensión", "Enfoque Convencional", "El Enfoque 3Tree"],
      tableRows: [
        { dim: "Tecnología", old: "Herramientas desconectadas diseñadas alrededor de necesidades individuales.", new: "Soluciones digitales integradas construidas alrededor del ecosistema deportivo." },
        { dim: "Análisis de Datos", old: "Información distribuida en múltiples sistemas, hojas de cálculo y plataformas aisladas. Procesos manuales lentos y difíciles de escalar.", new: "Datos estructurados transformados en inteligencia deportiva utilizable. Análisis asistido por IA y automatización diseñada para acelerar flujos de trabajo." },
        { dim: "Desarrollo", old: "Tecnología genérica sin comprensión profunda del entorno deportivo.", new: "Soluciones construidas en torno a necesidades deportivas específicas y experiencia real de campo." },
        { dim: "Automatización", old: "Procesos repetitivos gestionados de forma manual.", new: "Flujos de trabajo inteligentes y agentes de IA diseñados para automatizar tareas seleccionadas." },
        { dim: "Accesibilidad", old: "Tecnología avanzada a menudo concentrada en organizaciones con mayores recursos.", new: "Tecnología diseñada para expandir el acceso en todos los niveles del deporte." }
      ],
      pillarsTitle: "PILARES ESTRATÉGICOS",
      pillars: [
        { title: "Democratización de la Tecnología Deportiva", desc: "Trabajamos para reducir las barreras tecnológicas mediante soluciones digitales accesibles que permitan a atletas, entrenadores, academias, clubes, ligas y organizaciones beneficiarse de la tecnología moderna." },
        { title: "Agentes de IA para el Deporte", desc: "Desarrollamos agentes inteligentes capaces de asistir en el procesamiento de información, análisis, flujos de trabajo y tareas repetitivas, ayudando a los profesionales del deporte a trabajar de forma más eficiente." },
        { title: "Inteligencia Basada en Datos", desc: "Transformamos datos estructurados e información deportiva en insights prácticos que respaldan una mejor comprensión, planificación y toma de decisiones." },
        { title: "Automatización Inteligente", desc: "Conectamos tecnología, datos y flujos operativos para reducir procesos repetitivos y crear operaciones digitales más eficientes dentro del ecosistema deportivo." }
      ],
      roadmapTitle: "LA RUTA (ROADMAP)",
      roadmap: [
        { phase: "LOS ORÍGENES", desc: "Nacidos de la frustración de ver el talento, la información y las oportunidades desconectadas. Nuestros orígenes están arraigados en el deporte, el entrenamiento y más de 26 años de experiencia real. Aprendimos que la tecnología es más valiosa cuando comienza por comprender a las personas y los problemas que debe resolver." },
        { phase: "EL PRESENTE", desc: "Construyendo la infraestructura. Desarrollamos el ecosistema tecnológico que integra software, aplicaciones, Inteligencia Artificial, datos, automatización, agentes de IA, experiencias digitales y tecnología deportiva especializada. Nuestra misión actual es transformar capacidades tecnológicas complejas en herramientas prácticas para el deporte." },
        { phase: "EL FUTURO", desc: "Nuestra visión es ayudar a establecer un nuevo estándar global para Sports Intelligence. Visualizamos un ecosistema donde atletas, entrenadores, clubes, academias, ligas y organizaciones utilicen datos, IA, automatización y tecnología para tomar decisiones informadas y operar con mayor inteligencia. Construimos hacia un futuro donde la tecnología deportiva no sea solo una herramienta — sino una infraestructura inteligente que conecte datos, personas y oportunidades." }
      ],
      closingBanner: {
        company: "3TREE DIGITAL SPORT IA",
        badge: "SPORTS INTELLIGENCE COMPANY",
        tags: "SPORT TECH · AI · DATA · SPORTS OS · AUTOMATION",
        moto: "Sport Tech Revolution",
        sub: "Tecnología creada para entender, conectar y transformar los deportes."
      }
    },
    impact: {
      preTitle: "El Futuro del Deporte",
      title1: "El Impacto",
      title2: "De La IA",
      desc: "La Inteligencia Artificial ya no es ciencia ficción, es la nueva ventaja competitiva. Somos una Sports Intelligence Company impulsada por Visión Computarizada, Big Data y Modelos de Lenguaje (LLMs) que erradica el sesgo humano del scouting.",
      scroll: "Scroll",
      pillarsTitle1: "Los 3",
      pillarsTitle2: "Pilares",
      pillarsDesc: "La arquitectura tecnológica detrás de nuestra ventaja injusta.",
      pillars: [
        { 
          title: "Visión Computarizada", 
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
