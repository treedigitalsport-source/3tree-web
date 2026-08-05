"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLang } from "./i18n";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, LayoutTemplate, Cpu, Fingerprint, ChevronDown, Play, Globe, Activity, Brain, Video, Bot } from "lucide-react";
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
  const horizontalRef = useRef<HTMLDivElement>(null);

  /* Lenis smooth scroll */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  /* Scroll values for the Parallax Hero Video */
  const { scrollYProgress: heroScroll } = useScroll();
  const heroY = useTransform(heroScroll, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(heroScroll, [0, 0.3], [1, 0.3]);

  /* Smoothed scroll values for the Horizontal Projects */
  const { scrollYProgress } = useScroll({ 
    target: horizontalRef,
    offset: ["start start", "end end"]
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20, mass: 0.2 });
  const xOffset = useTransform(smoothProgress, [0, 1], ["0%", "-45%"]);

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
            <img src="/logo-3tree.png" alt="3Tree Digital" className="h-full w-full object-contain object-left" />
          </div>
        </div>

        <div className="hidden lg:flex gap-4 xl:gap-8 text-[10px] xl:text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-white/50 items-center">
          {t.nav.map((item, i) => {
            const sectionIds = ["services", "projects", "podcast", "journal", "impact", "in-the-play", "about", "contact"];
            let targetUrl = `#${sectionIds[i]}`;
            if (sectionIds[i] === "projects") targetUrl = "/projects/kinebase";
            if (sectionIds[i] === "podcast") targetUrl = "/podcast";
            if (sectionIds[i] === "journal") targetUrl = "/journal";
            if (sectionIds[i] === "in-the-play") targetUrl = "/in-the-play";
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

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLang}
            className="hoverable flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-full bg-white/[0.03] backdrop-blur-md hover:border-brandOrange/40"
          >
            <Globe className="w-3 h-3 text-white/60" /> {lang === 'en' ? 'ES' : 'EN'}
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
              className="w-full h-full object-cover opacity-70 mix-blend-screen scale-100 translate-y-[20%]"
              style={{ objectPosition: 'center top' }}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
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

      {/* ─── BENTO GRID: STATS + EXPERTISE (CONSOLIDADO) ─── */}
      <section id="services" className="relative z-10 w-full bg-[#020617]">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10">
          
          {/* Lado Izquierdo: Bloque Masivo de Estadísticas */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-white/[0.02]">
            <div className="p-8 md:p-12 lg:p-16 border-b border-white/10 flex flex-col justify-center min-h-[300px]">
               <h3 className="font-display text-5xl md:text-6xl font-black uppercase mb-4 leading-[0.9]">
                 System <br/><span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>Architecture</span>
               </h3>
               <p className="font-mono text-xs text-white/50 tracking-widest uppercase leading-relaxed">
                 {t.ourExpertise.join(" ")}
               </p>
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
            <source src="/Drone_dive_into_baseball_stadium_202607151954.mp4" type="video/mp4" />
          </video>
        </motion.div>
        {/* Desvanecimiento inferior suave hacia el siguiente bloque */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020617] to-transparent z-20 pointer-events-none"></div>
      </section>


      {/* ─── VERTICAL PROJECTS (EDITORIAL GRID) ─── */}
      <section id="projects" className="relative z-10 w-full bg-[#020617] py-24 md:py-32 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="flex flex-col items-center mb-20 text-center">
             <span className="font-mono text-[10px] font-bold text-brandOrange tracking-[0.3em] uppercase mb-4">Innovation</span>
             <h2 className="font-display text-5xl md:text-7xl font-black uppercase text-white leading-[0.9]">
               Our <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}>Ecosystem</span>
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
              <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden border border-white/10 bg-black hoverable flex flex-col">
                 <div className="h-[75%] relative overflow-hidden">
                   <div className="absolute inset-0 bg-brandOrange/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] z-10 mix-blend-color pointer-events-none"></div>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src="/baseball_biomechanics_1785628048219.jpg" alt="Kinebase" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                 </div>
                 <div className="h-[25%] p-8 flex justify-between items-center bg-white/[0.02] border-t border-white/10 group-hover:bg-brandOrange/5 transition-colors">
                    <div>
                      <p className="font-mono text-[10px] text-brandOrange tracking-[0.3em] uppercase mb-2">01 — {t.biomechanics}</p>
                      <h3 className="font-display text-3xl md:text-4xl font-black uppercase text-white leading-[0.9]">Kinebase Pro</h3>
                    </div>
                    <Link href="/projects/kinebase" className="w-14 h-14 border border-white/20 flex items-center justify-center rounded-full hover:bg-brandOrange hover:border-brandOrange hover:text-[#020617] transition-all hoverable hover:rotate-45">
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
              <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden border border-white/10 bg-black hoverable flex flex-col">
                 <div className="h-[75%] relative overflow-hidden">
                   <div className="absolute inset-0 bg-brandOrange/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] z-10 mix-blend-color pointer-events-none"></div>
                   <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000">
                     <source src="/smartphone_screen.mp4" type="video/mp4" />
                   </video>
                 </div>
                 <div className="h-[25%] p-8 flex justify-between items-center bg-white/[0.02] border-t border-white/10 group-hover:bg-brandOrange/5 transition-colors">
                    <div>
                      <p className="font-mono text-[10px] text-brandOrange tracking-[0.3em] uppercase mb-2">02 — {t.scouting}</p>
                      <h3 className="font-display text-3xl md:text-4xl font-black uppercase text-white leading-[0.9]">Scouting AI</h3>
                    </div>
                    <button className="px-6 py-3 border border-white/20 flex items-center justify-center rounded-none hover:bg-white/10 transition-all cursor-not-allowed">
                       <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">SOON</span>
                    </button>
                 </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── IN THE PLAY (NOTICIERO DEPORTIVO) ─── */}
      <section id="in-the-play" className="relative z-10 w-full border-b border-white/10 bg-[#020617] pt-8 pb-24 md:pt-10 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <span className="w-fit font-mono text-[10px] font-bold tracking-[0.3em] uppercase bg-brandOrange text-[#020617] px-4 py-2 mb-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-[#020617] rounded-full animate-pulse"></span> {t.liveFeed}
              </span>
              
              <h3 className="font-display text-5xl md:text-7xl font-black uppercase leading-[0.85] text-white mb-6">
                 <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}>{t.inThePlayTitle}</span>
              </h3>
              
              <p className="font-mono text-sm md:text-base text-white/50 leading-relaxed max-w-md mb-12">
                 {t.uploadDesc}
              </p>
              
              <Link href="/in-the-play" className="hoverable w-fit inline-flex items-center gap-4 bg-white/5 border border-white/20 text-white px-8 py-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brandOrange hover:text-[#020617] hover:border-brandOrange transition-colors">
                <Play className="w-4 h-4" /> {t.uploadYourPlay}
              </Link>
            </div>
            
            <div className="order-1 lg:order-2 relative border border-white/10 bg-black aspect-video lg:aspect-square overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%)] bg-[length:10px_10px] pointer-events-none z-10"></div>
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen grayscale group-hover:grayscale-0 transition-all duration-[2s] scale-105 group-hover:scale-100">
                <source src="/Corredor_de_fútbol_americano_en_202608051848.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>
            </div>

          </div>
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
                {isEs ? "Empresa Sport AI" : "Sport AI Company"}
              </p>
            </div>
            
            <div className="flex gap-6">
              {/* Instagram */}
              <a href="https://instagram.com/3treedigital" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-brandOrange hover:border-brandOrange transition-all hoverable">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@3treedigital" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-brandOrange hover:border-brandOrange transition-all hoverable">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* X (Twitter) */}
              <a href="https://x.com/3treedigital" target="_blank" rel="noopener noreferrer" aria-label="X" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-brandOrange hover:border-brandOrange transition-all hoverable">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Truth Social (Minimal T) */}
              <a href="https://truthsocial.com/@3treedigital" target="_blank" rel="noopener noreferrer" aria-label="Truth Social" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-brandOrange hover:border-brandOrange transition-all hoverable">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5.5 6.5h13v3.5h-4.5v8.5h-4v-8.5h-4.5z" />
                </svg>
              </a>
              {/* Pinterest */}
              <a href="https://pinterest.com/3treedigital" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-brandOrange hover:border-brandOrange transition-all hoverable">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.622 0 12.017 0z" />
                </svg>
              </a>
            </div>
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
