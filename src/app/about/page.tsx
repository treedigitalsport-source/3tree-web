"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Target, Globe, Bot, Database, Compass, CheckCircle2, AlertCircle, Zap, Cpu, Sparkles } from "lucide-react";
import { useLang } from "@/app/i18n";
import CustomCursor from "@/components/CustomCursor";

export default function AboutPage() {
  const { lang, t } = useLang();
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

      {/* Nav Bar */}
      <nav className="relative z-50 w-full p-8 md:px-16 flex justify-between items-center mix-blend-difference">
        <Link href="/" className="hoverable group flex items-center gap-4 text-white hover:text-brandOrange transition-colors">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] hidden md:inline">{isEs ? "Volver al Inicio" : "Back to Home"}</span>
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brandOrange bg-[#020617]">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>
      </nav>

      <main className="relative z-10 w-full">
        
        {/* 1. HERO SECTION (El Manifiesto) */}
        <section className="container mx-auto px-6 max-w-5xl pt-10 pb-32">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 0 30px rgba(242,101,34,0.4)" }}
              className="w-16 h-16 rounded-2xl bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center mx-auto mb-6 text-brandOrange transition-colors"
            >
              <Target className="w-8 h-8 drop-shadow-[0_0_10px_rgba(242,101,34,0.6)]" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl lg:text-[6rem] font-display font-black uppercase tracking-tighter leading-[0.85] mb-6"
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
              className="text-sm font-mono text-white/50 uppercase tracking-widest max-w-2xl mx-auto"
            >
              {t.about.tagline}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 font-sans text-base md:text-lg text-white/80 leading-relaxed text-left max-w-4xl mx-auto bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md"
          >
            <p className="text-white/90 font-light">
              {t.about.heroText1}
            </p>
            
            <div className="border-l-2 border-brandOrange pl-6 py-2">
              <p className="font-display font-bold text-xl md:text-2xl uppercase tracking-wide text-brandOrange">
                {t.about.heroText2}
              </p>
            </div>

            <p className="text-white/70 font-light leading-relaxed">
              {t.about.heroText3}
            </p>
          </motion.div>
        </section>

        {/* 2. FILOSOFÍA Y UVP */}
        <section className="bg-white/[0.01] border-y border-white/5 py-32 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brandOrange/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">
                {t.about.uvpTitle}
              </h2>
              <div className="bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-3xl max-w-4xl mx-auto backdrop-blur-sm">
                <p className="text-lg md:text-2xl font-display uppercase font-bold text-brandOrange leading-snug drop-shadow-[0_0_15px_rgba(242,101,34,0.3)]">
                  "{t.about.uvpQuote}"
                </p>
              </div>
            </div>

            {/* Tabla Comparativa */}
            <div className="overflow-x-auto border border-white/10 rounded-3xl bg-[#020617]/50 backdrop-blur-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-4 sm:p-6 font-mono text-xs uppercase tracking-widest text-white/70 w-1/4">{t.about.tableHeaders[0]}</th>
                    <th className="p-4 sm:p-6 font-mono text-xs uppercase tracking-widest text-white/70 w-1/3">{t.about.tableHeaders[1]}</th>
                    <th className="p-4 sm:p-6 font-mono text-xs uppercase tracking-widest text-brandOrange w-5/12">{t.about.tableHeaders[2]}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.about.tableRows.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group hoverable">
                      <td className="p-6 font-display font-bold text-base md:text-lg uppercase text-white/90">{row.dim}</td>
                      <td className="p-6 font-mono text-xs md:text-sm text-white/50 leading-relaxed uppercase flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" /> 
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
          </div>
        </section>

        {/* 3. LOS 4 PILARES ESTRATÉGICOS */}
        <section className="container mx-auto px-6 max-w-7xl py-32">
          <div className="mb-20 text-center">
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight">
              {t.about.pillarsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.pillars.map((pillar, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl hover:border-brandOrange/50 transition-all hoverable group flex flex-col justify-between"
              >
                <div>
                  {i === 0 && <Globe className="w-10 h-10 text-white/30 group-hover:text-brandOrange mb-6 transition-colors" />}
                  {i === 1 && <Bot className="w-10 h-10 text-white/30 group-hover:text-brandOrange mb-6 transition-colors" />}
                  {i === 2 && <Database className="w-10 h-10 text-white/30 group-hover:text-brandOrange mb-6 transition-colors" />}
                  {i === 3 && <Zap className="w-10 h-10 text-white/30 group-hover:text-brandOrange mb-6 transition-colors" />}
                  
                  <h3 className="font-display text-xl font-black uppercase mb-4 text-white group-hover:text-brandOrange transition-colors leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-white/60 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5 font-mono text-[10px] text-white/30 tracking-widest uppercase">
                  Pillar 0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. EL ROADMAP */}
        <section className="bg-brandOrange text-[#020617] py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          
          <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <div className="text-center mb-20 flex flex-col items-center">
              <Compass className="w-12 h-12 mb-6 opacity-60" />
              <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tight">
                {t.about.roadmapTitle}
              </h2>
            </div>

            <div className="space-y-16">
              {t.about.roadmap.map((step, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-16 items-start bg-black/5 p-8 rounded-3xl border border-black/10">
                  <div className="md:w-1/3 flex-shrink-0">
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
            className="bg-white/[0.02] border border-white/10 p-10 md:p-14 rounded-3xl space-y-6"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-brandOrange/10 border border-brandOrange/20 text-brandOrange font-mono text-xs font-bold uppercase tracking-widest">
              {t.about.closingBanner.badge}
            </div>
            
            <h2 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight text-white">
              {t.about.closingBanner.company}
            </h2>

            <p className="font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-white/50">
              {t.about.closingBanner.tags}
            </p>

            <div className="pt-4 border-t border-white/5">
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
          <Link 
            href="/in-the-play" 
            className="hoverable inline-flex items-center gap-4 bg-transparent border border-white/20 hover:border-brandOrange text-white px-10 py-5 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-brandOrange/10 group rounded-xl"
          >
            {t.cta} <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </main>
    </div>
  );
}
