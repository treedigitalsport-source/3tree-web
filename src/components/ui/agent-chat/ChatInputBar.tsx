'use client';

/**
 * 3Tree Digital Sport IA LLC — Chat Input Bar Component
 * Specification: 3T-AUDIT-011-F2 Blueprint
 */

import { Send, Mic } from 'lucide-react';

interface ChatInputBarProps {
  message: string;
  isSending: boolean;
  isListening: boolean;
  isEs: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onToggleListening: () => void;
}

export default function ChatInputBar({
  message, isSending, isListening, isEs, onChange, onSend, onToggleListening,
}: ChatInputBarProps) {
  return (
    <div className="p-3.5 border-t border-white/10 bg-black/40">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder={isEs ? 'Escribe o presiona el micrófono...' : 'Type or tap microphone...'}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-xs md:text-sm text-white placeholder-white/30 focus:outline-none focus:border-brandOrange/50 transition-colors"
            aria-label={isEs ? 'Mensaje para el agente' : 'Message to agent'}
          />
          <button
            onClick={onToggleListening}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
              isListening ? 'text-rose-400 bg-rose-500/20 animate-pulse' : 'text-white/40 hover:text-white'
            }`}
            title={isListening ? (isEs ? 'Detener micrófono' : 'Stop mic') : (isEs ? 'Dictar por voz' : 'Voice input')}
            aria-label="Dictado por voz"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onSend}
          disabled={!message.trim() || isSending}
          className="p-2.5 bg-brandOrange hover:bg-[#ff7a3a] disabled:opacity-40 disabled:hover:bg-brandOrange text-white rounded-full transition-all duration-200 shadow-sm shrink-0"
          title={isEs ? 'Enviar mensaje' : 'Send message'}
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
  );
}
