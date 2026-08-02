"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Database } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function PrivacyPage() {
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
            <ShieldCheck className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-4"
          >
            {isEs ? "POLÍTICA DE PRIVACIDAD" : "PRIVACY POLICY"}
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
              {isEs ? "1. Introducción" : "1. Introduction"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs 
                ? "En 3Tree Digital, valoramos tu confianza y nos comprometemos a proteger tus datos personales. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos la información personal y los archivos de video recopilados a través de nuestras plataformas web, incluyendo Kinebase Pro e In the Play."
                : "At 3Tree Digital, we value your trust and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, and safeguard personal information and video files collected through our web platforms, including Kinebase Pro and In the Play."}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "2. Información que Recopilamos" : "2. Information We Collect"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Recopilamos información que nos proporcionas directamente cuando interactúas con nuestras plataformas:"
                : "We collect information you provide directly to us when interacting with our platforms:"}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/50 text-sm font-light">
              <li>
                <strong>{isEs ? "Datos de Cuenta:" : "Account Data:"}</strong> {isEs ? "Nombre completo, dirección de correo electrónico e información de perfil deportivo." : "Full name, email address, and athletic profile details."}
              </li>
              <li>
                <strong>{isEs ? "Archivos de Video:" : "Video Files:"}</strong> {isEs ? "Videos crudos de jugadas deportivas que subes a In the Play para procesamiento de Inteligencia Artificial." : "Raw sports play videos you upload to In the Play for Artificial Intelligence processing."}
              </li>
              <li>
                <strong>{isEs ? "Datos del Dispositivo:" : "Device Data:"}</strong> {isEs ? "Dirección IP, tipo de navegador e información técnica de interacción con el sitio web." : "IP address, browser type, and technical interaction logs with the website."}
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "3. Procesamiento Biomecánico y de Video" : "3. Biomechanical & Video Processing"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Los videos subidos a Kinebase Pro e In the Play se procesan para:"
                : "Videos uploaded to Kinebase Pro and In the Play are processed in order to:"}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/50 text-sm font-light">
              <li>{isEs ? "Ejecutar algoritmos de reconstrucción esquelética y biomecánica 3D." : "Run skeletal reconstruction and 3D biomechanical algorithms."}</li>
              <li>{isEs ? "Estabilizar la imagen, realizar cortes dinámicos y aplicar filtros de calidad cinematográfica." : "Stabilize the image, perform dynamic cuts, and apply cinematic-quality filters."}</li>
              <li>{isEs ? "Publicar el material resultante en el feed global para visibilidad de scouts y entrenadores." : "Publish the resulting highlights in the global feed for discoverability by scouts and coaches."}</li>
            </ul>
            <p className="text-white/40 text-xs italic">
              {isEs
                ? "*No retenemos los videos crudos de manera indefinida una vez finalizado el procesamiento e indexación de la jugada."
                : "*We do not retain raw video files indefinitely once the processing and highlight indexing is completed."}
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "4. Seguridad en los Pagos (Stripe)" : "4. Payment Security (Stripe)"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Todos los pagos por suscripción de nuestros servicios se procesan de forma externa a través de Stripe, Inc. 3Tree Digital no almacena ni recopila los números de tu tarjeta de crédito o débito de forma directa. Toda la información de facturación es cifrada bajo los estándares de seguridad PCI-DSS de Stripe."
                : "All subscription payments for our services are processed externally through Stripe, Inc. 3Tree Digital does not collect or store your credit or debit card numbers directly. All billing information is encrypted under Stripe's PCI-DSS security standards."}
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "5. Uso de Cookies" : "5. Cookies & Tracking"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Utilizamos cookies esenciales y de análisis para recordar tus preferencias de idioma, optimizar el rendimiento de la carga del reproductor de video y entender la navegación general del sitio."
                : "We use essential and analytics cookies to remember your language preferences, optimize video player loading performance, and understand general site navigation."}
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "6. Tus Derechos" : "6. Your Rights"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Puedes solicitar el acceso, modificación o eliminación definitiva de tu información y tus videos cargados en cualquier momento poniéndote en contacto con nosotros en partners@3treedigital.com."
                : "You may request access, modification, or permanent deletion of your personal information and uploaded videos at any time by contacting us at partners@3treedigital.com."}
            </p>
          </section>

        </motion.div>

        {/* Footer Contact Callout */}
        <div className="mt-12 text-center text-white/40 text-xs">
          <p>
            {isEs 
              ? "¿Preguntas sobre nuestra privacidad? Contáctanos a " 
              : "Questions about our privacy? Contact us at "}
            <a href="mailto:partners@3treedigital.com" className="text-brandOrange hover:underline">partners@3treedigital.com</a>
          </p>
        </div>

      </main>
    </div>
  );
}
