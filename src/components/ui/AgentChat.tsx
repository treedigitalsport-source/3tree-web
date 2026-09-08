"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Headset } from "lucide-react";
import { useLang } from "@/app/i18n";
import { usePathname } from "next/navigation";

export default function AgentChat() {
  const pathname = usePathname();
  const { lang } = useLang();
  const isEs = lang === "es";

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  type SentimentType = 'POSITIVE_NEUTRAL' | 'HIGH_INTENT' | 'TECHNICAL' | 'FRUSTRATED';
  const [sentiment, setSentiment] = useState<SentimentType>('POSITIVE_NEUTRAL');

  const detectClientSentiment = (text: string): SentimentType => {
    if (/no funciona|error|falla|pesimo|pésimo|basura|estafa|lento|tarda|molesto|queja|incompetente|horrible/i.test(text)) return 'FRUSTRATED';
    if (/comprar|precio|costo|cuanto|cuánto|cotizar|cotizacion|cotización|contratar|demo|probar|empezar|interesa|adquirir|planes|plan/i.test(text)) return 'HIGH_INTENT';
    if (/algoritmo|biomecanica|biomecánica|pose|marcador|markov|monte carlo|vector|red neuronal|latencia|fps|api|sdk|arquitectura|sabermetria|sabermetría/i.test(text)) return 'TECHNICAL';
    return 'POSITIVE_NEUTRAL';
  };

  const welcomeText = isEs 
    ? "¡Hola! 👋 Soy Iris · Especialista de atención en 3Tree Digital. ¿En qué te puedo colaborar hoy?"
    : "Hello! 👋 I'm Iris, client care specialist at 3Tree Digital. How can I help you today?";

  // Auto-scroll to bottom only when open
  const scrollToBottom = () => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isSending, isOpen]);

  // Set initial welcome text and reset on language change
  useEffect(() => {
    setChatHistory([{ role: "agent", text: welcomeText }]);
  }, [isEs]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isSending) return;

    const userMsg = queryText.trim();
    const detectedMood = detectClientSentiment(userMsg);
    setSentiment(detectedMood);

    const newHistory = [...chatHistory, { role: "user", text: userMsg }];
    setChatHistory(newHistory);
    setMessage("");
    setIsSending(true);

    try {
      // Fire-and-forget lead capture with sentiment
      fetch("/api/webhooks/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg,
          sentiment: detectedMood,
          intent: detectedMood === 'HIGH_INTENT' ? 'PURCHASE_DEMO' : (detectedMood === 'TECHNICAL' ? 'TECHNICAL_INQUIRY' : 'GENERAL')
        }),
      }).catch(() => {});

      // Groq format
      const groqMessages = newHistory.map(msg => ({
        role: msg.role === "agent" ? "assistant" : "user",
        content: msg.text
      }));

      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: groqMessages }),
      });
      
      let reply = "";
      try {
        const data = await res.json();
        if (data && data.response && typeof data.response === "string" && data.response.trim().length > 0) {
          reply = data.response;
        }
        if (data && data.sentiment) {
          setSentiment(data.sentiment);
        }
      } catch (parseErr) {
        console.warn("JSON parse fallback", parseErr);
      }

      // Cliente-side fallback semántico infalible con detección dinámica de idioma
      if (!reply) {
        const isMsgSpanish = isEs || /[áéíóúñ¿¡]/i.test(userMsg) || /hola|buenas|que|cómo|como|cuanto|precio|donde|quién|quien|saludos|gracias|favor|equipo|beisbol|béisbol|partido|jugador|dia|tarde|noche/i.test(userMsg);

        if (/diamax/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "DIAMAX Pro es nuestra suite táctica de dugout para béisbol profesional, con simulación de 24 estados de Markov, algoritmos Monte Carlo, heatmaps de zona de strike y analítica sabermétrica en tiempo real."
            : "DIAMAX Pro is our tactical dugout suite for professional baseball, featuring 24-state Markov simulations, Monte Carlo algorithms, strike zone heatmaps, and real-time sabermetric analytics.";
        } else if (/kinebase|biomecanica|biomecánica|video|movimiento|vision|visión|camara|cámara/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "Kinebase Pro es nuestra plataforma de biomecánica 3D sin marcadores que extrae vectores cinemáticos y ángulos articulares directamente de video estándar. Para coordinar una demo técnica, indícanos tu nombre, correo y organización."
            : "Kinebase Pro is our markerless biomechanics system that extracts kinematic vectors and joint angles from standard video. To schedule a technical demo, please provide your name, email, and sports organization.";
        } else if (/precio|costo|cuanto|cuánto|cotizacion|cotización|tarifa|comprar|plan|planes/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "Ofrecemos licenciamiento modular adaptado a academias, equipos y ligas. Para enviarte una propuesta formal, por favor compártenos tu nombre, correo corporativo y organización."
            : "We provide modular licensing tailored for academies, teams, and leagues. To receive a formal proposal, please share your name, corporate email, and sports organization.";
        } else if (/contacto|email|correo|telefono|teléfono|ubicacion|ubicación|sede|donde|dónde/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "Nuestra sede oficial está ubicada en 5709 Kingfish Drive, Lutz, Florida, USA. Puedes dejarnos tus datos aquí o escribirnos directamente a contacto@3treedigital.com."
            : "Our headquarters are located at 5709 Kingfish Drive, Lutz, Florida, USA. You can leave your contact details here or write to contacto@3treedigital.com.";
        } else if (/@|\.com|\.net|\.org|[0-9]{7,}/.test(userMsg)) {
          reply = isMsgSpanish
            ? "¡Excelente! Hemos registrado tus datos de contacto con éxito. Un especialista de 3Tree Digital Sport IA se comunicará contigo a la brevedad."
            : "Excellent! We have successfully registered your contact details. A 3Tree Digital Sport IA specialist will reach out to you shortly.";
        } else {
          reply = isMsgSpanish
            ? "En 3Tree Digital Sport IA desarrollamos tecnología y modelos de inteligencia artificial de alto rendimiento para el deporte profesional. ¿Te interesa Kinebase Pro (biomecánica), DIAMAX Pro (táctica deportiva) o nuestros sistemas de Sports OS?"
            : "At 3Tree Digital Sport IA, we engineer elite sports technology and AI systems for professional athletics. Are you interested in Kinebase Pro (biomechanics), DIAMAX Pro (tactical baseball), or our Sports OS platforms?";
        }
      }

      setChatHistory((prev) => [
        ...prev, 
        { role: "agent", text: reply }
      ]);
    } catch (error) {
      console.warn("AgentChat caught error, executing client fallback", error);
      const isMsgSpanish = isEs || /[áéíóúñ¿¡]/i.test(queryText) || /hola|buenas|que|cómo|como/i.test(queryText);
      const fallbackReply = isMsgSpanish
        ? "En 3Tree Digital Sport IA estamos a tu disposición. ¿Te gustaría agendar una demostración técnica o conocer más sobre Kinebase Pro y DIAMAX Pro?"
        : "At 3Tree Digital Sport IA, we are at your service. Would you like to schedule a technical demo or learn more about Kinebase Pro and DIAMAX Pro?";
      setChatHistory((prev) => [
        ...prev, 
        { role: "agent", text: fallbackReply }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = () => {
    sendQuery(message);
  };

  const handleClose = () => {
    if (chatHistory.length > 1) {
      fetch("/api/webhooks/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: "CHAT_SESSION_ENDED", 
          fullHistory: chatHistory 
        }),
      }).catch(() => {});
    }
    
    setChatHistory([{ role: "agent", text: welcomeText }]);
    localStorage.removeItem("iris_chat_history_v2");
    localStorage.removeItem("iris_chat_history");
    setIsOpen(false);
  };

  // Strictly only render Iris AI on the main home page (/)
  if (pathname !== "/") {
    return null;
  }

  return (
    <>
      {/* Floating Button with Pulse Halo */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          className={`relative w-12 h-12 rounded-full bg-[#0a0f1d] border border-brandOrange/50 text-white shadow-[0_0_25px_rgba(242,101,34,0.4)] transition-all duration-300 group flex items-center justify-center ${
            isOpen ? 'opacity-0 pointer-events-none scale-50' : 'opacity-100 scale-100'
          }`}
          aria-label="Abrir chat con Iris"
        >
          {/* Rotating Conic Gradient Aura Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute -inset-0.5 rounded-full bg-[conic-gradient(from_0deg,#f26522,#ff8c42,transparent,#f26522)] blur-[1px] opacity-80 group-hover:opacity-100 transition-opacity"
          />

          <div className="relative w-11 h-11 rounded-full bg-[#0a0f1d] flex items-center justify-center z-10">
            <Headset className="w-5 h-5 text-brandOrange group-hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(242,101,34,0.8)]" />
          </div>

          {/* Live Status Badge */}
          <span className="absolute top-0 right-0 flex h-3 w-3 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#020617]"></span>
          </span>

          {/* Hover Tooltip */}
          <div className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-black/90 border border-white/15 text-white font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            {isEs ? "Iris · Especialista" : "Iris · Specialist"}
          </div>
        </motion.button>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="fixed bottom-6 right-6 z-[60] w-[390px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-4rem)] bg-[#0a0f1d]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header Profile */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center">
                  {/* Rotating Conic Gradient Aura Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="absolute -inset-0.5 rounded-full bg-[conic-gradient(from_0deg,#f26522,#ff8c42,transparent,#f26522)] blur-[1px] opacity-90"
                  />
                  
                  {/* Avatar Core */}
                  <div className="relative w-10 h-10 rounded-full bg-[#0a0f1d] border border-white/20 flex items-center justify-center shadow-lg">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                      <Headset className="w-5 h-5 text-brandOrange drop-shadow-[0_0_10px_rgba(242,101,34,0.7)]" />
                    </motion.div>
                  </div>
                  
                  {/* Live Status Badge */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#020617] shadow-sm" title="En línea">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-white text-sm tracking-wide">Iris</h3>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-brandOrange/10 border border-brandOrange/20 text-brandOrange">
                      {isEs ? "Especialista" : "Specialist"}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-white/50 tracking-wider">
                    {isEs ? "3Tree Digital · Lutz, FL" : "3Tree Digital · Lutz, FL"}
                  </p>
                </div>
              </div>

              <button 
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sentiment & Operational Mode Bar */}
            <div className="px-6 py-1.5 bg-black/60 border-b border-white/5 flex items-center justify-between text-[10px] font-mono">
              <span className="text-white/40">Status:</span>
              {sentiment === 'HIGH_INTENT' && (
                <span className="flex items-center gap-1.5 text-brandOrange font-semibold animate-fadeIn">
                  <span className="w-1.5 h-1.5 rounded-full bg-brandOrange animate-pulse" />
                  {isEs ? "🎯 Calificación Demo B2B" : "🎯 VIP Demo Qualification"}
                </span>
              )}
              {sentiment === 'TECHNICAL' && (
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold animate-fadeIn">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  {isEs ? "⚡ Análisis Cinemático & Datos" : "⚡ Kinematics & Sports Data"}
                </span>
              )}
              {sentiment === 'FRUSTRATED' && (
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold animate-fadeIn">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  {isEs ? "🛡️ Atención Ejecutiva Directa" : "🛡️ Priority Executive Care"}
                </span>
              )}
              {sentiment === 'POSITIVE_NEUTRAL' && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold animate-fadeIn">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {isEs ? "🟢 IA Conectada · 3Tree" : "🟢 AI Connected · 3Tree"}
                </span>
              )}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 text-sm font-sans">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div 
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-brandOrange text-white rounded-tr-xs shadow-md font-medium" 
                        : "bg-white/[0.04] border border-white/10 text-white/90 rounded-tl-xs backdrop-blur-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing animation */}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.04] border border-white/10 text-brandOrange p-3 rounded-2xl rounded-tl-xs text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brandOrange animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brandOrange animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brandOrange animate-bounce delay-300"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isEs ? "Escribe un mensaje para Iris..." : "Message Iris..."}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-xs md:text-sm text-white placeholder-white/30 focus:outline-none focus:border-brandOrange/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!message.trim() || isSending}
                  className="absolute right-2 p-2 bg-brandOrange hover:bg-[#ff7a3a] disabled:opacity-40 disabled:hover:bg-brandOrange text-white rounded-full transition-all duration-200 shadow-sm"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="mt-2 text-center">
                <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase">
                  3Tree Digital Sport IA · Florida, USA
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
