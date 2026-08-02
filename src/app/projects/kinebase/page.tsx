"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Cpu, LayoutTemplate, Activity, ShieldAlert, Award, PlayCircle } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function KinebaseProPage() {
  const { lang } = useLang();

  const isEs = lang === "es";

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white font-sans overflow-x-hidden relative">
      
      {/* Background Animated Gradient & Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-25">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,101,34,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      {/* Nav Bar */}
      <nav className="relative z-50 w-full p-8 md:px-16 flex justify-between items-center mix-blend-difference">
        <Link href="/" className="hoverable group flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{isEs ? "Volver al Inicio" : "Back to Home"}</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pt-10 pb-32">
        
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-20 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brandOrange/30 bg-brandOrange/10 text-brandOrange text-[10px] font-bold tracking-[0.2em] uppercase mb-8"
          >
            <Activity className="w-4 h-4" /> {isEs ? "TECNOLOGÍA DE RENDIMIENTO" : "PERFORMANCE TECH"}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50"
          >
            KINEBASE <span className="text-brandOrange">PRO</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed"
          >
            {isEs 
              ? "La plataforma definitiva de análisis biomecánico 3D en tiempo real para atletas de élite y equipos profesionales."
              : "The ultimate real-time 3D biomechanical analysis platform for elite athletes and professional sports organizations."}
          </motion.p>
        </div>

        {/* Feature Grid & Cover Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative max-w-5xl mx-auto mb-32"
        >
          <div className="absolute inset-0 bg-brandOrange/10 blur-[120px] rounded-full z-0"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row bg-[#0B1021]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Project Cover */}
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-black min-h-[350px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/baseball_biomechanics_1785628048219.jpg" alt="Kinebase Pro Sports Biomechanics" className="w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1021] to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0B1021]"></div>
            </div>
            
            {/* Info Panel */}
            <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
              <span className="text-brandOrange text-[10px] font-bold tracking-[0.2em] uppercase mb-4 block">
                {isEs ? "SISTEMA PROPIETARIO" : "PROPRIETARY SYSTEM"}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                {isEs ? "Análisis Cinemático Sin Marcadores" : "Markerless Kinematic Analysis"}
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed font-light text-sm md:text-base">
                {isEs
                  ? "Utilizando visión por computadora avanzada y redes neuronales optimizadas, Kinebase Pro reconstruye y analiza el movimiento esquelético en 3D directo desde transmisiones de video a 240 fps, sin requerir marcadores físicos ni trajes especiales."
                  : "Leveraging state-of-the-art computer vision and optimized neural networks, Kinebase Pro reconstructs and analyzes skeletal movement in 3D directly from 240 fps video feeds, with no physical markers or specialized suits required."}
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs font-mono text-white/50 mb-8">
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-brandOrange" /> {isEs ? "Visión Computacional" : "Computer Vision"}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brandOrange" /> {isEs ? "Latencia de 2ms" : "2ms Latency"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Specifications */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
            <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider">
              {isEs ? "Características Principales" : "Key Specifications"}
            </h3>
            <Cpu className="text-white/40 w-6 h-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brandOrange/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-brandOrange/10 flex items-center justify-center mb-6 text-brandOrange border border-brandOrange/20">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3 group-hover:text-brandOrange transition-colors">
                {isEs ? "Seguimiento de Ángulos" : "Joint Angle Tracking"}
              </h4>
              <p className="text-white/40 text-sm leading-relaxed font-light">
                {isEs
                  ? "Monitoreo preciso de la flexión de articulaciones, velocidad angular y fuerzas rotacionales críticas durante el movimiento dinámico."
                  : "Precise monitoring of joint flexion, angular velocity, and critical rotational forces during dynamic movement."}
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brandOrange/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-brandOrange/10 flex items-center justify-center mb-6 text-brandOrange border border-brandOrange/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3 group-hover:text-brandOrange transition-colors">
                {isEs ? "Prevención de Lesiones" : "Injury Prevention"}
              </h4>
              <p className="text-white/40 text-sm leading-relaxed font-light">
                {isEs
                  ? "Detección temprana de micro-desviaciones y asimetrías posturales que podrían desencadenar lesiones crónicas."
                  : "Early detection of micro-deviations and postural asymmetries that could lead to chronic injuries."}
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brandOrange/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-brandOrange/10 flex items-center justify-center mb-6 text-brandOrange border border-brandOrange/20">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3 group-hover:text-brandOrange transition-colors">
                {isEs ? "Reportes de Rendimiento" : "Performance Reports"}
              </h4>
              <p className="text-white/40 text-sm leading-relaxed font-light">
                {isEs
                  ? "Exportación automática de análisis de biomecánica detallada y métricas clave para el cuerpo técnico."
                  : "Automatic export of detailed biomechanics analysis and key metrics for coaching staff."}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mt-32 text-center"
        >
          <div className="p-12 md:p-16 rounded-[2.5rem] bg-white/[0.02] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brandOrange/10 blur-[100px] pointer-events-none"></div>
            <h3 className="text-3xl md:text-5xl font-display font-black uppercase text-white mb-6">
              {isEs ? "¿Listo para Implementar Kinebase Pro?" : "Ready to Implement Kinebase Pro?"}
            </h3>
            <p className="text-white/50 max-w-xl mx-auto mb-10 text-sm md:text-base font-light">
              {isEs
                ? "Contáctanos hoy para agendar una prueba real con tu equipo y ver cómo nuestras analíticas 3D optimizan el rendimiento deportivo."
                : "Get in touch today to schedule a live demo with your team and see how our 3D analytics optimize athletic performance."}
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 bg-brandOrange text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_40px_rgba(242,101,34,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {isEs ? "Agendar una Demostración" : "Schedule a Live Demo"} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
