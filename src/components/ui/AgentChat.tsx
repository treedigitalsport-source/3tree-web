"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Headset, Volume2, VolumeX, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useLang } from "@/app/i18n";

type SentimentType = 'POSITIVE_NEUTRAL' | 'HIGH_INTENT' | 'TECHNICAL' | 'FRUSTRATED';

export default function AgentChat() {
  const { lang } = useLang();
  const isEs = lang === "es";

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [sentiment, setSentiment] = useState<SentimentType>('POSITIVE_NEUTRAL');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const detectClientSentiment = (text: string): SentimentType => {
    if (/no funciona|error|falla|pesimo|pésimo|basura|estafa|lento|tarda|molesto|queja|incompetente|horrible/i.test(text)) return 'FRUSTRATED';
    if (/comprar|precio|costo|cuanto|cuánto|cotizar|cotizacion|cotización|contratar|demo|probar|empezar|interesa|adquirir|planes|plan/i.test(text)) return 'HIGH_INTENT';
    if (/algoritmo|biomecanica|biomecánica|pose|marcador|markov|monte carlo|vector|red neuronal|latencia|fps|api|sdk|arquitectura|sabermetria|sabermetría/i.test(text)) return 'TECHNICAL';
    return 'POSITIVE_NEUTRAL';
  };

  const welcomeText = isEs 
    ? "¡Hola! 👋 Soy Iris, Especialista de IA y Asesora en 3Tree Digital Sport. ¿En qué te puedo colaborar hoy?"
    : "Hello! 👋 I'm Iris, AI Specialist & Advisor at 3Tree Digital Sport. How can I assist your athletic organization today?";

  // Voz de sintetizador Web Speech API
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isEs ? "es-US" : "en-US";
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  };

  // Reconocimiento de voz por micrófono
  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isEs ? "Tu navegador no soporta reconocimiento de voz nativo." : "Voice recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isEs ? "es-ES" : "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setMessage(transcript);
          sendQuery(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

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

  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([{ role: "agent", text: welcomeText }]);
    }
  }, [welcomeText, chatHistory.length]);

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
      // Fire-and-forget webhook
      fetch("/api/webhooks/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg,
          sentiment: detectedMood,
          intent: detectedMood === 'HIGH_INTENT' ? 'PURCHASE_DEMO' : (detectedMood === 'TECHNICAL' ? 'TECHNICAL_INQUIRY' : 'GENERAL')
        }),
      }).catch(() => {});

      const groqMessages = newHistory
        .filter((msg, idx) => idx > 0 || msg.role === "user")
        .map(msg => ({
          role: msg.role === "agent" ? "assistant" : "user",
          content: msg.text
        }));

      const res = await fetch(`/api/groq?t=${Date.now()}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        cache: "no-store",
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

      // Motor de contingencia semántica enriquecido
      if (!reply) {
        const isMsgSpanish = isEs || /[áéíóúñ¿¡]/i.test(userMsg) || /hola|buenas|que|cómo|como|cuanto|precio|donde|quién|quien|saludos|gracias|favor|equipo|beisbol|béisbol|partido|jugador|dia|tarde|noche|soluciones|servicios/i.test(userMsg);

        if (/sports os|nucleo|núcleo|sistema operativo|operating system/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "Núcleo Sports OS es nuestra arquitectura propietaria de sistema operativo diseñada para centralizar datos de rendimiento, modelos de visión computacional, telemetría y analítica predictiva para clubes, ligas y academias de élite."
            : "Sports OS Core is our proprietary sports operating system architecture designed to centralize performance data, computer vision models, telemetry, and predictive analytics for elite clubs, leagues, and academies.";
        } else if (/dron|drone|cinematic|aerea|aérea/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "Nuestra solución de Dron Cinemático ofrece grabación aérea de alta velocidad y seguimiento cinemático con drones para análisis de rendimiento atlético y producción audiovisual de alto impacto."
            : "Our Cinematic Drone solution provides high-speed aerial tracking and videography for athletic performance analysis and high-impact sports marketing.";
        } else if (/agente|agent|asistente|automatizacion|automatización|scouting|video/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "Desarrollamos Agentes de IA autónomos 24/7 y pipelines de automatización de video que editan, estabilizan y procesan material de scouting deportivo eliminando el sesgo y error humano."
            : "We develop 24/7 autonomous AI Agents and custom video automation pipelines that edit, stabilize, and process sports scouting footage, eliminating human error and bias.";
        } else if (/solucion|solución|servicio|servicios|que hacen|que ofrecen|qué ofrecen/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "En 3Tree Digital ofrecemos 6 soluciones principales: 1) Núcleo Sports OS, 2) Interfaces Deportivas Inteligentes, 3) Automatización de Scouting & Video, 4) Implementación de IA, 5) Dron Cinemático y 6) Agentes de IA Autónomos 24/7. ¿Sobre cuál te gustaría conocer más?"
            : "At 3Tree Digital we provide 6 core solutions: 1) Sports OS Core, 2) Intelligent Sports Interfaces, 3) Scouting & Video Automation, 4) AI Implementation, 5) Cinematic Drone, and 6) 24/7 Autonomous AI Agents. Which one would you like to explore?";
        } else if (/precio|costo|cuanto|cuánto|cotizacion|cotización|tarifa|comprar|plan|planes/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "Ofrecemos licenciamiento modular adaptado a academias, clubes profesionales y ligas. Para enviarte una propuesta formal y coordinar una demostración personalizada, por favor compártenos tu nombre, correo corporativo y organización deportiva."
            : "We provide modular licensing tailored for academies, professional clubs, and leagues. To receive a formal proposal and schedule a demo, please share your name, corporate email, and sports organization.";
        } else if (/contacto|email|correo|telefono|teléfono|ubicacion|ubicación|sede|donde|dónde|address|location/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "Nuestra sede oficial está ubicada en 5709 Kingfish Drive, Lutz, Florida, USA. Puedes dejarnos tus datos aquí o escribirnos directamente a contacto@3treedigital.com."
            : "Our headquarters are located at 5709 Kingfish Drive, Lutz, Florida, USA. You can leave your contact details here or write to contacto@3treedigital.com.";
        } else if (/@|\.com|\.net|\.org|[0-9]{7,}/.test(userMsg)) {
          reply = isMsgSpanish
            ? "¡Excelente! Hemos registrado tus datos de contacto con éxito. Un especialista ejecutivo de 3Tree Digital Sport IA se comunicará contigo a la brevedad."
            : "Excellent! We have successfully registered your contact details. An executive specialist from 3Tree Digital Sport IA will reach out to you shortly.";
        } else if (/como estas|cómo estás|como te va|cómo te va|que tal|qué tal|buenas noches|buenos dias|buenos días|buenas tardes|buenas|hola|saludos/i.test(userMsg)) {
          reply = isMsgSpanish
            ? "¡Hola! Estoy muy bien, completamente operativa y lista para asistirte. ¿En qué te puedo colaborar hoy respecto a nuestra tecnología deportiva?"
            : "Hello! I am doing great, fully online and ready to assist. How can I help you today regarding our sports intelligence technology?";
        } else {
          reply = isMsgSpanish
            ? "En 3Tree Digital Sport IA desarrollamos tecnología de Sports Intelligence: Núcleo Sports OS, interfaces inteligentes, automatización de video y agentes de IA. ¿En qué te podemos colaborar hoy?"
            : "At 3Tree Digital Sport IA, we develop Sports Intelligence technology: Sports OS Core, intelligent interfaces, video automation, and AI agents. How can I assist you today?";
        }
      }

      setChatHistory((prev) => [
        ...prev, 
        { role: "agent", text: reply }
      ]);

      if (isVoiceEnabled || isCallActive) {
        speakText(reply);
      }
    } catch (error) {
      console.warn("AgentChat caught error, executing client fallback", error);
      const isMsgSpanish = isEs || /[áéíóúñ¿¡]/i.test(queryText) || /hola|buenas|que|cómo|como/i.test(queryText);
      const fallbackReply = isMsgSpanish
        ? "En 3Tree Digital Sport IA estamos a tu disposición. Desarrollamos Sports OS, automatización de video y agentes de IA para el deporte. ¿En qué te podemos colaborar hoy?"
        : "At 3Tree Digital Sport IA, we are at your service. We develop Sports OS, video automation, and AI agents for sports. How can we assist you today?";
      setChatHistory((prev) => [
        ...prev, 
        { role: "agent", text: fallbackReply }
      ]);
      if (isVoiceEnabled || isCallActive) {
        speakText(fallbackReply);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = () => {
    sendQuery(message);
  };

  const handleClose = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsCallActive(false);
    
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
    setIsOpen(false);
  };

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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute -inset-0.5 rounded-full bg-[conic-gradient(from_0deg,#f26522,#ff8c42,transparent,#f26522)] blur-[1px] opacity-80 group-hover:opacity-100 transition-opacity"
          />

          <div className="relative w-11 h-11 rounded-full bg-[#0a0f1d] flex items-center justify-center z-10">
            <Headset className="w-5 h-5 text-brandOrange group-hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(242,101,34,0.8)]" />
          </div>

          <span className="absolute top-0 right-0 flex h-3 w-3 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#020617]"></span>
          </span>

          <div className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-black/90 border border-white/15 text-white font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            {isEs ? "Iris · IA & Voz" : "Iris · AI & Voice"}
          </div>
        </motion.button>
      </div>

      {/* Chat / Call Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="fixed bottom-6 right-6 z-[60] w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] bg-[#0a0f1d]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header Profile */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="absolute -inset-0.5 rounded-full bg-[conic-gradient(from_0deg,#f26522,#ff8c42,transparent,#f26522)] blur-[1px] opacity-90"
                  />
                  
                  <div className="relative w-10 h-10 rounded-full bg-[#0a0f1d] border border-white/20 flex items-center justify-center shadow-lg">
                    <motion.div
                      animate={isSpeaking ? { scale: [1, 1.2, 1] } : { scale: [1, 1.06, 1] }}
                      transition={{ repeat: Infinity, duration: isSpeaking ? 0.8 : 3, ease: "easeInOut" }}
                    >
                      <Headset className={`w-5 h-5 ${isSpeaking ? 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]' : 'text-brandOrange drop-shadow-[0_0_10px_rgba(242,101,34,0.7)]'}`} />
                    </motion.div>
                  </div>
                  
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#020617] shadow-sm">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-white text-sm tracking-wide">Iris</h3>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-brandOrange/10 border border-brandOrange/20 text-brandOrange">
                      {isCallActive ? (isEs ? "En Llamada" : "In Call") : (isEs ? "IA & Voz" : "AI & Voice")}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-white/50 tracking-wider">
                    {isEs ? "3Tree Digital · Florida, USA" : "3Tree Digital · Florida, USA"}
                  </p>
                </div>
              </div>

              {/* Action Controls in Header */}
              <div className="flex items-center gap-1.5">
                {/* Voice Audio Call Mode Toggle */}
                <button
                  onClick={() => {
                    const next = !isCallActive;
                    setIsCallActive(next);
                    setIsVoiceEnabled(next);
                    if (next) {
                      speakText(isEs ? "Modo llamada por voz activado con Iris. ¿En qué puedo asistirte?" : "Voice call mode activated with Iris. How can I assist you?");
                    } else {
                      window.speechSynthesis?.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isCallActive 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                      : 'hover:bg-white/10 text-white/60 hover:text-white'
                  }`}
                  title={isCallActive ? "Finalizar llamada" : "Iniciar llamada de voz con Iris"}
                  aria-label="Llamada de voz"
                >
                  {isCallActive ? <PhoneOff className="w-4 h-4 text-emerald-400" /> : <Phone className="w-4 h-4" />}
                </button>

                {/* Voice Speech Synthesis Toggle */}
                <button
                  onClick={() => {
                    const next = !isVoiceEnabled;
                    setIsVoiceEnabled(next);
                    if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isVoiceEnabled ? 'text-brandOrange bg-brandOrange/10' : 'text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                  title={isVoiceEnabled ? "Silenciar voz" : "Activar respuesta por voz"}
                  aria-label="Alternar voz"
                >
                  {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  aria-label="Cerrar chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sentiment & Operational Mode Bar */}
            <div className="px-5 py-1.5 bg-black/60 border-b border-white/5 flex items-center justify-between text-[10px] font-mono">
              <span className="text-white/40">Status:</span>
              {isSpeaking ? (
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {isEs ? "🔊 Iris Hablando..." : "🔊 Iris Speaking..."}
                </span>
              ) : isListening ? (
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  {isEs ? "🎙️ Escuchando tu voz..." : "🎙️ Listening to you..."}
                </span>
              ) : sentiment === 'HIGH_INTENT' ? (
                <span className="flex items-center gap-1.5 text-brandOrange font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brandOrange animate-pulse" />
                  {isEs ? "🎯 Calificación Demo B2B" : "🎯 VIP Demo Qualification"}
                </span>
              ) : sentiment === 'TECHNICAL' ? (
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  {isEs ? "⚡ Análisis Cinemático & Datos" : "⚡ Kinematics & Sports Data"}
                </span>
              ) : sentiment === 'FRUSTRATED' ? (
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  {isEs ? "🛡️ Atención Ejecutiva Directa" : "🛡️ Priority Executive Care"}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {isEs ? "🟢 IA Conectada · 3Tree" : "🟢 AI Connected · 3Tree"}
                </span>
              )}
            </div>

            {/* Voice Call Active Screen or Chat Stream */}
            {isCallActive ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#0a0f1d] via-[#050811] to-black">
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ scale: isSpeaking ? [1, 1.4, 1] : [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ repeat: Infinity, duration: isSpeaking ? 1 : 2.5 }}
                    className="absolute w-36 h-36 rounded-full bg-brandOrange/20 blur-xl"
                  />
                  <div className="w-28 h-28 rounded-full bg-[#0a0f1d] border-2 border-brandOrange/60 flex items-center justify-center shadow-[0_0_30px_rgba(242,101,34,0.4)]">
                    <Headset className={`w-12 h-12 ${isSpeaking ? 'text-cyan-400' : 'text-brandOrange'}`} />
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h4 className="font-display font-bold text-white text-base">
                    {isEs ? "Llamada de Voz en Vivo con Iris" : "Live Voice Call with Iris"}
                  </h4>
                  <p className="text-xs text-white/50 font-mono">
                    {isSpeaking ? (isEs ? "Iris está respondiendo..." : "Iris is speaking...") : isListening ? (isEs ? "Escuchando tu voz..." : "Listening to you...") : (isEs ? "Presiona el micrófono para hablar" : "Tap microphone to speak")}
                  </p>
                </div>

                {/* Live Audio Waveform Simulation */}
                <div className="flex items-center gap-1.5 h-8">
                  {[40, 75, 100, 60, 90, 45, 80, 50, 70, 30].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={isSpeaking || isListening ? { height: [`${h * 0.2}px`, `${h * 0.4}px`, `${h * 0.2}px`] } : { height: "6px" }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                      className={`w-1 rounded-full ${isSpeaking ? 'bg-cyan-400' : isListening ? 'bg-rose-400' : 'bg-white/20'}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleListening}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                      isListening ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'bg-brandOrange hover:bg-[#ff7a3a] text-white'
                    }`}
                    aria-label="Hablar con Iris"
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsCallActive(false);
                      window.speechSynthesis?.cancel();
                      setIsSpeaking(false);
                    }}
                    className="w-14 h-14 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors"
                    aria-label="Colgar llamada"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 text-sm font-sans">
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
                      {msg.role === "agent" && (
                        <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-end">
                          <button
                            onClick={() => speakText(msg.text)}
                            className="text-[10px] text-white/40 hover:text-brandOrange flex items-center gap-1 transition-colors"
                            title="Escuchar este mensaje"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{isEs ? "Escuchar" : "Listen"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

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
            )}

            {/* Input Bar */}
            {!isCallActive && (
              <div className="p-3.5 border-t border-white/10 bg-black/40">
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={isEs ? "Escribe o presiona el micrófono..." : "Type or tap microphone..."}
                      className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-xs md:text-sm text-white placeholder-white/30 focus:outline-none focus:border-brandOrange/50 transition-colors"
                    />
                    <button
                      onClick={toggleListening}
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                        isListening ? 'text-rose-400 bg-rose-500/20 animate-pulse' : 'text-white/40 hover:text-white'
                      }`}
                      title={isListening ? "Detener micrófono" : "Dictar por voz"}
                      aria-label="Micrófono"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={handleSend}
                    disabled={!message.trim() || isSending}
                    className="p-2.5 bg-brandOrange hover:bg-[#ff7a3a] disabled:opacity-40 disabled:hover:bg-brandOrange text-white rounded-full transition-all duration-200 shadow-sm shrink-0"
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
