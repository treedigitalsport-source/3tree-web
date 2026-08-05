"use client";

import React, { createContext, useContext, useState } from 'react';

const dict = {
  en: {
    nav: ["Services", "Projects", "Podcast", "Journal", "Impact", "Sports News", "About us", "Contact"],
    cta: "Start Project",
    tagline: "Sport AI Company",
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
      { value: 150, suffix: "+", label: "Projects Delivered" },
      { value: 40, suffix: "+", label: "Elite Athletes" },
      { value: 98, suffix: "%", label: "Client Retention" },
      { value: 12, suffix: "", label: "Industry Awards" },
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
    }
  },
  es: {
    nav: ["Servicios", "Proyectos", "Podcast", "Diario", "Impacto", "Noticiero", "Quiénes somos", "Contacto"],
    cta: "Iniciar Proyecto",
    tagline: "Empresa Sport AI",
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
      { value: 150, suffix: "+", label: "Proyectos Entregados" },
      { value: 40, suffix: "+", label: "Atletas de Élite" },
      { value: 98, suffix: "%", label: "Retención de Clientes" },
      { value: 12, suffix: "", label: "Premios de la Industria" },
    ],
    whatWeDo: "Lo Que Hacemos",
    ourExpertise: ["Nuestra", "Experiencia"],
    services: [
      { title: "Creación de Software", desc: "Desarrollo de software a medida desde cero, estructurado para las necesidades específicas de organizaciones deportivas y startups." },
      { title: "Apps Móviles y Web", desc: "Desarrollo completo de aplicaciones nativas y multiplataforma con experiencias digitales ultra fluidas." },
      { title: "Diseño Web", desc: "Diseño web premium y de alto rendimiento. Creamos plataformas visualmente impactantes con UI/UX de vanguardia." },
      { title: "Automatización", desc: "Optimizamos tus flujos de trabajo con pipelines automáticos, ahorrando tiempo y eliminando el error humano en el scouting deportivo." },
      { title: "Implementación de IA", desc: "Integración de LLMs predictivos y visión por computadora en tu ecosistema. Desplegamos inteligencia artificial que realmente funciona." },
      { title: "Servicios de Dron FPV", desc: "Grabación aérea de alta velocidad y seguimiento con drones FPV. Capturamos ángulos impresionantes para análisis de rendimiento y publicidad deportiva." },
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
