"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, ArrowUpRight, PenTool } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import { aiArticles, neilArticles } from "@/lib/articlesData";
import { useEffect, useState } from "react";
import { getJournalArticles } from "@/app/actions/journal";
import { Loader2 } from "lucide-react";

export default function JournalHub() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const result = await getJournalArticles();
      if (result.success && result.articles && result.articles.length > 0) {
        setArticles(result.articles);
      }
      setLoading(false);
    }
    fetchArticles();
  }, []);

  const dbNeilArticles = articles.filter(a => a.author === "Neil Alvarado");
  const dbAiArticles = articles.filter(a => a.author !== "Neil Alvarado");

  const displayNeilArticles = dbNeilArticles.length > 0 ? dbNeilArticles : neilArticles;
  const displayAiArticles = dbAiArticles.length > 0 ? dbAiArticles : aiArticles;

  if (loading) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-brandOrange"><Loader2 className="w-12 h-12 animate-spin" /></div>;
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white relative overflow-hidden">
      <CustomCursor />

      {/* Background Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brandOrange/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#0054a6]/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="w-full px-6 md:px-12 py-8 flex justify-between items-center relative z-50">
        <Link href="/" className="hoverable flex items-center gap-3 text-white/50 hover:text-white transition-colors group">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brandOrange group-hover:bg-brandOrange/10 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Volver al Inicio</span>
        </Link>
        <div className="font-display font-black text-2xl tracking-widest uppercase">
          3Tree<span className="text-brandOrange">.</span>
        </div>
      </nav>

      {/* Header Section */}
      <header className="pt-20 pb-32 px-6 md:px-12 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <BookOpen className="w-5 h-5 text-brandOrange" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-brandOrange">
              The Edge Journal
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-6xl md:text-8xl font-black uppercase leading-[0.9] mb-8"
          >
            Shaping The Future <br />
            <span className="text-white/30">Of Sports Tech.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white/50 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Deep-dive insights, industry research, and disruptive ideas at the intersection of professional sports and digital innovation.
          </motion.p>
        </div>
      </header>

      {/* Neil's Weekly Column Section */}
      <section className="px-6 md:px-12 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
            <div className="w-12 h-12 rounded-full bg-[#0054a6]/20 flex items-center justify-center border border-[#0054a6]/50">
              <PenTool className="w-6 h-6 text-[#0054a6]" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-black uppercase text-white tracking-wide">
                Columna Especializada
              </h2>
              <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mt-1">
                Por Neil Alvarado • Experto en Analíticas de Béisbol
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {displayNeilArticles.map((article: any, i: number) => (
              <Link href={`/journal/${article.slug || article.id}`} key={article.id} className="block group hoverable h-full">
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                  className="bg-[#020617] border border-white/10 rounded-[2rem] p-8 md:p-10 hover:border-brandOrange/50 transition-colors duration-500 h-full flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brandOrange/5 blur-[50px] group-hover:bg-brandOrange/20 transition-colors duration-500 pointer-events-none"></div>
                  
                  <div className="flex flex-col h-full relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-brandOrange/10 border border-brandOrange/20 text-brandOrange font-mono text-[9px] font-bold uppercase tracking-wider mb-6 w-fit">
                      Nuevo Lanzamiento
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl font-bold uppercase mb-4 text-white group-hover:text-brandOrange transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-[1.8] font-medium mb-8">
                      {article.desc || article.content?.substring(0, 100) + "..."}
                    </p>
                    <div className="flex items-center gap-2 text-white/30 font-mono text-[10px] uppercase tracking-widest mt-auto">
                      <Clock className="w-3 h-3" /> {article.time || article.readTime}
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Articles Grid */}
      <section className="px-6 md:px-12 pb-40 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
            <div>
              <h2 className="font-display text-3xl font-black uppercase text-white tracking-wide">
                Reportes de Inteligencia
              </h2>
              <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mt-1">
                Análisis de Mercado en IA & Sports Tech
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayAiArticles.map((article: any, i: number) => (
              <Link href={`/journal/${article.slug || article.id}`} key={article.id} className="block group hoverable">
                <motion.article
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="relative rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/[0.05] group-hover:border-white/20 transition-colors duration-500"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>
                    <Image
                      src={article.image || article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out opacity-60"
                    />
                    
                    {/* Top Tags */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
                      <span className="px-3 py-1.5 rounded-full bg-brandOrange/90 backdrop-blur-md text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-white/80 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {article.time || article.readTime}
                      </div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-8 relative">
                    {/* Arrow Icon floating */}
                    <div className="absolute -top-6 right-8 w-12 h-12 bg-[#020617] border border-white/10 rounded-full flex items-center justify-center group-hover:bg-brandOrange group-hover:border-brandOrange transition-colors duration-500 z-20">
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>

                    <h2 className="font-display text-2xl font-bold uppercase mb-4 group-hover:text-brandOrange transition-colors duration-300">
                      {article.title}
                    </h2>
                    <p className="text-white/50 text-sm leading-[1.8] font-medium line-clamp-3">
                      {article.desc || article.content?.substring(0, 100) + "..."}
                    </p>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
