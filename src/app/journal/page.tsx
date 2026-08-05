"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import { aiArticles, neilArticles } from "@/lib/articlesData";
import { useEffect, useState } from "react";
import { getJournalArticles } from "@/app/actions/journal";
import { Loader2 } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function JournalHub() {
  const { lang } = useLang();
  const isEs = lang === "es";
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

  const featuredNeil = displayNeilArticles[0];
  const remainingArticles = [...displayNeilArticles.slice(1), ...displayAiArticles];

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white relative overflow-x-hidden font-sans">
      <CustomCursor />

      {/* Architectural Grid Background (Awwwards Style) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-50 w-full px-6 py-6 border-b border-white/10 flex justify-between items-center bg-[#020617]/80 backdrop-blur-md">
        <div className="font-display font-black text-2xl tracking-widest uppercase">
          3Tree<span className="text-brandOrange">.</span> Journal
        </div>
        <Link href="/" className="hoverable group flex items-center gap-4 text-white hover:text-brandOrange transition-colors">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] hidden md:inline">{isEs ? "Volver al Inicio" : "Back to Home"}</span>
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brandOrange bg-[#020617]">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>
      </nav>

      {/* Hero Awwwards Style */}
      <header className="relative z-10 w-full border-b border-white/10 overflow-hidden bg-[#020617]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-8 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center relative overflow-hidden">
            {/* Background glowing orb */}
            <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-brandOrange/10 blur-[120px] rounded-full pointer-events-none"></div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[14vw] md:text-[10vw] lg:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter relative z-10"
            >
              THE EDGE <br/> 
              <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>JOURNAL</span>
            </motion.h1>
          </div>
          <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-end bg-white/[0.02]">
            <p className="font-mono text-sm md:text-base leading-[1.8] text-white/60 mb-10">
              {isEs 
                ? "Análisis profundos, investigación de la industria e ideas disruptivas en la intersección del deporte profesional y la innovación digital."
                : "Deep-dive insights, industry research, and disruptive ideas at the intersection of professional sports and digital innovation."}
            </p>
            <div className="flex gap-4 flex-wrap">
              <span className="px-4 py-2 border border-white/10 rounded-none text-[10px] font-mono uppercase tracking-widest text-brandOrange">AI Tech</span>
              <span className="px-4 py-2 border border-white/10 rounded-none text-[10px] font-mono uppercase tracking-widest">Performance</span>
              <span className="px-4 py-2 border border-white/10 rounded-none text-[10px] font-mono uppercase tracking-widest">Big Data</span>
            </div>
          </div>
        </div>
        
        {/* Marquee Ticker */}
        <div className="w-full border-t border-white/10 bg-brandOrange py-3 overflow-hidden flex items-center whitespace-nowrap">
           <motion.div 
            animate={{ x: [0, -1000] }} 
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="flex gap-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[#020617] font-bold"
          >
            {[...Array(10)].map((_, i) => (
              <span key={i}>PERFORMANCE ANALYSIS • SCOUTING ALGORITHMS • BIG DATA INTELLIGENCE • AUTOMATION •</span>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Site of the Day / Featured Article (Neil's Latest) */}
      {featuredNeil && (
        <section className="relative z-10 w-full border-b border-white/10 bg-[#020617]">
          <Link href={`/journal/${featuredNeil.slug || featuredNeil.id}`} className="block group hoverable w-full relative h-[60vh] md:h-[85vh] overflow-hidden">
            {/* Background Image (Grayscale to Color) */}
            <div className="absolute inset-0 bg-[#020617] z-0">
              <Image 
                src={featuredNeil.image || featuredNeil.imageUrl || "/placeholder.jpg"}
                alt={featuredNeil.title}
                fill
                className="object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>
            </div>
            
            {/* Inner Content */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-16 lg:p-24">
              <div className="flex justify-between items-start">
                <div className="bg-brandOrange text-[#020617] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 rounded-sm">
                  <Star className="w-4 h-4 fill-[#020617]" /> {isEs ? "Visión Destacada" : "Featured Vision"}
                </div>
                <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md group-hover:bg-brandOrange group-hover:border-brandOrange transition-colors duration-500 overflow-hidden relative">
                  <ArrowUpRight className="w-8 h-8 text-white group-hover:-translate-y-12 group-hover:translate-x-12 transition-transform duration-500 absolute" />
                  <ArrowUpRight className="w-8 h-8 text-white translate-y-12 -translate-x-12 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500 delay-100 absolute" />
                </div>
              </div>
              
              <div className="max-w-5xl">
                <p className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-brandOrange mb-6 flex items-center gap-4">
                  {isEs ? "Por" : "By"} {featuredNeil.author || 'Neil Alvarado'} 
                  <span className="w-1 h-1 rounded-full bg-white/30"></span> 
                  {featuredNeil.time || featuredNeil.readTime}
                </p>
                <h2 className="font-display text-4xl md:text-6xl lg:text-[6rem] font-black uppercase leading-[0.9] text-white transition-colors duration-500">
                  {featuredNeil.title}
                </h2>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Directory Grid (Awwwards Style Bento) */}
      <section className="relative z-10 w-full bg-[#020617]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-white/10">
          
          {/* Section Title Cell */}
          <div className="p-8 md:p-12 border-b border-r border-white/10 flex flex-col justify-center bg-white/[0.02] col-span-1 md:col-span-2 lg:col-span-1 min-h-[400px]">
            <h3 className="font-display text-4xl font-black uppercase mb-6 leading-none">{isEs ? "Directorio" : "Directory"} <br/><span className="text-brandOrange">Index</span></h3>
            <p className="font-mono text-xs text-white/50 tracking-widest uppercase leading-relaxed">
              {isEs 
                ? `Explora ${remainingArticles.length} entradas de inteligencia curada sobre tecnología deportiva.` 
                : `Explore ${remainingArticles.length} entries of highly curated intelligence on sports tech.`}
            </p>
          </div>

          {/* Grid Items */}
          {remainingArticles.map((article: any, i: number) => (
            <Link 
              href={`/journal/${article.slug || article.id}`} 
              key={article.id} 
              className="block group hoverable relative border-b border-r border-white/10 aspect-square lg:aspect-auto min-h-[400px] overflow-hidden bg-[#020617]"
            >
              <div className="absolute inset-0 bg-[#020617] group-hover:bg-brandOrange/5 transition-colors duration-500 z-0">
                 <Image 
                  src={article.image || article.imageUrl || "/placeholder.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover opacity-10 grayscale group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-[1s] ease-in-out group-hover:scale-110"
                />
              </div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 text-white/80 rounded-sm">
                    {article.category || "Report"}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-brandOrange transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-brandOrange mb-4 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {article.time || article.readTime}
                  </div>
                  <h4 className="font-display text-2xl font-bold uppercase leading-[1.1] text-white/90 group-hover:text-white transition-colors duration-300">
                    {article.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
