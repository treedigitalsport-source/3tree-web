"use client";

import React, { useState } from "react";
import Image from "next/image";
import { aiArticles } from "@/lib/articlesData";
import { 
  Clock, 
  CheckCircle2, 
  Copy, 
  Bot, 
  Send, 
  Check
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { RumbleIcon } from "@/components/ui/RumbleIcon";
import { BlueskyIcon } from "@/components/ui/BlueskyIcon";
import { TruthSocialIcon } from "@/components/ui/TruthSocialIcon";
import { TikTokIcon } from "@/components/ui/TikTokIcon";

export default function SocialPublisherAdmin() {
  const [selectedArticleId, setSelectedArticleId] = useState<number>(aiArticles[0]?.id || 2);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispatchedId, setDispatchedId] = useState<string | null>(null);

  const selectedArticle = aiArticles.find(a => a.id === selectedArticleId) || aiArticles[0];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDispatch = (id: string) => {
    setDispatchedId(id);
    setTimeout(() => setDispatchedId(null), 3000);
  };

  // Generador inteligente de copies por canal adaptado por AG-017 Clara
  const channels = [
    {
      id: "instagram",
      name: "Instagram",
      handle: "@3treesportai",
      color: "#E1306C",
      icon: <InstagramIcon className="w-5 h-5 text-[#E1306C]" />,
      slot: "Martes y Jueves · 12:00 PM / 7:30 PM EST",
      format: "Infografía 1:1 Cuadrada (1024x1024 px)",
      copy: `📊 ¿El dato anticipa la decisión o solo la acompaña?\n\n${selectedArticle.descEs}\n\n💡 Puntos clave analizados por el staff:\n• ${selectedArticle.insightsEs[0] || ""}\n• ${selectedArticle.insightsEs[1] || ""}\n\n🔗 Lee el análisis completo en el enlace de nuestra biografía o en 3treedigital.com/journal/${selectedArticle.slug}\n\n#3TreeDigital #SportTech #ArtificialIntelligence #BaseballAnalytics #Biomechanics #SportsData #HighPerformance #AgentesDeIA`,
    },
    {
      id: "x",
      name: "X (Twitter)",
      handle: "@3TreeSportAI",
      color: "#FFFFFF",
      icon: <span className="font-black text-sm text-white">𝕏</span>,
      slot: "Lunes a Viernes · 08:00 AM EST (Morning Briefing)",
      format: "Hilo Sabermétrico (5 Tweets) + Social Card",
      copy: `🧵 1/4 ${selectedArticle.titleEs}\n\nDurante décadas el deporte se decidió con intuición. Hoy los algoritmos entran al vestuario y al dugout.\n\n👇 Abro hilo con la telemetría y los datos clave:\n\n2/4 📈 EL HALLAZGO:\n"${selectedArticle.insightsEs[0] || ""}"\n\n3/4 ⚡ LA APLICACIÓN:\n"${selectedArticle.insightsEs[1] || ""}"\n\n4/4 🚀 Lee el reporte completo de @3TreeSportAI aquí:\nhttps://3treedigital.com/journal/${selectedArticle.slug}`,
    },
    {
      id: "tiktok",
      name: "TikTok",
      handle: "@3TreeSportAI",
      color: "#00F2FE",
      icon: <TikTokIcon className="w-5 h-5 text-[#00F2FE]" />,
      slot: "Lunes · Miércoles · Viernes · 6:30 PM EST",
      format: "Video Vertical 9:16 (<45s) con Hook Rápido",
      copy: `[GUION PARA AG-013 MATEO]\n🎬 HOOK (0-3s): ¿Sabías que la IA ahora puede predecir la fatiga de un pitcher antes de que sienta el dolor?\n\n🎙️ VOZ EN OFF (3-20s): En este análisis desglosamos cómo ${selectedArticle.titleEs} está revolucionando el juego.\n\n📊 VISUAL (20-35s): Mostrar telemetría y esqueleto cinemático con datos de 102.7 mph y rotación de costuras.\n\n🚀 CTA (35-45s): Síguenos en @3TreeSportAI para ver más ciencia deportiva real.\n\n#SportTech #Baseball #Pitching #Kinematics #3TreeSportAI`,
    },
    {
      id: "youtube",
      name: "YouTube Shorts / Video",
      handle: "@3TreeSportAI",
      color: "#FF0000",
      icon: <span className="text-red-500 font-bold text-xs">YT</span>,
      slot: "Miércoles y Domingo · 5:00 PM EST",
      format: "Shorts 9:16 y Masterclass 16:9 4K",
      copy: `TITULAR: ${selectedArticle.titleEs} | 3Tree Digital Sport Tech\n\nDESCRIPCIÓN:\nEn este episodio analizamos el impacto directo de la inteligencia artificial, la visión artificial y los modelos biomecánicos en el deporte de alto rendimiento.\n\n📖 Artículo completo en The Edge Journal:\nhttps://3treedigital.com/journal/${selectedArticle.slug}\n\n🔔 Suscríbete al canal oficial de 3Tree Digital Sport IA para no perderte ningún análisis táctico.`,
    },
    {
      id: "rumble",
      name: "Rumble",
      handle: "3TreeSportAI",
      color: "#85c742",
      icon: <RumbleIcon className="w-5 h-5 text-[#85c742]" />,
      slot: "Miércoles y Domingo · 5:30 PM EST",
      format: "Video HD Completo y Archivo Sin Censura",
      copy: `${selectedArticle.titleEs}\n\n${selectedArticle.execSummaryEs}\n\nCanal oficial de 3Tree Sport AI en Rumble. Telemetría deportiva libre y análisis independiente de datos de élite.\n\nEnlace al artículo: https://3treedigital.com/journal/${selectedArticle.slug}`,
    },
    {
      id: "bluesky",
      name: "Bluesky",
      handle: "@3treesportai.bsky.social",
      color: "#0285FF",
      icon: <BlueskyIcon className="w-5 h-5 text-[#0285FF]" />,
      slot: "Martes y Jueves · 09:00 AM EST (Feed Cronológico)",
      format: "Micro-post con Enlace Indexado",
      copy: `🔬 ${selectedArticle.titleEs}\n\n"${selectedArticle.descEs}"\n\nReporte completo de Sport Tech y analítica deportiva publicado en The Edge Journal:\nhttps://3treedigital.com/journal/${selectedArticle.slug} 🚀`,
    },
    {
      id: "truth",
      name: "Truth Social",
      handle: "@3TreeSportAI",
      color: "#605af5",
      icon: <TruthSocialIcon className="w-5 h-5 text-[#605af5]" />,
      slot: "Lunes y Jueves · 11:30 AM EST",
      format: "Columna del Fundador y Visión de Estado",
      copy: `🚨 COLUMNA OFICIAL 3TREE SPORT AI\n\n${selectedArticle.titleEs}\n\n${selectedArticle.execSummaryEs}\n\nLa soberanía de datos y el alto rendimiento atlético ya son una prioridad estratégica global. Lee el artículo completo:\nhttps://3treedigital.com/journal/${selectedArticle.slug}`,
    },
    {
      id: "pinterest",
      name: "Pinterest",
      handle: "@3treesportai",
      color: "#E60023",
      icon: <span className="text-[#E60023] font-bold text-xs">PIN</span>,
      slot: "Sábado y Domingo · 2:00 PM EST",
      format: "Pin de Infografía 1:1 / Tablero Permanente",
      copy: `TITULAR DEL PIN: ${selectedArticle.titleEs}\n\nTABLERO: Sport Tech & Baseball Intelligence 2026\nENLACE DE DESTINO: https://3treedigital.com/journal/${selectedArticle.slug}\n\nDESCRIPCIÓN: Infografía oficial y datos biomecánicos de 3Tree Digital Sport IA. Guarda este pin para consultar los últimos avances en ciencia deportiva.`,
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── STATUS HEADER DE AG-017 CLARA ─── */}
      <div className="bg-gradient-to-r from-brandOrange/15 via-white/[0.03] to-[#0054A6]/15 border border-white/15 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brandOrange/20 border border-brandOrange/40 flex items-center justify-center text-brandOrange shadow-[0_0_20px_rgba(242,101,34,0.3)]">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight text-white">
                AG-017 Clara · Community Manager
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 font-mono text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Online y Sincronizada
              </span>
            </div>
            <p className="font-mono text-xs text-white/50">
              Calendario Oficial: <span className="text-brandOrange font-bold">CAL-SOC-2026-v1</span> · Zona Horaria: <span className="text-sky-400 font-bold">EST / EDT (Miami)</span>
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => handleDispatch("all")}
            className="w-full md:w-auto px-6 py-3 rounded-full bg-brandOrange hover:bg-brandOrange/90 text-white font-mono text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(242,101,34,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {dispatchedId === "all" ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Cola Aprobada y Enrutada!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Aprobar Cola Semanal Completa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── SELECTOR DE ARTÍCULO FUENTE ─── */}
      <div className="bg-[#060c1c]/90 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-brandOrange block mb-1">
              Paso 1: Seleccionar Contenido Fuente
            </span>
            <h3 className="font-display font-black text-lg md:text-xl uppercase text-white">
              Artículos Publicados en The Edge Journal
            </h3>
          </div>

          <div className="flex gap-2 flex-wrap">
            {aiArticles.map((art) => (
              <button
                key={art.id}
                onClick={() => setSelectedArticleId(art.id)}
                className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                  selectedArticleId === art.id
                    ? "bg-brandOrange text-white shadow-lg border border-brandOrange"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                Art. {art.id}: {art.slug.split("-")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Article Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-black/40 border border-white/10 p-4 rounded-2xl">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black aspect-square md:col-span-3 lg:col-span-2">
            <Image 
              src={selectedArticle.image} 
              alt={selectedArticle.titleEs} 
              fill 
              className="object-contain object-top"
            />
          </div>
          <div className="md:col-span-9 lg:col-span-10">
            <span className="px-2.5 py-0.5 rounded-full bg-brandOrange/20 border border-brandOrange/40 font-mono text-[9px] font-bold text-brandOrange uppercase mb-2 inline-block">
              {selectedArticle.categoryEs}
            </span>
            <h4 className="font-display font-black text-base md:text-lg text-white leading-snug mb-1">
              {selectedArticle.titleEs}
            </h4>
            <p className="font-sans text-xs text-white/60 line-clamp-2">
              {selectedArticle.descEs}
            </p>
          </div>
        </div>
      </div>

      {/* ─── PARRILLA DE LOS 8 CANALES SOCIALES ─── */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-brandOrange block mb-1">
              Paso 2: Cola de Publicación y Distribución
            </span>
            <h3 className="font-display font-black text-2xl uppercase text-white">
              Pauta por Red Social (8 Canales Activos)
            </h3>
          </div>
          <span className="font-mono text-xs text-white/40 hidden sm:inline">
            LinkedIn: <strong className="text-red-400">EXCLUIDO</strong> · 8 Redes Conectadas
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {channels.map((ch) => (
            <div 
              key={ch.id}
              className="bg-[#060c1c]/95 border border-white/10 hover:border-white/25 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300"
            >
              <div>
                {/* Channel Header */}
                <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
                      {ch.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-black text-base uppercase text-white leading-none">
                        {ch.name}
                      </h4>
                      <span className="font-mono text-[10px] text-brandOrange">
                        {ch.handle}
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[9px] text-white/70 font-bold uppercase">
                    {ch.format.split("(")[0]}
                  </span>
                </div>

                {/* Timing Slot */}
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-[10px] text-sky-400">
                  <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Slot: {ch.slot}</span>
                </div>

                {/* Copy Box */}
                <div className="relative bg-black/60 border border-white/10 rounded-2xl p-4 font-mono text-xs text-white/80 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto mb-4 custom-scrollbar">
                  {ch.copy}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-white/10 gap-2">
                <button
                  onClick={() => handleCopy(ch.id, ch.copy)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === ch.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white/60" />
                      <span>Copiar Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDispatch(ch.id)}
                  className="px-4 py-2 rounded-full bg-brandOrange/20 hover:bg-brandOrange border border-brandOrange/40 hover:border-brandOrange text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {dispatchedId === ch.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Programado</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-brandOrange group-hover:text-white" />
                      <span>Disparar Slot</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
