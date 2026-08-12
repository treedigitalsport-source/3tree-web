"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Newspaper, Clock, Calendar } from "lucide-react";
import { useLang } from "@/app/i18n";
import { useEffect, useState } from "react";
import { getPodcastNews } from "@/app/actions/podcast";
import CustomCursor from "@/components/CustomCursor";

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
  },
  {
    id: "3",
    category: "MOBILE TECH / SCOUTING",
    title: "Nueva App de Scouting actualiza datos de rendimiento de jugadores en tiempo real",
    desc: "Plataforma móvil sincroniza al instante métricas biomecánicas y estadísticas de carrera directamente en la pantalla de los cazatalentos.",
    date: "Hace 2 días",
    time: "Hace 3 días",
    videoUrl: "/smartphone_screen.mp4",
    createdAt: new Date(Date.now() - 172800000).toISOString()
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
  },
  {
    id: "3",
    category: "MOBILE TECH / SCOUTING",
    title: "New Scouting App updates player performance data in real-time",
    desc: "Mobile platform instantly syncs biomechanical metrics and game stats directly to scouts' screens.",
    date: "2 days ago",
    time: "3 days ago",
    videoUrl: "/smartphone_screen.mp4",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export default function SportsNewsPage() {
  const { t, lang } = useLang();
  const isEs = lang === "es";

  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const newsResult = await getPodcastNews();
        if (newsResult.success && newsResult.news && newsResult.news.length > 0) {
          setNewsList(newsResult.news);
        } else {
          setNewsList(isEs ? staticNewsEs : staticNewsEn);
        }
      } catch (err) {
        console.error("Error fetching sports news:", err);
        setNewsList(isEs ? staticNewsEs : staticNewsEn);
      }
    }
    fetchData();
  }, []);

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
          Live<span className="text-brandOrange">_</span>Dispatch
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
          <div className="lg:col-span-12 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative overflow-hidden min-h-[40vh]">
            <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-brandOrange/10 blur-[120px] rounded-full pointer-events-none"></div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="w-2 h-2 bg-brandOrange rounded-full animate-pulse"></span>
                <span className="font-mono text-xs uppercase tracking-widest text-brandOrange font-bold">LIVE FEED</span>
              </div>
              <h1 className="font-display text-[10vw] md:text-[8vw] lg:text-[7vw] font-black uppercase leading-[0.85] tracking-tighter relative z-10">
                {t.inThePlayTitle} <br/> 
                <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>DISPATCH</span>
              </h1>
              <p className="font-mono text-sm md:text-base leading-[1.8] text-white/60 mt-10 max-w-2xl">
                {isEs 
                  ? "Últimas noticias y actualizaciones corporativas del ecosistema global de tecnología deportiva. Cobertura en tiempo real de integraciones de IA, biomecánica y desarrollo de software."
                  : "Breaking news and corporate updates from the global sports tech ecosystem. Real-time coverage of AI integrations, biomechanics, and software development."}
              </p>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content Area - News Grid */}
      <div className="relative z-10 w-full bg-[#020617] max-w-6xl mx-auto border-x border-white/10 border-b min-h-screen">
        <div className="flex flex-col border-white/10">
          {newsList.map((news, i) => {
            const formattedDate = news.createdAt 
              ? new Date(news.createdAt).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })
              : (news.date || "");
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={news.id} 
                className="p-8 md:p-16 border-b border-white/10 bg-[#020617] hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex justify-between items-start mb-8">
                  <span className="px-4 py-2 bg-brandOrange/10 border border-brandOrange/20 font-mono text-[10px] font-bold uppercase tracking-widest text-brandOrange">
                    {news.category}
                  </span>
                  <div className="flex flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formattedDate}</span>
                    {news.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {news.time}</span>}
                  </div>
                </div>
                
                <h4 className="font-display text-3xl md:text-5xl font-bold uppercase leading-[1.1] text-white mb-6 group-hover:text-brandOrange transition-colors max-w-4xl">
                  {news.title}
                </h4>
                
                <p className="font-mono text-sm md:text-base leading-[1.8] text-white/60 mb-10 max-w-3xl">
                  {news.desc}
                </p>

                {news.videoUrl && (
                  <div className="w-full aspect-video bg-black border border-white/10 relative overflow-hidden group-hover:border-white/30 transition-colors shadow-2xl">
                    <video 
                      src={news.videoUrl} 
                      controls 
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
