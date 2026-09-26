'use client';

/**
 * 3Tree Digital Sport IA LLC — Chat Header Component
 * Specification: 3T-AUDIT-011-F2 Blueprint
 */

import { motion } from 'framer-motion';
import { X, Headset, Volume2, VolumeX, Phone, PhoneOff, ChevronDown } from 'lucide-react';
import type { AgentDescriptor, SentimentType } from './types';

interface ChatHeaderProps {
  activeAgent: AgentDescriptor;
  sentiment: SentimentType;
  isCallActive: boolean;
  isVoiceEnabled: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isEs: boolean;
  onToggleCall: () => void;
  onToggleVoice: () => void;
  onOpenSelector: () => void;
  onClose: () => void;
}

export default function ChatHeader({
  activeAgent, sentiment, isCallActive, isVoiceEnabled, isSpeaking, isListening,
  isEs, onToggleCall, onToggleVoice, onOpenSelector, onClose,
}: ChatHeaderProps) {
  return (
    <div className="flex flex-col border-b border-white/10 bg-black/50">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSelector}
            className="group relative flex items-center justify-center p-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-brandOrange/50"
            title={isEs ? 'Cambiar agente' : 'Switch agent'}
            aria-label="Seleccionar agente"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute -inset-0.5 rounded-full bg-[conic-gradient(from_0deg,#f26522,#ff8c42,transparent,#f26522)] blur-[1px] opacity-90"
            />
            <div className="relative w-9 h-9 rounded-full bg-[#0a0f1d] border border-white/20 flex items-center justify-center shadow-lg">
              <Headset className={`w-4 h-4 ${isSpeaking ? 'text-cyan-400' : 'text-brandOrange'}`} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#020617]" />
          </button>

          <div className="text-left">
            <button
              onClick={onOpenSelector}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none"
              aria-label="Abrir catálogo de agentes"
            >
              <h3 className="font-display font-bold text-white text-sm tracking-wide">{activeAgent.name}</h3>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-brandOrange/10 border border-brandOrange/20 text-brandOrange">
                {activeAgent.agentId}
              </span>
              <ChevronDown className="w-3 h-3 text-white/40" />
            </button>
            <p className="text-[10px] font-mono text-white/50 tracking-wider truncate max-w-[180px]">
              {activeAgent.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleCall}
            className={`p-2 rounded-full transition-all ${
              isCallActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'hover:bg-white/10 text-white/60 hover:text-white'
            }`}
            title={isCallActive ? (isEs ? 'Finalizar llamada' : 'End call') : (isEs ? 'Llamada de voz' : 'Voice call')}
            aria-label="Llamada de voz"
          >
            {isCallActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-full transition-colors ${
              isVoiceEnabled ? 'text-brandOrange bg-brandOrange/10' : 'text-white/40 hover:text-white hover:bg-white/10'
            }`}
            title={isVoiceEnabled ? (isEs ? 'Silenciar voz' : 'Mute voice') : (isEs ? 'Activar voz' : 'Enable voice')}
            aria-label="Alternar síntesis de voz"
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Cerrar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-5 py-1 bg-black/60 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
        <span className="text-white/40">Status:</span>
        {isSpeaking ? (
          <span className="text-cyan-400 font-semibold animate-pulse">🔊 {activeAgent.name} {isEs ? 'hablando...' : 'speaking...'}</span>
        ) : isListening ? (
          <span className="text-rose-400 font-semibold animate-pulse">🎙️ {isEs ? 'Escuchando tu voz...' : 'Listening...'}</span>
        ) : sentiment === 'HIGH_INTENT' ? (
          <span className="text-brandOrange font-semibold">🎯 {isEs ? 'Calificación B2B Pro' : 'B2B Demo Qualification'}</span>
        ) : sentiment === 'TECHNICAL' ? (
          <span className="text-cyan-400 font-semibold">⚡ {isEs ? 'Telemetría Biomecánica' : 'Biomechanics Telemetry'}</span>
        ) : sentiment === 'FRUSTRATED' ? (
          <span className="text-amber-400 font-semibold">🛡️ {isEs ? 'Atención Prioritaria' : 'Priority Care'}</span>
        ) : (
          <span className="text-emerald-400 font-semibold">🟢 {activeAgent.name} {isEs ? 'Conectado' : 'Connected'}</span>
        )}
      </div>
    </div>
  );
}
