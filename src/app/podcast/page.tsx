"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Headphones, Clock, Calendar, BarChart3, Radio, Loader2, Newspaper } from "lucide-react";
import { useLang } from "../i18n";
import { useEffect, useState } from "react";
import { getPodcastEpisodes, getPodcastNews } from "@/app/actions/podcast";
import CustomCursor from "@/components/CustomCursor";

const staticEpisodesEs = [
  { id: "1", title: "El Futuro del Análisis en Béisbol", date: "01 Ago, 2026", duration: "45 min" },
  { id: "2", title: "IA en Transmisiones Deportivas", date: "25 Jul, 2026", duration: "52 min" },
  { id: "3", title: "Biomecánica para Atletas de Élite", date: "18 Jul, 2026", duration: "38 min" },
  { id: "4", title: "Redefiniendo el Compromiso del Fan", date: "10 Jul, 2026", duration: "41 min" }
];

const staticEpisodesEn = [
  { id: "1", title: "The Future of Baseball Analytics", date: "Aug 01, 2026", duration: "45 min" },
  { id: "2", title: "AI in Sports Broadcasting", date: "Jul 25, 2026", duration: "52 min" },
  { id: "3", title: "Biomechanics for Elite Athletes", date: "Jul 18, 2026", duration: "38 min" },
  { id: "4", title: "Redefining Fan Engagement", date: "Jul 10, 2026", duration: "41 min" }
];

