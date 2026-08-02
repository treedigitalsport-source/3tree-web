"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, UploadCloud, Video, Sparkles, CheckCircle2, CreditCard } from "lucide-react";
import { useState } from "react";

export default function InThePlayPage() {
  // Estado para simular la suscripción (Stripe) y la subida de video
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Simula el pago de Stripe
  const handleUnlock = () => {
    // Aquí iría el redirect a Stripe Checkout: window.location.href = stripeUrl;
    // Por ahora lo simulamos:
    setIsSubscribed(true);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white font-sans overflow-x-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-brandOrange/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a la web
        </Link>

        {!isSubscribed ? (
          // PANTALLA 1: EL MURO DE PAGO (PAYWALL)
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center pt-10"
          >
            <div className="inline-block bg-brandOrange/10 border border-brandOrange/20 rounded-full px-6 py-2 mb-8">
              <span className="text-brandOrange font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Inteligencia Artificial Deportiva
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Hazte Viral. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandOrange to-orange-400">
                Por $2 al mes.
              </span>
            </h1>
            
            <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
              Sube el video crudo de tu juego. Nuestra IA lo edita, estabiliza y publica directamente en nuestra red global. Deja que el mundo vea tu talento.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 max-w-xl mx-auto backdrop-blur-xl relative overflow-hidden">
              {/* Efecto de luz dentro de la tarjeta */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brandOrange/30 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-brandOrange/20 flex items-center justify-center flex-shrink-0 text-brandOrange">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Edición Automática</h3>
                    <p className="text-white/50 text-sm">Cortes épicos generados por IA.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-brandOrange/20 flex items-center justify-center flex-shrink-0 text-brandOrange">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Estabilización Cinematográfica</h3>
                    <p className="text-white/50 text-sm">Calidad profesional para tus videos.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-brandOrange/20 flex items-center justify-center flex-shrink-0 text-brandOrange">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Distribución Global</h3>
                    <p className="text-white/50 text-sm">Publicación directa en la red Kinebase.</p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/10 my-4" />

                <button 
                  onClick={handleUnlock}
                  className="group relative w-full bg-brandOrange text-white px-8 py-5 rounded-full font-bold text-lg uppercase tracking-widest overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(242,101,34,0.4)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" /> Desbloquear Estudio
                  </span>
                </button>
                <p className="text-xs text-white/30 text-center flex items-center justify-center gap-1">
                  <CreditCard className="w-3 h-3" /> Pagos seguros con Stripe. Cancela cuando quieras.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          // PANTALLA 2: EL ESTUDIO (SOLO PARA SUSCRIPTORES)
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">3Tree Studio</h1>
                <p className="text-white/50 text-sm">Suscripción Activa (Plan $2/mes)</p>
              </div>
              <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                En Línea
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6">Sube tu video crudo</h2>
              
              {!uploadSuccess ? (
                <form onSubmit={handleUpload} className="space-y-8">
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-brandOrange/50 transition-colors bg-black/20 group relative overflow-hidden">
                    <Video className="w-12 h-12 mx-auto mb-4 text-white/20 group-hover:text-brandOrange transition-colors" />
                    <h3 className="text-lg font-bold mb-2">Arrastra tu video aquí</h3>
                    <p className="text-white/40 text-sm mb-6">MP4 o MOV hasta 500MB</p>
                    <input 
                      required
                      type="file" 
                      accept="video/mp4,video/quicktime" 
                      className="block w-full max-w-xs mx-auto text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isUploading}
                      className="bg-brandOrange text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(242,101,34,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <span className="flex items-center gap-2">Procesando IA <span className="animate-pulse">...</span></span>
                      ) : (
                        <span className="flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Enviar a la IA</span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">¡Video en procesamiento!</h3>
                  <p className="text-white/50 max-w-md mx-auto mb-8">
                    Nuestra inteligencia artificial está estabilizando y editando tu jugada. Te notificaremos cuando esté publicada en la red global.
                  </p>
                  <button 
                    onClick={() => setUploadSuccess(false)}
                    className="text-brandOrange font-bold text-sm uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Subir otro video
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
