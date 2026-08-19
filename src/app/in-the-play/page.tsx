"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Radio, Volume2, VolumeX, Play, Pause, Maximize, Activity, Wifi, Headphones, PlayCircle, Download } from "lucide-react";
import { useLang } from "@/app/i18n";
import CustomCursor from "@/components/CustomCursor";
import { useState, useEffect, useRef } from "react";

export default function SportsNewsBroadcastPage() {
  const { lang } = useLang();
  const isEs = lang === "es";

  // Real-time clock for TV broadcast
  const [timeStr, setTimeStr] = useState("08:30:00 PM EST");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }) + " EST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Video Streaming State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Electronic Scoreboard Groups & Auto-Rotation with Official Team Logos
  const [scoreTab, setScoreTab] = useState(0);

  const sportsGroups = [
    {
      category: isEs ? "BÉISBOL GLOBAL" : "GLOBAL BASEBALL",
      shortLabel: isEs ? "BÉISBOL" : "BASEBALL",
      items: [
        {
          league: "MLB",
          teamA: { name: "NYY", logo: "/logos/teams/nyy.png", bg: "#132448" },
          teamB: { name: "BOS", logo: "/logos/teams/bos.png", bg: "#BD3039" },
          score: "5 - 3",
          status: "FINAL"
        },
        {
          league: "NPB",
          teamA: { name: "GIA", logo: "/logos/teams/giants.svg", bg: "#FF6600" },
          teamB: { name: "TIG", logo: "/logos/teams/tigers.svg", bg: "#FFE100" },
          score: "4 - 2",
          status: "FINAL"
        },
        {
          league: "LIDOM",
          teamA: { name: "LIC", logo: "/logos/teams/licey.svg", bg: "#003882" },
          teamB: { name: "AGU", logo: "/logos/teams/aguilas.svg", bg: "#FFC72C" },
          score: "6 - 3",
          status: "FINAL"
        },
        {
          league: "LVBP",
          teamA: { name: "LEO", logo: "/logos/teams/leones.svg", bg: "#DDA000" },
          teamB: { name: "MAG", logo: "/logos/teams/magallanes.svg", bg: "#002D62" },
          score: "5 - 4",
          status: "FINAL"
        },
      ]
    },
    {
      category: isEs ? "FÚTBOL DE ÉLITE (ESP · ENG · GER · ITA)" : "ELITE SOCCER (ESP · ENG · GER · ITA)",
      shortLabel: isEs ? "FÚTBOL" : "SOCCER",
      items: [
        {
          league: "LALIGA",
          teamA: { name: "RMA", logo: "/logos/teams/rma.png", bg: "#FFFFFF" },
          teamB: { name: "FCB", logo: "/logos/teams/fcb.png", bg: "#004D98" },
          score: "2 - 1",
          status: "FINAL"
        },
        {
          league: "EPL",
          teamA: { name: "MCI", logo: "/logos/teams/mci.png", bg: "#6CABDD" },
          teamB: { name: "ARS", logo: "/logos/teams/ars.png", bg: "#EF0107" },
          score: "3 - 2",
          status: "88'"
        },
        {
          league: "BUNDES",
          teamA: { name: "BAY", logo: "/logos/teams/bay.png", bg: "#DC052D" },
          teamB: { name: "BVB", logo: "/logos/teams/bvb.png", bg: "#FDE100" },
          score: "4 - 1",
          status: "FINAL"
        },
        {
          league: "SERIE A",
          teamA: { name: "INT", logo: "/logos/teams/inter.png", bg: "#010E80" },
          teamB: { name: "JUV", logo: "/logos/teams/juv.png", bg: "#000000" },
          score: "1 - 0",
          status: "FINAL"
        },
      ]
    },
    {
      category: isEs ? "NFL & HOCKEY NHL" : "NFL & NHL HOCKEY",
      shortLabel: "NFL/NHL",
      items: [
        {
          league: "NFL",
          teamA: { name: "KC", logo: "/logos/teams/kc.png", bg: "#E31837" },
          teamB: { name: "SF", logo: "/logos/teams/sf.png", bg: "#AA0000" },
          score: "24 - 17",
          status: "Q4"
        },
        {
          league: "NHL",
          teamA: { name: "TBL", logo: "/logos/teams/tbl.png", bg: "#002868" },
          teamB: { name: "FLA", logo: "/logos/teams/fla.png", bg: "#C8102E" },
          score: "4 - 2",
          status: "P3"
        },
        {
          league: "NFL",
          teamA: { name: "BAL", logo: "/logos/teams/bal.png", bg: "#241773" },
          teamB: { name: "BUF", logo: "/logos/teams/buf.png", bg: "#00338D" },
          score: "28 - 21",
          status: "FINAL"
        },
        {
          league: "NHL",
          teamA: { name: "NYR", logo: "/logos/teams/nyr.png", bg: "#0038A8" },
          teamB: { name: "BOS", logo: "/logos/teams/nhl-bos.png", bg: "#FFB81C" },
          score: "3 - 1",
          status: "P2"
        },
      ]
    },
    {
      category: isEs ? "MOTORSPORTS & SURF" : "MOTORSPORTS & SURF",
      shortLabel: "F1/SURF",
      items: [
        {
          league: "F1",
          teamA: { name: "RBR", logo: "/logos/teams/rbr.svg", bg: "#0600EF" },
          teamB: { name: "MIA", logo: "/logos/teams/lad.png", bg: "#00A3E0" },
          score: "VER P1",
          status: "EN VIVO"
        },
        {
          league: "MOTOGP",
          teamA: { name: "DUC", logo: "/logos/teams/ducati.svg", bg: "#CC0000" },
          teamB: { name: "ITA", logo: "/logos/teams/nym.png", bg: "#009246" },
          score: "BAG P1",
          status: "POLE"
        },
        {
          league: "SURF",
          teamA: { name: "WSL", logo: "/logos/teams/wsl.svg", bg: "#0054A6" },
          teamB: { name: "TAH", logo: "/logos/teams/hou.png", bg: "#00A86B" },
          score: "17.85 PTS",
          status: "HEAT 4"
        },
        {
          league: "F1",
          teamA: { name: "FER", logo: "/logos/teams/ferrari.svg", bg: "#DC0000" },
          teamB: { name: "LAP", logo: "/logos/teams/mia-marlins.png", bg: "#F26522" },
          score: "1:27.481",
          status: "REC"
        },
      ]
    }
  ];

  useEffect(() => {
    const tabInterval = setInterval(() => {
      setScoreTab((prev) => (prev + 1) % sportsGroups.length);
    }, 4500);
    return () => clearInterval(tabInterval);
  }, [sportsGroups.length]);

  const tickerNews = isEs
    ? [
        "⚽ LALIGA ESPAÑA: El Clásico Real Madrid vs Barcelona con telemetría de visión computacional y tracking 3D",
        "⚽ PREMIER LEAGUE: Manchester City y Arsenal en duelo directo con modelos predictivos de posesión",
        "⚽ BUNDESLIGA ALEMANIA: Der Klassiker Bayern vs Dortmund analizado con cinemática de alta velocidad",
        "⚽ SERIE A ITALIA: Derby d'Italia Inter vs Juventus procesado en tiempo real por Sports OS",
        "🔴 BÉISBOL USA / MLB: Cámaras computarizadas analizan rotación de pitcheo en transmisiones en directo",
        "⚾ NPB JAPÓN: Algoritmos de biomecánica integrados en entrenamientos de béisbol profesional",
        "⚾ LIDOM / REP. DOMINICANA: Scouting digital en tiempo real para prospectos élite de Grandes Ligas",
        "⚾ LVBP / VENEZUELA: Telemetría 3D sin marcadores físicos en el estadio universitario",
        "🏒 NHL HOCKEY: Modelos predictivos de aceleración sobre hielo y trayectorias de disco",
        "🏈 NFL: Modelos de impacto y aceleración muscular reducen tiempo de diagnóstico",
        "🏎️ FÓRMULA 1: Telemetría aerodinámica en tiempo real procesada por Sports OS",
        "🏍️ MOTOGP: Dinámica angular y telemetría de inclinación en pista en alta frecuencia",
        "🏄 SURF WSL: Análisis de cinemática de olas y velocidad de maniobras en vivo",
        "📡 SEÑAL GLOBAL: Muy pronto al aire en 4K HDR desde Lutz, Florida"
      ]
    : [
        "⚽ LALIGA SPAIN: El Clásico Real Madrid vs Barcelona tracked with 3D computer vision and biomechanics",
        "⚽ PREMIER LEAGUE: Manchester City vs Arsenal title clash with real-time predictive possession models",
        "⚽ BUNDESLIGA GERMANY: Der Klassiker Bayern vs Dortmund analyzed with high-speed kinematic arrays",
        "⚽ SERIE A ITALY: Derby d'Italia Inter vs Juventus processed live in real time by Sports OS",
        "🔴 BASEBALL USA / MLB: Computerized camera arrays tracking pitch rotation live",
        "⚾ NPB JAPAN: Biomechanical computer vision algorithms deployed in professional baseball",
        "⚾ LIDOM / DOMINICAN REP: Real-time digital scouting for elite MLB prospects",
        "⚾ LVBP / VENEZUELA: Markerless 3D telemetry tracking in live stadium broadcasts",
        "🏒 NHL HOCKEY: Predictive on-ice acceleration models and puck trajectory tracking",
        "🏈 NFL: Muscle acceleration and impact models cutting diagnostic time",
        "🏎️ FORMULA 1: Real-time aerodynamic telemetry processed live by Sports OS",
        "🏍️ MOTOGP: High-frequency lean angle dynamics and telemetry tracking on track",
        "🏄 SURF WSL: Real-time wave kinematics and maneuver velocity analytics",
        "📡 GLOBAL BROADCAST: Coming soon on air in 4K HDR from Lutz, Florida"
      ];

  // Podcast & Videocast Hub State (Below Broadcast)
  const [selectedPodcastVideo, setSelectedPodcastVideo] = useState("/Player_speaks_with_journalists_1080p_202608051858.mp4");
  const [podcastVideoTitle, setPodcastVideoTitle] = useState(isEs ? "Episodio 01: Análisis Biomecánico y Scouting Predictivo" : "Episode 01: Biomechanical Analysis & Predictive Scouting");
  const podcastVideoRef = useRef<HTMLVideoElement>(null);
  const [isPodcastAudioPlaying, setIsPodcastAudioPlaying] = useState(false);
  const [podcastPlaybackRate, setPodcastPlaybackRate] = useState(1.0);

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
      title: isEs ? "Episodio 02: Tracking Óptico y Cinemática en la NFL" : "Episode 02: Optical Tracking & Kinematics in the NFL",
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
    <main className="min-h-screen w-full bg-[#020617] text-white selection:bg-brandOrange selection:text-white relative font-sans overflow-x-hidden">
      <CustomCursor />

      {/* ─── SECTION 1: LIVE TV BROADCAST STAGE ─── */}
      <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black">
        {/* Background Studio Set */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/news-studio.jpg"
            alt="3Tree Sports News Studio Set"
            fill
            priority
            className="object-cover object-center filter brightness-[0.8] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />
        </div>

        {/* Top TV Status Bar */}
        <header className="relative z-30 w-full px-6 md:px-10 py-4 flex justify-between items-center pointer-events-auto">
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-brandOrange flex items-center justify-center font-black text-[9px] text-white shadow-sm">3</span>
              <span className="font-display font-black text-sm tracking-wider uppercase text-white">
                3TREE<span className="text-brandOrange">SPORTS</span>
              </span>
            </div>
            <span className="h-3.5 w-[1px] bg-white/20" />
            <span className="font-mono text-[10px] font-black tracking-widest text-brandOrange bg-brandOrange/15 px-2 py-0.5 rounded border border-brandOrange/40">
              HD LIVE
            </span>
            <div className="flex items-center gap-1.5 text-white/50">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <Activity className="w-3.5 h-3.5 text-brandOrange animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-brandOrange/40 shadow-[0_0_20px_rgba(242,101,34,0.2)]">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandOrange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brandOrange"></span>
              </span>
              <span className="font-mono text-[11px] font-black uppercase tracking-widest text-brandOrange">
                {isEs ? "EN EL AIRE" : "ON AIR"}
              </span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="font-mono text-[11px] font-bold text-white/90 tracking-wider">
                {timeStr}
              </span>
            </div>

            <Link 
              href="/"
              className="hoverable flex items-center gap-2 bg-black/80 hover:bg-brandOrange text-white/80 hover:text-white backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 hover:border-brandOrange transition-all duration-300 shadow-2xl font-mono text-[10px] font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEs ? "Inicio" : "Home"}</span>
            </Link>
          </div>
        </header>

        {/* Center: Video Broadcast + Scoreboard Matrix */}
        <div className="relative z-20 flex-1 w-full max-w-6xl xl:max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-4 lg:gap-6 px-3 sm:px-6 lg:px-8 py-2 min-h-0 overflow-hidden">
          {/* Left: Video Player */}
          <div className="flex-1 min-w-0 w-full relative group flex flex-col justify-center">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brandOrange via-[#0054A6] to-brandOrange opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative rounded-2xl bg-black border border-white/20 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
              <div className="absolute top-0 left-0 right-0 z-20 px-4 py-2.5 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/60 to-transparent">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                  </span>
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    3TREE LIVE STREAM
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-[#0054A6]/80 text-white px-2 py-0.5 rounded">
                    4K HDR
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px] text-white/70">
                  <span className="hidden sm:inline tracking-wider">60 FPS · 48.2 MBPS</span>
                  <span className="px-2 py-0.5 rounded bg-brandOrange/20 text-brandOrange font-bold border border-brandOrange/30">
                    SPORTS OS
                  </span>
                </div>
              </div>

              <div className="w-full aspect-video relative bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                  src="/Soccer_player_kicks_ball_202608190134.mp4"
                />
                <div className="absolute bottom-12 right-4 pointer-events-none opacity-40">
                  <span className="font-display font-black text-xl tracking-widest text-white/50">
                    3TREE<span className="text-brandOrange">.</span>TV
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-2.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex justify-between items-center opacity-90 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="w-8 h-8 rounded-full bg-brandOrange hover:bg-white text-white hover:text-brandOrange flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105"
                      aria-label={isPlaying ? "Pausar" : "Reproducir"}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                      aria-label={isMuted ? "Activar audio" : "Silenciar"}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-brandOrange" />}
                    </button>
                    <span className="font-mono text-[9px] text-white/60 uppercase tracking-widest hidden sm:inline">
                      {isEs ? "Estudio Central Lutz, FL" : "Central Studio Lutz, FL"}
                    </span>
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    aria-label="Pantalla completa"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Electronic Scoreboard Tower */}
          <aside className="w-full lg:w-[380px] xl:w-[410px] shrink-0 h-full flex flex-col justify-center">
            <div className="bg-black/90 backdrop-blur-xl border border-white/15 rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              <div className="border-b border-white/10 pb-2 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-brandOrange" />
                    <span className="font-display font-black text-xs sm:text-sm tracking-wider uppercase text-white">
                      {isEs ? "PIZARRA ELECTRÓNICA" : "SCOREBOARD MATRIX"}
                    </span>
                  </div>
                  <span className="font-mono text-[8px] sm:text-[9px] text-brandOrange bg-brandOrange/10 border border-brandOrange/30 px-1.5 py-0.5 rounded font-black">
                    SPORTS OS
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {sportsGroups.map((group, idx) => (
                    <button
                      key={idx}
                      onClick={() => setScoreTab(idx)}
                      className={`font-mono text-[8px] sm:text-[9px] font-black uppercase py-1 px-0.5 rounded transition-all truncate text-center ${
                        scoreTab === idx
                          ? "bg-brandOrange text-[#020617] font-bold shadow-md shadow-brandOrange/30"
                          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {group.shortLabel}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-black text-white uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  <span className="text-white drop-shadow-sm truncate mr-1">{sportsGroups[scoreTab].category}</span>
                  <span className="text-brandOrange text-[8px] font-bold tracking-widest shrink-0">● AUTO 4.5s</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-2 sm:gap-2.5 py-1">
                {sportsGroups[scoreTab].items.map((s, idx) => (
                  <div
                    key={idx}
                    className="group/card relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-brandOrange/50 rounded-xl p-2 sm:p-2.5 flex items-center justify-between transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className="shrink-0 font-mono font-black text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 rounded bg-brandOrange/20 text-brandOrange border border-brandOrange/40">
                        {s.league}
                      </span>
                      <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/95 p-0.5 sm:p-1 shadow-[0_2px_10px_rgba(0,0,0,0.5)] ring-1 ring-white/40 flex items-center justify-center overflow-hidden shrink-0 group-hover/card:scale-110 transition-transform">
                            <img src={s.teamA.logo} alt={s.teamA.name} className="w-full h-full object-contain drop-shadow-sm" />
                          </div>
                          <span className="font-mono text-[9px] sm:text-[11px] font-black text-white tracking-wide truncate">{s.teamA.name}</span>
                        </div>
                        <span className="text-brandOrange font-mono font-black text-[8px] sm:text-[9px] px-0.5 sm:px-1 bg-brandOrange/10 rounded shrink-0">vs</span>
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/95 p-0.5 sm:p-1 shadow-[0_2px_10px_rgba(0,0,0,0.5)] ring-1 ring-white/40 flex items-center justify-center overflow-hidden shrink-0 group-hover/card:scale-110 transition-transform">
                            <img src={s.teamB.logo} alt={s.teamB.name} className="w-full h-full object-contain drop-shadow-sm" />
                          </div>
                          <span className="font-mono text-[9px] sm:text-[11px] font-black text-white tracking-wide truncate">{s.teamB.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-0.5 sm:gap-1 shrink-0 pl-1 sm:pl-2">
                      <span className="font-mono font-black text-brandOrange text-xs sm:text-sm md:text-base tracking-wider drop-shadow-[0_0_10px_rgba(242,101,34,0.5)]">
                        {s.score}
                      </span>
                      <span
                        className={`text-[8px] sm:text-[9px] font-mono font-black px-1.5 sm:px-2 py-0.5 rounded border uppercase tracking-wider shadow-md flex items-center gap-1 ${
                          s.status === "EN VIVO" || s.status === "88'" || s.status === "HEAT 4"
                            ? "bg-red-500/20 text-red-300 border-red-500/50"
                            : s.status === "FINAL"
                            ? "bg-white/20 text-white border-white/40 shadow-sm"
                            : "bg-brandOrange/20 text-brandOrange border-brandOrange/40"
                        }`}
                      >
                        {(s.status === "EN VIVO" || s.status === "88'" || s.status === "HEAT 4") && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping inline-block" />
                        )}
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-2 sm:pt-2.5 mt-2 flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-white/50 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SPORTS OS SYNC</span>
                </div>
                <span className="text-brandOrange font-bold">LATENCY: 12MS</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Live Ticker Tape */}
        <footer className="relative z-30 w-full bg-black border-t border-brandOrange/30 py-2 flex items-center overflow-hidden">
          <div className="shrink-0 px-4 md:px-6 flex items-center gap-2 border-r border-white/20 bg-brandOrange py-0.5 z-10">
            <Radio className="w-3 h-3 text-white animate-pulse" />
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {isEs ? "EN VIVO" : "LIVE"}
            </span>
          </div>
          <div className="overflow-hidden whitespace-nowrap flex-1 flex">
            <motion.div
              className="flex shrink-0 items-center gap-10 text-[11px] font-mono font-bold tracking-wider text-white uppercase"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            >
              {tickerNews.concat(tickerNews).map((item, index) => (
                <span key={index} className="flex items-center gap-6">
                  <span>{item}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brandOrange" />
                </span>
              ))}
            </motion.div>
          </div>
        </footer>
      </section>

      {/* ─── SECTION 2: DUAL MULTIMEDIA HUB (VIDEOCAST & PODCAST STUDIO) ─── */}
      <section className="relative z-20 w-full bg-[#020617] border-t border-white/15 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
            <div>
              <span className="text-brandOrange font-mono text-[10px] uppercase tracking-[0.3em] font-bold block mb-3">
                {isEs ? "ESTUDIO MULTIMEDIA & PODCAST" : "MULTIMEDIA & PODCAST STUDIO"}
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
                VIDEOCAST <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>& SUITE DE AUDIO</span>
              </h2>
            </div>

            {/* Direct Connectors */}
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

          {/* Dual Columns: Video on Left, Audio on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 🎥 LADO IZQUIERDO: REPRODUCTOR DE VIDEOCAST HD */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-brandOrange animate-pulse"></span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white">
                    VIDEOCAST HD
                  </span>
                </div>
                <div className="w-full aspect-video bg-black relative">
                  <video 
                    ref={podcastVideoRef}
                    src={selectedPodcastVideo}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl">
                <span className="text-[9px] font-mono text-brandOrange uppercase tracking-widest block mb-2 font-bold">
                  {isEs ? "REPRODUCIENDO AHORA" : "NOW PLAYING"}
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-white mb-4">
                  {podcastVideoTitle}
                </h3>

                <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">
                    {isEs ? "SELECCIONAR CAPÍTULO EN VIDEO:" : "SELECT VIDEO CHAPTER:"}
                  </span>
                  {videoPlaylist.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedPodcastVideo(v.videoUrl);
                        setPodcastVideoTitle(v.title);
                        if (podcastVideoRef.current) {
                          podcastVideoRef.current.load();
                          podcastVideoRef.current.play();
                        }
                      }}
                      className={`p-3 rounded-xl text-left font-mono text-[10px] flex items-center justify-between transition-all ${
                        selectedPodcastVideo === v.videoUrl 
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
              <div className="bg-white/[0.03] border border-white/15 p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-brandOrange/20 text-brandOrange px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest border border-brandOrange/30">
                    AUDIO STREAM
                  </span>
                  <span className="text-[10px] font-mono text-white/50">
                    320 KBPS • LOSSLESS
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold uppercase text-white mb-2 leading-tight">
                  {isEs ? "ZON ETHOS: EL PODCAST" : "ZON ETHOS: THE PODCAST"}
                </h2>
                <p className="font-mono text-xs text-white/60 mb-6">
                  {isEs ? "Inmersión profunda en Big Data, Biomecánica y Sports OS." : "Deep dives into Big Data, Biomechanics & Sports OS."}
                </p>

                {/* Sound Waveform */}
                <div className="bg-black/60 p-4 rounded-xl border border-white/10 mb-6">
                  <div className="w-full h-14 flex items-center gap-1.5 px-2">
                    {[40, 65, 80, 45, 90, 70, 30, 85, 95, 60, 50, 75, 90, 40, 65, 80, 55, 90, 75, 60, 85, 45, 70, 95, 80, 60, 40, 75, 90, 50].map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={isPodcastAudioPlaying ? { height: [`${Math.max(15, h * 0.3)}%`, `${h}%`, `${Math.max(20, h * 0.6)}%`] } : { height: `${h * 0.5}%` }}
                        transition={{ repeat: Infinity, duration: (i % 4) * 0.2 + 0.6, ease: "easeInOut" }}
                        className={`flex-1 rounded-full ${i < 12 ? "bg-brandOrange" : "bg-white/20"}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between font-mono text-[9px] text-white/50 mt-2 px-1">
                    <span>14:32</span>
                    <span>45:20</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <button 
                    onClick={() => setIsPodcastAudioPlaying(!isPodcastAudioPlaying)}
                    className="hoverable flex-1 py-3 px-6 rounded-xl bg-brandOrange hover:bg-white text-white hover:text-brandOrange font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isPodcastAudioPlaying ? (
                      <><span>PAUSAR AUDIO</span></>
                    ) : (
                      <><PlayCircle className="w-4 h-4 fill-current" /><span>ESCUCHAR AUDIO</span></>
                    )}
                  </button>

                  <button 
                    onClick={() => {
                      const speeds = [1.0, 1.5, 2.0];
                      const next = speeds[(speeds.indexOf(podcastPlaybackRate) + 1) % speeds.length];
                      setPodcastPlaybackRate(next);
                    }}
                    className="px-3 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors"
                  >
                    {podcastPlaybackRate}x
                  </button>
                </div>

                {/* Download MP3 */}
                <a
                  href="/Soccer_player_kicks_ball_202608190134.mp4"
                  download="3Tree_Sports_Podcast_Ep01.mp3"
                  className="hoverable w-full py-3 px-4 rounded-xl border border-white/20 hover:border-brandOrange text-white hover:text-brandOrange font-mono text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-white/5 hover:bg-brandOrange/10"
                >
                  <span>⬇ {isEs ? "DESCARGAR EPISODIO (AUDIO MP3)" : "DOWNLOAD EPISODE (AUDIO MP3)"}</span>
                </a>
              </div>

              {/* Direct Connectors */}
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
        </div>
      </section>
    </main>
  );
}
