"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Cookie, Info, Lock, Settings } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function CookiesPage() {
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
            <Cookie className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-4"
          >
            {isEs ? "POLÍTICA DE COOKIES" : "COOKIE POLICY"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-mono tracking-widest text-brandOrange font-bold uppercase"
          >
            {isEs ? "ÚLTIMA ACTUALIZACIÓN: AGOSTO 2026" : "LAST UPDATED: AUGUST 2026"}
          </motion.p>
        </div>

        {/* Content Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-12 bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brandOrange/5 blur-[80px] rounded-full pointer-events-none" />

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "1. ¿Qué son las Cookies?" : "1. What Are Cookies?"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs 
                ? "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet o móvil) cuando visitas un sitio web. Ayudan a que el sitio web funcione de manera más eficiente, recuerde tus preferencias de idioma y nos brinde métricas de uso técnico."
                : "Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help the website operate more efficiently, remember your language preferences, and provide us with technical usage metrics."}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "2. ¿Cómo Usamos las Cookies?" : "2. How We Use Cookies"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Utilizamos cookies por varios motivos técnicos y de usabilidad en 3Tree Digital:"
                : "We use cookies for several technical and usability reasons at 3Tree Digital:"}
            </p>
            <ul className="list-disc pl-6 space-y-3 text-white/50 text-sm font-light">
              <li>
                <strong>{isEs ? "Cookies Esenciales:" : "Essential Cookies:"}</strong> {isEs ? "Necesarias para habilitar la navegación segura, el procesamiento de pagos con Stripe y el inicio de sesión." : "Necessary to enable secure navigation, Stripe payment processing, and login states."}
              </li>
              <li>
                <strong>{isEs ? "Cookies de Preferencias:" : "Preference Cookies:"}</strong> {isEs ? "Nos permiten recordar tus selecciones de interfaz, como tu idioma preferido (español o inglés)." : "Allow us to remember your interface preferences, such as your preferred language (Spanish or English)."}
              </li>
              <li>
                <strong>{isEs ? "Cookies de Rendimiento:" : "Performance Cookies:"}</strong> {isEs ? "Ayudan a monitorear la velocidad de carga de los videos en el noticiero deportivo y a diagnosticar errores." : "Help monitor video loading speeds in our sports highlights feed and diagnose technical errors."}
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "3. Control de Cookies" : "3. Cookie Management"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Puedes deshabilitar o bloquear el uso de cookies en cualquier momento ajustando la configuración de tu navegador de internet. Ten en cuenta que si bloqueas las cookies esenciales, algunas secciones de la web, como el estudio de carga de videos de In the Play o los pagos seguros de Stripe, podrían no funcionar correctamente."
                : "You can disable or block cookies at any time by adjusting your web browser settings. Please note that blocking essential cookies may prevent certain parts of our website, such as In the Play video uploader or secure Stripe checkout, from operating properly."}
            </p>
          </section>

        </motion.div>

        {/* Footer Contact Callout */}
        <div className="mt-12 text-center text-white/40 text-xs">
          <p>
            {isEs 
              ? "¿Tienes dudas sobre las cookies? Contáctanos a " 
              : "Questions about our cookies? Contact us at "}
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=treedigitalsport@gmail.com" target="_blank" rel="noopener noreferrer" className="text-brandOrange hover:underline font-medium">treedigitalsport@gmail.com</a>
          </p>
        </div>

      </main>
    </div>
  );
}
