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

  const welcomeText = isEs 
    ? "¡Hola! 👋 Soy Iris · Especialista de atención en 3Tree Digital. ¿En qué te puedo colaborar hoy?"
    : "Hello! 👋 I'm Iris, client care specialist at 3Tree Digital. How can I help you today?";

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isSending]);

  // Set initial welcome text and reset on language change
  useEffect(() => {
    setChatHistory([{ role: "agent", text: welcomeText }]);
  }, [isEs]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isSending) return;

    const userMsg = queryText.trim();
    const newHistory = [...chatHistory, { role: "user", text: userMsg }];
    setChatHistory(newHistory);
    setMessage("");
    setIsSending(true);

    try {
      // Fire-and-forget lead capture
      fetch("/api/webhooks/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
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
      
      const data = await res.json();

      if (data.response) {
        setChatHistory((prev) => [
          ...prev, 
          { role: "agent", text: data.response }
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev, 
          { role: "agent", text: isEs ? "Disculpa, tuve un breve retraso de conexión. ¿Podrías reiterar tu consulta?" : "Pardon me, I experienced a brief connection delay. Could you repeat your question?" }
        ]);
      }
    } catch (error) {
      setChatHistory((prev) => [
        ...prev, 
        { role: "agent", text: isEs ? "Por favor contáctanos directamente a contacto@3treedigital.com o intenta nuevamente." : "Please feel free to reach out directly to contacto@3treedigital.com or try again." }
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
