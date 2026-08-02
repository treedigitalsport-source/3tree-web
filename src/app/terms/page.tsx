"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText, Lock, Globe, Scale } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function TermsPage() {
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
            <Scale className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-4"
          >
            {isEs ? "TÉRMINOS DE SERVICIO" : "TERMS OF SERVICE"}
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
              {isEs ? "1. Aceptación de los Términos" : "1. Acceptance of Terms"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs 
                ? "Al acceder y utilizar el sitio web de 3Tree Digital, incluyendo Kinebase Pro e In the Play, aceptas cumplir y estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, debes abstenerte de utilizar nuestros servicios."
                : "By accessing and using the 3Tree Digital website, including Kinebase Pro and In the Play, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you must refrain from using our services."}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "2. Descripción de los Servicios" : "2. Description of Services"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "3Tree Digital proporciona plataformas tecnológicas para la edición automatizada de jugadas deportivas (highlights) a través de Inteligencia Artificial, almacenamiento de video y distribución en nuestro feed de scouting y canal oficial de YouTube."
                : "3Tree Digital provides technological platforms for automated sports highlights editing via Artificial Intelligence, video storage, and distribution through our scouting feed and official YouTube channel."}
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "3. Suscripción y Pagos" : "3. Subscription & Payments"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "El uso de la herramienta de edición y subida de videos en In the Play requiere el pago de una suscripción activa de $2.00 USD al mes. Los pagos se procesan de forma recurrente y segura a través de Stripe. Puedes cancelar tu suscripción en cualquier momento. No se realizan reembolsos parciales por periodos mensuales ya facturados."
                : "Using the highlight editing and upload tool on In the Play requires an active subscription of $2.00 USD per month. Payments are processed recursively and securely via Stripe. You can cancel your subscription at any time. Partial refunds are not issued for billing periods already processed."}
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "4. Licencia y Uso de Contenido" : "4. Content License & Use"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Sigues siendo el propietario legítimo de todos los videos originales que subas. Al subir archivos de video a In the Play, otorgas a 3Tree Digital una licencia no exclusiva, libre de regalías, mundial y transferible para procesar, estabilizar, editar, almacenar y publicar el video resultante en nuestro feed global de visibilidad deportiva y en nuestro canal de YouTube oficial."
                : "You remain the sole owner of all original videos you upload. By uploading video files to In the Play, you grant 3Tree Digital a non-exclusive, royalty-free, worldwide, and transferable license to process, stabilize, edit, store, and publish the resulting video on our global sports discoverability feed and official YouTube channel."}
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "5. Uso Aceptable del Servicio" : "5. Acceptable Use"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "El usuario se compromete a no subir videos que contengan material con derechos de autor de terceros, contenido ofensivo, violento o que no esté directamente relacionado con jugadas y dinámicas deportivas."
                : "The user agrees not to upload videos containing third-party copyrighted material, offensive or violent content, or content that is not directly related to sports action and dynamics."}
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "6. Limitación de Responsabilidad" : "6. Limitation of Liability"}
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "3Tree Digital no garantiza que la publicación de tus jugadas destacadas garantice la contratación o el reclutamiento por parte de scouts, universidades o clubes deportivos. El servicio de procesamiento de Inteligencia Artificial se provee 'tal cual', sin garantías implícitas de rendimiento técnico."
                : "3Tree Digital does not guarantee that publishing your highlights will result in scouting, university recruitment, or club hiring. The Artificial Intelligence editing service is provided 'as is', without any implied performance warranties."}
            </p>
          </section>

        </motion.div>

        {/* Footer Contact Callout */}
        <div className="mt-12 text-center text-white/40 text-xs">
          <p>
            {isEs 
              ? "¿Dudas sobre los Términos de Servicio? Contáctanos a " 
              : "Questions about the Terms of Service? Contact us at "}
            <a href="mailto:partners@3treedigital.com" className="text-brandOrange hover:underline">partners@3treedigital.com</a>
          </p>
        </div>

      </main>
    </div>
  );
}
