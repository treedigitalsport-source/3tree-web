"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLang } from "./i18n";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, LayoutTemplate, Cpu, Fingerprint, Globe, Activity, Brain, Video, Bot, Menu, X, ChevronDown, BookOpen, Clock, Sparkles } from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import CustomCursor from "@/components/CustomCursor";
import { aiArticles, neilArticles } from "@/lib/articlesData";


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
/*  ROTATING HERO VERB (DYNAMIC ANIMATED "WE DESIGN")                         */
/* ══════════════════════════════════════════════════════════════════════════ */
function RotatingHeroVerb({ isEs }: { isEs: boolean }) {
  const wordsEn = ["DESIGN", "ENGINEER", "ACCELERATE", "INNOVATE", "POWER"];
  const wordsEs = ["DISEÑAMOS", "CREAMOS", "IMPULSAMOS", "INNOVAMOS", "POTENCIAMOS"];
  const words = isEs ? wordsEs : wordsEn;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-4 md:gap-x-6">
      {!isEs && (
        <span className="text-white drop-shadow-2xl">WE</span>
      )}
      <span className="relative inline-flex overflow-hidden h-[1.12em] align-baseline">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index % words.length] + (isEs ? "-es" : "-en")}
            initial={{ y: "100%", opacity: 0, filter: "blur(12px)", rotateX: -40 }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)", rotateX: 0 }}
            exit={{ y: "-100%", opacity: 0, filter: "blur(12px)", rotateX: 40 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]"
          >
            {words[index % words.length]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE COMPONENT                                                       */
/* ══════════════════════════════════════════════════════════════════════════ */
export default function MainContent() {
  const { t, lang, toggleLang } = useLang();
  const isEs = lang === "es";

  // Form Lead Magnet State
  const [leadEmail, setLeadEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");



  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;
    setLeadStatus("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLeadStatus("success");
      setLeadEmail("");
    } catch {
      setLeadStatus("error");
    }
  };



  // Scroll-aware header state
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav[0], href: "/#services" },
    { label: t.nav[1], href: "/#projects" },
    { label: t.nav[2], href: "/journal" },
    { label: t.nav[3], href: "/in-the-play" },
    { label: t.nav[4], href: "/impact" },
    { label: t.nav[5], href: "/about" },
  ];

  return (
    <main className="relative bg-[#020617] text-white selection:bg-brandOrange selection:text-white font-sans">
      <CustomCursor />
      <MouseSpotlight />

      {/* Grid Pattern Background - Only applied to structural sections, not video hero */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* ─── HEADER ─── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "py-2.5 bg-[#020617]/90 backdrop-blur-xl shadow-2xl"
            : "py-3.5 md:py-4 bg-gradient-to-b from-[#020617]/90 via-[#020617]/40 to-transparent"
        }`}
      >
        {/* Soft Diffused Horizontal Divider Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none opacity-80" />

        <div className="w-full px-6 md:px-12 lg:px-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            {/* Clickable Brand Responsive Logo (Original Design) */}
            <Link href="/" className="flex items-center hoverable group z-50 shrink-0">
              <div className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto flex items-center relative transition-all duration-300 group-hover:scale-[1.02]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/icons/logo-3tree.png" 
                  alt="3Tree Digital" 
                  className="h-full w-auto max-h-24 max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] object-contain object-left drop-shadow-[0_4px_25px_rgba(0,0,0,0.85)] filter brightness-105" 
                />
              </div>
            </Link>

            {/* Soft Diffused Gradient Vertical Divider Line */}
            <div className="hidden lg:block h-9 w-[1px] bg-gradient-to-b from-transparent via-white/[0.1] to-transparent blur-[0.4px] pointer-events-none"></div>
          </div>

          {/* Desktop Navigation Links (Posición prominente, grande y clara) */}
          <div className="hidden lg:flex gap-6 xl:gap-9 text-xs xl:text-sm font-mono font-extrabold tracking-widest uppercase text-white/90 items-center">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group/nav whitespace-nowrap">
                <Link href={link.href} className="hoverable hover:text-brandOrange transition-colors duration-300 flex items-center py-1">
                  {link.label}
                </Link>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brandOrange group-hover/nav:w-full transition-all duration-300"></span>
              </div>
            ))}
          </div>

          {/* Desktop Header Actions */}
          <div className="hidden lg:flex items-center gap-2.5 md:gap-3 shrink-0">
            <button 
              onClick={toggleLang}
              className="group hoverable flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors px-3 py-1.5 border border-white/15 rounded-full bg-white/[0.04] backdrop-blur-md hover:border-brandOrange/40"
            >
              <Globe className="w-3 h-3 text-white/70 group-hover:text-brandOrange group-hover:rotate-180 transition-all duration-700 ease-in-out" /> {lang === 'en' ? 'ES' : 'EN'}
            </button>
            
            <Link href="/contact" className="hoverable flex items-center gap-1.5 bg-brandOrange text-white px-5 md:px-6 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-white hover:text-brandOrange transition-all duration-300 shadow-md shadow-brandOrange/25">
              {t.cta} <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile Hamburger & Lang Button */}
          <div className="flex lg:hidden items-center gap-2 z-50">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-white/80 px-2.5 py-1.5 border border-white/10 rounded-full bg-white/[0.05]"
            >
              <Globe className="w-2.5 h-2.5 text-white/60" /> {lang === 'en' ? 'ES' : 'EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-md flex items-center justify-center text-white hover:text-brandOrange hover:border-brandOrange/40 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 w-full bg-[#020617]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-6 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col gap-4 font-mono text-xs font-bold uppercase tracking-[0.2em]">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/[0.03] hover:text-brandOrange transition-all flex items-center justify-between text-white/70"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/30" />
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-brandOrange text-white py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brandOrange transition-all shadow-xl shadow-brandOrange/25"
                >
                  {t.cta} <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ─── HERO SECTION (ABSOLUTE FULLSCREEN IMMERSIVE VIDEO) ─── */}
      <section className="relative min-h-screen w-full flex items-center overflow-hidden">

        {/* Capa 1: Video Hero Background — Scouts Béisbol en el Terreno (Bajado para encuadre cinematográfico y ocultar bordes inferiores) */}
        <video
          className="absolute inset-0 w-full h-full object-cover object-[center_26%] translate-y-10 sm:translate-y-14 md:translate-y-16 lg:translate-y-20 scale-[1.08] z-0 opacity-100 filter brightness-[1.04] contrast-[1.04] saturate-[1.06] pointer-events-none transition-transform duration-700"
          src="/videos/scouts_beisbol_hero_clean_v2.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
        />

        {/* Capa 2: Iluminación y Viñeta Cinematográfica Suave (Sin desenfoques que nublen el video) */}
        {/* Sombra lateral suave para lectura perfecta del texto sin tapar el scout ni la interfaz holográfica */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#020617]/85 via-[#020617]/30 via-45% to-transparent pointer-events-none" />
        {/* Transición suave hacia la siguiente sección */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#020617] via-[#020617]/20 via-15% to-transparent pointer-events-none" />
        {/* Despeje sutil superior bajo la barra de navegación */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#020617]/50 via-transparent via-15% to-transparent pointer-events-none" />

        {/* Hero Content Container - Perfectamente Equilibrado con despeje del header */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 relative z-10 flex flex-col justify-center h-full pt-36 md:pt-48 lg:pt-52 pb-16">
          <div className="max-w-4xl">
            
            {/* Tag Line */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5 text-brandOrange font-mono text-xs md:text-sm tracking-[0.25em] uppercase font-extrabold px-4 py-2 rounded-full border border-brandOrange/30 bg-brandOrange/10 backdrop-blur-md shadow-[0_0_20px_rgba(242,101,34,0.2)]">
                <span className="w-2 h-2 rounded-full bg-brandOrange animate-pulse" />
                {t.tagline}
              </span>
            </motion.div>

            {/* Main Title con Tipografía Syne Proporcionada, Sólida y Sin Cortes */}
            <h1 className="font-display font-black text-[clamp(1.8rem,3.2vw,3.2rem)] text-white uppercase leading-[1.15] tracking-normal max-w-2xl relative z-20 pointer-events-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] overflow-visible">
              {/* Line 1: DISEÑAMOS (Tamaño calibrado, S 100% visible) */}
              <div className="pt-2 pb-1 overflow-visible">
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-hero-gradient font-extrabold tracking-normal pr-4"
                >
                  {t.heroLine1}
                </motion.span>
              </div>

              {/* Line 2: The Future */}
              <div className="my-1 overflow-visible">
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block font-serif italic font-normal tracking-wide bg-gradient-to-r from-brandOrange via-[#ff8c42] to-[#ffb07c] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(242,101,34,0.5)] pr-4"
                >
                  {t.heroLine2}
                </motion.span>
              </div>

              {/* Line 3: Of Sports */}
              <div className="overflow-visible">
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.56, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-white font-black tracking-tight"
                >
                  {t.heroLine3}
                </motion.span>
              </div>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="mt-8 text-white/50 text-sm md:text-base font-light leading-[1.7] max-w-lg tracking-wide"
            >
              {t.heroDesc}
            </motion.p>

            {/* Main CTA with Scarcity */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.2 }}
              className="mt-8 mb-4 flex flex-col sm:flex-row items-start gap-4 md:gap-6"
            >
              <MagneticButton href="/contact" className="hoverable inline-flex items-center justify-center gap-2 bg-brandOrange text-white px-8 py-4 rounded-full text-[11px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brandOrange transition-all duration-500 shadow-[0_0_30px_rgba(242,101,34,0.3)]">
                {isEs ? "Agendar Demostración" : "Book a Demo"}
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
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
        </div>

        {/* ─── SCROLL INDICATOR ABAJO DEL PRIMER VIDEO ─── */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer z-30 group hoverable"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => {
            const nextSec = document.getElementById("services");
            if (nextSec) {
              nextSec.scrollIntoView({ behavior: "smooth" });
            } else {
              window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
            }
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-mono font-bold text-brandOrange group-hover:text-white transition-colors">
            {isEs ? "DESLIZAR" : "SCROLL"}
          </span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5 text-brandOrange mt-1" />
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE ACOPLADO DIRECTAMENTE AL HERO */}
      <div className="w-full border-y border-white/10 bg-brandOrange/5 py-4 overflow-hidden flex items-center whitespace-nowrap z-20 relative backdrop-blur-md">
         <Marquee speed={30} className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">
          {t.marquee1.map((item, i) => (
            <span key={i} className="mx-8 flex items-center gap-8">
              {item} <span className="w-1.5 h-1.5 bg-brandOrange rounded-full"></span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ─── SOCIAL PROOF METRICS (50K+ / 94% / 99.9%) ─── */}
      <section className="relative z-20 w-full bg-[#020617] py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-2xl border border-white/15 p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-brandOrange/30 transition-all duration-500"
          >
            <div className="flex flex-col gap-2 group cursor-default min-w-0">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight group-hover:text-brandOrange transition-colors">50K+</span>
              <span className="text-[10px] md:text-[11px] font-mono text-brandOrange uppercase tracking-[0.15em] font-bold leading-tight">{isEs ? "Horas de Video Procesadas" : "Video Hours Processed"}</span>
            </div>
            <div className="flex flex-col gap-2 sm:border-l border-white/10 sm:pl-6 md:pl-8 group cursor-default min-w-0">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight group-hover:text-brandOrange transition-colors">94%</span>
              <span className="text-[10px] md:text-[11px] font-mono text-brandOrange uppercase tracking-[0.15em] font-bold leading-tight">{isEs ? "Reducción en Tiempo de Análisis" : "Reduction in Analysis Time"}</span>
            </div>
            <div className="flex flex-col gap-2 sm:border-l border-white/10 sm:pl-6 md:pl-8 group cursor-default min-w-0">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight group-hover:text-brandOrange transition-colors">
                99.9<span className="text-2xl sm:text-3xl md:text-4xl text-white/80 ml-1">%</span>
              </span>
              <span className="text-[10px] md:text-[11px] font-mono text-brandOrange uppercase tracking-[0.15em] font-bold leading-tight">{isEs ? "Certeza Algorítmica Absoluta" : "Absolute Algorithmic Certainty"}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SERVICES: 3-ZONE EDITORIAL LAYOUT ─── */}
      <section id="services" className="relative z-20 w-full bg-[#020617] border-b border-white/10">

        {/* ZONE 1: Section Header + Badge */}
        <div className="w-full border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-12 lg:px-16 py-10 md:py-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-3 bg-brandOrange/10 border border-brandOrange/30 text-brandOrange px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest mb-5">
                <Bot className="w-3.5 h-3.5" />
                {isEs ? "Integración Cero Fricción: Sin Hardware Adicional." : "Zero-Friction Integration: No Extra Hardware."}
              </div>
              <h2 className="font-display font-black uppercase leading-[1.08] tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-4xl">
                {isEs ? "Nuestras" : "Intelligent"}<br />
                <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.35)" }}>
                  {isEs ? "Soluciones" : "Solutions"}
                </span>
              </h2>
              <p className="font-mono text-xs text-white/50 tracking-widest uppercase mt-4 max-w-md leading-relaxed">
                {isEs ? "Ecosistema de Inteligencia Deportiva de Alto Rendimiento" : "High-Performance Sports Intelligence Ecosystem"}
              </p>
            </div>

            {/* Stats Row (Calibrated, Legible Telemetry Bar) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/15 shrink-0 lg:max-w-[580px] w-full lg:w-auto rounded-2xl overflow-hidden shadow-xl">
              {t.stats.map((stat, i) => (
                <div key={i} className="bg-[#020617] flex flex-col items-center justify-center text-center px-3 py-3 sm:px-4 sm:py-4 group hover:bg-brandOrange/5 transition-colors">
                  <span className="font-display text-xl sm:text-2xl font-black text-white group-hover:text-brandOrange transition-colors leading-none tracking-tight">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-white/50 mt-2 leading-snug text-center min-h-[24px] flex items-center justify-center">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ZONE 2: Service Cards Grid (Balanced 3x2 Grid for 6 Services) */}
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-12 lg:px-16 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.services.map((service, idx) => {
              const icons = [
                <LayoutTemplate key={0} className="w-6 h-6 text-white group-hover:text-brandOrange transition-colors" />,
                <Cpu key={1} className="w-6 h-6 text-white group-hover:text-brandOrange transition-colors" />,
                <Fingerprint key={2} className="w-6 h-6 text-white group-hover:text-brandOrange transition-colors" />,
                <Activity key={3} className="w-6 h-6 text-white group-hover:text-brandOrange transition-colors" />,
                <Brain key={4} className="w-6 h-6 text-white group-hover:text-brandOrange transition-colors" />,
                <Bot key={5} className="w-6 h-6 text-white group-hover:text-brandOrange transition-colors" />,
              ];
              const Icon = icons[idx % icons.length];
              const isHighlighted = idx === t.services.length - 1;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  className={`p-6 sm:p-7 rounded-[2rem] border flex flex-col gap-4 overflow-hidden group transition-all duration-300 backdrop-blur-sm ${
                    isHighlighted
                      ? "bg-gradient-to-br from-brandOrange/15 via-brandOrange/5 to-transparent border-brandOrange/30 hover:border-brandOrange/50 shadow-[0_0_30px_rgba(242,101,34,0.1)]"
                      : "bg-white/[0.02] border-white/10 hover:border-brandOrange/30 hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isHighlighted
                      ? "border-brandOrange/50 bg-brandOrange/20 text-brandOrange shadow-[0_0_15px_rgba(242,101,34,0.3)]"
                      : "border-white/10 bg-white/[0.04] group-hover:border-brandOrange group-hover:bg-brandOrange/10"
                  }`}>
                    {Icon}
                  </div>

                  {/* Title + Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display text-sm sm:text-base md:text-lg font-black uppercase text-white leading-snug tracking-tight break-words flex-1 min-w-0">
                      {service.title}
                    </h4>
                    {isHighlighted && (
                      <span className="shrink-0 font-mono text-[8px] font-bold uppercase tracking-widest text-brandOrange bg-brandOrange/20 border border-brandOrange/40 px-2 py-1 rounded-full">
                        {isEs ? "NUEVO" : "NEW"}
                      </span>
                    )}
                  </div>

                  {/* Full Description (Zero Truncation) */}
                  <p className="font-mono text-xs text-white/60 leading-relaxed tracking-normal">
                    {service.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </section>


      {/* ═════ CINEMATIC DRONE SHOWCASE (ORIGINAL FULL-WIDTH IMMERSIVE) ═════ */}
      <section className="bg-gradient-to-b from-[#020617] to-black relative w-full pt-10 pb-0 overflow-hidden">
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
      </section>


      {/* ─── VERTICAL PROJECTS (EDITORIAL GRID) ─── */}
      <section id="projects" className="relative z-10 w-full bg-[#020617] py-24 md:py-32 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="flex flex-col items-center mb-20 text-center">
             <span className="font-mono text-[10px] font-bold text-brandOrange tracking-[0.3em] uppercase mb-4">{isEs ? "Innovación" : "Innovation"}</span>
             <h2 className="font-display text-5xl md:text-7xl font-black uppercase text-white leading-[0.9]">
               {isEs ? "Nuestra" : "Our"} <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}>{isEs ? "Tecnología" : "Technology"}</span>
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
                      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white leading-[0.9] mb-2">
                         {isEs ? "Centro de Analítica de Datos" : "Data Analytics Hub"}
                       </h3>
                    </div>
                    <button disabled aria-label={isEs ? "Próximamente disponible" : "Coming soon"} className="px-6 py-3 border border-white/10 flex items-center justify-center rounded-sm hover:bg-white/10 transition-all cursor-not-allowed disabled:opacity-50">
                       <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">{isEs ? "Próximamente" : "COMING SOON"}</span>
                    </button>
                 </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── EL DIARIO / FOUNDER'S COLUMN SHOWCASE ─── */}
      <section id="journal" className="relative z-10 w-full bg-[#020617] py-24 md:py-32 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brandOrange/10 border border-brandOrange/30 text-brandOrange font-mono text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isEs ? "EL DIARIO · COLUMNA DEL FUNDADOR" : "THE JOURNAL · FOUNDER'S COLUMN"}</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white leading-tight">
                {isEs ? "Pensamiento" : "Strategic"}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandOrange via-white to-sky-400">
                  {isEs ? "Editorial" : "Insights"}
                </span>
              </h2>
            </div>
            <Link
              href="/journal"
              className="hoverable inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:border-brandOrange hover:bg-brandOrange/10 transition-all font-mono text-xs font-bold uppercase tracking-wider text-white"
            >
              <span>{isEs ? "Ver Todos los Artículos (5)" : "View All Articles (5)"}</span>
              <ArrowUpRight className="w-4 h-4 text-brandOrange" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...aiArticles, ...neilArticles].map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative bg-[#060c1c]/90 border border-white/10 hover:border-brandOrange/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="px-6 pt-5 pb-3 flex justify-between items-center bg-[#060c1c] border-b border-white/5">
                    <span className="px-3 py-1 rounded-full bg-brandOrange text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-md">
                      {isEs ? article.categoryEs : article.categoryEn}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-mono text-[10px]">
                      <Clock className="w-3 h-3 text-brandOrange" />
                      <span>{isEs ? article.timeEs : article.timeEn}</span>
                    </div>
                  </div>

                  <div className="relative w-full aspect-square overflow-hidden bg-black/95 p-3 flex items-center justify-center">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                      <Image
                        src={article.image}
                        alt={isEs ? article.titleEs : article.titleEn}
                        fill
                        className="object-contain object-top transition-all duration-700 group-hover:scale-[1.01]"
                      />
                    </div>
                  </div>

                  <div className="p-6 md:p-7 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-white leading-snug mb-3 group-hover:text-brandOrange transition-colors line-clamp-2 min-h-[3.2rem] flex items-center">
                        {isEs ? article.titleEs : article.titleEn}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed font-light line-clamp-3 min-h-[3.8rem]">
                        {isEs ? article.descEs : article.descEn}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 md:px-7 pb-6 pt-4 border-t border-white/10 flex justify-between items-center bg-[#060c1c]">
                  <div className="min-w-0 pr-2">
                    <span className="block text-[8px] font-mono uppercase tracking-widest text-white/50">
                      {isEs ? "Escrito por" : "Written by"}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-brandOrange font-black truncate block">
                      {article.author}
                    </span>
                  </div>
                  <Link
                    href={`/journal/${article.slug}`}
                    className="hoverable shrink-0 inline-flex items-center gap-2 bg-brandOrange/10 hover:bg-brandOrange text-brandOrange hover:text-white px-4 py-2 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border border-brandOrange/30 hover:border-brandOrange transition-all duration-300"
                  >
                    <span>{isEs ? "Leer Artículo" : "Read Article"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
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
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white leading-tight tracking-tight mb-6 break-words">
            {isEs ? "Whitepaper 2026: Cinemática sin Marcadores" : "Whitepaper 2026: Markerless Kinematics"}
          </h2>
          <p className="font-mono text-sm md:text-base text-white/60 mb-10 max-w-2xl mx-auto">
            {isEs ? "Únete a más de 1,200 scouts y analistas que están descubriendo cómo los Datos y la Inteligencia Artificial están redefiniendo el paradigma del scouting análogo." : "Join over 1,200 scouts and analysts discovering how Data and AI are redefining the analog scouting paradigm."}
          </p>
          
          {leadStatus === "success" ? (
            <div className="p-6 rounded-2xl bg-brandOrange/20 border border-brandOrange/40 text-brandOrange font-mono text-sm uppercase tracking-widest max-w-lg mx-auto">
              ✓ {isEs ? "¡Whitepaper enviado exitosamente a tu correo!" : "Whitepaper successfully sent to your email!"}
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" onSubmit={handleLeadSubmit}>
              <input 
                type="email" 
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder={isEs ? "Tu correo corporativo..." : "Your corporate email..."}
                aria-label={isEs ? "Correo electrónico corporativo" : "Corporate email"}
                className="bg-[#020617]/80 border border-white/20 text-white px-6 py-4 outline-none focus:border-brandOrange focus:ring-2 focus:ring-brandOrange transition-all w-full sm:w-2/3 font-mono text-xs rounded-none"
                required
              />
              <button 
                type="submit" 
                disabled={leadStatus === "loading"}
                className="hoverable bg-brandOrange text-white px-8 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brandOrange transition-all duration-300 shadow-[0_0_20px_rgba(242,101,34,0.2)] disabled:opacity-50"
              >
                {leadStatus === "loading" ? (isEs ? "Enviando..." : "Sending...") : (isEs ? "Descargar" : "Download")}
              </button>
            </form>
          )}
          <span className="block mt-6 text-[9px] font-mono text-white/40 uppercase tracking-widest">
            {isEs ? "100% valor puro. Cero spam. Date de baja cuando quieras." : "100% pure value. Zero spam. Unsubscribe anytime."}
          </span>
          <p className="font-mono text-[10px] font-bold text-brandOrange uppercase tracking-[0.4em] mt-4 drop-shadow-md">
            Who Dares Wins <span className="text-white/40">*sas*</span>
          </p>
        </div>
      </section>

      {/* ─── FOOTER CORPORATIVO UNIFICADO ─── */}
      <Footer />
      
    </main>
  );
}

