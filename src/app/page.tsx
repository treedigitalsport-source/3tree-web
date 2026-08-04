"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { LangProvider, useLang } from "./i18n";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, LayoutTemplate, Cpu, Fingerprint, ChevronDown, BookOpen, X, Send, UploadCloud, Play, Globe } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import Lenis from "lenis";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/*  FLOATING ORBS â€” ambient particles                        */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function FloatingOrbs() {
  const [orbs, setOrbs] = useState<any[]>([]);

  useEffect(() => {
    setOrbs(Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 1,
      isOrange: i % 4 === 0,
      isBlue: i % 4 === 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      yAnim: [0, -(60 + Math.random() * 140), 0],
      xAnim: [0, (Math.random() - 0.5) * 80, 0],
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 8
    })));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
            background: orb.isOrange
              ? "rgba(242, 101, 34, 0.7)"
              : orb.isBlue
              ? "rgba(0, 84, 166, 0.5)"
              : "rgba(255, 255, 255, 0.25)",
            boxShadow: orb.isOrange
              ? "0 0 8px rgba(242, 101, 34, 0.4)"
              : "none",
          }}
          animate={{
            y: orb.yAnim,
            x: orb.xAnim,
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/*  MOUSE SPOTLIGHT â€” follows cursor with gradient           */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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
        background: "radial-gradient(circle, rgba(242,101,34,0.06) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/*  ANIMATED COUNTER                                          */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/*  MARQUEE â€” infinite scroll text ticker                     */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function Marquee({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) {
  return (
    <div className="overflow-hidden whitespace-nowrap flex">
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/*  MAGNETIC BUTTON â€” moves toward cursor on hover            */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/*  JOURNAL SECTION (2026 Editorial Hover)                    */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function JournalSection({ onOpenJournal }: { onOpenJournal: () => void }) {
  const { t } = useLang();
  
  return (
    <section id="journal" className="py-32 relative">
      <div className="container mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brandOrange font-mono text-[11px] tracking-[0.4em] uppercase font-bold inline-flex items-center gap-3 justify-center mb-8"
        >
          <span className="w-12 h-[1px] bg-brandOrange"></span>
          {t.ourJournal}
          <span className="w-12 h-[1px] bg-brandOrange"></span>
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-7xl md:text-[120px] font-black uppercase leading-[0.85] tracking-tight text-white mb-16"
        >
          {t.theEdge[0]} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandOrange to-brandBlue">
            {t.theEdge[1]}
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <button 
            onClick={onOpenJournal}
            className="group relative px-12 py-6 bg-white/5 border border-white/10 rounded-full overflow-hidden hover:border-brandOrange transition-colors duration-500 hoverable mx-auto block"
          >
            <div className="absolute inset-0 bg-brandOrange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <span className="relative z-10 font-mono text-sm tracking-widest uppercase font-bold group-hover:text-black transition-colors duration-500 flex items-center justify-center gap-4">
              {t.exploreJournal}
              <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/*  MAIN PAGE                                                 */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function DiarioFullPage({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useLang();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto"
        >
          <div className="min-h-screen p-6 md:p-12">
            <div className="flex justify-between items-center mb-16">
              <span className="text-brandOrange font-mono text-[11px] tracking-[0.4em] uppercase font-bold inline-flex items-center gap-3">
                <BookOpen className="w-4 h-4" /> {t.diarioTitle}
              </span>
              <button onClick={onClose} className="p-4 bg-white/5 rounded-full hover:bg-brandOrange transition-colors group hoverable">
                <X className="w-6 h-6 text-white group-hover:text-black transition-colors" />
              </button>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-12">
              <h2 className="font-display text-5xl md:text-7xl font-black uppercase leading-none text-white">
                {t.diarioSubtitle1} <br/><span className="text-brandOrange">{t.diarioSubtitle2}</span>
              </h2>
              
              <div className="bg-white/5 rounded-[2rem] p-8 md:p-12 border border-white/10">
                <h3 className="font-mono text-sm tracking-widest uppercase text-brandOrange mb-6">{t.newEntry}</h3>
                <input type="text" placeholder={t.entryTitle} className="w-full bg-transparent border-b border-white/10 pb-4 text-2xl md:text-4xl font-display text-white placeholder-white/20 focus:outline-none focus:border-brandOrange transition-colors mb-8 hoverable" />
                <textarea placeholder={t.entryBody} rows={6} className="w-full bg-transparent border border-white/10 rounded-xl p-6 text-white/70 placeholder-white/20 focus:outline-none focus:border-brandOrange transition-colors resize-none hoverable font-sans text-lg leading-relaxed mb-8"></textarea>
                <button className="bg-brandOrange text-white px-8 py-4 rounded-full font-mono text-[11px] tracking-widest uppercase font-bold hover:shadow-lg hover:shadow-brandOrange/20 transition-all hoverable flex items-center gap-2">
                  <Send className="w-4 h-4" /> {t.saveEntry}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  IN THE PLAY (FLOATING HUB PLATFORM)                                       */
/* ══════════════════════════════════════════════════════════════════════════ */
function InThePlaySection() {
  const { t } = useLang();
  
  return (
    <section id="in-the-play" className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#020617] border-y border-white/[0.04] py-20">
      
      {/* Background Cinematic Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-30 blur-[6px] scale-110"
        >
          <source src="/hero-video-cropped.mp4" type="video/mp4" />
        </video>
        {/* Dark Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.85)_100%)] pointer-events-none"></div>
      </div>

      {/* Orbiting Community Videos (Decorative) */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
         <motion.div 
           animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }} 
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[15%] left-[8%] w-48 h-28 rounded-2xl border border-white/10 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] opacity-60 backdrop-blur-md"
         >
            <div className="absolute inset-0 bg-white/5"></div>
            <div className="absolute bottom-2 left-3 text-[8px] font-mono text-white/50">@alex_pro</div>
         </motion.div>
         
         <motion.div 
           animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }} 
           transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute bottom-[20%] left-[15%] w-40 h-56 rounded-2xl border border-white/10 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] opacity-40 backdrop-blur-md"
         >
            <div className="absolute inset-0 bg-brandOrange/5"></div>
            <div className="absolute bottom-2 left-3 text-[8px] font-mono text-white/50">@miguel_88</div>
         </motion.div>

         <motion.div 
           animate={{ y: [0, -15, 0], rotate: [0, -2, 0] }} 
           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
           className="absolute top-[25%] right-[10%] w-56 h-32 rounded-2xl border border-white/10 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] opacity-50 backdrop-blur-md"
         >
            <div className="absolute inset-0 bg-brandBlue/10"></div>
            <div className="absolute bottom-2 right-3 text-[8px] font-mono text-white/50">@sarah_fit</div>
         </motion.div>
      </div>

      {/* Floating Hub (Center) */}
      <div className="relative z-20 w-full max-w-2xl mx-4 group">
        
        {/* Glow behind the hub */}
        <div className="absolute -inset-10 bg-brandOrange/20 blur-[100px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-1000"></div>

        <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-2xl flex flex-col items-center text-center overflow-hidden hoverable">
          
          {/* Top Live Badge */}
          <div className="absolute top-8 left-8">
             <span className="text-white/80 text-[9px] font-mono uppercase tracking-[0.3em] font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
               <span className="w-1.5 h-1.5 rounded-full bg-brandOrange animate-pulse"></span>
               {t.liveFeed}
             </span>
          </div>

          <h3 className="font-display text-4xl md:text-5xl font-black uppercase text-white mb-4 mt-8 md:mt-2 leading-none">
             {t.inThePlayTitle}
          </h3>
          <p className="text-white/50 mb-10 text-sm leading-relaxed max-w-sm">
             {t.uploadDesc}
          </p>

           <Link href="/in-the-play" className="w-full bg-brandOrange text-white py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(242,101,34,0.4)] hover:bg-white hover:text-brandOrange transition-all duration-500 flex items-center justify-center gap-3 relative z-10">
              <Play className="w-4 h-4" /> {t.watchVideos}
           </Link>
        </div>
      </div>
    </section>
  );
}

function MainContent() {
  const { t, lang, toggleLang } = useLang();
  const isEs = lang === "es";
  const [isDiarioOpen, setIsDiarioOpen] = useState(false);
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

  const { scrollYProgress } = useScroll({ 
    target: horizontalRef,
    offset: ["start start", "end end"]
  });
  
  // Smooth out scroll progression using a spring for buttery-smooth horizontal motion
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20, mass: 0.2 });
  
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-80%"]);

  const opacity1 = useTransform(smoothProgress, [0.10, 0.25, 0.35, 0.50], [0, 0.6, 0.6, 0]);
  const opacity2 = useTransform(smoothProgress, [0.30, 0.45, 0.55, 0.70], [0, 0.6, 0.6, 0]);
  const opacity3 = useTransform(smoothProgress, [0.50, 0.65, 0.75, 0.90], [0, 0.6, 0.6, 0]);

  const scale1 = useTransform(smoothProgress, [0.10, 0.50], [1.08, 1.18]);
  const scale2 = useTransform(smoothProgress, [0.30, 0.70], [1.08, 1.18]);
  const scale3 = useTransform(smoothProgress, [0.50, 0.90], [1.08, 1.18]);

  /* Parallax values for hero */
  const { scrollYProgress: heroScroll } = useScroll();
  const heroY = useTransform(heroScroll, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(heroScroll, [0, 0.3], [1, 0.3]);

  return (
    <main className="relative">
      <CustomCursor />
      <FloatingOrbs />
      <MouseSpotlight />

      {/* Cinematic Top Gradient Fade for Header and Subtitles */}
      <div className="fixed top-0 left-0 right-0 h-[20vh] bg-gradient-to-b from-[#020617] via-[#020617]/60 to-transparent z-[40] pointer-events-none"></div>

      {/* â•â•â• HEADER â•â•â• */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 px-6 md:px-10 py-6 flex justify-between items-center"
      >
        <div className="flex items-center hoverable">
          <div className="h-24 md:h-28 w-[280px] md:w-[380px] flex items-center relative transition-all duration-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-3tree.png"
              alt="3Tree Digital Sport Tech"
              className="h-full w-full object-contain object-left"
            />
          </div>
        </div>

        <nav className="hidden lg:flex gap-6 text-xs font-bold tracking-[0.2em] uppercase text-white/40 items-center">
          {t.nav.map((item, i) => {
            const sectionIds = ["services", "projects", "podcast", "journal", "impact", "in-the-play", "about", "contact"];
            
            let targetUrl = `#${sectionIds[i]}`;
            if (sectionIds[i] === "projects") targetUrl = "/projects/kinebase";
            if (sectionIds[i] === "podcast") targetUrl = "/podcast";
            if (sectionIds[i] === "journal") targetUrl = "/journal";
            if (sectionIds[i] === "in-the-play") targetUrl = "/in-the-play";
            if (sectionIds[i] === "about") targetUrl = "/about";
            if (sectionIds[i] === "contact") targetUrl = "/contact";

            return (
              <div key={item} className="relative group/nav">
                <Link href={targetUrl} className="hoverable hover:text-white transition-colors duration-500 flex items-center gap-1 group/link">
                  {item}
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brandOrange group-hover/nav:w-full transition-all duration-500"></span>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          
          {/* Tech Translator Button */}
          <button 
            onClick={toggleLang}
            className="hoverable relative flex items-center gap-2.5 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-brandOrange/40 rounded-full pl-4 pr-3 py-2 bg-white/[0.03] backdrop-blur-md group shadow-xl"
            title={lang === 'es' ? "Switch to English" : "Cambiar a Español"}
          >
            <span>{lang === 'en' ? 'ESP' : 'ENG'}</span>
            <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/5 group-hover:bg-brandOrange/20 transition-colors">
              <Globe className="w-3 h-3 text-white/60 group-hover:text-brandOrange group-hover:rotate-45 transition-all duration-500" />
              <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite] group-hover:border-brandOrange/40 transition-colors"></div>
            </div>
          </button>
          
          <MagneticButton href="/contact" className="hoverable group relative px-7 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] overflow-hidden text-white border border-white/10 hover:border-brandOrange/50 transition-all duration-700">
            <span className="absolute inset-0 bg-brandOrange scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></span>
            <span className="relative z-10 flex items-center gap-2">
              {t.cta} <ArrowUpRight className="w-3 h-3 group-hover:rotate-45 transition-transform duration-300" />
            </span>
          </MagneticButton>
        </div>
      </motion.header>

      {/* â•â•â• HERO SECTION â•â•â• */}
      <section className="relative h-screen flex items-center overflow-hidden">

        {/* Cinematic Background â€” image emerges from the page, no edges */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          {/* Cinematic Video Background */}
          <motion.div 
            className="absolute inset-0 hero-video-image"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
            }}
          >
            {/* Cinematic Video Background */}
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-70 mix-blend-screen scale-[1.35] translate-y-[15%]"
              style={{ objectPosition: 'center 100%' }}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Film grain (Keep this to blend the video smoothly) */}
          <div className="hero-grain"></div>

          {/* Bottom gradient for text readability */}
          <div className="absolute bottom-0 left-0 right-0 h-[20%] z-[6] pointer-events-none bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent"></div>
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

            {/* Main Title â€” massive with stagger */}
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

            {/* CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.2 }}
              className="mt-10 flex flex-wrap gap-4 items-center"
            >
              <MagneticButton href="#work" className="hoverable group inline-flex items-center gap-3 bg-brandOrange px-8 py-4 rounded-full text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:shadow-2xl hover:shadow-brandOrange/30 transition-all duration-500">
                {t.viewWork}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </MagneticButton>
              <MagneticButton href="#contact" className="hoverable group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white/60 text-[11px] font-bold uppercase tracking-[0.15em] border border-white/10 hover:border-white/30 hover:text-white transition-all duration-500 backdrop-blur-sm">
                {t.getInTouch}
              </MagneticButton>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/20">{t.scroll}</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="w-4 h-4 text-white/20" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cinematic Showcase moved below Services */}

      {/* ——— MARQUEE STRIP ——— */}
      <div className="py-6 border-y border-white/[0.04] overflow-hidden">
        <Marquee speed={40}>
          {t.marquee1.map((item, i) => (
            <span key={i} className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/10 mx-8 flex items-center gap-4">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-brandOrange/30"></span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ——— STATS ——— */}
      <section id="impact" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {t.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center py-10 px-6 rounded-2xl stat-card group"
              >
                <div className="text-4xl md:text-6xl font-display font-black text-white group-hover:text-brandOrange transition-colors duration-700">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/20 text-[9px] uppercase tracking-[0.25em] font-bold mt-4">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ SERVICES (THE 3 PILLARS) ═════ */}
      <section id="services" className="py-32 relative min-h-screen flex items-center overflow-hidden bg-[#020617]">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brandOrange/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          
          <div className="flex flex-col items-center text-center mb-20 gap-4">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brandOrange font-mono text-[11px] tracking-[0.4em] uppercase font-bold inline-flex items-center gap-3"
            >
              <span className="w-12 h-[1px] bg-brandOrange"></span>
              OUR EXPERTISE
              <span className="w-12 h-[1px] bg-brandOrange"></span>
            </motion.span>
            <motion.h2
              className="font-display text-5xl md:text-8xl font-black uppercase text-white leading-[0.85]"
            >
              Dominating <span className="text-brandOrange">The Digital Space</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: UI/UX Design */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="relative p-10 rounded-3xl flex flex-col justify-start overflow-hidden border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 hoverable group shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0054a6]/10 text-[#0054a6] flex items-center justify-center mb-8 border border-[#0054a6]/20 group-hover:bg-[#0054a6]/20 transition-colors">
                <LayoutTemplate className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-display font-black uppercase mb-4 text-white">UI/UX Design</h3>
              <p className="text-white/50 text-base leading-relaxed font-medium">
                Intuitive interfaces for scouting applications and performance dashboards. We design experiences that give teams a competitive edge.
              </p>
            </motion.div>

            {/* Pillar 2: Sport Tech Dev */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="relative p-10 rounded-3xl flex flex-col justify-start overflow-hidden border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 hoverable group shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-brandOrange/10 text-brandOrange flex items-center justify-center mb-8 border border-brandOrange/20 group-hover:bg-brandOrange/20 transition-colors">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-display font-black uppercase mb-4 text-white">Sport Tech Dev</h3>
              <p className="text-white/50 text-base leading-relaxed font-medium">
                Custom software development and sports data API integration. From real-time analytics to machine learning pipelines.
              </p>
            </motion.div>

            {/* Pillar 3: Brand Identity */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative p-10 rounded-3xl flex flex-col justify-start overflow-hidden border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 hoverable group shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center mb-8 border border-[#8b5cf6]/20 group-hover:bg-[#8b5cf6]/20 transition-colors">
                <Fingerprint className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-display font-black uppercase mb-4 text-white">Brand Identity</h3>
              <p className="text-white/50 text-base leading-relaxed font-medium">
                Building modern sports brands and art direction. Visual systems that command respect and inspire loyalty.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═════ CINEMATIC DRONE SHOWCASE ═════ */}
      <section className="bg-gradient-to-b from-[#020617] to-black relative w-full pt-10 pb-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5 }}
          className="w-full h-[60vh] md:h-[80vh] relative group hoverable"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          }}
        >
          {/* Subtle Mask Overlay for darkness */}
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

        {/* Bulletproof Bottom Fade: Guarantee no hard line between this section and the next */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>
      </section>

      {/* â•â•â• HORIZONTAL SCROLL PROJECTS â•â•â• */}
      <section id="projects" ref={horizontalRef} className="h-[400vh] relative">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          
          {/* Background Images - Fixed in center and cross-fading based on scroll progress */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            
            {/* Image 1 - Biomechanics */}
            <motion.div 
              className="absolute inset-0"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                opacity: opacity1,
                scale: scale1
              }}
            >
              <Image src="/baseball_biomechanics_1785628048219.jpg" alt="Kinebase Pro" fill quality={100} className="object-cover object-center opacity-60 mix-blend-screen" />
            </motion.div>

            {/* Image 2 - Computer Vision */}
            <motion.div 
              className="absolute inset-0"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                opacity: opacity2,
                scale: scale2
              }}
            >
              <Image src="/hero-baseball.jpg" alt="Markerless Tracking" fill quality={100} className="object-cover object-center opacity-60 mix-blend-screen" />
            </motion.div>


            {/* Image 3 - Data Science */}
            <motion.div 
              className="absolute inset-0"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                opacity: opacity3,
                scale: scale3
              }}
            >
              <Image src="/system_data_1785627955822.jpg" alt="Scouting Dashboard" fill quality={100} className="object-cover object-center opacity-60 mix-blend-screen" />
            </motion.div>

          </div>

          <motion.div style={{ x }} className="flex w-[500vw] z-10 relative">

            {/* Panel 1 - Introduction */}
            <div className="w-screen h-screen flex flex-col justify-center items-center text-center px-6 md:px-20 shrink-0">
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-brandOrange font-mono text-[11px] tracking-[0.4em] uppercase font-bold mb-8 inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-brandOrange"></span> {isEs ? "PROYECTO DESTACADO" : "FEATURED PROJECT"}
              </motion.span>
              <h2 className="font-display text-6xl md:text-[10rem] font-black uppercase text-white leading-none mb-6 orange-blur-text" data-text="KINEBASE">KINEBASE</h2>
              <h3 className="font-display text-3xl md:text-5xl font-bold uppercase text-white/30 mb-8">{isEs ? "PRO" : "PRO"}</h3>
              <p className="text-white/30 max-w-md text-base font-medium">{isEs ? "Una revolución en análisis biomecánico 3D y prevención de lesiones." : "A revolution in 3D biomechanical analysis and injury prevention."}</p>
            </div>

            {/* Panel 2 - Phase 1 */}
            <div className="w-screen h-screen flex flex-col md:flex-row justify-center items-center shrink-0 relative px-10 md:px-24 group gap-10">
               {/* Text Column */}
               <div className="w-full md:w-1/2 flex flex-col justify-center items-start md:pl-10 relative z-10 md:mr-auto">
                  <span className="text-brandOrange font-mono tracking-[0.3em] uppercase text-[10px] font-bold mb-4 flex items-center gap-2">
                     <span className="w-4 h-[1px] bg-brandOrange"></span> {isEs ? "Fase 01" : "Phase 01"}
                  </span>
                  <h3 className="text-5xl md:text-7xl font-display font-black text-white uppercase mb-6 leading-none drop-shadow-2xl">
                    {isEs ? "RASTREO SIN" : "MARKERLESS"}<br/>{isEs ? "MARCADORES" : "TRACKING"}
                  </h3>
                  <p className="text-white/40 text-lg max-w-md drop-shadow-lg">
                    {isEs 
                      ? "Reconstrucción esquelética 3D en tiempo real directo desde cámaras normales sin trajes ni sensores." 
                      : "Real-time 3D skeletal reconstruction directly from standard high-speed cameras with no sensors."}
                  </p>
               </div>
            </div>

            {/* Panel 3 - Phase 2 */}
            <div className="w-screen h-screen flex flex-col md:flex-row justify-center items-center shrink-0 relative px-10 md:px-24 group gap-10">
               {/* Text Column */}
               <div className="w-full md:w-1/2 flex flex-col justify-center items-end text-right md:pr-10 relative z-10 md:ml-auto">
                  <span className="text-brandOrange font-mono tracking-[0.3em] uppercase text-[10px] font-bold mb-4 flex items-center gap-2">
                     {isEs ? "Fase 02" : "Phase 02"} <span className="w-4 h-[1px] bg-brandOrange"></span>
                  </span>
                  <h3 className="text-5xl md:text-7xl font-display font-black text-white uppercase mb-6 leading-none drop-shadow-2xl">
                    {isEs ? "ÁNGULOS Y" : "JOINT ANGLES"}<br/>{isEs ? "MÉTRICAS" : "& FORCES"}
                  </h3>
                  <p className="text-white/40 text-lg max-w-md drop-shadow-lg">
                    {isEs 
                      ? "Análisis preciso de velocidad angular, flexión de articulaciones y fuerzas rotacionales." 
                      : "Precise analysis of angular velocity, joint flexion, and rotational forces during movement."}
                  </p>
               </div>
            </div>

            {/* Panel 4 - Phase 3 */}
            <div className="w-screen h-screen flex flex-col md:flex-row justify-center items-center shrink-0 relative px-10 md:px-24 group gap-10">
               {/* Text Column */}
               <div className="w-full md:w-1/2 flex flex-col justify-center items-start md:pl-10 relative z-10 md:mr-auto">
                  <span className="text-brandOrange font-mono tracking-[0.3em] uppercase text-[10px] font-bold mb-4 flex items-center gap-2">
                     <span className="w-4 h-[1px] bg-brandOrange"></span> {isEs ? "Fase 03" : "Phase 03"}
                  </span>
                  <h3 className="text-5xl md:text-7xl font-display font-black text-white uppercase mb-6 leading-none drop-shadow-2xl">
                    {isEs ? "PREVENCIÓN Y" : "SCOUTING"}<br/>{isEs ? "SCOUTING" : "& PREVENTION"}
                  </h3>
                  <p className="text-white/40 text-lg max-w-md drop-shadow-lg">
                    {isEs 
                      ? "Identificación de asimetrías musculares y fatiga para mitigar lesiones y optimizar el perfil atlético." 
                      : "Identification of muscular asymmetries and fatigue to prevent injuries and optimize athletic profile."}
                  </p>
               </div>
            </div>

            {/* Panel 5 - Link to Submenu */}
            <div className="w-screen h-screen flex justify-center items-center shrink-0">
              <motion.div
                className="flex flex-col items-center justify-center rounded-[3rem] p-16 md:p-24 max-w-3xl"
                style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.05)" }}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="font-display text-5xl md:text-7xl font-black uppercase text-white text-center leading-none mb-10">
                  {isEs ? "VER KINEBASE PRO" : "VIEW KINEBASE PRO"}<br/>{isEs ? "COMPLETO" : "DETAILS"}
                </h2>
                <Link href="/projects/kinebase" className="hoverable bg-brandOrange text-white px-10 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-brandOrange/30 transition-all duration-500 cursor-pointer">
                  {isEs ? "EXPLORAR SUBMENÚ" : "EXPLORE SUBMENU"}
                </Link>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* ═════ ANOTHER MARQUEE ═════ */}
      <div className="py-6 border-y border-white/[0.04] overflow-hidden">
        <Marquee speed={35}>
          {t.marquee2.map((item, i) => (
            <span key={i} className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/8 mx-8 flex items-center gap-4 select-none">
              {item}
              <span className="w-1 h-1 rounded-full bg-white/10"></span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ——— JOURNAL (Movido a sub-menu) ——— */}
      {/* 
      <JournalSection onOpenJournal={() => setIsDiarioOpen(true)} />
      <DiarioFullPage isOpen={isDiarioOpen} onClose={() => setIsDiarioOpen(false)} />
      */}

      {/* ——— IN THE PLAY (Movido a sub-menu) ——— */}
      {/* <InThePlaySection /> */}

      {/* ——— CONTACT ——— */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="contact-glass rounded-[3rem] p-10 md:p-20 max-w-5xl mx-auto">

            <div className="text-center mb-16">
              <span className="text-brandOrange font-mono text-[11px] tracking-[0.4em] uppercase font-bold inline-flex items-center gap-3 mx-auto mb-8">
                <span className="w-8 h-[1px] bg-brandOrange"></span>
                {t.startProject}
                <span className="w-8 h-[1px] bg-brandOrange"></span>
              </span>
              <h2 className="font-display text-5xl md:text-7xl font-black uppercase text-white leading-[0.85] mb-6">
                {t.letsBuild} <br />
                <span className="orange-blur-text" data-text={t.theFuture}>{t.theFuture}</span>
              </h2>
              <p className="text-white/30 text-base max-w-lg mx-auto font-medium leading-relaxed">
                {t.contactDesc}
              </p>
            </div>

            <div className="p-8 md:p-12 rounded-3xl max-w-3xl mx-auto" style={{ background: "rgba(15, 23, 42, 0.3)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <form className="space-y-10">
                {[
                  { label: t.formName, type: "text", placeholder: t.placeholderName },
                  { label: t.formEmail, type: "email", placeholder: t.placeholderEmail },
                ].map((field, i) => (
                  <div key={i} className="group">
                    <label className="block text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3 group-focus-within:text-brandOrange transition-colors duration-300 font-bold">{field.label}</label>
                    <input type={field.type} className="form-input hoverable" placeholder={field.placeholder} />
                  </div>
                ))}
                <div className="group">
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3 group-focus-within:text-brandOrange transition-colors duration-300 font-bold">{t.formIdea}</label>
                  <textarea rows={3} className="form-input hoverable resize-none" placeholder={t.placeholderIdea}></textarea>
                </div>

                <MagneticButton href="#" className="hoverable group w-full bg-brandOrange text-white py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:shadow-2xl hover:shadow-brandOrange/30 transition-all duration-500 flex items-center justify-center gap-2">
                  {t.sendMessage} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
              </form>
            </div>

            <div className="mt-16 text-center">
              <p className="font-mono text-xs md:text-sm font-bold text-brandOrange uppercase tracking-[0.5em] drop-shadow-md">{t.whoDaresWins}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— FOOTER ——— */}
      <footer className="py-12 border-t border-white/[0.04] bg-black/40">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white text-[10px] font-mono tracking-[0.2em] font-medium">{t.footerText}</p>
          
          {/* Social Icons */}
          <div className="flex gap-5 items-center">
            <a href="#" className="hoverable text-white/50 hover:text-brandOrange transition-all duration-300" title="X (Twitter)">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="hoverable text-white/50 hover:text-brandOrange transition-all duration-300" title="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.858.508 9.388.508 9.388.508s7.53 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" className="hoverable text-white/50 hover:text-brandOrange transition-all duration-300" title="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            <a href="#" className="hoverable text-white/50 hover:text-brandOrange transition-all duration-300" title="Truth Social">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <rect width="22" height="22" x="1" y="1" rx="5" className="fill-none stroke-current stroke-[1.5]" />
                <path d="M7 7h10v2.5h-3.5v7.5h-3V9.5H7V7z" />
              </svg>
            </a>
            <a href="#" className="hoverable text-white/50 hover:text-brandOrange transition-all duration-300" title="Pinterest">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.164 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.62 0 11.988-5.367 11.988-11.987C24.005 5.367 18.636 0 12.017 0z"/>
              </svg>
            </a>
            <a href="#" className="hoverable text-white/50 hover:text-brandOrange transition-all duration-300" title="TikTok">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.25-.25v6.07c-.1 4.1-3.3 7.82-7.44 8.24-4.85.59-9.35-2.81-9.74-7.67-.48-5.06 3.19-9.75 8.25-10.02.93-.05 1.86.08 2.76.38V5.07c-2.1-.22-4.14.73-5.26 2.51-1.31 2.05-1.25 4.88.16 6.86 1.34 1.89 3.73 2.89 6.02 2.5 2.11-.36 3.79-2.12 4.1-4.24.06-.41.08-.83.08-1.25V.02z"/>
              </svg>
            </a>
          </div>

          <div className="flex gap-8">
            {t.footerLinks.map((item, index) => {
              let href = "#";
              if (index === 0) href = "/privacy";
              if (index === 1) href = "/terms";
              if (index === 2) href = "/cookies";
              if (index === 3) href = "/about";
              return (
                <Link key={item} href={href} className="hoverable text-white text-[10px] font-mono tracking-[0.2em] font-medium hover:text-brandOrange transition-colors duration-500">{item}</Link>
              );
            })}
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <MainContent />
  );
}
