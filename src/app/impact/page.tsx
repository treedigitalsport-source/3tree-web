"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Camera, Database, ArrowLeft, X } from "lucide-react";
import { useLang } from "@/app/i18n";
import CustomCursor from "@/components/CustomCursor";

export default function ImpactPage() {
  const { t, lang } = useLang();
  const isEs = lang === "es";

  return (
    <main className="bg-[#020617] text-white selection:bg-brandOrange selection:text-white min-h-screen font-sans overflow-x-hidden relative">
      <CustomCursor />
      
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Cinematic Top Gradient Fade for Header */}
      <div className="fixed top-0 left-0 right-0 h-[20vh] bg-gradient-to-b from-[#020617] via-[#020617]/60 to-transparent z-[40] pointer-events-none"></div>

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
        <motion.div className="relative z-10 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="w-12 h-[1px] bg-brandOrange"></span>
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-brandOrange">
              {t.impact.preTitle}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display font-black text-6xl md:text-8xl lg:text-[8rem] uppercase leading-[0.85] tracking-tight mb-10"
          >
            {t.impact.title1}<br/>
            <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}>
              {t.impact.title2}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-mono text-sm md:text-base text-white/50 max-w-2xl leading-relaxed uppercase tracking-[0.1em]"
          >
            {t.impact.desc}
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-6 md:left-20 flex items-center gap-4 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/50">{t.impact.scroll}</span>
          <div className="w-16 h-[1px] bg-white/10 relative overflow-hidden">
             <motion.div 
               animate={{ x: ["-100%", "100%"] }} 
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
               className="absolute top-0 left-0 w-full h-full bg-brandOrange"
             />
          </div>
        </motion.div>
      </section>

      {/* The 3 Pillars (Glassmorphism Redesign) */}
      <section className="relative z-10 py-32 border-b border-white/10 bg-[#020617]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <h2 className="font-display font-black text-5xl md:text-7xl uppercase leading-[0.9]">
                {t.impact.pillarsTitle1}<br/>
                <span className="text-brandOrange">{t.impact.pillarsTitle2}</span>
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 max-w-md">
              {t.impact.pillarsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {t.impact.pillars.map((pillar, i) => {
              const icons = [Camera, Database, Brain];
              const Icon = icons[i];
              return (
                <div key={i} className={`border border-white/10 p-10 hover:border-brandOrange/50 transition-all duration-500 bg-white/[0.02] backdrop-blur-md hover:bg-brandOrange/[0.02] hoverable group shadow-2xl shadow-transparent hover:shadow-brandOrange/5 ${i === 1 ? 'lg:mt-16' : ''} ${i === 2 ? 'lg:mt-32' : ''}`}>
                  <Icon className="w-12 h-12 text-white/20 group-hover:text-brandOrange mb-10 transition-colors drop-shadow-[0_0_15px_rgba(255,100,0,0)] group-hover:drop-shadow-[0_0_15px_rgba(255,100,0,0.8)]" />
                  <h3 className="font-display text-3xl font-black uppercase mb-4 text-white/90 group-hover:text-white transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="font-mono text-xs text-white/50 leading-loose uppercase tracking-[0.1em] group-hover:text-white/70 transition-colors">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before vs After Ecosystem (Deep Tech Dark Mode Redesign) */}
      <section className="relative z-10 py-32 bg-[#020617] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        
        {/* Glowing orb background effect for the 3Tree Paradigm */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brandOrange/20 blur-[120px] rounded-full pointer-events-none opacity-50 mix-blend-screen hidden md:block"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {/* The Old Paradigm */}
            <div className="relative">
              <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block"></div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.3em] mb-10 text-white/40">
                {t.impact.oldParadigmTitle}
              </h3>
              <ul className="space-y-8 font-display text-2xl md:text-3xl font-black uppercase text-white/30">
                {t.impact.oldParadigm.map((item, i) => (
                  <li key={i} className="flex items-center gap-6">
                    <X className="w-6 h-6 text-red-500/50 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The 3Tree Paradigm */}
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.3em] mb-10 text-brandOrange">
                {t.impact.newParadigmTitle}
              </h3>
              <ul className="space-y-8 font-display text-3xl md:text-4xl font-black uppercase text-white drop-shadow-md">
                {t.impact.newParadigm.map((item, i) => (
                  <li key={i} className="flex items-center gap-6 hoverable group">
                    <div className="w-8 h-8 rounded-full bg-brandOrange/10 border border-brandOrange/50 flex items-center justify-center group-hover:bg-brandOrange group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(255,100,0,0.3)] group-hover:shadow-[0_0_25px_rgba(255,100,0,0.8)] flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-brandOrange group-hover:text-black transition-colors" />
                    </div>
                    <span className="group-hover:text-brandOrange transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Action */}
      <section className="py-24 text-center container mx-auto px-6 border-t border-white/10 relative z-10 bg-[#020617]">
        <Link 
          href="/in-the-play" 
          className="hoverable inline-flex items-center gap-4 bg-transparent border border-brandOrange text-brandOrange px-12 py-6 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-brandOrange hover:text-[#020617] group shadow-[0_0_30px_rgba(255,100,0,0.1)] hover:shadow-[0_0_50px_rgba(255,100,0,0.4)]"
        >
          {t.cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </section>
    </main>
  );
}
