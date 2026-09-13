"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, ArrowUpRight, BookOpen, Sparkles, User, Brain, Shield, ChevronRight, ChevronLeft } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import { aiArticles, neilArticles, Article } from "@/lib/articlesData";
import { useState, useEffect } from "react";
import { useLang } from "@/app/i18n";
import { Footer } from "@/components/ui/Footer";

const ITEMS_PER_PAGE = 6;

export default function JournalHub() {
  const { lang, toggleLang } = useLang();
  const isEs = lang === "es";

  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: "all", labelEs: "Todos los Artículos", labelEn: "All Articles" },
    { id: "founder", labelEs: "Columna del Fundador", labelEn: "Founder's Column" },
    { id: "analyst", labelEs: "Perspectiva del Analista", labelEn: "Analyst's Perspective" },
  ];

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const allArticlesList = (
    activeFilter === "founder"
      ? aiArticles
      : activeFilter === "analyst"
      ? neilArticles
      : [...aiArticles, ...neilArticles]
  );

  const totalPages = Math.max(1, Math.ceil(allArticlesList.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleArticles = allArticlesList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      const gridElem = document.getElementById("journal-grid");
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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
            3Tree<span className="text-brandOrange">.</span>{isEs ? "Diario" : "Journal"}
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
              {isEs ? "EL DIARIO" : "THE EDGE"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandOrange via-white to-sky-400">
                {isEs ? "EDITORIAL" : "JOURNAL"}
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
                  onClick={() => handleFilterChange(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
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

      {/* ─── UNIFIED RESPONSIVE EDITORIAL GRID ─── */}
      <section id="journal-grid" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Section Title & Article Counter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brandOrange/15 border border-brandOrange/40 flex items-center justify-center text-brandOrange">
              {activeFilter === "founder" ? (
                <Sparkles className="w-5 h-5 text-[#388bfd]" />
              ) : activeFilter === "analyst" ? (
                <User className="w-5 h-5 text-brandOrange" />
              ) : (
                <BookOpen className="w-5 h-5 text-brandOrange" />
              )}
            </div>
            <div>
              <h2 className="font-display font-black text-xl md:text-2xl uppercase tracking-wider text-white">
                {activeFilter === "founder"
                  ? isEs ? "Columna del Fundador" : "Founder's Column"
                  : activeFilter === "analyst"
                  ? isEs ? "Perspectiva del Analista" : "Analyst's Perspective"
                  : isEs ? "Todos los Artículos de Investigación" : "All Research Articles"}
              </h2>
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-widest">
                {activeFilter === "founder"
                  ? "Ali Zapata · Sport Intelligence & IA"
                  : activeFilter === "analyst"
                  ? "Neil Alvarado · Analista Deportivo"
                  : isEs ? "3Tree Digital Sport IA · Ecosistema Editorial" : "3Tree Digital Sport IA · Editorial Hub"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-brandOrange/10 border border-brandOrange/30 font-mono text-xs font-bold text-brandOrange">
              {allArticlesList.length}{" "}
              {isEs ? "Artículos Publicados" : "Published Articles"}
            </span>
            {totalPages > 1 && (
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-xs font-bold text-white/70">
                {isEs ? `Página ${currentPage} de ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
              </span>
            )}
          </div>
        </div>

        {/* Responsive Balanced Grid (Pixel-Perfect Uniform Dimensions & Framing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {visibleArticles.map((article: Article, index: number) => {
            const isFounder = article.author?.includes("Ali") || article.categoryEs?.includes("Fundador");

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={`group relative bg-[#060c1c]/90 border rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between h-full ${
                  isFounder
                    ? "border-white/10 hover:border-[#388bfd]/60"
                    : "border-white/10 hover:border-brandOrange/60"
                }`}
              >
                <div className="flex flex-col flex-1">
                  {/* Dedicated Top Badges Header (Strict Uniform Height) */}
                  <div className="px-6 py-3.5 flex justify-between items-center bg-[#060c1c] border-b border-white/5 h-12">
                    <span
                      className={`px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase tracking-wider shadow-md text-white ${
                        isFounder ? "bg-[#0054A6]" : "bg-brandOrange"
                      }`}
                    >
                      {isEs ? article.categoryEs : article.categoryEn}
                    </span>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-mono text-[10px]">
                      <Clock
                        className={`w-3 h-3 ${isFounder ? "text-[#388bfd]" : "text-brandOrange"}`}
                      />
                      <span>{isEs ? article.timeEs : article.timeEn}</span>
                    </div>
                  </div>

                  {/* Featured Image Frame: 100% Strict 1:1 Aspect-Square Uniform Frame */}
                  <div className="relative w-full aspect-square overflow-hidden bg-black/95 p-3 flex items-center justify-center shrink-0">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-black">
                      <Image
                        src={article.image || "/images/articles/el_partido_invisible_1788755675644.jpg"}
                        alt={isEs ? article.titleEs : article.titleEn}
                        fill
                        className="object-contain object-center transition-all duration-700 group-hover:scale-[1.01]"
                      />
                    </div>
                  </div>

                  {/* Article Content with Normalized Heights */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3
                        className={`font-display font-black text-lg uppercase tracking-tight text-white leading-snug mb-3 transition-colors line-clamp-2 min-h-[3.5rem] flex items-center ${
                          isFounder ? "group-hover:text-[#388bfd]" : "group-hover:text-brandOrange"
                        }`}
                      >
                        {isEs ? article.titleEs : article.titleEn}
                      </h3>

                      <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed font-light mb-4 line-clamp-3 min-h-[4rem]">
                        {isEs ? article.descEs : article.descEn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA (Strict Uniform Height) */}
                <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center bg-[#060c1c] h-18 mt-auto">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${
                        isFounder
                          ? "bg-[#0054A6]/20 border-[#0054A6]/40 text-[#388bfd]"
                          : "bg-brandOrange/20 border-brandOrange/40 text-brandOrange"
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[8px] font-mono uppercase tracking-widest text-white/50">
                        {isEs ? "Escrito por" : "Written by"}
                      </span>
                      <span
                        className={`font-mono text-xs uppercase tracking-wider font-black truncate block ${
                          isFounder ? "text-white" : "text-brandOrange"
                        }`}
                      >
                        {article.author}
                      </span>
                      {(article.authorRoleEs || article.authorRoleEn) && (
                        <span className="block text-[9px] font-mono text-white/40 truncate max-w-[150px]">
                          {isEs ? article.authorRoleEs : article.authorRoleEn}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/journal/${article.slug || article.id}`}
                    className={`hoverable shrink-0 inline-flex items-center gap-2 text-white px-4 py-2 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 group/btn shadow-md ${
                      isFounder
                        ? "bg-white/5 hover:bg-[#0054A6] border-white/15 hover:border-[#0054A6]"
                        : "bg-white/5 hover:bg-brandOrange border-white/15 hover:border-brandOrange"
                    }`}
                  >
                    <span>{isEs ? "Leer Artículo" : "Read Article"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── INTERACTIVE PAGINATION CONTROLS ─── */}
        {totalPages > 1 && (
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="font-mono text-xs text-white/60">
              {isEs
                ? `Mostrando ${startIndex + 1} - ${Math.min(startIndex + ITEMS_PER_PAGE, allArticlesList.length)} de ${allArticlesList.length} artículos`
                : `Showing ${startIndex + 1} - ${Math.min(startIndex + ITEMS_PER_PAGE, allArticlesList.length)} of ${allArticlesList.length} articles`}
            </div>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  currentPage === 1
                    ? "opacity-30 cursor-not-allowed border-white/10 text-white/40"
                    : "bg-white/5 hover:bg-brandOrange hover:border-brandOrange text-white border-white/15"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isEs ? "Anterior" : "Prev"}</span>
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-full font-mono text-xs font-black transition-all duration-300 cursor-pointer flex items-center justify-center border ${
                      currentPage === pageNum
                        ? "bg-brandOrange border-brandOrange text-white shadow-[0_0_20px_rgba(242,101,34,0.5)] scale-105"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  currentPage === totalPages
                    ? "opacity-30 cursor-not-allowed border-white/10 text-white/40"
                    : "bg-brandOrange/20 hover:bg-brandOrange hover:border-brandOrange text-white border-brandOrange/40"
                }`}
              >
                <span>{isEs ? "Siguiente" : "Next"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ─── FOOTER CORPORATIVO UNIFICADO ─── */}
      <Footer />
    </main>
  );
}

