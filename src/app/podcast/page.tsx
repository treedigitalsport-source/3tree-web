"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Headphones, Clock, Calendar, BarChart3, Radio, Loader2, Newspaper } from "lucide-react";
import { useLang } from "../i18n";
import { useEffect, useState, useRef } from "react";
import { getPodcastEpisodes, getPodcastNews } from "@/app/actions/podcast";
import CustomCursor from "@/components/CustomCursor";

const staticEpisodesEs = [
  { id: "1", title: "El Futuro del Análisis en Béisbol", date: "01 Ago, 2026", duration: "45 min" },
  { id: "2", title: "IA en Transmisiones Deportivas", date: "25 Jul, 2026", duration: "52 min" },
  { id: "3", title: "Biomecánica para Atletas de ÉÉLITE", date: "18 Jul, 2026", duration: "38 min" },
  { id: "4", title: "Redefiniendo el Compromiso del Fan", date: "10 Jul, 2026", duration: "41 min" }
];

const staticEpisodesEn = [
  { id: "1", title: "The Future of Baseball Analytics", date: "Aug 01, 2026", duration: "45 min" },
  { id: "2", title: "AI in Sports Broadcasting", date: "Jul 25, 2026", duration: "52 min" },
  { id: "3", title: "Biomechanics for EÉLITE Athletes", date: "Jul 18, 2026", duration: "38 min" },
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
    title: "Equipos de la NFL adoptan tracking óÓptico en tiempo real para análisis de aceleración de corredores",
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
  const { t, lang, toggleLang } = useLang();
  const isEs = lang === "es";

  // Video State
  const [selectedVideo, setSelectedVideo] = useState("/Player_speaks_with_journalists_1080p_202608051858.mp4");
  const [videoTitle, setVideoTitle] = useState(isEs ? "Episodio 01: Análisis Biomecánico y Scouting Predictivo" : "Episode 01: Biomechanical Analysis & Predictive Scouting");
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Audio State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [audioProgress, setAudioProgress] = useState(32); // percentage

  const videoPlaylist = [
    {
      id: "1",
      title: isEs ? "Episodio 01: Análisis Biomecánico y Scouting Predictivo" : "Episode 01: Biomechanical Analysis & Predictive Scouting",
      guest: "Ali Zapata & Neil Alvarado",
      duration: "45:20",
      videoUrl: "/Player_speaks_with_journalists_1080p_202608051858.mp4",
      tag: "MLB / AI"
    },
    {
      id: "2",
      title: isEs ? "Episodio 02: Tracking ÓÓptico y Cinemática en la NFL" : "Episode 02: Optical Tracking & Kinematics in the NFL",
      guest: "Sports Intelligence Lab",
      duration: "38:45",
      videoUrl: "/Corredor_de_fútbol_americano_en_202608051848.mp4",
      tag: "NFL / DATA"
    },
    {
      id: "3",
      title: isEs ? "Episodio 03: Drones de Alta Velocidad en Cobertura Táctica" : "Episode 03: High-Speed Drones in Tactical Coverage",
      guest: "3Tree Drone Unit",
      duration: "29:10",
      videoUrl: "/Drone_dive_into_baseball_stadium_202607151954.mp4",
      tag: "DRONE / BROADCAST"
    }
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white relative overflow-x-hidden font-sans">
      <CustomCursor />

      {/* Architectural Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Top Header */}
      <nav className="relative z-50 w-full px-6 md:px-12 py-6 border-b border-white/10 flex justify-between items-center bg-[#020617]/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="w-3 h-3 rounded-full bg-brandOrange animate-pulse"></span>
          <span className="font-display font-black text-xl tracking-widest uppercase">
            3TREE<span className="text-brandOrange"> MEDIA HUB</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="font-mono text-xs font-extrabold px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:border-brandOrange hover:text-brandOrange transition-all cursor-pointer uppercase tracking-wider text-white"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <Link href="/" className="hoverable group flex items-center gap-3 text-white hover:text-brandOrange transition-colors">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] hidden md:inline">
              {isEs ? "Volver al Inicio" : "Back to Home"}
            </span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brandOrange bg-[#020617]">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative z-10 w-full px-6 md:px-12 pt-12 pb-8 border-b border-white/10 bg-[#020617]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-brandOrange font-mono text-[10px] uppercase tracking-[0.3em] font-bold block mb-3">
              {isEs ? "ESTUDIO MULTIMEDIA OFICIAL" : "OFFICIAL MULTIMEDIA STUDIO"}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
              VIDEOCAST <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>& PODCAST</span>
            </h1>
          </div>

          {/* External Streaming Platform Connectors */}
          <div className="flex items-center gap-3 flex-wrap">
            <a 
              href="https://open.spotify.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hoverable flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-black px-4 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              <Headphones className="w-3.5 h-3.5 fill-current" />
              <span>Spotify</span>
            </a>
            <a 
              href="https://youtube.com/@3treedigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hoverable flex items-center gap-2 bg-[#FF0000] hover:bg-[#ff3333] text-white px-4 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              <PlayCircle className="w-3.5 h-3.5 fill-current" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── DUAL MULTIMEDIA HUB (VIDEO ON LEFT + AUDIO ON RIGHT) ─── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 🎥 LADO IZQUIERDO: REPRODUCTOR DE VIDEO HD */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              
              {/* Video Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-brandOrange animate-pulse"></span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white">
                  VIDEOCAST HD
                </span>
              </div>

              {/* Video Player Display */}
              <div className="w-full aspect-video bg-black relative">
                <video 
                  ref={videoPlayerRef}
                  src={selectedVideo}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Video Info & Clip Selector */}
            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl">
              <span className="text-[9px] font-mono text-brandOrange uppercase tracking-widest block mb-2 font-bold">
                {isEs ? "REPRODUCIENDO AHORA" : "NOW PLAYING"}
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-white mb-4">
                {videoTitle}
              </h3>

              {/* Video Playlist Selector */}
              <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">
                  {isEs ? "SELECCIONAR CAPÍTULO EN VIDEO:" : "SELECT VIDEO CHAPTER:"}
                </span>
                {videoPlaylist.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVideo(v.videoUrl);
                      setVideoTitle(v.title);
                      if (videoPlayerRef.current) {
                        videoPlayerRef.current.load();
                        videoPlayerRef.current.play();
                      }
                    }}
                    className={`p-3 rounded-xl text-left font-mono text-[10px] flex items-center justify-between transition-all ${
                      selectedVideo === v.videoUrl 
                        ? "bg-brandOrange text-[#020617] font-bold shadow-md" 
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="truncate mr-2">▶ {v.title}</span>
                    <span className="shrink-0 text-[9px] opacity-75">{v.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 🎧 LADO DERECHO: SUITE DE AUDIO DESCARGABLE & STREAMING */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Master Audio Controller Card */}
            <div className="bg-white/[0.03] border border-white/15 p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
              
              {/* Top Meta */}
              <div className="flex items-center justify-between mb-6">
                <span className="bg-brandOrange/20 text-brandOrange px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest border border-brandOrange/30">
                  AUDIO STREAM
                </span>
                <span className="text-[10px] font-mono text-white/50">
                  320 KBPS • LOSSLESS
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold uppercase text-white mb-2 leading-tight">
                {isEs ? "IN THE PLAY: EL PODCAST" : "IN THE PLAY: THE PODCAST"}
              </h2>
              <p className="font-mono text-xs text-white/60 mb-6">
                {isEs ? "Inmersión profunda en Big Data, Biomecánica y Sports OS." : "Deep dives into Big Data, Biomechanics & Sports OS."}
              </p>

              {/* Sound Waveform Visualizer */}
              <div className="bg-black/60 p-4 rounded-xl border border-white/10 mb-6">
                <div className="w-full h-14 flex items-center gap-1.5 px-2">
                  {[40, 65, 80, 45, 90, 70, 30, 85, 95, 60, 50, 75, 90, 40, 65, 80, 55, 90, 75, 60, 85, 45, 70, 95, 80, 60, 40, 75, 90, 50].map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={isAudioPlaying ? { height: [`${Math.max(15, h * 0.3)}%`, `${h}%`, `${Math.max(20, h * 0.6)}%`] } : { height: `${h * 0.5}%` }}
                      transition={{ repeat: Infinity, duration: (i % 4) * 0.2 + 0.6, ease: "easeInOut" }}
                      className={`flex-1 rounded-full ${i < 12 ? "bg-brandOrange" : "bg-white/20"}`}
                    />
                  ))}
                </div>

                {/* Scrubber Time Bar */}
                <div className="flex items-center justify-between font-mono text-[9px] text-white/50 mt-2 px-1">
                  <span>14:32</span>
                  <span>45:20</span>
                </div>
              </div>

              {/* Player Controls & Speed Selector */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <button 
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  className="hoverable flex-1 py-3 px-6 rounded-xl bg-brandOrange hover:bg-white text-white hover:text-brandOrange font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isAudioPlaying ? (
                    <><span>PAUSAR AUDIO</span></>
                  ) : (
                    <><PlayCircle className="w-4 h-4 fill-current" /><span>ESCUCHAR AUDIO</span></>
                  )}
                </button>

                {/* Speed Toggle */}
                <button 
                  onClick={() => {
                    const speeds = [1.0, 1.5, 2.0];
                    const next = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
                    setPlaybackRate(next);
                  }}
                  className="px-3 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors"
                  title="Velocidad de reproducción"
                >
                  {playbackRate}x
                </button>
              </div>

              {/* Download MP3 Button */}
              <a
                href="/Soccer_player_kicks_ball_202608190134.mp4"
                download="3Tree_Sports_Podcast_Ep01.mp3"
                className="hoverable w-full py-3 px-4 rounded-xl border border-white/20 hover:border-brandOrange text-white hover:text-brandOrange font-mono text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-white/5 hover:bg-brandOrange/10"
              >
                <span>⬇ {isEs ? "DESCARGAR EPISODIO (AUDIO MP3)" : "DOWNLOAD EPISODE (AUDIO MP3)"}</span>
              </a>
            </div>

            {/* Direct Connectors Card */}
            <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
                  {isEs ? "DISPONIBLE TAMBIÉN EN:" : "ALSO AVAILABLE ON:"}
                </p>
                <p className="font-mono text-xs font-bold text-white mt-0.5">
                  Spotify • Apple Podcasts • YouTube Music
                </p>
              </div>
              <div className="flex gap-2">
                <a 
                  href="https://open.spotify.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Spotify"
                >
                  <Headphones className="w-4 h-4 fill-current" />
                </a>
                <a 
                  href="https://youtube.com/@3treedigital" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="YouTube"
                >
                  <PlayCircle className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
