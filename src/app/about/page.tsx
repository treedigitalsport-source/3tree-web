"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users, Target, ShieldAlert, CheckCircle2, XCircle, Award, Scale, Lightbulb } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function AboutPage() {
  const { lang } = useLang();
  const isEs = lang === "es";

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white font-sans overflow-x-hidden relative">
      
      {/* Background Animated Gradient & Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,101,34,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,255,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
      </div>
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      {/* Nav Bar */}
      <nav className="relative z-50 w-full p-8 md:px-16 flex justify-between items-center mix-blend-difference">
        <Link href="/" className="hoverable group flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{isEs ? "Volver al Inicio" : "Back to Home"}</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 max-w-4xl pt-10 pb-32">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 0 30px rgba(242,101,34,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-2xl bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center mx-auto mb-6 text-brandOrange cursor-pointer transition-colors hover:bg-brandOrange/20"
          >
            <Users className="w-8 h-8 drop-shadow-[0_0_10px_rgba(242,101,34,0.6)]" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-4"
          >
            {isEs ? "QUIÉNES SOMOS" : "ABOUT US"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-mono tracking-widest text-brandOrange font-bold uppercase"
          >
            {isEs ? "3TREE DIGITAL · SPORT TECH REVOLUTION" : "3TREE DIGITAL · SPORT TECH REVOLUTION"}
          </motion.p>
        </div>

        {/* Content Body */}
        <div className="space-y-12">
          
          {/* Section 1: Quién fundó la compañía */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brandOrange/5 blur-[80px] rounded-full pointer-events-none" />
            
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3 mb-6">
              <motion.div whileHover={{ scale: 1.2, rotate: 15 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
                <Award className="w-6 h-6 text-brandOrange drop-shadow-[0_0_8px_rgba(242,101,34,0.8)]" />
              </motion.div>
              {isEs ? "Nuestra Fundación" : "Our Founders"}
            </h2>
            
            <div className="space-y-6 text-white/70 leading-relaxed text-sm md:text-base font-light">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{isEs ? "El Origen" : "The Origins"}</h3>
                <p>
                  {isEs 
                    ? "Operando desde Lutz, Florida, USA — Operaciones Globales, fundé 3tree Digital con un propósito claro: cerrar la brecha entre el talento de élite y los reclutadores profesionales. Como único dueño y arquitecto de este proyecto, he evolucionado esta agencia para convertirla en una plataforma impulsada por Inteligencia Artificial, desplegando herramientas autónomas que llevan la visibilidad atlética al siguiente nivel."
                    : "Operating out of Lutz, Florida, USA — Global Operations, I founded 3tree Digital with a clear purpose: to bridge the gap between elite talent and professional scouts. As the sole owner and architect of this project, I have evolved this agency into an AI-powered platform, deploying autonomous tools that take athletic visibility to the next level."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">{isEs ? "La Ventaja Injusta (El Factor del Fundador)" : "The Unfair Advantage (The Founder Factor)"}</h3>
                <p className="mb-4">
                  {isEs
                    ? "Mi visión no nació en una sala de juntas corporativa. Es el resultado directo de mi trayectoria como Único Fundador: la fusión de 26 años de experiencia en Entrenamiento Personal de Élite con ingeniería avanzada en IA y Big Data. Esta combinación es mi principal ventaja técnica y estratégica."
                    : "My vision was not born in a corporate boardroom. It is the direct result of my trajectory as a Solo Founder: the fusion of 26 years of elite Personal Training experience with advanced engineering in AI and Big Data. This combination is my main technical and strategic advantage."}
                </p>
                <ul className="space-y-4">
                  <li>
                    <strong className="text-brandOrange block mb-1">👁️ {isEs ? "Visión de Campo (Domain Expertise)" : "Field Vision (Domain Expertise)"}</strong>
                    {isEs 
                      ? "No uso simples algoritmos genéricos de detección de movimiento. Dos décadas y media en la trinchera me permiten identificar exactamente qué jugadas, métricas y detalles biomecánicos son los que un scout profesional necesita ver." 
                      : "I don't use simple generic motion detection algorithms. Two and a half decades in the trenches allow me to identify exactly what plays, metrics, and biomechanical details a professional scout needs to see."}
                  </li>
                  <li>
                    <strong className="text-brandOrange block mb-1">🧠 {isEs ? "Arquitectura de Datos (Data Vision)" : "Data Architecture (Data Vision)"}</strong>
                    {isEs 
                      ? "La plataforma hace mucho más que editar videos. Uso la Inteligencia Artificial para cuantificar el rendimiento deportivo a escala, transformando el talento bruto de un atleta en estadísticas innegables." 
                      : "The platform does much more than edit videos. I use Artificial Intelligence to quantify athletic performance at scale, transforming an athlete's raw talent into undeniable statistics."}
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Section: Cómo Nació la Idea */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brandOrange/5 blur-[80px] rounded-full pointer-events-none" />
            
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3 mb-6">
              <motion.div whileHover={{ scale: 1.2, rotate: -15 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
                <Lightbulb className="w-6 h-6 text-brandOrange drop-shadow-[0_0_8px_rgba(242,101,34,0.8)]" />
              </motion.div>
              {isEs ? "Cómo Nació la Idea" : "How the Idea Was Born"}
            </h2>
            
            <div className="space-y-4 text-white/70 leading-relaxed text-sm md:text-base font-light">
              <p>
                {isEs 
                  ? "La idea de 3tree Digital e In the Play nació en los campos de juego locales. Observé cómo decenas de jóvenes atletas con talento extraordinario se quedaban fuera del radar de los cazatalentos profesionales simplemente por no tener los recursos para pagar miles de dólares a agencias de video tradicionales."
                  : "The idea for 3tree Digital and In the Play was born on local sports fields. I watched dozens of extraordinarily talented young athletes miss out on professional scouting opportunities simply because they couldn't afford to pay traditional video production agencies thousands of dollars."}
              </p>
              <p>
                {isEs
                  ? "Ver a padres de familia sosteniendo teléfonos móviles intentando grabar y estabilizar con las manos temblorosas las jugadas clave de sus hijos me inspiró: ¿Qué pasaría si usara Inteligencia Artificial para tomar esos videos caseros, estabilizarlos, recortar las mejores jugadas y darles calidad de televisión profesional al instante y al costo de una suscripción de $2 dólares al mes? Así nació mi misión."
                  : "Seeing parents holding cell phones trying to capture and stabilize their children's key plays with shaking hands inspired me: What if I used Artificial Intelligence to take those home videos, stabilize them, crop the best plays, and instantly give them TV-broadcast quality for the price of a $2 dollar subscription? Thus, my mission was born."}
              </p>
            </div>
          </motion.section>

          {/* Section 2: Cuál es su propuesta */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden"
          >
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3 mb-6">
              <motion.div whileHover={{ scale: 1.2, rotate: 15 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
                <Target className="w-6 h-6 text-brandOrange drop-shadow-[0_0_8px_rgba(242,101,34,0.8)]" />
              </motion.div>
              {isEs ? "Mi Propuesta de Valor" : "My Value Proposal"}
            </h2>
            
            <div className="space-y-4 text-white/70 leading-relaxed text-sm md:text-base font-light">
              <p>
                {isEs
                  ? "Mi propuesta consiste en democratizar las oportunidades en el deporte. A través de mi plataforma In the Play, proporciono un estudio de edición de video instantáneo que estabiliza jugadas crudas, realiza recortes cinematográficos precisos y aplica filtros avanzados por solo $2 dólares al mes."
                  : "My proposal is to democratize sports recruiting opportunities. Through my platform In the Play, I provide an instant video editing studio that stabilizes raw footage, performs precise cinematic cuts, and applies advanced filters for only $2 dollars a month."}
              </p>
              <p>
                {isEs
                  ? "Los atletas ya no necesitan contratar agencias costosas ni editores de video manuales. Suben su clip crudo y, en minutos, tienen un highlight listo para el feed de visibilidad internacional y publicado directamente en el canal oficial de YouTube."
                  : "Athletes no longer need to hire expensive agencies or manual video editors. They upload their raw clip and, in minutes, have a highlight ready for the international visibility feed and published directly to the official YouTube channel."}
              </p>
            </div>
          </motion.section>


        </div>

        {/* Action Button */}
        <div className="mt-16 text-center">
          <Link 
            href="/in-the-play" 
            className="hoverable inline-flex items-center gap-2 bg-brandOrange text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(242,101,34,0.4)] transition-all hover:scale-105"
          >
            {isEs ? "Comenzar en In the Play" : "Start on In the Play"} <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>

      </main>
    </div>
  );
}
