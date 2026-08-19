"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { useLang } from "@/app/i18n";

export default function Contact() {
  const { lang } = useLang();
  const isEs = lang === "es";
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);

    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || "Ocurrió un error.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-brandOrange selection:text-white relative overflow-hidden flex flex-col">
      <CustomCursor />

      {/* Navigation */}
      <nav className="w-full px-6 md:px-12 py-8 flex justify-between items-center relative z-50">
        <Link href="/" className="hoverable flex items-center gap-3 text-white/50 hover:text-white transition-colors group">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brandOrange group-hover:bg-brandOrange/10 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">{isEs ? "Volver al Inicio" : "Back to Home"}</span>
        </Link>
        <div className="font-display font-black text-2xl tracking-widest uppercase">
          3Tree<span className="text-brandOrange">.</span>
        </div>
      </nav>

      {/* Contact Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-12 relative z-10 w-full max-w-7xl mx-auto gap-16 pb-20">
        
        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brandOrange/10 border border-brandOrange/20 text-brandOrange font-mono text-[10px] font-bold uppercase tracking-widest mb-6">
            {isEs ? "Sede Global" : "Global HQ"}
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-8">
            {isEs ? "Construyamos" : "Let's Build"} <br />
            <span className="text-white/30">{isEs ? "el futuro." : "the future."}</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed mb-12 max-w-md font-medium">
            {isEs 
              ? "¿Listo para actualizar la infraestructura digital de tu organización? Escríbenos. Desarrollamos Sports OS, analítica avanzada y plataformas para el deporte de élite."
              : "Ready to upgrade your organization's digital infrastructure? Drop us a line. We build Sports OS architectures, advanced analytics, and platforms for elite sports."}
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white/70">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-brandOrange font-bold mb-1">Email</p>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=treedigitalsport@gmail.com" target="_blank" rel="noopener noreferrer" className="font-medium text-lg hover:text-brandOrange transition-colors">treedigitalsport@gmail.com</a>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-white/70">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-brandOrange font-bold mb-1">{isEs ? "Ubicación" : "Location"}</p>
                <p className="font-medium text-lg">{isEs ? "Lutz, Florida, USA — Operaciones Globales" : "Lutz, Florida, USA — Global Operations"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-[#020617] border border-white/10 p-8 md:p-12 rounded-[2rem] w-full max-w-lg mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brandOrange/5 blur-[100px] pointer-events-none"></div>

              <h2 className="font-display text-2xl font-black uppercase mb-8 tracking-wide relative z-10">
                {isEs ? "Iniciar Proyecto" : "Start Project"}
              </h2>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center text-center py-12 relative z-10"
                  >
                    <div className="w-20 h-20 bg-brandOrange/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-brandOrange" />
                    </div>
                    <h3 className="text-2xl font-display font-black uppercase mb-4 text-white">
                      {isEs ? "¡Mensaje Recibido!" : "Message Received!"}
                    </h3>
                    <p className="text-white/60">
                      {isEs ? "Gracias por contactarnos. Nuestro equipo revisará tu solicitud y se comunicará contigo pronto." : "Thank you for reaching out. Our team will review your request and get back to you shortly."}
                    </p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6 relative z-10"
                  >
                    {/* CAPA DE SEGURIDAD 2: HONEYPOT Y TIMESTAMP OCULTOS */}
                    <input type="text" name="website_url_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden opacity-0 pointer-events-none w-0 h-0 absolute -left-[9999px]" />
                    <input type="hidden" name="form_rendered_at" value={Date.now()} />

                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                        {isEs ? "Organización / Equipo" : "Organization / Team"}
                      </label>
                      <input name="organization" required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brandOrange focus:bg-brandOrange/5 transition-colors" placeholder={isEs ? "Ej. New York Yankees" : "e.g. New York Yankees"} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                          {isEs ? "Nombre" : "Name"}
                        </label>
                        <input name="name" required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brandOrange focus:bg-brandOrange/5 transition-colors" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                          {isEs ? "Correo Electrónico" : "Email"}
                        </label>
                        <input name="email" required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brandOrange focus:bg-brandOrange/5 transition-colors" placeholder="john@example.com" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                        {isEs ? "Tipo de Servicio" : "Service Type"}
                      </label>
                      <select name="service" required defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brandOrange focus:bg-brandOrange/5 transition-colors appearance-none">
                        <option value="" disabled>{isEs ? "Selecciona un servicio..." : "Select a service..."}</option>
                        <option value="Sport Intelligence OS & AI">{isEs ? "Sport Intelligence OS & IA" : "Sport Intelligence OS & AI"}</option>
                        <option value="Branding & Design">{isEs ? "Branding y Diseño UI/UX" : "Branding & UI/UX Design"}</option>
                        <option value="Consulting">{isEs ? "Consultoría Tecnológica" : "Tech Consulting"}</option>
                        <option value="Other">{isEs ? "Otro / General" : "Other / General"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange">{isEs ? "Tu Mensaje" : "Your Message"}</label>
                      <textarea name="message" required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brandOrange focus:bg-brandOrange/5 transition-colors resize-none mt-2" placeholder={isEs ? "Cuéntanos sobre tu visión..." : "Tell us about your vision..."}></textarea>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button type="submit" disabled={loading} className="group relative w-full bg-white text-black px-8 py-5 rounded-xl font-black uppercase tracking-widest overflow-hidden transition-all hover:bg-brandOrange hover:text-white mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> {isEs ? "Enviar Solicitud" : "Send Request"}</>}
                      </span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

      </div>
    </main>
  );
}
