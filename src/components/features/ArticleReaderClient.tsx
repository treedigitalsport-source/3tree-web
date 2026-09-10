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
  time?: string;
  timeEs?: string;
  timeEn?: string;
  author?: string;
  authorRoleEs?: string;
  authorRoleEn?: string;
  execSummaryEn?: string;
  execSummaryEs?: string;
  insightsEn?: string[];
  insightsEs?: string[];
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
  const { lang, toggleLang } = useLang();
  const isEs = lang === "es";

  // Rich markdown parser for article content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    const parseInline = (text: string) => {
      // Split on bold (**text**) and italic (*text*)
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} className="font-black text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={idx} className="italic text-brandOrange/90">{part.slice(1, -1)}</em>;
        }
        return part;
      });
    };

    while (i < lines.length) {
      const line = lines[i];

      // Table parsing
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }
        if (tableLines.length >= 2) {
          const headerCells = tableLines[0].split('|').filter(Boolean).map(c => c.trim());
          const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
          elements.push(
            <div key={`table-${i}`} className="my-8 overflow-x-auto rounded-2xl border border-white/15 bg-white/[0.02] backdrop-blur-md shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/15 bg-brandOrange/10">
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx} className="py-3.5 px-6 font-mono text-xs font-black uppercase tracking-widest text-brandOrange">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-sans text-sm">
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.03] transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`py-3.5 px-6 leading-relaxed ${cIdx === 0 ? 'text-white/60' : 'text-white font-medium'}`}>
                          {parseInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // H1 Header (If present in body, render subtly or skip to prevent duplicating hero)
      if (line.startsWith('# ')) {
        const h1Text = line.replace('# ', '').trim();
        // If it's a different subtitle or lead title, render as styled lead header
        if (h1Text.toLowerCase() !== articleTitle.toLowerCase()) {
          elements.push(
            <h2 key={`h1-${i}`} className="text-2xl md:text-3xl font-display font-black text-white mt-8 mb-6 leading-tight tracking-tight">
              {parseInline(h1Text)}
            </h2>
          );
        }
        i++;
        continue;
      }

      // H2 Header
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-2xl md:text-3xl font-display font-black text-white mt-12 mb-6 pb-3 border-b border-white/10 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brandOrange shrink-0"></span>
            {parseInline(line.replace('## ', ''))}
          </h2>
        );
        i++;
        continue;
      }

      // H3 Header
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg md:text-xl font-display font-bold text-brandOrange mt-8 mb-4">
            {parseInline(line.replace('### ', ''))}
          </h3>
        );
        i++;
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={`quote-${i}`} className="border-l-4 border-brandOrange bg-brandOrange/[0.05] p-6 rounded-r-2xl my-8 text-white/90 italic text-lg md:text-xl font-serif leading-relaxed shadow-lg">
            {parseInline(line.replace('> ', ''))}
          </blockquote>
        );
        i++;
        continue;
      }

      // Horizontal Rule
      if (line.trim() === '---') {
        elements.push(
          <hr key={`hr-${i}`} className="my-10 border-t border-white/10" />
        );
        i++;
        continue;
      }

      // Bullet List
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().replace(/^[-*]\s+/, '');
        elements.push(
          <div key={`li-${i}`} className="flex items-start gap-3 my-3 text-white/80 text-base md:text-lg leading-relaxed font-sans pl-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brandOrange mt-2.5 shrink-0" />
            <span>{parseInline(bulletText)}</span>
          </div>
        );
        i++;
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        elements.push(<div key={`blank-${i}`} className="h-4" />);
        i++;
        continue;
      }

      // Regular Paragraph
      elements.push(
        <p key={`p-${i}`} className="text-white/80 text-base md:text-lg leading-relaxed mb-6 font-sans tracking-wide">
          {parseInline(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  const articleTitle = isEs ? (article.titleEs || article.titleEn) : (article.titleEn || article.titleEs);
  const articleCategory = isEs ? (article.categoryEs || article.categoryEn) : (article.categoryEn || article.categoryEs);
  const articleContent = isEs ? (article.contentEs || article.contentEn) : (article.contentEn || article.contentEs);
  const articleTime = isEs ? (article.timeEs || article.time || "5 min read") : (article.timeEn || article.time || "5 min read");


  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 w-full px-6 md:px-12 py-8 flex justify-between items-center z-50">
        <Link href="/journal" className="hoverable flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-all duration-300 backdrop-blur-md bg-white/5">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] hidden md:inline">
            {isEs ? "Volver al Diario" : "Back to Journal"}
          </span>
        </Link>
        <button
          onClick={toggleLang}
          className="font-mono text-xs font-extrabold px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:border-brandOrange hover:text-brandOrange transition-all cursor-pointer uppercase tracking-wider text-white backdrop-blur-md"
        >
          {lang === "es" ? "EN" : "ES"}
        </button>
      </nav>

      {/* Editorial Hero Banner & Header */}
      <section className="relative z-10 w-full pt-28 md:pt-36 pb-12 px-6 md:px-12 border-b border-white/10 bg-gradient-to-b from-[#050d21] via-[#020617] to-[#020617]">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brandOrange/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Category, Read Time & Author Badges */}
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="px-4 py-1.5 rounded-full bg-brandOrange text-white font-mono text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(242,101,34,0.4)]">
              {articleCategory}
            </span>
            <div className="flex items-center gap-1.5 text-white/80 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border border-white/10">
              <Clock className="w-3 h-3 text-brandOrange" />
              {articleTime}
            </div>
            {article.author && (
              <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border border-white/15">
                <span className="text-brandOrange font-black">{isEs ? "Por " : "By "}{article.author}</span>
                {(article.authorRoleEs || article.authorRoleEn) && (
                  <span className="text-white/60 font-normal hidden sm:inline border-l border-white/20 pl-2">
                    {isEs ? article.authorRoleEs : article.authorRoleEn}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Article Main Headline */}
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-[1.08] max-w-4xl mb-10">
            {articleTitle}
          </h1>

          {/* Centered Premium Infographic Showcase Frame */}
          <div className="relative w-full max-w-2xl sm:max-w-3xl aspect-square rounded-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-black/90 flex items-center justify-center p-3 sm:p-5 group">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={article.image}
                alt={articleTitle}
                fill
                className="object-contain object-top transition-transform duration-700 group-hover:scale-[1.01]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content Layout (2-Column) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 pb-32 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-start">
        
        {/* Left Sidebar: Intelligence Panel */}
        <aside className="md:col-span-4 space-y-12 order-2 md:order-1 sticky top-32">
          {/* Executive Summary Box */}
          {(article.execSummaryEn || article.execSummaryEs) && (
            <div className="bg-brandOrange/[0.02] border border-brandOrange/20 p-8 rounded-xl backdrop-blur-md relative overflow-hidden group hover:border-brandOrange/50 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-brandOrange"></div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brandOrange mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brandOrange animate-pulse"></div>
                {isEs ? "Resumen Ejecutivo" : "Executive Summary"}
              </h3>
              <p className="text-white/80 text-[15px] leading-relaxed font-serif italic">
                {isEs ? article.execSummaryEs : article.execSummaryEn}
              </p>
            </div>
          )}

          {/* Key Insights Box */}
          {(article.insightsEn || article.insightsEs) && (
            <div className="space-y-6">
               <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 border-b border-white/10 pb-3">
                {isEs ? "Datos Clave (Insights)" : "Key Insights"}
               </h3>
               <ul className="space-y-5">
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
