"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLang } from "./i18n";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  ChevronRight, 
  Globe, 
  Activity, 
  Brain, 
  Video, 
  Bot, 
  Volume2, 
  VolumeX, 
  Play, 
  Headphones, 
  Radio, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Layers,
  BarChart3,
  Cpu
} from "lucide-react";
import { SocialLinks } from "@/components/ui/SocialLinks";
import CustomCursor from "@/components/CustomCursor";
import Lenis from "lenis";

/* ────────────────────────────────────────────────────────────────────────── */
/*  MOUSE SPOTLIGHT (APPLE AMBIENT GLOW)                                      */
/* ────────────────────────────────────────────────────────────────────────── */
function MouseSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 35, stiffness: 180 });
  const smoothY = useSpring(mouseY, { damping: 35, stiffness: 180 });

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
        width: 700,
        height: 700,
        marginLeft: -350,
        marginTop: -350,
        background: "radial-gradient(circle, rgba(242,101,34,0.08) 0%, rgba(242,101,34,0.02) 40%, transparent 70%)",
        filter: "blur(50px)",
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  ANIMATED COUNTER                                                          */
/* ────────────────────────────────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────────────────────────────────── */
/*  MARQUEE                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */
function Marquee({ children, speed = 35, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
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

/* ────────────────────────────────────────────────────────────────────────── */
/*  MAIN PAGE COMPONENT (APPLE DESIGN SYSTEM)                                 */
/* ────────────────────────────────────────────────────────────────────────── */
export default function MainContent() {
  const { t, lang, toggleLang } = useLang();
  const isEs = lang === "es";

  // Video Audio State & Control
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Lenis Smooth Scrolling Init
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const toggleHeroAudio = () => {
    if (!heroVideoRef.current) return;
    const newMuted = !isHeroMuted;
    heroVideoRef.current.muted = newMuted;
    if (!newMuted) {
      heroVideoRef.current.volume = 0.85;
    }
    setIsHeroMuted(newMuted);
  };

  const toggleHeroPlay = () => {
    if (!heroVideoRef.current) return;
    if (isPlaying) {
      heroVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      heroVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <main className="relative bg-[#000000] text-white selection:bg-[#f26522] selection:text-white font-sans antialiased overflow-x-hidden min-h-screen">
      <CustomCursor />
      <MouseSpotlight />

      {/* ─── 1. APPLE PRO FLOATING NAVBAR ─── */}
      <header className="fixed top-6 left-0 right-0 z-50 px-4 md:px-8 max-w-6xl mx-auto flex items-center justify-between">
        <motion.div 
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#0a0a0c]/70 backdrop-blur-2xl border border-white/[0.12] rounded-full px-5 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hoverable flex-shrink-0 group">
            <div className="h-8 w-28 md:w-36 flex items-center relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/logo-3tree.png" alt="3Tree Digital" className="h-full w-full object-contain object-left group-hover:opacity-90 transition-opacity" />
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-medium text-white/60 tracking-tight">
            <Link href="#services" className="hover:text-white transition-colors">
              {isEs ? "Servicios" : "Services"}
            </Link>
            <Link href="/projects/kinebase" className="hover:text-white transition-colors flex items-center gap-1">
              Kinebase Pro <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#f26522]/20 text-[#f26522] border border-[#f26522]/30">AI</span>
            </Link>
            <Link href="/in-the-play" className="hover:text-white transition-colors">
              {isEs ? "Noticiero & Media" : "News & Media"}
            </Link>
            <Link href="/podcast" className="hover:text-white transition-colors">
              {isEs ? "Podcast Studio" : "Podcast"}
            </Link>
            <Link href="/journal" className="hover:text-white transition-colors">
              {isEs ? "Diario" : "Journal"}
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              {isEs ? "Quiénes Somos" : "About"}
            </Link>
          </nav>

          {/* Right Actions (Language & Pill CTA) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 hover:border-white/20"
              aria-label="Cambiar idioma"
            >
              <Globe className="w-3.5 h-3.5 text-white/50" />
              <span>{lang === 'en' ? 'ES' : 'EN'}</span>
            </button>
            
            <Link 
              href="/contact" 
              className="flex items-center gap-1.5 bg-white text-black hover:bg-white/90 text-xs font-semibold px-4 md:px-5 py-1.5 rounded-full transition-all duration-300 shadow-[0_2px_15px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isEs ? "Iniciar Proyecto" : "Start Project"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </header>

      {/* ─── 2. APPLE HERO SECTION ─── */}
      <section className="relative pt-36 md:pt-44 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Apple Category Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs text-white/80 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#f26522] animate-pulse"></span>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-white/70">
            {isEs ? "LABORATORIO DE INTELIGENCIA DEPORTIVA" : "SPORTS INTELLIGENCE LAB"}
          </span>
        </motion.div>

        {/* Main Apple Pro Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.92] max-w-5xl mx-auto"
        >
          <span className="bg-gradient-to-b from-white via-white/95 to-white/60 bg-clip-text text-transparent">
            {isEs ? "Diseñamos el futuro" : "Designing the future"}
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#f26522] via-[#ff8a4c] to-[#f26522] bg-clip-text text-transparent font-serif italic normal-case tracking-normal">
            {isEs ? "de los deportes." : "of sports."}
          </span>
        </motion.h1>

        {/* Apple Balanced Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-normal leading-relaxed tracking-tight"
        >
          {isEs 
            ? "Fusionamos visión computacional, biomecánica cuántica y arquitectura de software de alto rendimiento para atletas de élite y franquicias globales."
            : "We fuse computer vision, quantum biomechanics, and high-performance software architecture for elite athletes and global franchises."}
        </motion.p>

        {/* Apple Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            href="/contact" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#f26522] hover:bg-[#ff7a3d] text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(242,101,34,0.35)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{isEs ? "Agendar Demostración" : "Book a Demo"}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/projects/kinebase" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.12] text-white/90 hover:text-white border border-white/[0.12] font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 backdrop-blur-md"
          >
            <span>{isEs ? "Explorar Kinebase Pro" : "Explore Kinebase Pro"}</span>
            <ChevronRight className="w-4 h-4 text-white/50" />
          </Link>
        </motion.div>

        {/* ─── 3. APPLE CINEMATIC THEATER VIEWPORT (CLEAN HERO VIDEO) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-20 w-full max-w-6xl relative rounded-3xl md:rounded-[2.5rem] border border-white/[0.15] bg-[#0a0a0c]/80 backdrop-blur-3xl p-2.5 md:p-3.5 shadow-[0_25px_120px_rgba(0,0,0,0.9)] overflow-hidden group"
        >
          {/* Inner Video Container */}
          <div className="relative w-full aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden bg-black">
            <video 
              ref={heroVideoRef}
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover scale-[1.02] transition-transform duration-1000 group-hover:scale-100"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>

            {/* Apple Subtle Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

            {/* Top Left Floating Telemetry Pill */}
            <div className="absolute top-4 md:top-6 left-4 md:left-6 z-20 flex items-center gap-2.5 bg-black/60 backdrop-blur-xl border border-white/10 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
              <span className="font-mono text-[10px] font-bold text-white/90 tracking-wider uppercase">
                KINEBASE PRO · 98 MPH VELO · 94 ELITE
              </span>
            </div>

            {/* Bottom Right Apple-Style Media Controls */}
            <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 z-20 flex items-center gap-2">
              {/* Play/Pause Pill */}
              <button 
                onClick={toggleHeroPlay}
                className="bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-xl border border-white/10 px-3.5 py-2 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-2"
                aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
              >
                <Play className={`w-3 h-3 ${isPlaying ? "fill-white text-white" : "text-white/60"}`} />
                <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
              </button>

              {/* Audio Unmute/Mute Pill */}
              <button 
                onClick={toggleHeroAudio}
                className="bg-black/60 hover:bg-[#f26522] text-white/80 hover:text-white backdrop-blur-xl border border-white/10 hover:border-[#f26522] px-3.5 py-2 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-2"
                aria-label={isHeroMuted ? "Activar sonido" : "Silenciar sonido"}
              >
                {isHeroMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white/60" />
                    <span>{isEs ? "ACTIVAR AUDIO" : "UNMUTE AUDIO"}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-white fill-current animate-pulse" />
                    <span className="text-white">{isEs ? "AUDIO ACTIVO" : "AUDIO ON"}</span>
                    <span className="flex items-center gap-0.5 ml-1">
                      <span className="w-0.5 h-2 bg-white rounded-full animate-pulse"></span>
                      <span className="w-0.5 h-3.5 bg-white rounded-full animate-pulse delay-75"></span>
                      <span className="w-0.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></span>
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 4. APPLE LOGO MARQUEE / TRUST TICKER ─── */}
      <div className="w-full border-y border-white/[0.08] bg-[#050507] py-4 overflow-hidden">
        <Marquee speed={35} className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 font-semibold">
          {t.marquee1.map((item, i) => (
            <span key={i} className="mx-8 flex items-center gap-8">
              {item} <span className="w-1.5 h-1.5 bg-[#f26522] rounded-full"></span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ─── 5. APPLE PRO METRICS STRIP ─── */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          <div className="flex flex-col gap-2 pt-6 md:pt-0 md:pr-8">
            <span className="text-5xl md:text-6xl font-black text-white tracking-tight">50K+</span>
            <span className="text-xs font-mono text-[#f26522] uppercase tracking-[0.15em] font-semibold">
              {isEs ? "Horas de Video Procesadas" : "Video Hours Processed"}
            </span>
            <p className="text-xs text-white/40 mt-1">
              {isEs ? "Entrenamiento computacional con más de 12 ligas profesionales." : "Computational training across 12+ pro leagues."}
            </p>
          </div>
          
          <div className="flex flex-col gap-2 pt-6 md:pt-0 md:px-8">
            <span className="text-5xl md:text-6xl font-black text-white tracking-tight">94%</span>
            <span className="text-xs font-mono text-[#f26522] uppercase tracking-[0.15em] font-semibold">
              {isEs ? "Aceleración en Scouting" : "Scouting Speed Acceleration"}
            </span>
            <p className="text-xs text-white/40 mt-1">
              {isEs ? "De días de revisión manual a informes automatizados en segundos." : "From days of manual review to reports in seconds."}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-6 md:pt-0 md:pl-8">
            <span className="text-5xl md:text-6xl font-black text-white tracking-tight">&lt;200<span className="text-2xl text-white/40">ms</span></span>
            <span className="text-xs font-mono text-[#f26522] uppercase tracking-[0.15em] font-semibold">
              {isEs ? "Latencia en Tiempo Real" : "Real-time Telemetry Latency"}
            </span>
            <p className="text-xs text-white/40 mt-1">
              {isEs ? "Tracking visual instantáneo sin marcadores corporales." : "Instant visual tracking without body markers."}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 6. APPLE BENTO GRID (CAPABILITIES & ECOSYSTEM) ─── */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-[#f26522] tracking-[0.25em] uppercase block mb-3">
            {isEs ? "ECOSISTEMA TECNOLÓGICO" : "TECHNOLOGICAL ECOSYSTEM"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {isEs ? "Potencia analítica sin límites." : "Limitless analytical power."}
          </h2>
          <p className="mt-4 text-white/60 text-base max-w-xl mx-auto">
            {isEs 
              ? "Herramientas diseñadas con precisión milimétrica para dominar el rendimiento atlético moderno."
              : "Tools engineered with millimeter precision to dominate modern athletic performance."}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1 (Large - Kinebase Biomechanics) */}
          <div className="md:col-span-8 rounded-3xl bg-[#0a0a0c] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-500 p-8 md:p-12 relative overflow-hidden flex flex-col justify-between group shadow-xl">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#f26522]/10 border border-[#f26522]/20 flex items-center justify-center text-[#f26522] mb-8">
                <Activity className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] font-bold text-[#f26522] tracking-widest uppercase block mb-2">01 — BIOMECÁNICA 3D</span>
              <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
                Kinebase Pro Platform
              </h3>
              <p className="text-sm md:text-base text-white/60 max-w-lg leading-relaxed">
                {isEs 
                  ? "Análisis cinemático sin sensores invasivos. Extracción de métricas de velocidad, rotación y fatiga muscular directamente desde cualquier cámara."
                  : "Sensorless kinematic analysis. Extract velocity, spin rate, and muscle fatigue metrics directly from standard broadcast cameras."}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-white/[0.08] flex items-center justify-between relative z-10">
              <span className="text-xs font-mono text-white/40">Next.js 14 · Computer Vision · PyTorch</span>
              <Link href="/projects/kinebase" className="flex items-center gap-2 text-xs font-semibold text-[#f26522] hover:text-white transition-colors">
                <span>{isEs ? "Ver Caso de Estudio" : "View Case Study"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Subtle Gradient Glow */}
            <div className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-tl from-[#f26522]/10 to-transparent pointer-events-none rounded-full blur-3xl group-hover:from-[#f26522]/15 transition-all"></div>
          </div>

          {/* Bento Card 2 (Media & Noticiero TV) */}
          <div className="md:col-span-4 rounded-3xl bg-[#0a0a0c] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-500 p-8 md:p-10 relative overflow-hidden flex flex-col justify-between group shadow-xl">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white mb-8">
                <Radio className="w-6 h-6 text-[#f26522]" />
              </div>
              <span className="font-mono text-[10px] font-bold text-[#f26522] tracking-widest uppercase block mb-2">02 — BROADCAST & MEDIA</span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">
                Noticiero 3Sport
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {isEs 
                  ? "Transmisiones en vivo, marcadores en tiempo real (NFL, MLB, F1) y cobertura de periodismo deportivo de alto impacto."
                  : "Live broadcasting, real-time scoreboards (NFL, MLB, F1), and high-impact sports journalism coverage."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between relative z-10">
              <span className="text-xs font-mono text-white/40">Live TV Hub</span>
              <Link href="/in-the-play" className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#f26522] transition-colors">
                <span>{isEs ? "Ver Noticiero" : "Watch Broadcast"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 3 (Multimedia & Podcast Suite) */}
          <div className="md:col-span-4 rounded-3xl bg-[#0a0a0c] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-500 p-8 md:p-10 relative overflow-hidden flex flex-col justify-between group shadow-xl">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white mb-8">
                <Headphones className="w-6 h-6 text-[#f26522]" />
              </div>
              <span className="font-mono text-[10px] font-bold text-[#f26522] tracking-widest uppercase block mb-2">03 — PODCAST & AUDIO</span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">
                Podcast Studio
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {isEs 
                  ? "Episodios descargables en MP3, sincronización directa con Spotify y YouTube, y debates con scouts profesionales."
                  : "Downloadable MP3 episodes, direct Spotify & YouTube sync, and debates with pro scouts."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between relative z-10">
              <span className="text-xs font-mono text-white/40">Spotify & YouTube</span>
              <Link href="/podcast" className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#f26522] transition-colors">
                <span>{isEs ? "Escuchar" : "Listen Now"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 4 (Large - Scouting AI & Computer Vision) */}
          <div className="md:col-span-8 rounded-3xl bg-[#0a0a0c] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-500 p-8 md:p-12 relative overflow-hidden flex flex-col justify-between group shadow-xl">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white mb-8">
                <Brain className="w-6 h-6 text-[#f26522]" />
              </div>
              <span className="font-mono text-[10px] font-bold text-[#f26522] tracking-widest uppercase block mb-2">04 — SCOUTING INTELIGENTE</span>
              <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
                Algoritmos Predictivos de Rendimiento
              </h3>
              <p className="text-sm md:text-base text-white/60 max-w-lg leading-relaxed">
                {isEs 
                  ? "Detección de prospectos y análisis comparativo con jugadores históricos de las Grandes Ligas mediante modelos de aprendizaje profundo."
                  : "Prospect detection and comparative analysis against historical MLB data using deep learning models."}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-white/[0.08] flex items-center justify-between relative z-10">
              <span className="text-xs font-mono text-white/40">Neural Pose Estimation</span>
              <Link href="/journal" className="flex items-center gap-2 text-xs font-semibold text-[#f26522] hover:text-white transition-colors">
                <span>{isEs ? "Leer Diario Técnico" : "Read Technical Journal"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 7. APPLE CINEMATIC STADIUM VIDEO SHOWCASE ─── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="relative w-full h-[50vh] md:h-[70vh] rounded-3xl md:rounded-[2.5rem] border border-white/[0.1] overflow-hidden group shadow-2xl bg-black">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover scale-[1.03] transition-transform duration-1000 group-hover:scale-100"
          >
            <source src="/videos/Drone_dive_into_baseball_stadium_202607151954.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-8 md:p-14">
            <span className="font-mono text-xs font-bold text-[#f26522] tracking-[0.25em] uppercase mb-2">
              {isEs ? "ESCENARIO DE ALTO RENDIMIENTO" : "HIGH-PERFORMANCE ARENA"}
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight max-w-xl">
              {isEs ? "La tecnología que transforma cada jugada en ventaja competitiva." : "The technology transforming every play into competitive edge."}
            </h3>
          </div>
        </div>
      </section>

      {/* ─── 8. APPLE WHITEPAPER LEAD MAGNET ─── */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-b from-[#0e0e12] to-[#060608] border border-white/[0.1] p-10 md:p-16 relative overflow-hidden shadow-2xl">
          <span className="font-mono text-xs font-bold text-[#f26522] tracking-[0.25em] uppercase block mb-3">
            {isEs ? "DESCARGA EXCLUSIVA" : "EXCLUSIVE DOWNLOAD"}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            {isEs ? "Whitepaper 2026: Cinemática sin Marcadores" : "Whitepaper 2026: Markerless Kinematics"}
          </h2>
          <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            {isEs 
              ? "Descubra cómo los datos biomecánicos y la IA están sustituyendo el scouting tradicional en las organizaciones deportivas de élite."
              : "Discover how biomechanical data and AI are replacing traditional scouting across elite sports organizations."}
          </p>

          <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder={isEs ? "Correo corporativo..." : "Corporate email..."}
              className="bg-white/[0.05] border border-white/[0.15] text-white px-5 py-3.5 rounded-full text-xs outline-none focus:border-[#f26522] transition-colors w-full"
              required
            />
            <button 
              type="submit" 
              className="bg-[#f26522] hover:bg-[#ff7a3d] text-white text-xs font-semibold px-7 py-3.5 rounded-full uppercase tracking-wider transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              {isEs ? "Descargar" : "Download"}
            </button>
          </form>
          
          <span className="block mt-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
            {isEs ? "100% Valor Puro · Cero Spam" : "100% Pure Value · Zero Spam"}
          </span>
        </div>
      </section>

      {/* ─── 9. APPLE FOOTER ─── */}
      <footer className="border-t border-white/[0.08] bg-[#000000] py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="font-display font-black text-xl tracking-wider uppercase">
              3Tree Digital <span className="text-[#f26522]">Sports AI</span>
            </div>
            <p className="text-xs text-white/40 mt-1 font-mono uppercase tracking-widest">
              Sports Intelligence & Biomechanics Architecture
            </p>
          </div>
          <SocialLinks className="gap-5" />
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/40 font-mono">
          <p>© {new Date().getFullYear()} 3Tree Digital LLC. {isEs ? "Todos los derechos reservados." : "All rights reserved."}</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">{isEs ? "Términos" : "Terms"}</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">{isEs ? "Privacidad" : "Privacy"}</Link>
            <Link href="/contact" className="hover:text-white transition-colors">{isEs ? "Contacto" : "Contact"}</Link>
          </div>
        </div>
      </footer>
      
    </main>
  );
}
