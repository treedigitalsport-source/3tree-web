"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, UploadCloud, Video, Sparkles, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

export default function InThePlayPage() {
  // Estado para simular la suscripción (Stripe) y la subida de video
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Formulario de Pago
  const [cardType, setCardType] = useState<"credit" | "debit">("credit");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      return;
    }
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsSubscribed(true);
    }, 2500);
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
          // PANTALLA 1: EL MURO DE PAGO (PAYWALL) CON FORMULARIO
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto pt-4"
          >
            <div className="text-center mb-12">
              <div className="inline-block bg-brandOrange/10 border border-brandOrange/20 rounded-full px-6 py-2 mb-6">
                <span className="text-brandOrange font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Inteligencia Artificial Deportiva
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-black uppercase mb-4 leading-tight">
                HAZTE VIRAL POR <span className="text-brandOrange">$2 AL MES</span>
              </h1>
              
              <p className="text-lg text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
                Sube el video crudo de tu juego. Nuestra IA lo edita, estabiliza y publica en nuestra red global para que los cazatalentos te descubran.
              </p>
            </div>

            {/* Two-Column Checkout Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
              
              {/* Column 1: Benefits */}
              <div className="col-span-1 lg:col-span-5 bg-white/[0.01] border border-white/5 rounded-3xl p-8 space-y-6">
                <h3 className="text-lg font-bold tracking-wider uppercase text-white/80 border-b border-white/10 pb-3">Estudio Premium</h3>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center flex-shrink-0 text-brandOrange">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Edición por IA</h4>
                    <p className="text-white/40 text-xs mt-1">Cortes y transiciones dinámicas generadas en segundos.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center flex-shrink-0 text-brandOrange">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Estabilización</h4>
                    <p className="text-white/40 text-xs mt-1">Suavizado cinemático digital de cámara en jugadas rápidas.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center flex-shrink-0 text-brandOrange">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Distribución Global</h4>
                    <p className="text-white/40 text-xs mt-1">Publicación prioritaria en el feed de scouting internacional.</p>
                  </div>
                </div>
              </div>

              {/* Column 2: Payment Form */}
              <div className="col-span-1 lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brandOrange/10 blur-[50px] rounded-full pointer-events-none" />
                
                <form onSubmit={handlePaymentSubmit} className="space-y-4 relative z-10">
                  <h3 className="text-lg font-bold tracking-wider uppercase text-white/80 border-b border-white/10 pb-3 mb-4">Información de Facturación</h3>

                  {/* Card Type Selector */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCardType("credit")}
                      className={`flex-1 py-2.5 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                        cardType === "credit"
                          ? "bg-brandOrange/15 border-brandOrange text-brandOrange"
                          : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      Tarjeta Crédito
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardType("debit")}
                      className={`flex-1 py-2.5 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                        cardType === "debit"
                          ? "bg-brandOrange/15 border-brandOrange text-brandOrange"
                          : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      Tarjeta Débito
                    </button>
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">Nombre en la Tarjeta</label>
                    <input
                      type="text"
                      required
                      placeholder="EJ. JUAN PÉREZ"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brandOrange text-white font-mono placeholder:text-white/20"
                    />
                  </div>

                  {/* Card Number */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">Número de Tarjeta</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                          setCardNumber(formatted);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brandOrange text-white font-mono placeholder:text-white/20"
                      />
                      <CreditCard className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Expiry and CVV Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">Vencimiento (MM/AA)</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          const formatted = val.length > 2 ? `${val.slice(0, 2)}/${val.slice(2, 4)}` : val;
                          setCardExpiry(formatted);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brandOrange text-white font-mono placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brandOrange text-white font-mono placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-white/10 my-4" />

                  <button 
                    type="submit"
                    disabled={isProcessingPayment}
                    className="group relative w-full bg-brandOrange text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(242,101,34,0.4)] disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Procesando pago seguro...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> Desbloquear Estudio por $2/mes
                        </>
                      )}
                    </span>
                  </button>
                </form>
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
