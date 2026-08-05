"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Brain, Camera, Database, ChevronDown, ArrowLeft } from "lucide-react";
import { useLang } from "@/app/i18n";
import CustomCursor from "@/components/CustomCursor";

export default function ImpactPage() {
  const { lang } = useLang();
  const isEs = lang === "es";

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <main className="bg-[#020617] text-white selection:bg-brandOrange selection:text-white min-h-screen font-sans overflow-x-hidden relative">
      <CustomCursor />
      
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <nav className="relative z-50 w-full px-6 py-6 flex justify-between items-center bg-transparent absolute top-0 left-0 right-0">
        <div className="font-display font-black text-2xl tracking-widest uppercase">
          3tree digital <span className="text-brandOrange">Sport IA</span>
        </div>
        <Link href="/" className="hoverable group flex items-center gap-4 text-white hover:text-brandOrange transition-colors">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] hidden md:inline">{isEs ? "Volver al Inicio" : "Back to Home"}</span>
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brandOrange bg-[#020617]">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-20 pt-32 pb-20 overflow-hidden border-b border-white/10">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="w-12 h-[1px] bg-brandOrange"></span>
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-brandOrange">
              {isEs ? "El Futuro del Deporte" : "The Future of Sports"}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display font-black text-6xl md:text-8xl lg:text-[8rem] uppercase leading-[0.85] tracking-tight mb-10"
          >
            {isEs ? "El Impacto" : "The Impact"}<br/>
            <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}>
              {isEs ? "De La IA" : "Of AI"}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-mono text-sm md:text-base text-white/50 max-w-2xl leading-relaxed uppercase tracking-[0.1em]"
          >
            {isEs 
              ? "La Inteligencia Artificial ya no es ciencia ficción, es la nueva ventaja competitiva. Somos una empresa Sport AI impulsada por Visión Computarizada, Big Data y Modelos de Lenguaje (LLMs) que erradica el sesgo humano del scouting."
              : "Artificial Intelligence is no longer science fiction, it's the new competitive advantage. We are a Sport AI company driven by Computer Vision, Big Data, and LLMs that eradicates human bias from scouting."}
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-6 md:left-20 flex items-center gap-4 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/50">Scroll</span>
          <div className="w-16 h-[1px] bg-white/10 relative overflow-hidden">
             <motion.div 
               animate={{ x: ["-100%", "100%"] }} 
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
               className="absolute top-0 left-0 w-full h-full bg-brandOrange"
             />
          </div>
        </motion.div>
      </section>

      {/* The 3 Pillars */}
      <section className="relative z-10 py-32 border-b border-white/10 bg-[#020617]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <h2 className="font-display font-black text-5xl md:text-7xl uppercase leading-[0.9]">
                {isEs ? "Los 3" : "The 3"}<br/>
                <span className="text-brandOrange">{isEs ? "Pilares" : "Pillars"}</span>
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 max-w-md">
              {isEs ? "La arquitectura tecnológica detrás de nuestra ventaja injusta." : "The technological architecture behind our unfair advantage."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="border border-white/10 p-10 hover:border-brandOrange/50 transition-colors bg-white/[0.01] hoverable group">
              <Camera className="w-12 h-12 text-white/20 group-hover:text-brandOrange mb-10 transition-colors" />
              <h3 className="font-display text-3xl font-black uppercase mb-4">Computer Vision</h3>
              <p className="font-mono text-xs text-white/50 leading-loose uppercase tracking-[0.1em]">
                {isEs 
                  ? "Análisis biomecánico sin marcadores (Kinebase Pro). Medimos ángulos, torque y velocidad de rotación extrayendo datos exactos directamente del píxel. Adiós al sesgo del ojo clínico."
                  : "Markerless biomechanical analysis (Kinebase Pro). We measure angles, torque, and rotational speed extracting exact data directly from the pixel. Goodbye to the bias of the clinical eye."}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="border border-white/10 p-10 hover:border-brandOrange/50 transition-colors bg-white/[0.01] hoverable group lg:mt-16">
              <Database className="w-12 h-12 text-white/20 group-hover:text-brandOrange mb-10 transition-colors" />
              <h3 className="font-display text-3xl font-black uppercase mb-4">Predictive LLMs</h3>
              <p className="font-mono text-xs text-white/50 leading-loose uppercase tracking-[0.1em]">
                {isEs 
                  ? "Transformamos notas subjetivas y métricas crudas en perfiles de talento estructurados. Nuestros modelos de lenguaje predicen curvas de rendimiento y alertan sobre riesgos de lesión."
                  : "We transform subjective notes and raw metrics into structured talent profiles. Our language models predict performance curves and alert about injury risks."}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="border border-white/10 p-10 hover:border-brandOrange/50 transition-colors bg-white/[0.01] hoverable group lg:mt-32">
              <Brain className="w-12 h-12 text-white/20 group-hover:text-brandOrange mb-10 transition-colors" />
              <h3 className="font-display text-3xl font-black uppercase mb-4">Automated Workflows</h3>
              <p className="font-mono text-xs text-white/50 leading-loose uppercase tracking-[0.1em]">
                {isEs 
                  ? "Democratizamos la visibilidad. Pipelines automatizados de video que editan, estabilizan y procesan material crudo, enviándolo instantáneamente al feed global de scouting."
                  : "We democratize visibility. Automated video pipelines that edit, stabilize, and process raw footage, instantly sending it to the global scouting feed."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before vs After Ecosystem */}
      <section className="relative z-10 py-32 bg-brandOrange text-[#020617] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.3em] mb-6 opacity-60">The Old Paradigm</h3>
              <ul className="space-y-6 font-display text-2xl md:text-3xl font-black uppercase opacity-50">
                <li className="flex items-center gap-4"><span className="w-3 h-3 bg-[#020617]"></span> Subjective Human Scouting</li>
                <li className="flex items-center gap-4"><span className="w-3 h-3 bg-[#020617]"></span> Expensive Video Editors</li>
                <li className="flex items-center gap-4"><span className="w-3 h-3 bg-[#020617]"></span> Hidden Talent Pools</li>
                <li className="flex items-center gap-4"><span className="w-3 h-3 bg-[#020617]"></span> Unstructured Notebooks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.3em] mb-6">The 3Tree Paradigm</h3>
              <ul className="space-y-6 font-display text-3xl md:text-4xl font-black uppercase">
                <li className="flex items-center gap-4"><ArrowRight className="w-8 h-8" /> Markerless Biomechanics</li>
                <li className="flex items-center gap-4"><ArrowRight className="w-8 h-8" /> Autonomous AI Editing</li>
                <li className="flex items-center gap-4"><ArrowRight className="w-8 h-8" /> Global Data-Driven Feed</li>
                <li className="flex items-center gap-4"><ArrowRight className="w-8 h-8" /> LLM Tactical Reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