const staticNewsEs = [
  {
    id: "1",
    category: "MLB / BÉISBOL",
    title: "Los Dodgers integran Kinebase Pro para optimizar la rotación de lanzadores abridores",
    desc: "El cuerpo técnico del equipo oficializa la implementación de análisis biomecánico 3D en tiempo real.",
    date: "Hoy",
    time: "Hace 2 horas",
    videoUrl: "/Player_speaks_with_journalists_1080p_202608051858.mp4",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    category: "NFL / FÚTBOL AMERICANO",
    title: "Equipos de la NFL adoptan tracking óptico en tiempo real para análisis de aceleración de corredores",
    desc: "El sistema de cámaras computarizadas analiza el impacto y la aceleración muscular de los corredores para optimizar el rendimiento.",
    date: "Ayer",
    time: "Hace 1 día",
    videoUrl: "/Corredor_de_fútbol_americano_en_202608051848.mp4",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const staticNewsEn = [
  {
    id: "1",
    category: "MLB / BASEBALL",
    title: "Dodgers integrate Kinebase Pro to optimize starting pitcher rotation",
    desc: "The team's coaching staff officializes the implementation of real-time 3D biomechanical analysis.",
    date: "Today",
    time: "2 hours ago",
    videoUrl: "/Player_speaks_with_journalists_1080p_202608051858.mp4",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    category: "NFL / FOOTBALL",
    title: "NFL teams adopt real-time optical tracking for runner acceleration analytics",
    desc: "The computerized camera system tracks muscle acceleration and collision impact in real-time to optimize performance.",
    date: "Yesterday",
    time: "1 day ago",
    videoUrl: "/Corredor_de_fútbol_americano_en_202608051848.mp4",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export default function PodcastPage() {
  const { t, lang } = useLang();
  const isEs = lang === "es";
  const [activeTab, setActiveTab] = useState<"podcast" | "news">("podcast");

  const podcast = t.podcast || {
    title: "zon_ethos",
    subtitle: "Deep dives into Sports Tech, Data, and Future.",
    listenLatest: "Listen to Latest",
    latestEpisode: "LATEST EPISODE",
    previousEpisodes: "Previous Episodes",
  };

  const [episodes, setEpisodes] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const epResult = await getPodcastEpisodes();
      if (epResult.success && epResult.episodes && epResult.episodes.length > 0) {
        setEpisodes(epResult.episodes);
      } else {
        setEpisodes(isEs ? staticEpisodesEs : staticEpisodesEn);
      }

      const newsResult = await getPodcastNews();
      if (newsResult.success && newsResult.news && newsResult.news.length > 0) {
        setNewsList(newsResult.news);
      } else {
        setNewsList(isEs ? staticNewsEs : staticNewsEn);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const featuredEpisode = episodes[0];
  const previousEpisodes = episodes.slice(1);

  if (loading) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-brandOrange"><Loader2 className="w-12 h-12 animate-spin" /></div>;
  }

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
          zon<span className="text-brandOrange">_</span>ethos
        </div>
        <Link href="/" className="hoverable group flex items-center gap-4 text-white hover:text-brandOrange transition-colors">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] hidden md:inline">{isEs ? "Volver al Inicio" : "Back to Home"}</span>
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brandOrange bg-[#020617]">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>
      </nav>

      {/* Hero Header */}
      <header className="relative z-10 w-full border-b border-white/10 overflow-hidden bg-[#020617]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-8 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center relative overflow-hidden min-h-[40vh]">
            <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-brandOrange/10 blur-[120px] rounded-full pointer-events-none"></div>
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[10vw] md:text-[8vw] lg:text-[6vw] font-black uppercase leading-[0.85] tracking-tighter relative z-10"
            >
              AUDIO <br/> 
              <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>INTELLIGENCE</span>
            </motion.h1>
          </div>
          <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-end bg-white/[0.02]">
            <p className="font-mono text-sm md:text-base leading-[1.8] text-white/60 mb-10">
              {podcast.subtitle}
            </p>
            
            {/* Tab Selector Awwwards Style */}
            <div className="flex flex-col gap-0 border border-white/10">
              <button
                className={`p-4 font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition-colors text-left flex items-center justify-between border-b border-white/10 bg-brandOrange text-[#020617] cursor-default`}
              >
                <span><Radio className="inline-block w-3 h-3 mr-2" /> PODCAST</span>
                <span className="w-2 h-2 rounded-full bg-[#020617]"></span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 w-full bg-[#020617]">
        <>
          {/* Featured Player Component */}
          <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-white/10">
            <div className="relative border-b lg:border-b-0 lg:border-r border-white/10 h-[50vh] lg:h-[70vh] bg-black overflow-hidden group">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                src="/gridiron_ai_1785627944344.jpg" 
                alt="Podcast Cover" 
                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent"></div>
               <div className="absolute bottom-8 left-8">
                 <span className="bg-brandOrange text-[#020617] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                   <Radio className="w-3 h-3 animate-pulse" /> ON AIR
                 </span>
               </div>
            </div>

            <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-[#020617]">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50 mb-6">
                {podcast.latestEpisode} • SEASON 1
              </span>
              <h2 className="font-display text-4xl md:text-6xl font-black uppercase leading-[0.9] text-white mb-8">
                {featuredEpisode?.title}
              </h2>
              
              <div className="flex gap-4 font-mono text-[10px] uppercase tracking-widest text-brandOrange mb-12">
                <span>{featuredEpisode?.date}</span>
                <span className="text-white/20">|</span>
                <span>{featuredEpisode?.duration}</span>
              </div>

              {/* Premium Audio Interface */}
              <div className="bg-white/[0.02] border border-white/10 p-6 flex flex-col gap-6">
                {/* Fake Waveform */}
                <div className="w-full h-12 flex items-center gap-1 opacity-50">
                  {[...Array(40)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: ["20%", "100%", "30%"] }}
                      transition={{ repeat: Infinity, duration: (i % 5) * 0.2 + 0.5, ease: "easeInOut" }}
                      className="flex-1 bg-brandOrange w-1 rounded-full"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <button className="hoverable w-16 h-16 rounded-full bg-white text-[#020617] flex items-center justify-center hover:bg-brandOrange transition-colors">
                    <PlayCircle className="w-8 h-8 ml-1" />
                  </button>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-white mb-1">{podcast.listenLatest}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Spotify • Apple Podcasts</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Previous Episodes Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border-l border-white/10">
            <div className="p-8 md:p-12 border-b border-r border-white/10 flex flex-col justify-center bg-white/[0.02] min-h-[300px]">
              <h3 className="font-display text-4xl font-black uppercase mb-4 leading-none">
                {podcast.previousEpisodes}
              </h3>
              <p className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase">Archive Index</p>
            </div>

            {previousEpisodes.map((ep: any, i: number) => (
              <div key={i} className="p-8 border-b border-r border-white/10 bg-[#020617] hover:bg-brandOrange/5 transition-colors group flex flex-col justify-between min-h-[300px] hoverable cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-8 h-8 text-brandOrange" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 mb-6 block">EPISODE 0{i + 2}</span>
                  <h4 className="font-display text-2xl font-bold uppercase leading-tight text-white mb-6 group-hover:text-brandOrange transition-colors">
                    {ep.title}
                  </h4>
                </div>
                <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-brandOrange/70">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {ep.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {ep.duration}</span>
                </div>
              </div>
            ))}
          </section>
        </>
      </div>
    </main>
  );
}
