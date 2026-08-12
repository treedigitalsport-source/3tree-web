"use client";

import React, { createContext, useContext, useState } from 'react';

const dict = {
  en: {
    nav: ["Services", "Projects", "Podcast", "Journal", "Impact", "About us", "Contact"],
    cta: "Start Project",
    tagline: "Sports Intelligence Company",
    heroLine1: "We Design",
    heroLine2: "The Future",
    heroLine3: "Of Sports.",
    heroDesc: "We fuse high-performance design, data analytics, and cutting-edge development for the sports industry.",
    biomechanics: "Markerless Biomechanics",
    scouting: "Predictive Scouting",
    viewWork: "View Our Work",
    getInTouch: "Get In Touch",
    scroll: "Scroll",
    marquee1: ["UI/UX Design", "Sport Analytics", "Brand Identity", "Web Development", "Data Visualization", "Mobile Apps", "AI Integration", "Performance Tech"],
    stats: [
      { value: 26, suffix: "", label: "Years Field Experience" },
      { value: 100, suffix: "%", label: "Data-Driven Focus" },
      { value: 24, suffix: "/7", label: "Autonomous Analysis" },
      { value: 0, suffix: "", label: "Human Bias" },
    ],
    whatWeDo: "What We Do",
    ourExpertise: ["Our", "Expertise"],
    services: [
      { title: "Software Development", desc: "Custom software creation from scratch, tailored to the specific needs of elite sports organizations and tech startups." },
      { title: "App Design & Dev", desc: "End-to-end mobile and web application development, delivering seamless native and cross-platform digital experiences." },
      { title: "Web Design", desc: "High-performance, premium web design. We craft visually stunning platforms with cutting-edge UI/UX." },
      { title: "Automation", desc: "Streamline your workflows with custom automation pipelines, saving time and eliminating human error in sports scouting." },
      { title: "AI Implementation", desc: "Integration of predictive LLMs and computer vision into your ecosystem. We deploy artificial intelligence that actually works." },
      { title: "Cinematic Drone Services", desc: "High-speed drone tracking and aerial videography. We capture breathtaking angles for performance analysis and commercial sports marketing." },
      { title: "AI Agents", desc: "Autonomous AI agents tailored for your business. We build smart assistants that operate 24/7, driving engagement and automating complex tasks." },
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
    contactDesc: "Have an idea for a sports app, a data platform, or a new brand? Tell us about your project.",
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
    whoDaresWins: "Who Dares Wins *sas*",
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
    lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    
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
      subtitle: "3TREE DIGITAL · SPORT TECH REVOLUTION",
      heroText1: "Headquartered in Lutz, Florida, with global operations, 3tree Digital Sport IA is a Sports Intelligence company disrupting the Sport Tech sector. As an AI-driven technology factory, we design advanced software, mobile applications, and autonomous agents to radically transform athletic visibility through data analysis and automation.",
      heroText2: "We weren't born in traditional corporate boardrooms, but in the trenches of high-performance training. Over 26 years, we watched thousands of young talents fall off the radar due to a lack of objective validation. Our mission was born from one question: What if we used AI and Big Data to quantify athletic performance with millimeter precision, at an accessible cost?",
      uvpTitle: "Our Philosophy",
      uvpQuote: "Our philosophy is the relentless pursuit of objective truth. We believe the human eye is limited by biology and bias, leaving thousands of talents in the shadows. That is why we don't guess; we quantify. We build AI-driven ecosystems so that talent speaks through irrefutable mathematics, democratizing athletic visibility forever.",
      tableHeaders: ["Dimension", "Conventional Approach", "The 3Tree Approach"],
      tableRows: [
        { dim: "Visibility", old: "Expensive and restrictive video agencies.", new: "Democratized through accessible subscriptions." },
        { dim: "Evaluation", old: "Human scouting prone to bias and subjectivity.", new: "Millimeter validation driven by Computer Vision and AI." },
        { dim: "Development", old: "Generic software created by engineers without field experience.", new: "Solutions with real Domain Expertise, forged in 26 years of physical rigor." },
        { dim: "Analysis", old: "Raw notes and unstructured profiles.", new: "Predictive LLMs and Autonomous Agents that structure talent instantly." }
      ],
      pillarsTitle: "Strategic Pillars",
      pillars: [
        { title: "Democratization of Access", desc: "Drastically reduce economic barriers with accessible applications so any athlete can back their talent with objective data." },
        { title: "AI Agents for Everyone", desc: "Provide autonomous analysis tools that convert complex metrics into professional profiles ready for amateur, college, and competitive evaluation." },
        { title: "Big Data Validation", desc: "Sustain sports evaluation on rigorous statistics and performance analysis through specialized AI, eliminating subjectivity." }
      ],
      roadmapTitle: "The Roadmap",
      roadmap: [
        { phase: "The Origins", desc: "Born from the frustration of seeing wasted talent. Our origin is the sweat of the gym and one-on-one biomechanical analysis. We come from understanding the real needs of the athlete before writing the first line of code." },
        { phase: "The Present", desc: "Building the infrastructure. We have developed AI algorithms and automation workflows that democratize video editing and data extraction. Our current focus is establishing the ecosystem connecting invisible athletes with objective validation." },
        { phase: "The Future", desc: "Our vision is to become the Global Standard for Sports Intelligence. We envision a future where college and pro scouts won't make decisions without consulting 3Tree LLM predictions. We are moving toward fully autonomous agents that scan performance in real-time and prevent injuries before they occur." }
      ]
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
    nav: ["Servicios", "Proyectos", "Podcast", "Diario", "Impacto", "Quiénes somos", "Contacto"],
    cta: "Iniciar Proyecto",
    tagline: "Sports Intelligence Company",
    heroLine1: "Diseñamos",
    heroLine2: "El Futuro",
    heroLine3: "De Los Deportes.",
    heroDesc: "Fusionamos diseño de alto rendimiento, análisis de datos y desarrollo de vanguardia para la industria deportiva.",
    biomechanics: "Biomecánica Markerless",
    scouting: "Scouting Predictivo",
    viewWork: "Ver Trabajo",
    getInTouch: "Contáctanos",
    scroll: "Bajar",
    marquee1: ["Diseño UI/UX", "Análisis Deportivo", "Identidad de Marca", "Desarrollo Web", "Visualización de Datos", "Apps Móviles", "Integración IA", "Tecnología de Rendimiento"],
    stats: [
      { value: 26, suffix: "", label: "Años de Experiencia" },
      { value: 100, suffix: "%", label: "Enfoque en Datos" },
      { value: 24, suffix: "/7", label: "Análisis Autónomo" },
      { value: 0, suffix: "", label: "Sesgo Humano" },
    ],
    whatWeDo: "Lo Que Hacemos",
    ourExpertise: ["Nuestra", "Experiencia"],
    services: [
      { title: "Desarrollo de Software", desc: "Desarrollo de software a medida desde cero, estructurado para las necesidades específicas de organizaciones deportivas y startups." },
      { title: "Apps Móviles y Web", desc: "Desarrollo completo de aplicaciones nativas y multiplataforma con experiencias digitales ultra fluidas." },
      { title: "Diseño Web", desc: "Diseño web premium y de alto rendimiento. Creamos plataformas visualmente impactantes con UI/UX de vanguardia." },
      { title: "Automatización", desc: "Optimizamos tus flujos de trabajo con pipelines automáticos, ahorrando tiempo y eliminando el error humano en el scouting deportivo." },
      { title: "Implementación de IA", desc: "Integración de LLMs predictivos y visión por computadora en tu ecosistema. Desplegamos inteligencia artificial que realmente funciona." },
      { title: "Servicios de Dron Cinemático", desc: "Grabación aérea de alta velocidad y seguimiento con drones. Capturamos ángulos impresionantes para análisis de rendimiento y publicidad deportiva." },
      { title: "Agentes de IA", desc: "Agentes autónomos de IA a la medida de tu negocio. Creamos asistentes inteligentes que operan 24/7, automatizando tareas complejas y mejorando el engagement." },
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
    contactDesc: "¿Tienes una idea para una app deportiva, plataforma de datos o una nueva marca? Cuéntanos sobre tu proyecto.",
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
    whoDaresWins: "Quien Arriesga Gana *sas*",
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
    lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    
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
      subtitle: "3TREE DIGITAL · SPORT TECH REVOLUTION",
      heroText1: "Con sede en Lutz, Florida, y operaciones globales, 3tree Digital Sport IA es una compañía de Sports Intelligence que irrumpe en el sector Sport Tech. Como una factoría tecnológica impulsada por Inteligencia Artificial, diseñamos software avanzado, aplicaciones móviles y agentes autónomos para transformar radicalmente la visibilidad atlética mediante el análisis de datos y la automatización.",
      heroText2: "No nacimos en los despachos corporativos tradicionales, sino en las trincheras del entrenamiento de alto rendimiento. Durante 26 años, vimos a miles de jóvenes talentos quedar fuera del radar por falta de validación objetiva. Nuestra misión nació de una pregunta: ¿Qué pasaría si usáramos IA y Big Data para cuantificar el desempeño atlético con precisión milimétrica, a un costo accesible?",
      uvpTitle: "Nuestra Filosofía",
      uvpQuote: "Nuestra filosofía es la búsqueda implacable de la verdad objetiva. Creemos que el ojo humano está limitado por su biología y sus sesgos, dejando miles de talentos en la sombra. Por eso, no adivinamos; cuantificamos. Construimos ecosistemas de Inteligencia Artificial para que el talento se defienda con matemáticas irrefutables, democratizando la visibilidad atlética para siempre.",
      tableHeaders: ["Dimensión", "Enfoque Convencional", "El Enfoque 3Tree"],
      tableRows: [
        { dim: "Visibilidad", old: "Agencias de video costosas y restrictivas.", new: "Democratizada mediante suscripciones accesibles." },
        { dim: "Evaluación", old: "Scouting humano propenso a sesgos y subjetividad.", new: "Validación milimétrica impulsada por Visión Computarizada e IA." },
        { dim: "Desarrollo", old: "Software genérico creado por ingenieros sin experiencia de campo.", new: "Soluciones con Domain Expertise real, forjadas en 26 años de rigor físico." },
        { dim: "Análisis", old: "Notas crudas y perfiles no estructurados.", new: "LLMs predictivos y Agentes Autónomos que estructuran talento al instante." }
      ],
      pillarsTitle: "Pilares Estratégicos",
      pillars: [
        { title: "Democratización del Acceso", desc: "Reducir drásticamente las barreras económicas con aplicaciones accesibles para que cualquier atleta pueda respaldar su talento con datos objetivos." },
        { title: "Agentes de IA para Todos", desc: "Proveer herramientas de análisis autónomas que convierten métricas complejas en perfiles profesionales listos para la evaluación amateur, universitaria y competitiva." },
        { title: "Validación con Big Data", desc: "Sustentar la evaluación deportiva en estadísticas rigurosas y análisis de rendimiento mediante IA especializada, eliminando la subjetividad." }
      ],
      roadmapTitle: "La Ruta",
      roadmap: [
        { phase: "Fundación", desc: "Nacimos de la frustración de ver el talento desperdiciado. Nuestro origen es el sudor del gimnasio y el análisis biomecánico uno a uno. Venimos de entender la necesidad real del atleta antes de escribir la primera línea de código." },
        { phase: "El Presente", desc: "Estamos construyendo la infraestructura. Hemos desarrollado algoritmos de IA y flujos de automatización que democratizan la edición de video y la extracción de datos. Nuestro enfoque actual es establecer el ecosistema que conecte a los atletas invisibles con la validación objetiva." },
        { phase: "El Futuro", desc: "Nuestra visión es convertirnos en el Estándar Global de Inteligencia Deportiva. Visualizamos un futuro donde los scouts universitarios y profesionales no tomen decisiones sin consultar las predicciones de nuestros LLMs. Vamos hacia el desarrollo de agentes completamente autónomos que escaneen el rendimiento en tiempo real y prevengan lesiones." }
      ]
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
  lang: 'en',
  setLang: () => {},
  t: dict.en,
  toggleLang: () => {}
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

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
