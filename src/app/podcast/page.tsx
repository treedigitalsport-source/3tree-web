"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Headphones, Clock, Calendar, BarChart3, Radio, Loader2, Newspaper } from "lucide-react";
import { useLang } from "../i18n";
import { useEffect, useState } from "react";
import { getPodcastEpisodes, getPodcastNews } from "@/app/actions/podcast";

const staticEpisodes = [
  { id: "1", title: "The Future of Baseball Analytics", date: "Aug 01, 2026", duration: "45 min" },
  { id: "2", title: "AI in Sports Broadcasting", date: "Jul 25, 2026", duration: "52 min" },
  { id: "3", title: "Biomechanics for Elite Athletes", date: "Jul 18, 2026", duration: "38 min" },
  { id: "4", title: "Redefining Fan Engagement", date: "Jul 10, 2026", duration: "41 min" }
];

const staticNews = [
  {
    id: "1",
    category: "Lanzamiento",
    title: "Kinebase v2.0 con rastreo biomecánico 3D en tiempo real",
    desc: "Nuestra suite insignia recibe una actualización mayor, permitiendo a los entrenadores analizar ángulos de lanzamiento en béisbol con menos de 2ms de latencia en la nube.",
    date: "Hoy",
    time: "Hace 2 horas",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    category: "Alianza",
    title: "3Tree Digital firma acuerdo de analíticas avanzadas con academia de béisbol de élite en República Dominicana",
    desc: "Colaboraremos en el desarrollo de software a medida para el scouting de jóvenes prospectos utilizando analíticas de datos de radares avanzados de Trackman.",
    date: "Ayer",
    time: "Hace 1 día",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "3",
    category: "Reporte de Mercado",
    title: "El impacto de la inteligencia artificial generativa en las transmisiones deportivas",
    desc: "Publicamos nuestro reporte anual detallando cómo los gráficos interactivos personalizados aumentan la retención del fanático joven en un 42% en transmisiones en vivo.",
    date: "Jul 24, 2026",
    time: "Hace 1 semana",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

export default function PodcastPage() {
  const { t, lang } = useLang();
  const [activeTab, setActiveTab] = useState<"podcast" | "news">("podcast");

  // Handle case where dictionary is incomplete or loading
  const podcast = t.podcast || {
    title: "3Tree Podcast",
    subtitle: "Deep dives into Sports Tech, Data, and Future.",
    listenLatest: "Listen to Latest Episode",
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
        // Fallback to static data if no DB data yet
        setEpisodes(staticEpisodes);
      }

      const newsResult = await getPodcastNews();
      if (newsResult.success && newsResult.news && newsResult.news.length > 0) {
        setNewsList(newsResult.news);
      } else {
        setNewsList(staticNews);
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
    <div className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white font-sans overflow-x-hidden relative">
      
      {/* Background Animated Gradient & Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,101,34,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      {/* Nav Bar */}
      <nav className="relative z-50 w-full p-8 md:px-16 flex justify-between items-center mix-blend-difference">
        <Link href="/" className="hoverable group flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Volver al Inicio</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pt-10 pb-32">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brandOrange/30 bg-brandOrange/10 text-brandOrange text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
            <Radio className="w-4 h-4 animate-pulse" /> En Vivo
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
            {podcast.title}
          </h1>
          <p className="text-xl text-white/50 font-light max-w-2xl mx-auto">
            {podcast.subtitle}
          </p>
        </motion.div>

        {/* Tab Selector */}
        <div className="flex justify-center gap-4 mb-16 relative z-20">
          <button
            onClick={() => setActiveTab("podcast")}
            className={`px-8 py-3.5 rounded-full font-bold text-xs tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
              activeTab === "podcast"
                ? "bg-brandOrange text-white border-brandOrange shadow-[0_0_30px_rgba(242,101,34,0.4)] scale-105"
                : "bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10"
            }`}
          >
            <Radio className="w-4 h-4" /> Podcast
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`px-8 py-3.5 rounded-full font-bold text-xs tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
              activeTab === "news"
                ? "bg-brandOrange text-white border-brandOrange shadow-[0_0_30px_rgba(242,101,34,0.4)] scale-105"
                : "bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10"
            }`}
          >
            <Newspaper className="w-4 h-4" /> Canal de Noticias
          </button>
        </div>

        {activeTab === "podcast" ? (
          <>
            {/* Featured Player Glassmorphism */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative max-w-5xl mx-auto mb-32"
            >
              <div className="absolute inset-0 bg-brandOrange/20 blur-[100px] rounded-full z-0"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row bg-[#0B1021]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Podcast Cover */}
                <div className="w-full md:w-2/5 aspect-square md:aspect-auto relative bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/gridiron_ai_1785627944344.jpg" alt="Podcast Cover" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1021] to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0B1021]"></div>
                </div>
                
                {/* Player Info */}
                <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-brandOrange text-[10px] font-bold tracking-[0.2em] uppercase mb-4 block">
                    {podcast.latestEpisode}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                    {featuredEpisode?.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-6 mb-10 text-white/40 text-sm">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {featuredEpisode?.date}</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {featuredEpisode?.duration}</span>
                    <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Temporada 1, Ep 1</span>
                  </div>

                  {/* Progress Bar (Visual only) */}
                  <div className="w-full h-1 bg-white/10 rounded-full mb-8 relative">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-brandOrange rounded-full shadow-[0_0_10px_rgba(242,101,34,0.5)]"></div>
                  </div>

                  <div className="flex items-center gap-6">
                    <button className="w-16 h-16 rounded-full bg-brandOrange text-white flex items-center justify-center hover:scale-105 hover:shadow-[0_0_30px_rgba(242,101,34,0.4)] transition-all">
                      <PlayCircle className="w-8 h-8" />
                    </button>
                    <div className="flex flex-col">
                      <span className="text-white font-bold">{podcast.listenLatest}</span>
                      <span className="text-white/40 text-sm">Disponible en Spotify & Apple</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Previous Episodes Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
                <h3 className="text-2xl font-display font-bold text-white">
                  {podcast.previousEpisodes}
                </h3>
                <Headphones className="text-white/40 w-6 h-6" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {previousEpisodes.map((ep: any, i: number) => (
                  <div key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-brandOrange/30 transition-all cursor-pointer flex gap-6 items-center">
                    <div className="w-16 h-16 rounded-xl bg-black overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform">
                       <div className="absolute inset-0 bg-brandOrange/20 mix-blend-overlay z-10"></div>
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={ep.thumbnailUrl || "/hero-football.jpg"} alt="Episode thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div>
                      <span className="text-brandOrange text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block">
                        EPISODIO 0{i + 2}
                      </span>
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brandOrange transition-colors">
                        {ep.title}
                      </h4>
                      <div className="flex items-center gap-4 text-white/40 text-xs">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ep.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ep.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          /* News Channel Tab */
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
              <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wide">
                Canal de Noticias & Actualizaciones
              </h3>
              <Newspaper className="text-brandOrange w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-6">
              {newsList.map((news, i) => {
                const formattedDate = news.createdAt 
                  ? new Date(news.createdAt).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                  : (news.date || "");
                return (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="relative p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/10 hover:border-brandOrange/30 transition-all group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brandOrange/5 blur-[50px] group-hover:bg-brandOrange/10 transition-colors pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <span className="px-4 py-1.5 rounded-full bg-brandOrange/10 border border-brandOrange/20 text-brandOrange font-mono text-[9px] font-bold uppercase tracking-wider w-fit">
                        {news.category}
                      </span>
                      <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                        {news.time && (
                          <>
                            <span className="text-white/20">•</span>
                            <span>{news.time}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-brandOrange transition-colors">
                      {news.title}
                    </h4>
                    
                    <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
                      {news.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
