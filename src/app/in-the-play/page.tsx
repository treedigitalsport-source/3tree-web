"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, UploadCloud, Video, Sparkles, CheckCircle2, CreditCard, Loader2, UserPlus, FileText, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/app/i18n";

export default function InThePlayPage() {
  const { lang } = useLang();
  const isEs = lang === "es";

  // Wizard Steps: 1 = Registro, 2 = Pago/Stripe, 3 = Estudio (Subir Video)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Registro States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regSport, setRegSport] = useState("Béisbol");
  const [regCategory, setRegCategory] = useState("Amateur");

  // Step 2: Pago States
  const [cardType, setCardType] = useState<"credit" | "debit">("credit");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Step 3: Estudio States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Handlers
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone) {
      alert(isEs ? "Por favor completa todos los datos obligatorios." : "Please fill all required fields.");
      return;
    }
    // Set cardholder name default value to registration name
    setCardName(regName);
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      alert(isEs ? "Por favor completa los datos de tu tarjeta." : "Please fill your card details.");
      return;
    }
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setStep(3);
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
      
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-brandOrange/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {isEs ? "Volver a la web" : "Back to Home"}
        </Link>

        {/* Header Section (Shared for Steps 1 & 2) */}
        {step < 3 && (
          <div className="text-center mb-10">
            <div className="inline-block bg-brandOrange/10 border border-brandOrange/20 rounded-full px-6 py-2 mb-6">
              <span className="text-brandOrange font-bold tracking-widest text-xs uppercase flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> {isEs ? "Inteligencia Artificial Deportiva" : "Sport Artificial Intelligence"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black uppercase mb-4 leading-tight">
              {isEs ? "IN THE PLAY HIGHLIGHT" : "IN THE PLAY HIGHLIGHT"}
            </h1>
            <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto font-light">
              {isEs 
                ? "Regístrate, realiza tu pago de suscripción y sube tu video. Nuestra IA lo estabilizará y editará automáticamente."
                : "Register, complete your subscription payment, and upload your video. Our AI will automatically edit and stabilize it."}
            </p>

            {/* Step Indicators */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${step >= 1 ? "bg-brandOrange text-white" : "bg-white/10 text-white/40"}`}>1</span>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${step === 1 ? "text-brandOrange font-bold" : "text-white/40"}`}>{isEs ? "Registro" : "Register"}</span>
              </div>
              <div className="w-8 h-[1px] bg-white/10" />
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${step >= 2 ? "bg-brandOrange text-white" : "bg-white/10 text-white/40"}`}>2</span>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${step === 2 ? "text-brandOrange font-bold" : "text-white/40"}`}>{isEs ? "Pago" : "Payment"}</span>
              </div>
              <div className="w-8 h-[1px] bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold bg-white/10 text-white/40">3</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">{isEs ? "Estudio" : "Studio"}</span>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 1: REGISTRO */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brandOrange/10 blur-[50px] rounded-full pointer-events-none" />
              
              <form onSubmit={handleRegisterSubmit} className="space-y-5 relative z-10">
                <h3 className="text-lg font-bold tracking-wider uppercase text-white/85 border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-brandOrange" /> {isEs ? "Formulario de Registro" : "Registration Details"}
                </h3>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">{isEs ? "Nombre Completo" : "Full Name"}</label>
                  <input
                    type="text"
                    required
                    placeholder={isEs ? "EJ. MATEO ALVARADO" : "E.G. MATEO ALVARADO"}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brandOrange text-white placeholder:text-white/20"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">
                    {isEs ? "Correo Electrónico" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brandOrange text-white placeholder:text-white/20 font-mono"
                  />
                  <p className="text-[10px] text-brandOrange/70 font-mono mt-1">
                    {isEs ? "⚠ Aquí recibirás tu video final editado." : "⚠ Your final edited video will be sent here."}
                  </p>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">{isEs ? "Teléfono / WhatsApp" : "Phone / WhatsApp"}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brandOrange text-white placeholder:text-white/20 font-mono"
                  />
                </div>

                {/* Sport Selector */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">{isEs ? "Deporte" : "Sport"}</label>
                  <select
                    value={regSport}
                    onChange={(e) => setRegSport(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brandOrange text-white appearance-none cursor-pointer"
                    style={{ backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E')", backgroundPosition: "right 1rem center", backgroundSize: "1em", backgroundRepeat: "no-repeat" }}
                  >
                    <option value="Béisbol" className="bg-[#020617]">{isEs ? "Béisbol" : "Baseball"}</option>
                    <option value="Fútbol" className="bg-[#020617]">{isEs ? "Fútbol" : "Soccer"}</option>
                    <option value="Hockey" className="bg-[#020617]">{isEs ? "Hockey" : "Hockey"}</option>
                    <option value="Fútbol Americano" className="bg-[#020617]">{isEs ? "Fútbol Americano" : "Football"}</option>
                    <option value="Sóftbol" className="bg-[#020617]">{isEs ? "Sóftbol" : "Softball"}</option>
                  </select>
                </div>

                {/* Category Selector */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">{isEs ? "Categoría de Juego" : "Game Category"}</label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brandOrange text-white appearance-none cursor-pointer"
                    style={{ backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E')", backgroundPosition: "right 1rem center", backgroundSize: "1em", backgroundRepeat: "no-repeat" }}
                  >
                    <option value="Juvenil" className="bg-[#020617]">{isEs ? "Juvenil" : "Youth"}</option>
                    <option value="Amateur" className="bg-[#020617]">{isEs ? "Amateur" : "Amateur"}</option>
                    <option value="Universitario" className="bg-[#020617]">{isEs ? "Universitario / College" : "College"}</option>
                    <option value="Profesional" className="bg-[#020617]">{isEs ? "Profesional" : "Professional"}</option>
                  </select>
                </div>

                <div className="w-full h-[1px] bg-white/10 my-4" />

                <button
                  type="submit"
                  className="group relative w-full bg-brandOrange text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(242,101,34,0.3)] flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    {isEs ? "Proceder al Pago ($2/mes)" : "Proceed to Payment ($2/mo)"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: PAGO (STRIPE COBRO SIMULADO) */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brandOrange/10 blur-[50px] rounded-full pointer-events-none" />
              
              <form onSubmit={handlePaymentSubmit} className="space-y-4 relative z-10">
                <h3 className="text-lg font-bold tracking-wider uppercase text-white/85 border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brandOrange" /> {isEs ? "Información de Facturación" : "Billing Details"}
                </h3>

                {/* Submitter Summary Badge */}
                <div className="bg-black/35 border border-white/5 rounded-xl p-4 text-xs font-mono space-y-1">
                  <div className="text-white/40">{isEs ? "INFORMACIÓN DEL CLIENTE:" : "CLIENT INFORMATION:"}</div>
                  <div className="text-white"><span className="text-brandOrange">{isEs ? "Nombre:" : "Name:"}</span> {regName}</div>
                  <div className="text-white"><span className="text-brandOrange">{isEs ? "Correo:" : "Email:"}</span> {regEmail}</div>
                  <div className="text-white"><span className="text-brandOrange">{isEs ? "Plan:" : "Plan:"}</span> In The Play Premium ($2.00 USD / {isEs ? "mes" : "mo"})</div>
                </div>

                {/* Card Type Selector */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCardType("credit")}
                    className={`flex-1 py-2.5 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                      cardType === "credit"
                        ? "bg-brandOrange/15 border-brandOrange text-brandOrange"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    {isEs ? "Tarjeta Crédito" : "Credit Card"}
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
                    {isEs ? "Tarjeta Débito" : "Debit Card"}
                  </button>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">{isEs ? "Nombre en la Tarjeta" : "Cardholder Name"}</label>
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
                  <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">{isEs ? "Número de Tarjeta" : "Card Number"}</label>
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
                    <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">{isEs ? "Vencimiento (MM/AA)" : "Expiry (MM/YY)"}</label>
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

                <div className="flex gap-4">
                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-shrink-0 px-6 py-4 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    {isEs ? "Atrás" : "Back"}
                  </button>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isProcessingPayment}
                    className="flex-1 group relative bg-brandOrange text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(242,101,34,0.4)] disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> {isEs ? "Procesando pago seguro..." : "Processing secure payment..."}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> {isEs ? "Pagar $2/mes y Desbloquear" : "Pay $2/mo & Unlock"}
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 3: ESTUDIO DE SUBIDA (SOLO PARA REGISTRADOS/SUSCRITOS) */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 border-b border-white/10 pb-6 gap-4">
                <div>
                  <h1 className="text-3xl font-display font-black uppercase text-white mb-2">3Tree Studio Highlight</h1>
                  <p className="text-white/50 text-sm font-mono flex items-center gap-1.5">
                    <span className="text-brandOrange font-bold">{isEs ? "Usuario:" : "User:"}</span> {regName} ({regEmail})
                  </p>
                </div>
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {isEs ? "Suscripción Activa" : "Active Subscription"}
                </div>
              </div>

              {/* Uploader Card */}
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 backdrop-blur-xl">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Video className="w-5 h-5 text-brandOrange" /> {isEs ? "Sube tu video crudo" : "Upload your raw video"}
                </h2>
                
                {!uploadSuccess ? (
                  <form onSubmit={handleUpload} className="space-y-8">
                    <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-brandOrange/50 transition-colors bg-black/20 group relative overflow-hidden">
                      <Video className="w-12 h-12 mx-auto mb-4 text-white/20 group-hover:text-brandOrange transition-colors" />
                      <h3 className="text-lg font-bold mb-2">{isEs ? "Arrastra tu video aquí" : "Drag and drop your video here"}</h3>
                      <p className="text-white/40 text-sm mb-6">{isEs ? "MP4 o MOV hasta 500MB" : "MP4 or MOV up to 500MB"}</p>
                      <input 
                        required
                        type="file" 
                        accept="video/mp4,video/quicktime" 
                        className="block w-full max-w-xs mx-auto text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                      />
                    </div>

                    <div className="bg-brandOrange/5 border border-brandOrange/15 rounded-xl p-4 text-xs text-white/70 leading-relaxed font-mono">
                      {isEs 
                        ? `ℹ El video final editado se enviará automáticamente a: ${regEmail}.` 
                        : `ℹ The final edited highlight video will be automatically sent to: ${regEmail}.`}
                    </div>

                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isUploading}
                        className="bg-brandOrange text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(242,101,34,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <span className="flex items-center gap-2">{isEs ? "Procesando IA" : "IA Processing"} <span className="animate-pulse">...</span></span>
                        ) : (
                          <span className="flex items-center gap-2"><UploadCloud className="w-4 h-4" /> {isEs ? "Enviar a la IA" : "Submit to AI"}</span>
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
                    <h3 className="text-2xl font-bold uppercase tracking-wider mb-4">{isEs ? "¡Video en procesamiento!" : "Video Processing!"}</h3>
                    <p className="text-white/50 max-w-md mx-auto mb-8 text-sm leading-relaxed">
                      {isEs 
                        ? `Estamos procesando, estabilizando y adaptando tu video. Recibirás el corte cinematográfico final en tu correo: ${regEmail} en pocos minutos.`
                        : `We are processing, stabilizing, and editing your video. You will receive the final cinematic cut at your email: ${regEmail} in a few minutes.`}
                    </p>
                    <button 
                      onClick={() => setUploadSuccess(false)}
                      className="text-brandOrange font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
                    >
                      {isEs ? "Subir otro video" : "Upload another video"}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
}
