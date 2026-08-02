"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export default function LeadForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Ocurrió un error. Intenta de nuevo.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setErrorMessage(errorMessage);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden flex items-center justify-center min-h-[80vh]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(0,113,227,0.15)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-xl p-10 md:p-16 rounded-[2.5rem] glass border border-white/10 bg-zinc-950/50 backdrop-blur-xl text-center shadow-2xl"
      >
        <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-white tracking-tight">
          Transforma tu Negocio
        </h2>
        <p className="text-gray-400 font-light mb-10 text-lg">
          Déjanos tu email y te contactaremos para crear una estrategia digital a medida.
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={status === "loading" || status === "success"}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-16 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
              required
            />
            
            <AnimatePresence mode="wait">
              <motion.button
                key={status}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="submit"
                disabled={status === "loading" || status === "success" || !email}
                className="absolute right-2 top-2 bottom-2 w-12 flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "idle" || status === "error" ? (
                  <ArrowRight size={20} />
                ) : status === "loading" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={20} className="text-green-600" />
                )}
              </motion.button>
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-sm mt-4 absolute w-full text-center"
              >
                {errorMessage}
              </motion.p>
            )}
            
            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-400 text-sm mt-4 absolute w-full text-center font-medium"
              >
                ¡Gracias! Nos pondremos en contacto muy pronto.
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </section>
  );
}
