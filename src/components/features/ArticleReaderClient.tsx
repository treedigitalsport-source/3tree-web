"use client";

import { ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/app/i18n";
import { SocialLinks } from "@/components/ui/SocialLinks";

type Article = {
  id: number;
  slug: string;
  image: string;
  time: string;
  author?: string;
  titleEn: string;
  categoryEn: string;
  descEn: string;
  contentEn: string;
  titleEs: string;
  categoryEs: string;
  descEs: string;
  contentEs: string;
};

export default function ArticleReaderClient({ article }: { article: Article }) {
  const { lang } = useLang();
  const isEs = lang === "es";

  // Very basic markdown parser for the article content
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl md:text-5xl font-display font-black text-white mt-12 mb-8 leading-tight">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl md:text-2xl font-display font-bold text-white mt-10 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={index} className="border-l-4 border-brandOrange pl-6 my-8 text-white/80 italic text-lg md:text-xl font-serif">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.trim() === '') return <div key={index} className="h-4"></div>;
      return <p key={index} className="text-white/90 text-base md:text-lg leading-relaxed mb-6 font-normal">{line}</p>;
    });
  };

  const articleTitle = isEs ? (article.titleEs || article.titleEn) : (article.titleEn || article.titleEs);
  const articleCategory = isEs ? (article.categoryEs || article.categoryEn) : (article.categoryEn || article.categoryEs);
  const articleContent = isEs ? (article.contentEs || article.contentEn) : (article.contentEn || article.contentEs);


  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 w-full px-6 md:px-12 py-8 flex justify-between items-center z-50 mix-blend-difference">
        <Link href="/journal" className="hoverable flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-all duration-300 backdrop-blur-md bg-white/5">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] hidden md:inline">{isEs ? "Volver al Diario" : "Back to Journal"}</span>
          </span>
        </Link>
      </nav>

      {/* Hero Image Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
        <Image
          src={article.image}
          alt={articleTitle}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-16 z-10">
          <div className="max-w-4xl mx-auto">
            <div
              className="flex items-center gap-4 mb-6 flex-wrap"
            >
              <span className="px-4 py-2 rounded-full bg-brandOrange text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_#f26522]">
                {articleCategory}
              </span>
              <div className="flex items-center gap-2 text-white/80 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest border border-white/10">
                <Clock className="w-3 h-3" />
                {isEs ? article.timeEs : article.timeEn}
              </div>
              {/* @ts-ignore */}
              {article.author && (
                <div className="flex items-center gap-2 text-white bg-[#0054a6] px-4 py-2 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  By {article.author}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content Layout (2-Column) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 pb-32 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-start">
        
        {/* Left Sidebar: Intelligence Panel */}
        <aside className="md:col-span-4 space-y-12 order-2 md:order-1 sticky top-32">
          {/* Executive Summary Box */}
          {/* @ts-ignore - Dynamic fields added to DB */}
          {(article.execSummaryEn || article.execSummaryEs) && (
            <div className="bg-brandOrange/[0.02] border border-brandOrange/20 p-8 rounded-xl backdrop-blur-md relative overflow-hidden group hover:border-brandOrange/50 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-brandOrange"></div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brandOrange mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brandOrange animate-pulse"></div>
                {isEs ? "Resumen Ejecutivo" : "Executive Summary"}
              </h3>
              <p className="text-white/80 text-[15px] leading-relaxed font-serif italic">
                {/* @ts-ignore */}
                {isEs ? article.execSummaryEs : article.execSummaryEn}
              </p>
            </div>
          )}

          {/* Key Insights Box */}
          {/* @ts-ignore */}
          {(article.insightsEn || article.insightsEs) && (
            <div className="space-y-6">
               <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 border-b border-white/10 pb-3">
                {isEs ? "Datos Clave (Insights)" : "Key Insights"}
               </h3>
               <ul className="space-y-5">
                  {/* @ts-ignore */}
                  {(isEs ? article.insightsEs : article.insightsEn)?.map((insight: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start text-[14px] text-[#9ca3af] font-light leading-relaxed">
                      <span className="font-mono text-brandOrange font-bold opacity-50 text-xs mt-1">0{i + 1}</span>
                      {insight}
                    </li>
                  ))}
               </ul>
            </div>
          )}

          {/* Author/Share block */}
          <div className="pt-8 border-t border-white/10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">
                {isEs ? "Compartir Reporte" : "Share Report"}
            </p>
            <SocialLinks />
          </div>
        </aside>

        {/* Right Column: Main Narrative */}
        <article className="md:col-span-8 order-1 md:order-2">
          <div className="w-full">
            {articleContent ? renderContent(articleContent) : null}
          </div>
        </article>
      </div>

      {/* Footer Divider */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 border-t border-white/10 pt-12 pb-24 text-center">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">
          3Tree Digital Sport IA &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
