"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLang } from "./i18n";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, LayoutTemplate, Cpu, Fingerprint, ChevronDown, Play, Globe, Activity, Brain, Video, Bot } from "lucide-react";
import { SocialLinks } from "@/components/ui/SocialLinks";
import CustomCursor from "@/components/CustomCursor";
import Lenis from "lenis";

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MOUSE SPOTLIGHT                                                           */
/* ══════════════════════════════════════════════════════════════════════════ */
function MouseSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[1] hidden md:block"
      style={{
        x: smoothX,
        y: smoothY,
        width: 600,
        height: 600,
        marginLeft: -300,
        marginTop: -300,
        background: "radial-gradient(circle, rgba(242,101,34,0.06) 0%, transparent 60%)",
        filter: "blur(40px)",
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  ANIMATED COUNTER                                                          */
/* ══════════════════════════════════════════════════════════════════════════ */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame: number;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MARQUEE                                                                   */
/* ══════════════════════════════════════════════════════════════════════════ */
function Marquee({ children, speed = 30, className="" }: { children: React.ReactNode; speed?: number; className?: string }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap flex ${className}`}>
      <motion.div
        className="flex shrink-0"
        animate={{ x: [0, "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAGNETIC BUTTON                                                           */
/* ══════════════════════════════════════════════════════════════════════════ */
function MagneticButton({ children, className = "", href = "#" }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 300 });
  const springY = useSpring(y, { damping: 15, stiffness: 300 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE COMPONENT                                                       */
/* ══════════════════════════════════════════════════════════════════════════ */
export default function MainContent() {
  const { t, lang, toggleLang } = useLang();
  const isEs = lang === "es";
  /* Scroll values for the Parallax Hero Video */
  const { scrollYProgress: heroScroll } = useScroll();
  const heroY = useTransform(heroScroll, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(heroScroll, [0, 0.3], [1, 0.3]);

  return (
    <main className="relative bg-[#020617] text-white selection:bg-brandOrange selection:text-white font-sans overflow-x-hidden">
      <CustomCursor />
      <MouseSpotlight />

      {/* Grid Pattern Background - Only applied to structural sections, not video hero */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Cinematic Top Gradient Fade for Header */}
      <div className="fixed top-0 left-0 right-0 h-[20vh] bg-gradient-to-b from-[#020617] via-[#020617]/60 to-transparent z-[40] pointer-events-none"></div>

      {/* ─── HEADER ─── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 px-6 md:px-10 py-6 flex justify-between items-center bg-[#020617]/40 backdrop-blur-md border-b border-white/10"
      >
        <div className="flex items-center hoverable">
          <div className="h-24 md:h-28 w-[280px] md:w-[380px] flex items-center relative transition-all duration-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/logo-3tree.png" alt="3Tree Digital" className="h-full w-full object-contain object-left" />
          </div>
        </div>

        <div className="hidden lg:flex gap-4 xl:gap-8 text-[10px] xl:text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-white/50 items-center">
          {t.nav.map((item, i) => {
            const sectionIds = ["services", "projects", "podcast", "journal", "impact", "about", "contact"];
            let targetUrl = `#${sectionIds[i]}`;
            if (sectionIds[i] === "projects") targetUrl = "/projects/kinebase";
            if (sectionIds[i] === "podcast") targetUrl = "/podcast";
            if (sectionIds[i] === "journal") targetUrl = "/journal";
            if (sectionIds[i] === "impact") targetUrl = "/impact";
            if (sectionIds[i] === "about") targetUrl = "/about";
            if (sectionIds[i] === "contact") targetUrl = "/contact";

            return (
              <div key={item} className="relative group/nav whitespace-nowrap">
                <Link href={targetUrl} className="hoverable hover:text-white transition-colors duration-500 flex items-center gap-1 group/link">
                  {item}
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brandOrange group-hover/nav:w-full transition-all duration-500"></span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mr-2 md:mr-6 lg:mr-10">
          <button 
            onClick={toggleLang}
            className="group hoverable flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-full bg-white/[0.03] backdrop-blur-md hover:border-brandOrange/40"
          >
            <Globe className="w-3 h-3 text-white/60 group-hover:text-brandOrange group-hover:rotate-180 transition-all duration-700 ease-in-out" /> {lang === 'en' ? 'ES' : 'EN'}
          </button>
          
          <Link href="/contact" className="hoverable flex items-center gap-2 bg-brandOrange text-white px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brandOrange transition-all duration-500">
            {t.cta} <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </motion.header>

      {/* ─── HERO SECTION (ORIGINAL FULLSCREEN IMMERSIVE VIDEO) ─── */}
      <section className="relative h-screen flex items-center overflow-hidden">
        
        {/* Cinematic Video Background */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <div 
            className="absolute inset-0"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
            }}
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-80 scale-100 translate-y-[20%]"
              style={{ objectPosition: 'center top' }}
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          {/* Bottom gradient for text readability */}
          <div className="absolute bottom-0 left-0 right-0 h-[30%] z-[6] pointer-events-none bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent"></div>
        </motion.div>

        {/* Hero Content */}
        <div className="w-full max-w-[96%] mx-auto px-6 md:px-10 relative z-10 flex flex-col justify-center h-full pt-32">
          <div className="max-w-6xl">
            {/* Tag Line */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 ml-[60px]"
            >
              <span className="inline-flex items-center text-brandOrange font-mono text-sm md:text-base tracking-[0.4em] uppercase font-bold">
                --{t.tagline}--
              </span>
            </motion.div>

            {/* Main Title */}
            <h1 className="font-display font-black text-[clamp(2.5rem,7vw,8rem)] text-white uppercase leading-[0.85] tracking-[-0.02em] max-w-4xl relative z-20 pointer-events-none mix-blend-difference ml-[60px]">
              {[t.heroLine1, t.heroLine2, t.heroLine3].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.span
                    initial={{ y: "150%", rotateX: 60, filter: "blur(20px)", opacity: 0, scale: 1.1 }}
                    animate={{ y: 0, rotateX: 0, filter: "blur(0px)", opacity: 1, scale: 1 }}
                    transition={{ duration: 1.6, delay: 0.2 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className={`block drop-shadow-2xl ${i === 1 ? "font-serif italic font-normal tracking-normal text-[#f26522]" : "text-white"}`}
                  >
                    {line}
                  </motion.span>
                </div>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="mt-12 text-white/45 text-base md:text-lg font-light leading-[1.8] max-w-lg tracking-wide"
            >
              {t.heroDesc}
            </motion.p>

            {/* Main CTA with Scarcity */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.2 }}
              className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 ml-[60px]"
            >
              <Link href="/contact" className="hoverable flex items-center justify-center gap-2 bg-brandOrange text-white px-8 py-4 rounded-full text-[11px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brandOrange transition-all duration-500 shadow-[0_0_30px_rgba(242,101,34,0.3)]">
                {isEs ? "Agendar Demostración" : "Book a Demo"}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <div className="flex flex-col pt-1 sm:pt-2 px-2 text-center sm:text-left">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                  {isEs ? "Disponibilidad Limitada" : "Limited Availability"}
                </span>
                <span className="text-xs text-brandOrange font-mono mt-1 font-bold">
                  {isEs ? "* Solo 3 nuevos partners por trimestre" : "* Only 3 new partners per quarter"}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-30 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/50">{t.scroll}</span>
            <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
               <motion.div 
                 animate={{ y: ["-100%", "100%"] }} 
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
                 className="absolute top-0 left-0 w-full h-full bg-brandOrange"
               />
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="w-full border-y border-white/10 bg-brandOrange/5 py-4 overflow-hidden flex items-center whitespace-nowrap z-20 relative backdrop-blur-md">
         <Marquee speed={30} className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">
          {t.marquee1.map((item, i) => (
            <span key={i} className="mx-8 flex items-center gap-8">
              {item} <span className="w-1.5 h-1.5 bg-brandOrange rounded-full"></span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* SOCIAL PROOF METRICS BAR */}
      <section className="relative z-20 w-full bg-[#020617] border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="flex flex-col gap-3 pt-6 md:pt-0 hoverable">
            <span className="text-5xl md:text-6xl font-black text-white font-display tracking-tighter">50K+</span>
            <span className="text-[10px] font-mono text-brandOrange uppercase tracking-[0.2em]">{isEs ? "Horas de Video Procesadas" : "Video Hours Processed"}</span>
          </div>
          <div className="flex flex-col gap-3 pt-6 md:pt-0 hoverable">
            <span className="text-5xl md:text-6xl font-black text-white font-display tracking-tighter">94%</span>
            <span className="text-[10px] font-mono text-brandOrange uppercase tracking-[0.2em]">{isEs ? "Reducción en Tiempo de Análisis" : "Reduction in Analysis Time"}</span>
          </div>
          <div className="flex flex-col gap-3 pt-6 md:pt-0 hoverable">
            <span className="text-5xl md:text-6xl font-black text-white font-display tracking-tighter">&lt;200<span className="text-3xl text-white/50">ms</span></span>
            <span className="text-[10px] font-mono text-brandOrange uppercase tracking-[0.2em]">{isEs ? "Certeza Algorítmica Absoluta" : "Absolute Algorithmic Certainty"}</span>
          </div>
        </div>
      </section>

      {/* ─── BENTO GRID: STATS + EXPERTISE (CONSOLIDADO) ─── */}
      <section id="services" className="relative z-10 w-full bg-[#020617]">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10">
          
          {/* Lado Izquierdo: Bloque Masivo de Estadísticas */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-white/[0.02]">
            <div className="p-8 md:p-12 lg:p-16 border-b border-white/10 flex flex-col justify-center min-h-[300px]">
               <h3 className="font-display text-5xl md:text-6xl font-black uppercase mb-4 leading-[0.9]">
                 {isEs ? "Arquitectura" : "System"} <br/><span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>{isEs ? "del Sistema" : "Architecture"}</span>
               </h3>
               <p className="font-mono text-xs text-white/50 tracking-widest uppercase leading-relaxed mb-8">
                 {t.ourExpertise.join(" ")}
               </p>
               <div className="inline-flex items-center gap-3 bg-brandOrange/10 border border-brandOrange/30 text-brandOrange px-5 py-3 text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest w-fit">
                 <Bot className="w-4 h-4" />
                 {isEs ? "Integración Cero Fricción: Sin Hardware Adicional." : "Zero-Friction Integration: No Extra Hardware."}
               </div>
            </div>
            
            <div className="grid grid-cols-2 grid-rows-2 flex-grow">
              {t.stats.map((stat, i) => (
                <div key={i} className="p-8 border-b border-r border-white/10 flex flex-col justify-center text-center group hover:bg-brandOrange/5 transition-colors">
                  <span className="font-display text-4xl md:text-6xl font-black text-white group-hover:text-brandOrange transition-colors">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mt-3">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Derecho: Catálogo de Servicios Dinámico */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 bg-[#020617]">
            {t.services.map((service, idx) => {
              // Asignar un ícono dinámicamente basado en el índice
              const icons = [
                <LayoutTemplate key={0} className="w-6 h-6 text-white group-hover:text-brandOrange" />,
                <Cpu key={1} className="w-6 h-6 text-white group-hover:text-brandOrange" />,
                <Fingerprint key={2} className="w-6 h-6 text-white group-hover:text-brandOrange" />,
                <Activity key={3} className="w-6 h-6 text-white group-hover:text-brandOrange" />,
                <Brain key={4} className="w-6 h-6 text-white group-hover:text-brandOrange" />,
                <Video key={5} className="w-6 h-6 text-white group-hover:text-brandOrange" />,
                <Bot key={6} className="w-6 h-6 text-white group-hover:text-brandOrange" />,
              ];
              const Icon = icons[idx % icons.length];

              return (
                <div key={idx} className="p-8 md:p-10 border-b border-r border-white/10 flex flex-col justify-between hover:bg-brandOrange/5 transition-colors group">
                  <div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-8 border border-white/10 bg-white/5 group-hover:border-brandOrange group-hover:bg-brandOrange/10 transition-colors">
                      {Icon}
                    </div>
                    <h4 className="font-display text-2xl font-black uppercase mb-4 text-white leading-none">
                      {service.title}
                    </h4>
                  </div>
                  <p className="font-mono text-[10px] text-white/50 leading-relaxed uppercase tracking-[0.1em]">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═════ CINEMATIC DRONE SHOWCASE (MANTENIDO) ═════ */}
      <section className="bg-gradient-to-b from-[#020617] to-black relative w-full pt-10 pb-0">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5 }}
          className="w-full h-[80vh] md:h-[100vh] relative group hoverable"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 95%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 95%, transparent 100%)',
          }}
        >
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none"></div>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[2000ms] group-hover:scale-105"
          >
            <source src="/videos/Drone_dive_into_baseball_stadium_202607151954.mp4" type="video/mp4" />
          </video>
        </motion.div>
        {/* Desvanecimiento inferior suave hacia el siguiente bloque */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020617] to-transparent z-20 pointer-events-none"></div>
      </section>


      {/* ─── VERTICAL PROJECTS (EDITORIAL GRID) ─── */}
      <section id="projects" className="relative z-10 w-full bg-[#020617] py-24 md:py-32 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="flex flex-col items-center mb-20 text-center">
             <span className="font-mono text-[10px] font-bold text-brandOrange tracking-[0.3em] uppercase mb-4">{isEs ? "Innovación" : "Innovation"}</span>
             <h2 className="font-display text-5xl md:text-7xl font-black uppercase text-white leading-[0.9]">
               {isEs ? "Nuestro" : "Our"} <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}>{isEs ? "Ecosistema" : "Ecosystem"}</span>
             </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Project 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="group"
            >
              <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#020617] hoverable flex flex-col shadow-2xl">
                 <div className="h-[75%] relative overflow-hidden">
                   <div className="absolute inset-0 bg-brandOrange/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] z-30 mix-blend-color pointer-events-none"></div>
                   {/* Smooth Gradient Masks to fade/soften edges */}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/30 z-20 pointer-events-none"></div>
                   <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/20 via-transparent to-[#020617]/20 z-20 pointer-events-none"></div>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src="/images/articles/baseball_biomechanics_1785628048219.jpg" alt="Kinebase" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-1000" />
                 </div>
                 <div className="h-[25%] p-8 flex justify-between items-center bg-white/[0.01] border-t border-white/5 group-hover:bg-brandOrange/5 transition-colors">
                    <div>
                      <p className="font-mono text-[10px] text-brandOrange tracking-[0.3em] uppercase mb-2">01 — {t.biomechanics}</p>
                      <h3 className="font-display text-3xl md:text-4xl font-black uppercase text-white leading-[0.9]">Kinebase Pro</h3>
                    </div>
                    <Link href="/projects/kinebase" className="w-14 h-14 border border-white/10 flex items-center justify-center rounded-full hover:bg-brandOrange hover:border-brandOrange hover:text-[#020617] transition-all hoverable hover:rotate-45">
                       <ArrowUpRight className="w-5 h-5" />
                    </Link>
                 </div>
              </div>
            </motion.div>

            {/* Project 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="group lg:mt-32"
            >
              <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#020617] hoverable flex flex-col shadow-2xl">
                 <div className="h-[75%] relative overflow-hidden">
                   <div className="absolute inset-0 bg-brandOrange/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] z-30 mix-blend-color pointer-events-none"></div>
                   {/* Smooth Gradient Masks to fade/soften edges */}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/30 z-20 pointer-events-none"></div>
                   <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/20 via-transparent to-[#020617]/20 z-20 pointer-events-none"></div>
                   <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-1000">
                     <source src="/videos/smartphone_screen.mp4" type="video/mp4" />
                   </video>
                 </div>
                 <div className="h-[25%] p-8 flex justify-between items-center bg-white/[0.01] border-t border-white/5 group-hover:bg-brandOrange/5 transition-colors">
                    <div>
                      <p className="font-mono text-[10px] text-brandOrange tracking-[0.3em] uppercase mb-2">02 — {t.scouting}</p>
                      <h3 className="font-display text-3xl md:text-4xl font-black uppercase text-white leading-[0.9]">Scouting AI</h3>
                    </div>
                    <button className="px-6 py-3 border border-white/10 flex items-center justify-center rounded-sm hover:bg-white/10 transition-all cursor-not-allowed">
                       <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">{isEs ? "Próximamente" : "COMING SOON"}</span>
                    </button>
                 </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── LEAD MAGNET (WHITE PAPER CAPTURE) ─── */}
      <section className="relative z-10 w-full border-t border-b border-white/10 bg-brandOrange/5 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <span className="font-mono text-[10px] text-brandOrange tracking-[0.3em] uppercase font-bold mb-4 block">
            {isEs ? "Descarga Gratuita" : "Free Download"}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase text-white leading-tight mb-6">
            {isEs ? "Whitepaper 2026: Cinemática sin Marcadores" : "Whitepaper 2026: Markerless Kinematics"}
          </h2>
          <p className="font-mono text-sm md:text-base text-white/60 mb-10 max-w-2xl mx-auto">
            {isEs ? "Únete a más de 1,200 scouts y analistas que están descubriendo cómo los Datos y la Inteligencia Artificial están redefiniendo el paradigma del scouting análogo." : "Join over 1,200 scouts and analysts discovering how Data and AI are redefining the analog scouting paradigm."}
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder={isEs ? "Tu correo corporativo..." : "Your corporate email..."}
              className="bg-[#020617]/80 border border-white/20 text-white px-6 py-4 outline-none focus:border-brandOrange transition-colors w-full sm:w-2/3 font-mono text-xs rounded-none"
              required
            />
            <button type="submit" className="hoverable bg-brandOrange text-white px-8 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brandOrange transition-all duration-300 shadow-[0_0_20px_rgba(242,101,34,0.2)]">
              {isEs ? "Descargar" : "Download"}
            </button>
          </form>
          <span className="block mt-6 text-[9px] font-mono text-white/40 uppercase tracking-widest">
            {isEs ? "100% valor puro. Cero spam. Date de baja cuando quieras." : "100% pure value. Zero spam. Unsubscribe anytime."}
          </span>
        </div>
      </section>

      {/* ─── FOOTER CORPORATIVO ─── */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-[#020617] pt-20 pb-10 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
            <div>
              <div className="font-display font-black text-xl md:text-2xl tracking-widest uppercase mb-4">
                3tree digital <span className="text-brandOrange">Sport IA</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {isEs ? "Sports Intelligence Company" : "Sports Intelligence Company"}
              </p>
            </div>
            
            <SocialLinks className="gap-6" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
              © {new Date().getFullYear()} 3Tree Digital. {isEs ? "Todos los derechos reservados." : "All rights reserved."}
            </p>
            
            <div className="flex flex-wrap gap-4 md:gap-8 justify-center font-mono text-[10px] font-bold uppercase tracking-widest text-white/50">
              <Link href="/terms" className="hover:text-brandOrange transition-colors hoverable">{isEs ? "Términos de Servicio" : "Terms of Service"}</Link>
              <Link href="/privacy" className="hover:text-brandOrange transition-colors hoverable">{isEs ? "Políticas de Privacidad" : "Privacy Policy"}</Link>
              <Link href="/cookies" className="hover:text-brandOrange transition-colors hoverable">{isEs ? "Cookies" : "Cookies"}</Link>
            </div>
          </div>
        </div>
      </footer>
      
    </main>
  );
}
