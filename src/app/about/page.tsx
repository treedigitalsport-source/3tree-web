"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users, Target, ShieldAlert, CheckCircle2, XCircle, Award, Scale } from "lucide-react";
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
            className="w-16 h-16 rounded-2xl bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center mx-auto mb-6 text-brandOrange"
          >
            <Users className="w-8 h-8" />
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
              <Award className="w-6 h-6 text-brandOrange" />
              {isEs ? "Nuestra Fundación" : "Our Founders"}
            </h2>
            
            <div className="space-y-4 text-white/70 leading-relaxed text-sm md:text-base font-light">
              <p>
                {isEs 
                  ? "3Tree Digital fue fundada en Lutz, Florida, por un equipo de apasionados de la tecnología, analistas deportivos y ex-atletas dedicados a revolucionar la visibilidad de los deportistas a nivel mundial."
                  : "3Tree Digital was founded in Lutz, Florida, by a team of technology experts, sports analysts, and former athletes dedicated to revolutionizing athletic visibility worldwide."}
              </p>
              <p>
                {isEs
                  ? "Concebida originalmente para cerrar la brecha entre los jugadores con talento excepcional y los cazatalentos profesionales, la empresa ha evolucionado para implementar herramientas avanzadas de automatización de video basadas en Inteligencia Artificial."
                  : "Originally conceived to bridge the gap between exceptionally talented players and professional scouts, the company has evolved to deploy state-of-the-art video automation tools powered by Artificial Intelligence."}
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
              <Target className="w-6 h-6 text-brandOrange" />
              {isEs ? "Nuestra Propuesta de Valor" : "Our Value Proposal"}
            </h2>
            
            <div className="space-y-4 text-white/70 leading-relaxed text-sm md:text-base font-light">
              <p>
                {isEs
                  ? "Nuestra propuesta consiste en democratizar las oportunidades en el deporte. A través de In the Play, proporcionamos un estudio de edición de video instantáneo que estabiliza jugadas crudas, realiza recortes cinematográficos precisos y aplica filtros avanzados por solo $2 dólares al mes."
                  : "Our proposal is to democratize sports recruiting opportunities. Through In the Play, we provide an instant video editing studio that stabilizes raw footage, performs precise cinematic cuts, and applies advanced filters for only $2 dollars a month."}
              </p>
              <p>
                {isEs
                  ? "Los atletas ya no necesitan contratar agencias costosas ni editores de video manuales. Suben su clip crudo y, en minutos, tienen un highlight listo para nuestro feed de visibilidad internacional y publicado directamente en nuestro canal de YouTube."
                  : "Athletes no longer need to hire expensive agencies or manual video editors. They upload their raw clip and, in minutes, have a highlight ready for our international visibility feed and published directly to our YouTube channel."}
              </p>
            </div>
          </motion.section>

          {/* Section 3: Qué nos diferencia (Tabla comparativa) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md relative"
          >
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3 mb-8">
              <Scale className="w-6 h-6 text-brandOrange" />
              {isEs ? "La Diferencia 3Tree Digital" : "The 3Tree Digital Difference"}
            </h2>

            {/* Comparison Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm font-light">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider font-mono">
                    <th className="py-4 pr-4">{isEs ? "Característica" : "Feature"}</th>
                    <th className="py-4 px-4 text-brandOrange font-bold">3Tree Digital (In the Play)</th>
                    <th className="py-4 pl-4">{isEs ? "Agencias Tradicionales" : "Traditional Agencies"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-white/70">
                  <tr>
                    <td className="py-4 pr-4 font-bold text-white">{isEs ? "Costo del Servicio" : "Cost of Service"}</td>
                    <td className="py-4 px-4 text-green-400 font-mono font-bold">$2.00 USD / mes</td>
                    <td className="py-4 pl-4 font-mono">$1,000 - $3,000 USD</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-bold text-white">{isEs ? "Tiempo de Entrega" : "Delivery Time"}</td>
                    <td className="py-4 px-4 text-green-400 font-bold">{isEs ? "Minutos (Edición IA)" : "Minutes (AI Edited)"}</td>
                    <td className="py-4 pl-4">{isEs ? "Semanas o Meses" : "Weeks or Months"}</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-bold text-white">{isEs ? "Edición y Estabilización" : "Editing & Stabilization"}</td>
                    <td className="py-4 px-4 text-green-400"><CheckCircle2 className="w-4 h-4 inline mr-2 text-green-400" /> {isEs ? "Automatizada por IA" : "AI Automated"}</td>
                    <td className="py-4 pl-4 text-red-400"><XCircle className="w-4 h-4 inline mr-2 text-red-400" /> {isEs ? "Manual o inexistente" : "Manual / None"}</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-bold text-white">{isEs ? "Publicación en YouTube" : "YouTube Syndication"}</td>
                    <td className="py-4 px-4 text-green-400"><CheckCircle2 className="w-4 h-4 inline mr-2 text-green-400" /> {isEs ? "Automática" : "Automatic"}</td>
                    <td className="py-4 pl-4 text-red-400"><XCircle className="w-4 h-4 inline mr-2 text-red-400" /> {isEs ? "No incluida" : "Not included"}</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-bold text-white">{isEs ? "Acceso a Scouts" : "Scout Visibility"}</td>
                    <td className="py-4 px-4 text-green-400"><CheckCircle2 className="w-4 h-4 inline mr-2 text-green-400" /> {isEs ? "Red Global Abierta" : "Open Global Feed"}</td>
                    <td className="py-4 pl-4 text-red-400"><XCircle className="w-4 h-4 inline mr-2 text-red-400" /> {isEs ? "Solo contactos cerrados" : "Closed contacts only"}</td>
                  </tr>
                </tbody>
              </table>
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
