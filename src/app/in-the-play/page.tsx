"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Radio, Volume2, VolumeX, Play, Pause, Maximize, Activity, Wifi } from "lucide-react";
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
      category: isEs ? "NFL & HOCKEY NHL" : "NFL & NHL HOCKEY",
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
        "🔴 BÉISBOL USA / MLB: Cámaras computarizadas analizan rotación de pitcheo en vivo",
        "⚾ NPB JAPÓN: Algoritmos de biomecánica integrados en entrenamientos de primavera",
        "⚾ LIDOM / REP. DOMINICANA: Scouting digital en tiempo real para prospectos de Grandes Ligas",
        "⚾ LVBP / VENEZUELA: Telemetría 3D sin sensores físicos en transmisiones en directo",
        "🏒 NHL HOCKEY: Modelos predictivos de aceleración sobre hielo y trayectorias de puck",
        "🏈 NFL: Modelos de impacto y aceleración muscular reducen tiempo de diagnóstico",
        "🏎️ FÓRMULA 1: Telemetría aerodinámica en tiempo real procesada por Sports OS",
        "🏍️ MOTOGP: Dinámica angular y telemetría de inclinación en pista en alta frecuencia",
        "🏄 SURF WSL: Análisis de cinemática de olas y velocidad de maniobras en vivo",
        "📡 SEÑAL GLOBAL: Muy pronto al aire en 4K HDR desde Lutz, Florida"
      ]
    : [
        "🔴 BASEBALL USA / MLB: Computerized camera arrays tracking pitch rotation live",
        "⚾ NPB JAPAN: Biomechanical computer vision algorithms deployed in spring training",
        "⚾ LIDOM / DOMINICAN REP: Real-time digital scouting for elite MLB prospects",
        "⚾ LVBP / VENEZUELA: Markerless 3D telemetry in live broadcast environments",
        "🏒 NHL HOCKEY: Predictive on-ice acceleration models and puck trajectory tracking",
        "🏈 NFL: Muscle acceleration and impact models cutting diagnostic time",
        "🏎️ FORMULA 1: Real-time aerodynamic telemetry processed live by Sports OS",
        "🏍️ MOTOGP: High-frequency lean angle dynamics and telemetry tracking on track",
        "🏄 SURF WSL: Real-time wave kinematics and maneuver velocity analytics",
        "📡 GLOBAL BROADCAST: Coming soon on air in 4K HDR from Lutz, Florida"
      ];

  return (
    <main className="h-screen w-screen bg-black text-white selection:bg-brandOrange selection:text-white relative overflow-hidden flex flex-col justify-between font-sans select-none">
      <CustomCursor />

      {/* ─── BACKGROUND: FULL STUDIO BROADCAST VIEW ─── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/news-studio.jpg"
          alt="3Tree Sports News Studio Set"
          fill
          priority
          className="object-cover object-center filter brightness-[0.8] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />
      </div>

      {/* ─── TOP TV WATERMARK & STATUS BAR ─── */}
      <header className="relative z-30 w-full px-6 md:px-10 py-4 flex justify-between items-center pointer-events-auto">
        
        {/* Left: TV Channel Watermark / Logo */}
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

        {/* Right: On-Air Clock & Back Button */}
        <div className="flex items-center gap-3">
          {/* On Air Indicator & Clock */}
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

          {/* Navigation Back */}
          <Link 
            href="/"
            className="hoverable flex items-center gap-2 bg-black/80 hover:bg-brandOrange text-white/80 hover:text-white backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 hover:border-brandOrange transition-all duration-300 shadow-2xl font-mono text-[10px] font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEs ? "Inicio" : "Home"}</span>
          </Link>
        </div>
      </header>

      {/* ─── CENTER: SIDE-BY-SIDE BROADCAST STAGE (VIDEO + TALL SCORE-TOWER) ─── */}
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch justify-center gap-6 px-4 md:px-8 py-2">
        
        {/* Left / Center: Streaming Video Player (16:9) */}
        <div className="flex-1 w-full relative group flex flex-col justify-center">
          
          {/* Outer Cyber Neon Glow Ring */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brandOrange via-[#0054A6] to-brandOrange opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500" />

          {/* Streaming Screen Chassis */}
          <div className="relative rounded-2xl bg-black border border-white/20 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
            
            {/* Top HUD Technical Bar */}
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

            {/* Video Player Display (16:9 Aspect Ratio) */}
            <div className="w-full aspect-video relative bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                src="/Player_speaks_with_journalists_1080p_202608051858.mp4"
              />

              {/* Holographic Watermark Overlay in Corner */}
              <div className="absolute bottom-12 right-4 pointer-events-none opacity-40">
                <span className="font-display font-black text-xl tracking-widest text-white/50">
                  3TREE<span className="text-brandOrange">.</span>TV
                </span>
              </div>

              {/* Floating Bottom Video Controls Bar */}
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

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1">
                    <span className="w-1 h-3 bg-brandOrange rounded-full animate-pulse"></span>
                    <span className="w-1 h-4 bg-brandOrange rounded-full animate-pulse delay-100"></span>
                    <span className="w-1 h-2 bg-brandOrange rounded-full animate-pulse delay-200"></span>
                    <span className="w-1 h-5 bg-brandOrange rounded-full animate-pulse delay-300"></span>
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

            {/* Corner Precision Bracket Markings */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-brandOrange pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#0054A6] pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#0054A6] pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-brandOrange pointer-events-none" />
          </div>
        </div>

        {/* ─── RIGHT SIDE: CYBER-HUD SCORE TOWER (ALTURA 100% ALINEADA AL MONITOR) ─── */}
        <aside className="w-full lg:w-96 shrink-0 flex flex-col relative group pointer-events-auto">
          
          {/* Outer Neon Aura */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-brandOrange via-[#0054A6]/60 to-brandOrange opacity-50 blur-md group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

          {/* Full Height Scoreboard Chassis */}
          <div className="h-full w-full rounded-2xl bg-[#030712]/95 backdrop-blur-2xl border border-brandOrange/40 flex flex-col justify-between p-4 shadow-[0_20px_60px_rgba(0,0,0,0.95)] relative overflow-hidden">
            
            {/* Top Header & Telemetry */}
            <div className="border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandOrange opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brandOrange"></span>
                  </span>
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    {isEs ? "PIZARRA DIGITAL 3TREE" : "3TREE LIVE MATRIX"}
                  </span>
                </div>
                <span className="font-mono text-[8px] font-black text-brandOrange bg-brandOrange/15 px-2 py-0.5 rounded border border-brandOrange/30">
                  REAL-TIME
                </span>
              </div>

              {/* Category Quick Switcher Pills */}
              <div className="flex items-center justify-between gap-1.5 bg-white/5 p-1 rounded-xl">
                {sportsGroups.map((grp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setScoreTab(idx)}
                    className={`flex-1 py-1.5 rounded-lg font-mono text-[8px] font-black uppercase tracking-wider transition-all duration-300 ${
                      scoreTab === idx
                        ? "bg-brandOrange text-white shadow-[0_0_15px_rgba(242,101,34,0.4)]"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {idx === 0 ? "BÉISBOL" : idx === 1 ? "NFL/NHL" : "F1/SURF"}
                  </button>
                ))}
              </div>

              {/* Active Category Banner */}
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono font-black text-white uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <span className="text-white drop-shadow-sm">{sportsGroups[scoreTab].category}</span>
                <span className="text-brandOrange text-[8px] font-bold tracking-widest">● AUTO 4.5s</span>
              </div>
            </div>

            {/* Match Cards Matrix (Takes Full Vertical Space) */}
            <div className="flex-1 flex flex-col justify-between gap-2.5 py-1">
              {sportsGroups[scoreTab].items.map((s, idx) => (
                <div
                  key={idx}
                  className="group/card relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-brandOrange/50 rounded-xl p-2.5 flex items-center justify-between transition-all duration-300 shadow-lg"
                >
                  {/* Left: League & Teams Matchup */}
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-black text-[8px] px-1.5 py-0.5 rounded bg-brandOrange/20 text-brandOrange border border-brandOrange/40">
                      {s.league}
                    </span>

                    {/* Team Logos with Names */}
                    <div className="flex items-center gap-2">
                      {/* Team A */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-full bg-white/10 p-1 border border-white/25 flex items-center justify-center overflow-hidden shadow-md group-hover/card:scale-105 transition-transform">
                          <img
                            src={s.teamA.logo}
                            alt={s.teamA.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-mono text-[11px] font-black text-white tracking-wide">
                          {s.teamA.name}
                        </span>
                      </div>

                      <span className="text-white/30 text-[9px] font-mono font-black">vs</span>

                      {/* Team B */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-full bg-white/10 p-1 border border-white/25 flex items-center justify-center overflow-hidden shadow-md group-hover/card:scale-105 transition-transform">
                          <img
                            src={s.teamB.logo}
                            alt={s.teamB.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-mono text-[11px] font-black text-white tracking-wide">
                          {s.teamB.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Big Digital Score & Status Badge */}
                  <div className="text-right flex flex-col items-end">
                    <span className="font-mono font-black text-brandOrange text-xs md:text-sm tracking-wider drop-shadow-[0_0_8px_rgba(242,101,34,0.4)]">
                      {s.score}
                    </span>
                    <span className="text-[8px] font-mono font-bold text-white/50 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase mt-0.5">
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Tower Footer Telemetry */}
            <div className="border-t border-white/10 pt-2.5 mt-2 flex items-center justify-between text-[8px] font-mono text-white/50 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SPORTS OS SYNC</span>
              </div>
              <span className="text-brandOrange font-bold">LATENCY: 12MS</span>
            </div>

          </div>
        </aside>
      </div>

      {/* ─── BOTTOM CONTINUOUS LIVE TICKER TAPE ─── */}
      <footer className="relative z-30 w-full bg-black border-t border-brandOrange/30 py-2 flex items-center overflow-hidden">
        {/* Ticker Live Indicator */}
        <div className="shrink-0 px-4 md:px-6 flex items-center gap-2 border-r border-white/20 bg-brandOrange py-0.5 z-10">
          <Radio className="w-3 h-3 text-white animate-pulse" />
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white">
            {isEs ? "EN VIVO" : "LIVE"}
          </span>
        </div>

        {/* Continuous Scrolling News Crawl */}
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
    </main>
  );
}
