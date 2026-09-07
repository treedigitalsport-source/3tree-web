"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Camera, Database, ArrowLeft, X, Sparkles } from "lucide-react";
import { useLang } from "@/app/i18n";
import CustomCursor from "@/components/CustomCursor";
import { Footer } from "@/components/ui/Footer";

export default function ImpactPage() {
  const { t, lang, toggleLang } = useLang();
  const isEs = lang === "es";

  return (
    <main className="bg-[#020617] text-white selection:bg-brandOrange selection:text-white min-h-screen font-sans overflow-x-hidden relative flex flex-col">
      <CustomCursor />
      
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 w-full px-6 md:px-12 py-6 flex justify-between items-center border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
        <Link href="/" className="font-display font-black text-xl md:text-2xl tracking-widest uppercase hover:opacity-80 transition-opacity">
          3Tree Digital <span className="text-brandOrange">Sport IA</span>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="font-mono text-xs font-extrabold px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:border-brandOrange hover:text-brandOrange transition-all cursor-pointer uppercase tracking-wider text-white"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <Link href="/" className="hoverable group flex items-center gap-3 text-white/70 hover:text-white transition-colors">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest hidden sm:inline">
              {isEs ? "Volver al Inicio" : "Back to Home"}
            </span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brandOrange group-hover:bg-brandOrange/10 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center px-6 md:px-16 lg:px-20 pt-20 pb-16 overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#020617] via-[#050d21] to-[#020617]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brandOrange/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0054A6]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brandOrange/10 border border-brandOrange/30 text-brandOrange font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.impact.preTitle}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.95] tracking-tight mb-8 break-words"
          >
            {t.impact.title1}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandOrange via-white to-sky-400">
              {t.impact.title2}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed font-light"
          >
            {t.impact.desc}
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-12 flex items-center gap-4 z-30 max-w-5xl mx-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-white/40">{t.impact.scroll}</span>
          <div className="w-16 h-[1px] bg-white/10 relative overflow-hidden">
             <motion.div 
               animate={{ x: ["-100%", "100%"] }} 
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
               className="absolute top-0 left-0 w-full h-full bg-brandOrange"
             />
          </div>
        </motion.div>
      </section>

      {/* The 3 Pillars Section */}
      <section className="relative z-10 py-16 md:py-24 border-b border-white/10 bg-[#020617]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase leading-[0.95] tracking-tight">
                {t.impact.pillarsTitle1}<br/>
                <span className="text-brandOrange">{t.impact.pillarsTitle2}</span>
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-white/50 max-w-md">
              {t.impact.pillarsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {t.impact.pillars.map((pillar, i) => {
              const icons = [Camera, Database, Brain];
              const Icon = icons[i];
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border border-white/10 p-6 sm:p-7 rounded-[2rem] hover:border-brandOrange/40 transition-all duration-300 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] group flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5 group-hover:border-brandOrange/50 group-hover:bg-brandOrange/10 transition-colors">
                      <Icon className="w-5 h-5 text-white/60 group-hover:text-brandOrange transition-colors" />
                    </div>
                    <h3 className="font-display text-xs sm:text-sm md:text-base font-black uppercase mb-3 text-white leading-snug tracking-tight break-words">
                      {pillar.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before vs After Ecosystem */}
      <section className="relative z-10 py-16 md:py-24 bg-[#020617] text-white overflow-hidden">
        {/* Glowing background accent */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brandOrange/10 blur-[140px] rounded-full pointer-events-none hidden md:block"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* The Old Paradigm */}
            <div className="p-6 sm:p-8 rounded-[2rem] border border-white/10 bg-white/[0.01]">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-white/40 border-b border-white/10 pb-3">
                {t.impact.oldParadigmTitle}
              </h3>
              <ul className="space-y-4 font-display text-sm sm:text-base font-bold uppercase text-white/40 tracking-tight">
                {t.impact.oldParadigm.map((item, i) => (
                  <li key={i} className="flex items-center gap-3.5 break-words">
                    <X className="w-4 h-4 text-red-400/60 flex-shrink-0" />
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The 3Tree Paradigm */}
            <div className="p-6 sm:p-8 rounded-[2rem] border border-brandOrange/30 bg-gradient-to-br from-brandOrange/10 via-transparent to-transparent shadow-[0_0_40px_rgba(242,101,34,0.08)]">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-brandOrange border-b border-brandOrange/20 pb-3">
                {t.impact.newParadigmTitle}
              </h3>
              <ul className="space-y-4 font-display text-sm sm:text-base font-black uppercase text-white tracking-tight">
                {t.impact.newParadigm.map((item, i) => (
                  <li key={i} className="flex items-center gap-3.5 group break-words">
                    <div className="w-6 h-6 rounded-full bg-brandOrange/20 border border-brandOrange/50 flex items-center justify-center flex-shrink-0 group-hover:bg-brandOrange transition-colors">
                      <ArrowRight className="w-3 h-3 text-brandOrange group-hover:text-black transition-colors" />
                    </div>
                    <span className="group-hover:text-brandOrange transition-colors break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Action CTA */}
      <section className="py-16 md:py-20 text-center container mx-auto px-6 border-t border-white/10 relative z-10 bg-[#020617] mt-auto">
        <Link 
          href="/#projects" 
          className="hoverable inline-flex items-center gap-4 bg-brandOrange text-white px-10 py-5 rounded-2xl font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-brandOrange hover:scale-105 shadow-[0_0_30px_rgba(242,101,34,0.3)]"
        >
          {isEs ? "Explorar Tecnología" : "Explore Technology"} 
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ─── FOOTER CORPORATIVO UNIFICADO ─── */}
      <Footer />
    </main>
  );
}

