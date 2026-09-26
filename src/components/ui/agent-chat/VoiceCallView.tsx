'use client';

/**
 * 3Tree Digital Sport IA LLC — Voice Call View Component
 * Specification: 3T-AUDIT-011-F2 Blueprint
 */

import { motion } from 'framer-motion';
import { Headset, Mic, MicOff, PhoneOff } from 'lucide-react';
import type { AgentDescriptor } from './types';

interface VoiceCallViewProps {
  activeAgent: AgentDescriptor;
  isSpeaking: boolean;
  isListening: boolean;
  isEs: boolean;
  onToggleListening: () => void;
  onEndCall: () => void;
}

export default function VoiceCallView({
  activeAgent, isSpeaking, isListening, isEs, onToggleListening, onEndCall,
}: VoiceCallViewProps) {
  const bars = [40, 75, 100, 60, 90, 45, 80, 50, 70, 30];

  return (
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
          {isEs ? `Llamada con ${activeAgent.name}` : `Call with ${activeAgent.name}`}
        </h4>
        <p className="text-xs text-white/50 font-mono">
          {isSpeaking
            ? (isEs ? `${activeAgent.name} está hablando...` : `${activeAgent.name} is speaking...`)
            : isListening
            ? (isEs ? 'Escuchando tu voz...' : 'Listening to you...')
            : (isEs ? 'Presiona el micrófono para hablar' : 'Tap microphone to speak')}
        </p>
      </div>

      {/* Live Audio Waveform Simulation */}
      <div className="flex items-center gap-1.5 h-8">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            animate={isSpeaking || isListening ? { height: [`${h * 0.2}px`, `${h * 0.4}px`, `${h * 0.2}px`] } : { height: '6px' }}
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
            className={`w-1 rounded-full ${isSpeaking ? 'bg-cyan-400' : isListening ? 'bg-rose-400' : 'bg-white/20'}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleListening}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)]'
              : 'bg-brandOrange hover:bg-[#ff7a3a] text-white'
          }`}
          aria-label={isEs ? 'Hablar con el agente' : 'Speak to agent'}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button
          onClick={onEndCall}
          className="w-14 h-14 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors"
          aria-label={isEs ? 'Colgar llamada' : 'End call'}
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
