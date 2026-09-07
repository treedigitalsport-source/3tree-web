"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Target, Globe, Bot, Database, Compass, CheckCircle2, AlertCircle, Zap, ArrowUpRight } from "lucide-react";
import { useLang } from "@/app/i18n";
import CustomCursor from "@/components/CustomCursor";
import { Footer } from "@/components/ui/Footer";

export default function AboutPage() {
  const { lang, t, toggleLang } = useLang();
  const isEs = lang === "es";

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white font-sans overflow-x-hidden relative">
      <CustomCursor />
      
      {/* Background Animated Gradient & Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,101,34,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,255,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
      </div>
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      {/* ─── INSTITUTIONAL HEADER ─── */}
      <header className="relative z-50 w-full px-6 md:px-12 lg:px-16 py-6 flex justify-between items-center border-b border-white/[0.04] bg-[#020617]/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center hoverable group shrink-0">
            <div className="h-12 sm:h-14 w-auto flex items-center relative transition-all duration-300 group-hover:scale-[1.02]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/icons/logo-3tree.png" 
                alt="3Tree Digital" 
                className="h-full w-auto max-h-14 max-w-[220px] sm:max-w-[280px] object-contain object-left filter brightness-105" 
              />
            </div>
          </Link>
          <div className="hidden lg:block h-6 w-[1px] bg-gradient-to-b from-transparent via-white/[0.08] to-transparent blur-[0.4px]"></div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLang}
            className="group hoverable flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors px-3 py-1.5 border border-white/15 rounded-full bg-white/[0.04] backdrop-blur-md hover:border-brandOrange/40"
          >
            <Globe className="w-3 h-3 text-white/70 group-hover:text-brandOrange group-hover:rotate-180 transition-all duration-700 ease-in-out" /> {lang === 'en' ? 'ES' : 'EN'}
          </button>

          <Link href="/" className="hoverable group flex items-center gap-2 text-white/80 hover:text-brandOrange transition-colors px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] text-[10px] font-mono font-bold uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>{isEs ? "Inicio" : "Home"}</span>
          </Link>
          
          <Link href="/contact" className="hidden sm:flex hoverable items-center gap-1.5 bg-brandOrange text-white px-5 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-white hover:text-brandOrange transition-all duration-300 shadow-md shadow-brandOrange/25">
            {t.cta} <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 w-full">
        
        {/* 1. HERO SECTION (El Manifiesto) */}
        <section className="container mx-auto px-6 max-w-5xl pt-16 md:pt-24 pb-24 md:pb-32">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="w-16 h-16 rounded-2xl bg-brandOrange/10 border border-brandOrange/30 flex items-center justify-center mx-auto mb-6 text-brandOrange shadow-[0_0_25px_rgba(242,101,34,0.25)]"
            >
              <Target className="w-8 h-8 drop-shadow-[0_0_10px_rgba(242,101,34,0.6)]" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-display font-black uppercase tracking-tight leading-[0.9] mb-6"
            >
              {t.about.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs font-mono tracking-[0.3em] text-brandOrange font-bold uppercase mb-4"
            >
              {t.about.subtitle}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xs sm:text-sm font-mono text-white/50 uppercase tracking-widest max-w-2xl mx-auto"
            >
              {t.about.tagline}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 font-sans text-base md:text-lg text-white/80 leading-relaxed text-left max-w-4xl mx-auto bg-white/[0.015] border border-white/10 p-8 sm:p-10 md:p-14 rounded-[2.5rem] backdrop-blur-xl shadow-2xl"
          >
            <p className="text-white/90 font-light text-base sm:text-lg">
              {t.about.heroText1}
            </p>
            
            <div className="border-l-4 border-brandOrange pl-6 py-2 bg-brandOrange/5 rounded-r-2xl">
              <p className="font-display font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-wide text-brandOrange leading-snug">
                {t.about.heroText2}
              </p>
            </div>

            <p className="text-white/70 font-light leading-relaxed text-sm sm:text-base">
              {t.about.heroText3}
            </p>
          </motion.div>
        </section>

        {/* 2. FILOSOFÍA Y UVP */}
        <section className="bg-white/[0.01] border-y border-white/10 py-24 md:py-32 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brandOrange/5 blur-[140px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">
                {t.about.uvpTitle}
              </h2>
              <div className="bg-white/[0.02] border border-brandOrange/30 p-8 md:p-12 rounded-3xl max-w-4xl mx-auto backdrop-blur-md shadow-[0_0_40px_rgba(242,101,34,0.1)]">
                <p className="text-base sm:text-xl md:text-2xl font-display uppercase font-bold text-brandOrange leading-relaxed drop-shadow-[0_0_15px_rgba(242,101,34,0.3)]">
                  "{t.about.uvpQuote}"
                </p>
              </div>
            </div>

            {/* Desktop Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto border border-white/10 rounded-3xl bg-[#020617]/70 backdrop-blur-md shadow-2xl">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="p-6 font-mono text-xs uppercase tracking-widest text-white/70 w-1/4">{t.about.tableHeaders[0]}</th>
                    <th className="p-6 font-mono text-xs uppercase tracking-widest text-white/70 w-1/3">{t.about.tableHeaders[1]}</th>
                    <th className="p-6 font-mono text-xs uppercase tracking-widest text-brandOrange w-5/12">{t.about.tableHeaders[2]}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.about.tableRows.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group hoverable">
                      <td className="p-6 font-display font-bold text-base md:text-lg uppercase text-white/90">{row.dim}</td>
                      <td className="p-6 font-mono text-xs md:text-sm text-white/50 leading-relaxed uppercase flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400/60 shrink-0 mt-0.5" /> 
                        <span>{row.old}</span>
                      </td>
                      <td className="p-6 font-mono text-xs md:text-sm text-white leading-relaxed uppercase group-hover:text-brandOrange transition-colors">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-brandOrange shrink-0 mt-0.5" />
                          <span>{row.new}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (< 768px) */}
            <div className="md:hidden space-y-6">
              {t.about.tableRows.map((row, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl space-y-4">
                  <span className="font-display font-black text-lg uppercase text-white tracking-wide block border-b border-white/10 pb-3">
                    {row.dim}
                  </span>
                  <div className="space-y-3 font-mono text-xs uppercase">
                    <div className="flex items-start gap-2.5 text-white/50 bg-red-950/20 border border-red-500/20 p-3.5 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{row.old}</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-white bg-brandOrange/10 border border-brandOrange/30 p-3.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-brandOrange shrink-0 mt-0.5" />
                      <span className="text-brandOrange font-bold">{row.new}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. LOS 4 PILARES ESTRATÉGICOS */}
        <section className="container mx-auto px-6 max-w-7xl py-24 md:py-32">
          <div className="mb-16 md:mb-20 text-center">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
              {t.about.pillarsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.pillars.map((pillar, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl hover:border-brandOrange/50 transition-all hoverable group flex flex-col justify-between shadow-xl hover:shadow-brandOrange/10"
              >
                <div>
                  {i === 0 && <Target className="w-10 h-10 text-white/30 group-hover:text-brandOrange mb-6 transition-colors drop-shadow-[0_0_10px_rgba(242,101,34,0.4)]" />}
                  {i === 1 && <Database className="w-10 h-10 text-white/30 group-hover:text-brandOrange mb-6 transition-colors" />}
                  {i === 2 && <Globe className="w-10 h-10 text-white/30 group-hover:text-brandOrange mb-6 transition-colors" />}
                  {i === 3 && <Bot className="w-10 h-10 text-white/30 group-hover:text-brandOrange mb-6 transition-colors" />}
                  
                  <h3 className="font-display text-lg xl:text-xl font-black uppercase mb-4 text-white group-hover:text-brandOrange transition-colors leading-snug break-words">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-white/60 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5 font-mono text-[10px] text-brandOrange/70 tracking-widest uppercase font-bold">
                  Pillar 0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. EL ROADMAP */}
        <section className="bg-brandOrange text-[#020617] py-24 md:py-32 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          
          <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <div className="text-center mb-16 md:mb-20 flex flex-col items-center">
              <Compass className="w-12 h-12 mb-6 text-[#020617]/70" />
              <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight">
                {t.about.roadmapTitle}
              </h2>
            </div>

            <div className="space-y-12 md:space-y-16">
              {t.about.roadmap.map((step, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-16 items-start bg-black/5 p-8 sm:p-10 rounded-3xl border border-black/10 hover:bg-black/10 transition-colors">
                  <div className="md:w-1/3 flex-shrink-0">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#020617]/60 block mb-1 font-bold">{isEs ? `Fase 0${i+1}` : `Phase 0${i+1}`}</span>
                    <h3 className="font-display text-2xl md:text-3xl font-black uppercase border-b-2 border-[#020617]/30 pb-3">
                      {step.phase}
                    </h3>
                  </div>
                  <div className="md:w-2/3">
                    <p className="font-sans text-sm md:text-base leading-relaxed font-medium text-[#020617]/90">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. INSTITUTIONAL CLOSING BANNER */}
        <section className="py-24 text-center container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/10 p-10 md:p-14 rounded-3xl space-y-6 shadow-2xl"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-brandOrange/10 border border-brandOrange/30 text-brandOrange font-mono text-xs font-bold uppercase tracking-widest">
              {t.about.closingBanner.badge}
            </div>
            
            <h2 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight text-white">
              {t.about.closingBanner.company}
            </h2>

            <p className="font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-white/50">
              {t.about.closingBanner.tags}
            </p>

            <div className="pt-6 border-t border-white/10">
              <p className="font-display font-bold text-xl md:text-2xl text-brandOrange uppercase mb-2">
                "{t.about.closingBanner.moto}"
              </p>
              <p className="font-sans text-sm text-white/60 font-light">
                {t.about.closingBanner.sub}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Footer Action */}
        <section className="py-16 text-center container mx-auto px-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/contact" 
              className="hoverable inline-flex items-center gap-3 bg-brandOrange text-white hover:bg-white hover:text-brandOrange px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all rounded-xl shadow-lg shadow-brandOrange/20"
            >
              {t.cta} <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/" 
              className="hoverable inline-flex items-center gap-3 bg-transparent border border-white/20 hover:border-brandOrange text-white px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-brandOrange/10 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" /> {isEs ? "Volver al Inicio" : "Back to Home"}
            </Link>
          </div>
        </section>
      </main>

      {/* ─── FOOTER CORPORATIVO UNIFICADO ─── */}
      <Footer />
    </div>
  );
}

