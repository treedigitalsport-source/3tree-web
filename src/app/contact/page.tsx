"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";

export default function Contact() {
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
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Volver al Inicio</span>
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
            Sede Global
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-8">
            Construyamos <br />
            <span className="text-white/30">el futuro.</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed mb-12 max-w-md font-medium">
            ¿Listo para actualizar la infraestructura digital de tu organización? Escríbenos. Construimos software a medida y marcas para equipos deportivos de élite.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white/70">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-brandOrange font-bold mb-1">Email</p>
                <p className="font-medium text-lg">partners@3treedigital.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-white/70">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-brandOrange font-bold mb-1">Ubicación</p>
                <p className="font-medium text-lg">Lutz, Florida — Operaciones Globales</p>
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
            <form onSubmit={handleSubmit} className="bg-[#020617] border border-white/10 p-8 md:p-12 rounded-[2rem] w-full max-w-lg mx-auto relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-brandOrange/5 blur-[100px] pointer-events-none"></div>

            <h2 className="font-display text-2xl font-black uppercase mb-8 tracking-wide">
              Iniciar Proyecto
            </h2>

            <div className="space-y-6 relative z-10">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                  Organización / Equipo
                </label>
                <input 
                  name="organization"
                  required
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brandOrange focus:bg-brandOrange/5 transition-colors"
                  placeholder="Ej. New York Yankees"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                  Nombre de Contacto
                </label>
                <input 
                  name="name"
                  required
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brandOrange focus:bg-brandOrange/5 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange">Tu Mensaje</label>
                <textarea 
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brandOrange focus:bg-brandOrange/5 transition-colors resize-none mt-2"
                  placeholder="Cuéntanos sobre tu visión..."
                ></textarea>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-green-400 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> ¡Mensaje enviado con éxito!</p>}

              <button type="submit" disabled={loading} className="group relative w-full bg-white text-black px-8 py-5 rounded-xl font-black uppercase tracking-widest overflow-hidden transition-all hover:bg-brandOrange hover:text-white mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Enviar Solicitud</>}
                </span>
              </button>
            </div>
          </form>
        </motion.div>

      </div>
    </main>
  );
}
