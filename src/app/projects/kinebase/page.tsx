"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Cpu, Activity, ShieldAlert, Award } from "lucide-react";
import { useLang } from "@/app/i18n";
import CustomCursor from "@/components/CustomCursor";
import { Footer } from "@/components/ui/Footer";

export default function KinebaseProPage() {
  const { lang, toggleLang } = useLang();
  const isEs = lang === "es";

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white relative overflow-x-hidden font-sans">
      <CustomCursor />

      {/* Architectural Grid Background (Awwwards Style) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-50 w-full px-6 md:px-12 py-6 border-b border-white/10 flex justify-between items-center bg-[#020617]/80 backdrop-blur-md">
        <Link href="/" className="font-display font-black text-2xl tracking-widest uppercase hover:opacity-80 transition-opacity">
          3Tree<span className="text-brandOrange">.</span>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="font-mono text-xs font-extrabold px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:border-brandOrange hover:text-brandOrange transition-all cursor-pointer uppercase tracking-wider text-white"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <Link href="/" className="hoverable group flex items-center gap-4 text-white hover:text-brandOrange transition-colors">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] hidden md:inline">
              {isEs ? "Volver al Inicio" : "Back to Home"}
            </span>
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brandOrange bg-[#020617]">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </nav>

      {/* Hero Awwwards Style */}
      <header className="relative z-10 w-full border-b border-white/10 overflow-hidden bg-[#020617]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-8 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center relative overflow-hidden min-h-[60vh]">
            <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-brandOrange/10 blur-[120px] rounded-full pointer-events-none"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-none border border-white/10 bg-white/[0.02] text-brandOrange text-[10px] font-mono tracking-[0.2em] uppercase mb-8 relative z-10">
                <Activity className="w-3 h-3" /> {isEs ? "TECNOLOGÍA DE RENDIMIENTO" : "PERFORMANCE TECH"}
              </span>
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight relative z-10 break-words">
                KINEBASE <br/> 
                <span className="text-transparent" style={{ WebkitTextStroke: '2px #f26522' }}>PRO</span>
              </h1>
            </motion.div>
          </div>
          
          <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-end bg-white/[0.02]">
            <p className="font-mono text-sm md:text-base leading-[1.8] text-white/60 mb-10">
              {isEs 
                ? "La plataforma definitiva de análisis biomecánico 3D en tiempo real para atletas de élite y equipos profesionales."
                : "The ultimate real-time 3D biomechanical analysis platform for elite athletes and professional sports organizations."}
            </p>
            <div className="flex gap-4 flex-wrap">
              <span className="px-4 py-2 border border-white/10 rounded-none text-[10px] font-mono uppercase tracking-widest text-brandOrange">Computer Vision</span>
              <span className="px-4 py-2 border border-white/10 rounded-none text-[10px] font-mono uppercase tracking-widest">240 fps</span>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Split Showcase */}
      <section className="relative z-10 w-full border-b border-white/10 bg-[#020617]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Side */}
          <div className="relative border-b lg:border-b-0 lg:border-r border-white/10 h-[40vh] lg:h-[70vh] overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/articles/baseball_biomechanics_1785628048219.jpg" 
              alt="Kinebase Pro" 
              className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>
          </div>
          
          {/* Info Side */}
          <div className="p-8 md:p-14 lg:p-18 flex flex-col justify-center bg-[#020617]">
            <span className="text-brandOrange text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-6 block">
              {isEs ? "// SISTEMA PROPIETARIO" : "// PROPRIETARY SYSTEM"}
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black uppercase mb-6 leading-tight tracking-tight">
              {isEs ? "Análisis Cinemático" : "Markerless"}{" "}
              <span className="text-brandOrange">
                {isEs ? "Sin Marcadores" : "Kinematic Analysis"}
              </span>
            </h2>
            <p className="text-white/60 leading-[1.8] font-mono text-xs sm:text-sm mb-10 max-w-xl">
              {isEs
                ? "Utilizando visión por computadora avanzada y redes neuronales optimizadas, Kinebase Pro reconstruye y analiza el movimiento esquelético en 3D directo desde transmisiones de video a 240 fps, sin requerir marcadores físicos ni trajes especiales."
                : "Leveraging state-of-the-art computer vision and optimized neural networks, Kinebase Pro reconstructs and analyzes skeletal movement in 3D directly from 240 fps video feeds, with no physical markers or specialized suits required."}
            </p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
              <div>
                <span className="block font-display text-3xl font-black text-white mb-1">2ms</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-brandOrange">{isEs ? "Latencia" : "Latency"}</span>
              </div>
              <div>
                <span className="block font-display text-3xl font-black text-white mb-1">3D</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-brandOrange">{isEs ? "Mapeo 3D" : "Mapping"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Bento Grid */}
      <section className="relative z-10 w-full bg-[#020617]">
        <div className="grid grid-cols-1 md:grid-cols-3 border-l border-white/10">
          
          <div className="p-6 sm:p-8 md:p-10 border-b border-r border-white/10 flex flex-col justify-between bg-white/[0.02] min-h-[340px] hover:bg-brandOrange/5 transition-colors group">
            <div>
              <div className="w-10 h-10 flex items-center justify-center mb-6 border border-white/10 group-hover:border-brandOrange transition-colors">
                <Activity className="w-5 h-5 text-white group-hover:text-brandOrange transition-colors" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase leading-tight tracking-tight mb-3 break-words">
                {isEs ? "Ángulos" : "Joint"} <br/><span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>{isEs ? "Articulares" : "Tracking"}</span>
              </h3>
            </div>
            <p className="font-mono text-xs text-white/50 leading-relaxed">
              {isEs
                ? "Monitoreo preciso de la flexión de articulaciones, velocidad angular y fuerzas rotacionales críticas."
                : "Precise monitoring of joint flexion, angular velocity, and critical rotational forces."}
            </p>
          </div>

          <div className="p-6 sm:p-8 md:p-10 border-b border-r border-white/10 flex flex-col justify-between bg-[#020617] min-h-[340px] hover:bg-brandOrange/5 transition-colors group">
            <div>
              <div className="w-10 h-10 flex items-center justify-center mb-6 border border-white/10 group-hover:border-brandOrange transition-colors">
                <ShieldAlert className="w-5 h-5 text-white group-hover:text-brandOrange transition-colors" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase leading-tight tracking-tight mb-3 break-words">
                {isEs ? "Prevención" : "Injury"} <br/><span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>{isEs ? "De Lesiones" : "Prevention"}</span>
              </h3>
            </div>
            <p className="font-mono text-xs text-white/50 leading-relaxed">
              {isEs
                ? "Detección temprana de micro-desviaciones y asimetrías posturales que podrían desencadenar lesiones."
                : "Early detection of micro-deviations and postural asymmetries that could lead to chronic injuries."}
            </p>
          </div>

          <div className="p-6 sm:p-8 md:p-10 border-b border-r border-white/10 flex flex-col justify-between bg-white/[0.02] min-h-[340px] hover:bg-brandOrange/5 transition-colors group">
            <div>
              <div className="w-10 h-10 flex items-center justify-center mb-6 border border-white/10 group-hover:border-brandOrange transition-colors">
                <Award className="w-5 h-5 text-white group-hover:text-brandOrange transition-colors" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase leading-tight tracking-tight mb-3 break-words">
                {isEs ? "Reportes" : "Performance"} <br/><span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>{isEs ? "Técnicos" : "Reports"}</span>
              </h3>
            </div>
            <p className="font-mono text-xs text-white/50 leading-relaxed">
              {isEs
                ? "Exportación automática de análisis de biomecánica y métricas clave para el cuerpo técnico."
                : "Automatic export of detailed biomechanics analysis and key metrics for coaching staff."}
            </p>
          </div>
          
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 w-full border-b border-white/10 bg-[#020617] p-10 md:p-20 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brandOrange/5 blur-[150px] pointer-events-none"></div>
        <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase text-white mb-10 leading-[0.9] tracking-tight relative z-10 break-words">
          {isEs ? "OBTÉN" : "DEPLOY"} <br/>
          <span className="text-brandOrange">KINEBASE</span>
        </h3>
        <Link 
          href="/contact"
          className="hoverable relative z-10 inline-flex items-center gap-4 bg-transparent border border-white/20 text-white px-10 py-5 font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-brandOrange hover:border-brandOrange transition-colors duration-500"
        >
          {isEs ? "Agendar Demostración" : "Schedule Live Demo"} <ArrowUpRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ─── FOOTER CORPORATIVO UNIFICADO ─── */}
      <Footer />
    </main>
  );
}
