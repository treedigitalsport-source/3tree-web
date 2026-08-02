"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, LayoutTemplate, Cpu, Fingerprint, ChevronDown } from "lucide-react";
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
function JournalSection() {
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);
  
  // Mouse position for the floating image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const articles = [
    {
      id: 0,
      title: "How AI is Reshaping Athlete Biomechanics in 2026",
      category: "AI Integration",
      date: "Oct 12, 2026",
      image: "/journal-1.jpg"
    },
    {
      id: 1,
      title: "The New Standard for Fan Engagement",
      category: "UI/UX",
      date: "Sep 28, 2026",
      image: "/journal-2.jpg"
    },
    {
      id: 2,
      title: "Real-time Data: Winning Before the Whistle",
      category: "Sport Analytics",
      date: "Sep 15, 2026",
      image: "/journal-3.jpg"
    }
  ];

  return (
    <section id="journal" className="py-32 relative cursor-default" onMouseMove={handleMouseMove}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-start mb-24 gap-5">
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-brandOrange font-mono text-[11px] tracking-[0.4em] uppercase font-bold inline-flex items-center gap-3"
          >
            <span className="w-12 h-[1px] bg-brandOrange"></span>
            Our Journal
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl md:text-8xl font-black uppercase text-white leading-[0.85]"
          >
            The <span className="text-brandOrange">Edge</span>
          </motion.h2>
        </div>

        {/* Article List */}
        <div className="flex flex-col border-t border-white/[0.05]">
          {articles.map((article) => (
            <div 
              key={article.id}
              className="group relative border-b border-white/[0.05] py-12 md:py-16 flex flex-col md:flex-row md:items-center justify-between gap-6 hoverable"
              onMouseEnter={() => setHoveredArticle(article.id)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              {/* Category & Date */}
              <div className="flex flex-col gap-3 md:w-1/4">
                <span className="font-mono text-[10px] text-brandOrange tracking-[0.3em] uppercase font-bold">{article.category}</span>
                <span className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">{article.date}</span>
              </div>
              
              {/* Mobile Image (Hidden on Desktop) */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden md:hidden my-4">
                <Image src={article.image} alt={article.title} fill className="object-cover" />
              </div>
              
              {/* Title */}
              <div className="md:w-3/4">
                <h3 className={`font-display text-3xl md:text-5xl font-black uppercase leading-[1.1] transition-all duration-500 ${hoveredArticle !== null && hoveredArticle !== article.id ? 'text-white/10' : 'text-white group-hover:text-brandOrange md:group-hover:translate-x-4'}`}>
                  {article.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Image Reveal (Desktop Only) */}
      <motion.div 
        className="fixed top-0 left-0 w-[400px] h-[250px] pointer-events-none z-50 overflow-hidden rounded-2xl shadow-2xl hidden md:block"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hoveredArticle !== null ? 1 : 0,
          scale: hoveredArticle !== null ? 1 : 0.8,
        }}
        transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.3, type: "spring", stiffness: 200 } }}
      >
        {articles.map((article) => (
          <div 
            key={article.id} 
            className={`absolute inset-0 transition-opacity duration-500 ${hoveredArticle === article.id ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image src={article.image} alt={article.title} fill className="object-cover" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/*  MAIN PAGE                                                 */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function Home() {
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
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  const opacity1 = useTransform(scrollYProgress, [0.10, 0.25, 0.35, 0.50], [0, 0.6, 0.6, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.30, 0.45, 0.55, 0.70], [0, 0.6, 0.6, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.50, 0.65, 0.75, 0.90], [0, 0.6, 0.6, 0]);

  const scale1 = useTransform(scrollYProgress, [0.10, 0.50], [1.08, 1.18]);
  const scale2 = useTransform(scrollYProgress, [0.30, 0.70], [1.08, 1.18]);
  const scale3 = useTransform(scrollYProgress, [0.50, 0.90], [1.08, 1.18]);

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

        <nav className="hidden lg:flex gap-8 text-xs font-bold tracking-[0.2em] uppercase text-white/40">
          {["Services", "Projects", "Journal", "Impact", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hoverable hover:text-white transition-colors duration-500 relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brandOrange group-hover:w-full transition-all duration-500"></span>
            </a>
          ))}
        </nav>

        <MagneticButton href="#contact" className="hoverable group relative px-7 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] overflow-hidden text-white border border-white/10 hover:border-brandOrange/50 transition-all duration-700">
          <span className="absolute inset-0 bg-brandOrange scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></span>
          <span className="relative z-10 flex items-center gap-2">
            Start Project <ArrowUpRight className="w-3 h-3 group-hover:rotate-45 transition-transform duration-300" />
          </span>
        </MagneticButton>
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
              className="w-full h-full object-cover opacity-90 mix-blend-screen scale-[1.35] translate-y-[15%]"
              style={{ objectPosition: 'center 100%' }}
            >
              <source src="/hero-video-cropped.mp4" type="video/mp4" />
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
              className="mb-10"
            >
              <span className="inline-flex items-center gap-3 text-brandOrange font-mono text-[11px] tracking-[0.4em] uppercase font-bold">
                <motion.span
                  className="inline-block w-12 h-[1px] bg-brandOrange"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  style={{ transformOrigin: "left" }}
                />
                Sport Tech Agency
              </span>
            </motion.div>

            {/* Main Title â€” massive with stagger */}
            <h1 className="font-display font-black text-[clamp(2.5rem,7vw,8rem)] text-white uppercase leading-[0.85] tracking-[-0.02em] max-w-4xl relative z-20 pointer-events-none mix-blend-difference ml-[60px]">
              {["We Design", "The Future", "Of Sports."].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.span
                    initial={{ y: "130%", rotateX: 40 }}
                    animate={{ y: 0, rotateX: 0 }}
                    transition={{ duration: 1.4, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className={`block ${i === 1 ? "orange-blur-text" : ""} ${i === 2 ? "text-white/30" : ""}`}
                    {...(i === 1 ? { "data-text": line } : {})}
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
              We fuse high-performance design, data analytics, and cutting-edge
              development for the sports industry.
            </motion.p>

            {/* CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.2 }}
              className="mt-10 flex flex-wrap gap-4 items-center"
            >
              <MagneticButton href="#work" className="hoverable group inline-flex items-center gap-3 bg-brandOrange px-8 py-4 rounded-full text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:shadow-2xl hover:shadow-brandOrange/30 transition-all duration-500">
                View Our Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </MagneticButton>
              <MagneticButton href="#contact" className="hoverable group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white/60 text-[11px] font-bold uppercase tracking-[0.15em] border border-white/10 hover:border-white/30 hover:text-white transition-all duration-500 backdrop-blur-sm">
                Get In Touch
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
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/20">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="w-4 h-4 text-white/20" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* â•â•â• MARQUEE STRIP â•â•â• */}
      <div className="py-6 border-y border-white/[0.04] overflow-hidden">
        <Marquee speed={40}>
          {["UI/UX Design", "Sport Analytics", "Brand Identity", "Web Development", "Data Visualization", "Mobile Apps", "AI Integration", "Performance Tech"].map((item, i) => (
            <span key={i} className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/10 mx-8 flex items-center gap-4">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-brandOrange/30"></span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* â•â•â• STATS â•â•â• */}
      <section id="impact" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { value: 150, suffix: "+", label: "Projects Delivered" },
              { value: 40, suffix: "+", label: "Elite Athletes" },
              { value: 98, suffix: "%", label: "Client Retention" },
              { value: 12, suffix: "", label: "Industry Awards" },
            ].map((stat, i) => (
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

      {/* â•â•â• SERVICES â•â•â• */}
      <section id="services" className="py-32 relative">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="flex flex-col items-start mb-24 gap-5">
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-brandOrange font-mono text-[11px] tracking-[0.4em] uppercase font-bold inline-flex items-center gap-3"
            >
              <span className="w-12 h-[1px] bg-brandOrange"></span>
              What We Do
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-5xl md:text-8xl font-black uppercase text-white leading-[0.85]"
            >
              Our <span className="text-brandOrange">Expertise</span>
            </motion.h2>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <LayoutTemplate className="w-10 h-10" strokeWidth={1.5} />, num: "01", title: "UI/UX Design", desc: "Intuitive interfaces for scouting applications and performance dashboards. We design experiences that give teams a competitive edge.", accent: "#0054a6" },
              { icon: <Cpu className="w-10 h-10" strokeWidth={1.5} />, num: "02", title: "Sport Tech Dev", desc: "Custom software development and sports data API integration. From real-time analytics to machine learning pipelines.", accent: "#f26522" },
              { icon: <Fingerprint className="w-10 h-10" strokeWidth={1.5} />, num: "03", title: "Brand Identity", desc: "Building modern sports brands and art direction. Visual systems that command respect and inspire loyalty.", accent: "#8b5cf6" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="hoverable group service-card relative p-10 rounded-3xl flex flex-col justify-between min-h-[440px] overflow-hidden border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-700"
              >
                {/* Hover glow */}
                <div className="absolute -top-20 -right-20 w-[250px] h-[250px] rounded-full blur-[100px] opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none" style={{ background: s.accent }}></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-12">
                    <div className="relative w-24 h-24 rounded-[2rem] flex items-center justify-center border border-white/10 group-hover:border-white/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 overflow-hidden shadow-2xl" style={{ color: s.accent, background: `linear-gradient(135deg, ${s.accent}15, transparent)` }}>
                      {/* Glossy highlight */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      {/* Inner shadow/glow */}
                      <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 20px ${s.accent}20` }} />
                      {/* The Icon */}
                      <div className="relative z-10 filter drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-700">
                        {s.icon}
                      </div>
                    </div>
                    <span className="text-white/[0.04] font-display text-6xl font-black select-none">{s.num}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold uppercase mb-5 text-white">{s.title}</h3>
                  <p className="text-white/35 text-sm leading-[1.9] font-medium">{s.desc}</p>
                </div>

                {/* Progress bar on hover */}
                <div className="mt-10 relative z-10">
                  <div className="h-[1px] bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full w-0 group-hover:w-full transition-all duration-1000 ease-out rounded-full" style={{ background: s.accent }}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â• HORIZONTAL SCROLL PROJECTS â•â•â• */}
      <section id="projects" ref={horizontalRef} className="h-[400vh] relative">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          
          {/* Background Images - Fixed in center and cross-fading based on scroll progress */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            
            {/* Image 1 - Gridiron AI */}
            <motion.div 
              className="absolute inset-0"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                opacity: opacity1,
                scale: scale1
              }}
            >
              <Image src="/football.jpg" alt="Biomechanics" fill quality={100} className="object-cover object-top opacity-60 mix-blend-screen" />
            </motion.div>

            {/* Image 2 - System Data */}
            <motion.div 
              className="absolute inset-0"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                opacity: opacity2,
                scale: scale2
              }}
            >
              <Image src="/hero-new-2.png" alt="System Data" fill quality={100} className="object-cover object-top opacity-60 mix-blend-screen" />
            </motion.div>

            {/* Image 3 - Ice Analytics */}
            <motion.div 
              className="absolute inset-0"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
                opacity: opacity3,
                scale: scale3
              }}
            >
              <Image src="/hockey.jpg" alt="Ice Analytics" fill quality={100} className="object-cover object-top opacity-60 mix-blend-screen" />
            </motion.div>

          </div>

          <motion.div style={{ x }} className="flex w-[500vw] z-10 relative">

            {/* Panel 1 */}
            <div className="w-screen h-screen flex flex-col justify-center items-center text-center px-6 md:px-20 shrink-0">
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-brandOrange font-mono text-[11px] tracking-[0.4em] uppercase font-bold mb-8 inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-brandOrange"></span> Case Study 01
              </motion.span>
              <h2 className="font-display text-6xl md:text-[10rem] font-black uppercase text-white leading-none mb-6 orange-blur-text" data-text="ScoutAI">ScoutAI</h2>
              <h3 className="font-display text-3xl md:text-5xl font-bold uppercase text-white/30 mb-8">Pro</h3>
              <p className="text-white/30 max-w-md text-base font-medium">A revolution in baseball analytics. Scroll to explore.</p>
            </div>

            {/* Panel 2 - Ventana Uno (Gridiron) */}
            <div className="w-screen h-screen flex flex-col md:flex-row justify-center items-center shrink-0 relative px-10 md:px-24 group gap-10">

               {/* Text Column */}
               <div className="w-full md:w-1/2 flex flex-col justify-center items-start md:pl-10 relative z-10 md:mr-auto">
                  <span className="text-brandOrange font-mono tracking-[0.3em] uppercase text-[10px] font-bold mb-4 flex items-center gap-2">
                     <span className="w-4 h-[1px] bg-brandOrange"></span> Phase 01
                  </span>
                  <h3 className="text-5xl md:text-7xl font-display font-black text-white uppercase mb-6 leading-none drop-shadow-2xl">Gridiron <br/> AI</h3>
                  <p className="text-white/40 text-lg max-w-md drop-shadow-lg">Advanced Mechanics Tracking. Precision analysis of every movement.</p>
               </div>
            </div>

            {/* Panel 3 - Ventana Dos (System Data) */}
            <div className="w-screen h-screen flex flex-col md:flex-row justify-center items-center shrink-0 relative px-10 md:px-24 group gap-10">

               {/* Text Column */}
               <div className="w-full md:w-1/2 flex flex-col justify-center items-end text-right md:pr-10 relative z-10 md:ml-auto">
                  <span className="text-brandOrange font-mono tracking-[0.3em] uppercase text-[10px] font-bold mb-4 flex items-center gap-2">
                     Phase 02 <span className="w-4 h-[1px] bg-brandOrange"></span>
                  </span>
                  <h3 className="text-5xl md:text-7xl font-display font-black text-white uppercase mb-6 leading-none drop-shadow-2xl">System <br/> Data</h3>
                  <p className="text-white/40 text-lg max-w-md drop-shadow-lg">Real-time heatmap analysis and biomechanics tracking. Empowering elite teams.</p>
               </div>
            </div>

            {/* Panel 4 - Ventana Tres (Ice Analytics) */}
            <div className="w-screen h-screen flex flex-col md:flex-row justify-center items-center shrink-0 relative px-10 md:px-24 group gap-10">

               {/* Text Column */}
               <div className="w-full md:w-1/2 flex flex-col justify-center items-start md:pl-10 relative z-10 md:mr-auto">
                  <span className="text-brandBlue font-mono tracking-[0.3em] uppercase text-[10px] font-bold mb-4 flex items-center gap-2">
                     <span className="w-4 h-[1px] bg-brandBlue"></span> Phase 03
                  </span>
                  <h3 className="text-5xl md:text-7xl font-display font-black text-white uppercase mb-6 leading-none drop-shadow-2xl">Ice <br/> Analytics</h3>
                  <p className="text-white/40 text-lg max-w-md drop-shadow-lg">Precision tracking on the ice. Velocity and impact metrics.</p>
               </div>
            </div>

            {/* Panel 5 - CTA */}
            <div className="w-screen h-screen flex justify-center items-center shrink-0">
              <motion.div
                className="flex flex-col items-center justify-center rounded-[3rem] p-16 md:p-24 max-w-3xl"
                style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.05)" }}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="font-display text-5xl md:text-7xl font-black uppercase text-white text-center leading-none mb-10">Have a <br /> project<br /> in mind?</h2>
                <MagneticButton href="#contact" className="hoverable bg-brandOrange text-white px-10 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-brandOrange/30 transition-all duration-500">
                  Let&apos;s Talk
                </MagneticButton>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* â•â•â• ANOTHER MARQUEE â•â•â• */}
      <div className="py-6 border-y border-white/[0.04] overflow-hidden">
        <Marquee speed={35}>
          {["Baseball", "Basketball", "Football", "Soccer", "Tennis", "Golf", "eSports", "MMA", "Swimming", "Track & Field"].map((item, i) => (
            <span key={i} className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/8 mx-8 flex items-center gap-4 select-none">
              {item}
              <span className="w-1 h-1 rounded-full bg-white/10"></span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* â•â•â• JOURNAL â•â•â• */}
      <JournalSection />

      {/* â•â•â• CONTACT â•â•â• */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="contact-glass rounded-[3rem] p-10 md:p-20 max-w-5xl mx-auto">

            <div className="text-center mb-16">
              <span className="text-brandOrange font-mono text-[11px] tracking-[0.4em] uppercase font-bold inline-flex items-center gap-3 mx-auto mb-8">
                <span className="w-8 h-[1px] bg-brandOrange"></span>
                Start A Project
                <span className="w-8 h-[1px] bg-brandOrange"></span>
              </span>
              <h2 className="font-display text-5xl md:text-7xl font-black uppercase text-white leading-[0.85] mb-6">
                Let&apos;s Build <br />
                <span className="orange-blur-text" data-text="The Future.">The Future.</span>
              </h2>
              <p className="text-white/30 text-base max-w-lg mx-auto font-medium leading-relaxed">
                Have an idea for a sports app, a data platform, or a new brand? Tell us about your project.
              </p>
            </div>

            <div className="p-8 md:p-12 rounded-3xl max-w-3xl mx-auto" style={{ background: "rgba(15, 23, 42, 0.3)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <form className="space-y-10">
                {[
                  { label: "Your Name", type: "text", placeholder: "e.g. John Doe" },
                  { label: "Email Address", type: "email", placeholder: "e.g. john@company.com" },
                ].map((field, i) => (
                  <div key={i} className="group">
                    <label className="block text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3 group-focus-within:text-brandOrange transition-colors duration-300 font-bold">{field.label}</label>
                    <input type={field.type} className="form-input hoverable" placeholder={field.placeholder} />
                  </div>
                ))}
                <div className="group">
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3 group-focus-within:text-brandOrange transition-colors duration-300 font-bold">Tell us your idea</label>
                  <textarea rows={3} className="form-input hoverable resize-none" placeholder="e.g. We want a scouting app..."></textarea>
                </div>

                <MagneticButton href="#" className="hoverable group w-full bg-brandOrange text-white py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:shadow-2xl hover:shadow-brandOrange/30 transition-all duration-500 flex items-center justify-center gap-2">
                  Send Message <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
              </form>
            </div>

            <div className="mt-16 text-center">
              <p className="font-mono text-[10px] font-bold text-brandOrange uppercase tracking-[0.5em] drop-shadow-md">Who Dares Wins *saas*</p>
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â• FOOTER â•â•â• */}
      <footer className="py-8 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/15 text-[10px] font-mono tracking-[0.2em]">Â© 2026 3Tree Digital Sport Tech. All rights reserved.</p>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a key={item} href="#" className="hoverable text-white/15 text-[10px] font-mono tracking-[0.2em] hover:text-brandOrange transition-colors duration-500">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
