"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, ShieldCheck } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: "agent", text: "Hola, soy el Agente de Filtro de 3Tree Digital. ¿En qué puedo ayudarte?" }
  ]);
  // const { dict } = useLang();

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message to UI immediately
    const userMsg = message;
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setMessage("");
    setIsSending(true);

    try {
      // Send to MCP simulated database route
      const res = await fetch("/api/webhooks/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      
      const data = await res.json();

      // Simulate Agent processing delay
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev, 
          { role: "agent", text: "Mensaje recibido. Nuestro Agente Comercial lo está evaluando y se contactará pronto." }
        ]);
        setIsSending(false);
      }, 1500);

    } catch (error) {
      console.error("Error sending message:", error);
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#F26522] text-white shadow-2xl transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageSquare size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="fixed bottom-6 right-6 z-[60] w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-3rem)] bg-[#111111]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2 bg-[#F26522]/20 rounded-full">
                    <Bot className="text-[#F26522]" size={20} />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111111]"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Agente Comercial</h3>
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <ShieldCheck size={12} className="text-green-500" /> MCP Protegido
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} className="text-white/70" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-[#F26522] text-white rounded-tr-sm" 
                        : "bg-white/10 text-white/90 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white/50 p-3 rounded-2xl rounded-tl-sm text-sm flex gap-1">
                    <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F26522]/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!message.trim() || isSending}
                  className="absolute right-2 p-2 bg-[#F26522] hover:bg-[#ff7a3a] disabled:opacity-50 disabled:hover:bg-[#F26522] text-white rounded-full transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
