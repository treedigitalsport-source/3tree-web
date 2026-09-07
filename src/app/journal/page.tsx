"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, ArrowUpRight, BookOpen, Sparkles, User, Brain, Shield, ChevronRight } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import { aiArticles, neilArticles } from "@/lib/articlesData";
import { useState } from "react";
import { useLang } from "@/app/i18n";
import { Footer } from "@/components/ui/Footer";

export default function JournalHub() {
  const { lang, toggleLang } = useLang();
  const isEs = lang === "es";

  const [activeFilter, setActiveFilter] = useState("all");

  const categories = [
    { id: "all", labelEs: "Todos los Artículos", labelEn: "All Articles" },
    { id: "founder", labelEs: "Columna del Fundador", labelEn: "Founder's Column" },
    { id: "ai", labelEs: "Sport Intelligence & IA", labelEn: "Sport Intelligence & AI" },
  ];

  const filteredNeil = activeFilter === "ai" ? [] : neilArticles;
  const filteredAi = activeFilter === "founder" ? [] : aiArticles;

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white relative overflow-x-hidden font-sans">
      <CustomCursor />

      {/* Architectural Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>

      {/* ─── NAVIGATION ─── */}
      <nav className="relative z-50 w-full px-6 md:px-12 py-6 border-b border-white/10 flex justify-between items-center bg-[#020617]/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-brandOrange flex items-center justify-center font-display font-black text-sm text-white shadow-md">
            3
          </div>
          <div className="font-display font-black text-xl tracking-widest uppercase text-white">
            3Tree<span className="text-brandOrange">.</span>Journal
          </div>
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

      {/* ─── HERO HEADER ─── */}
      <header className="relative z-10 w-full border-b border-white/10 bg-gradient-to-b from-[#020617] via-[#050d21] to-[#020617] py-16 md:py-24 px-6 md:px-12 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brandOrange/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0054A6]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brandOrange/10 border border-brandOrange/30 text-brandOrange font-mono text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isEs ? "PUBLICACIÓN EDITORIAL OFICIAL" : "OFFICIAL EDITORIAL DISPATCH"}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.9]">
              THE EDGE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandOrange via-white to-sky-400">
                JOURNAL
              </span>
            </h1>
          </div>

          <div className="max-w-md">
            <p className="font-sans text-sm md:text-base text-white/70 leading-relaxed font-light mb-6">
              {isEs
                ? "Investigación, sabermetría avanzada e ideas disruptivas en la intersección del deporte profesional, la biomecánica y la inteligencia artificial."
                : "Deep research, advanced sabermetrics, and disruptive ideas at the intersection of professional sports, biomechanics, and artificial intelligence."}
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeFilter === cat.id
                      ? "bg-brandOrange text-white shadow-[0_0_20px_rgba(242,101,34,0.4)]"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {isEs ? cat.labelEs : cat.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ─── DUAL WINDOWS EDITORIAL SECTION ─── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* ═════════ WINDOW 1: PERSPECTIVA DEL ANALISTA (NEIL ALVARADO) ═════════ */}
          {filteredNeil.length > 0 && (
            <div className="flex flex-col gap-6">
              
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brandOrange/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brandOrange/15 border border-brandOrange/40 flex items-center justify-center text-brandOrange">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-lg md:text-xl uppercase tracking-wider text-white">
                      {isEs ? "Perspectiva del Analista" : "Analyst's Perspective"}
                    </h2>
                    <span className="font-mono text-[10px] text-brandOrange uppercase tracking-widest">
                      Neil Alvarado · Analista Deportivo
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-brandOrange/10 border border-brandOrange/30 font-mono text-[10px] font-bold text-brandOrange">
                  {filteredNeil.length} {isEs ? "Artículos" : "Articles"}
                </span>
              </div>

              {/* Neil Articles Stack */}
              <div className="space-y-6">
                {filteredNeil.map((article: any, index: number) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-[#060c1c]/90 border border-white/10 hover:border-brandOrange/60 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Dedicated Top Badges Header */}
                    <div className="px-6 pt-5 pb-3 flex justify-between items-center bg-[#060c1c] border-b border-white/5">
                      <span className="px-3 py-1 rounded-full bg-brandOrange text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-md">
                        {isEs ? article.categoryEs : article.categoryEn}
                      </span>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-mono text-[10px]">
                        <Clock className="w-3 h-3 text-brandOrange" />
                        <span>{isEs ? article.timeEs : article.timeEn}</span>
                      </div>
                    </div>

                    {/* Featured Image Frame */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/90 p-3 flex items-center justify-center">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                        <Image
                          src={article.image || "/images/articles/baseball_biomechanics_1785628048219.jpg"}
                          alt={isEs ? article.titleEs : article.titleEn}
                          fill
                          className="object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-white leading-tight mb-4 group-hover:text-brandOrange transition-colors">
                          {isEs ? article.titleEs : article.titleEn}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed font-light mb-6">
                          {isEs ? article.descEs : article.descEn}
                        </p>
                      </div>

                      {/* Card Footer CTA */}
                      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brandOrange/20 border border-brandOrange/40 flex items-center justify-center text-brandOrange">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block text-[8px] font-mono uppercase tracking-widest text-white/50">
                              {isEs ? "Escrito por" : "Written by"}
                            </span>
                            <span className="font-mono text-xs uppercase tracking-wider text-brandOrange font-black">
                              {article.author || "Neil Alvarado"}
                            </span>
                            {(article.authorRoleEs || article.authorRoleEn) && (
                              <span className="block text-[9px] font-mono text-white/40 max-w-[180px] sm:max-w-xs truncate">
                                {isEs ? article.authorRoleEs : article.authorRoleEn}
                              </span>
                            )}
                          </div>
                        </div>

                        <Link
                          href={`/journal/${article.slug || article.id}`}
                          className="hoverable inline-flex items-center gap-2 bg-white/5 hover:bg-brandOrange text-white hover:text-white px-5 py-2.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border border-white/15 hover:border-brandOrange transition-all duration-300 group/btn shadow-md"
                        >
                          <span>{isEs ? "Leer Artículo" : "Read Article"}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════ WINDOW 2: SPORT INTELLIGENCE & IA ═════════ */}
          {filteredAi.length > 0 && (
            <div className="flex flex-col gap-6">
              
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#0054A6]/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0054A6]/20 border border-[#0054A6]/50 flex items-center justify-center text-[#0054A6]">
                    <Brain className="w-4 h-4 text-[#388bfd]" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-lg md:text-xl uppercase tracking-wider text-white">
                      {isEs ? "Sport Intelligence & IA" : "Sport Intelligence & AI"}
                    </h2>
                    <span className="font-mono text-[10px] text-[#388bfd] uppercase tracking-widest">
                      Sports OS · Deep Research
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#0054A6]/20 border border-[#0054A6]/40 font-mono text-[10px] font-bold text-[#388bfd]">
                  {filteredAi.length} {isEs ? "Artículos" : "Articles"}
                </span>
              </div>

              {/* AI Articles Stack */}
              <div className="space-y-6">
                {filteredAi.map((article: any, index: number) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-[#060c1c]/90 border border-white/10 hover:border-[#0054A6] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Dedicated Top Badges Header (Outside of the artwork to prevent any overlay or cut) */}
                    <div className="px-6 pt-5 pb-3 flex justify-between items-center bg-[#060c1c] border-b border-white/5">
                      <span className="px-3 py-1 rounded-full bg-[#0054A6] text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-md">
                        {isEs ? article.categoryEs : article.categoryEn}
                      </span>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-mono text-[10px]">
                        <Clock className="w-3 h-3 text-[#388bfd]" />
                        <span>{isEs ? article.timeEs : article.timeEn}</span>
                      </div>
                    </div>

                    {/* Featured Image Frame: 100% Full Uncropped Square Infographic */}
                    <div className="relative w-full aspect-square overflow-hidden bg-black/95 p-3 flex items-center justify-center">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                        <Image
                          src={article.image || "/images/articles/el_partido_invisible_1788755675644.jpg"}
                          alt={isEs ? article.titleEs : article.titleEn}
                          fill
                          className="object-contain object-center transition-all duration-700 group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-white leading-tight mb-4 group-hover:text-[#388bfd] transition-colors">
                          {isEs ? article.titleEs : article.titleEn}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed font-light mb-6">
                          {isEs ? article.descEs : article.descEn}
                        </p>
                      </div>

                      {/* Card Footer CTA */}
                      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white">
                            <User className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <span className="block text-[8px] font-mono uppercase tracking-widest text-white/50">
                              {isEs ? "Escrito por" : "Written by"}
                            </span>
                            <span className="font-mono text-xs uppercase tracking-wider text-white font-black">
                              {article.author || "Ali Zapata"}
                            </span>
                            {(article.authorRoleEs || article.authorRoleEn) && (
                              <span className="block text-[9px] font-mono text-white/40 max-w-[180px] sm:max-w-xs truncate">
                                {isEs ? article.authorRoleEs : article.authorRoleEn}
                              </span>
                            )}
                          </div>
                        </div>

                        <Link
                          href={`/journal/${article.slug || article.id}`}
                          className="hoverable inline-flex items-center gap-2 bg-white/5 hover:bg-[#0054A6] text-white hover:text-white px-5 py-2.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border border-white/15 hover:border-[#0054A6] transition-all duration-300 group/btn shadow-md"
                        >
                          <span>{isEs ? "Leer Artículo" : "Read Article"}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ─── FOOTER CORPORATIVO UNIFICADO ─── */}
      <Footer />
    </main>
  );
}

