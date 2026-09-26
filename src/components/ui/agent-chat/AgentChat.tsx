/**
 * 3Tree Digital Sport IA LLC — Client Agent UI Master Orchestrator Component
 * Specification: 3T-AUDIT-011-F2 Blueprint
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Headset } from 'lucide-react';
import { useLang } from '@/app/i18n';
import { useAgentChatStore } from './useAgentChatStore';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInputBar from './ChatInputBar';
import VoiceCallView from './VoiceCallView';
import AgentSelector from './AgentSelector';

export default function AgentChat() {
  const { lang } = useLang();
  const isEs = lang === 'es';

  const store = useAgentChatStore(lang);

  return (
    <>
      {/* Floating Button with Pulse Halo */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => store.setIsOpen(true)}
          className={`relative w-12 h-12 rounded-full bg-[#0a0f1d] border border-brandOrange/50 text-white shadow-[0_0_25px_rgba(242,101,34,0.4)] transition-all duration-300 group flex items-center justify-center ${
            store.isOpen ? 'opacity-0 pointer-events-none scale-50' : 'opacity-100 scale-100'
          }`}
          aria-label={isEs ? `Abrir chat con ${store.activeAgent.name}` : `Open chat with ${store.activeAgent.name}`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="absolute -inset-0.5 rounded-full bg-[conic-gradient(from_0deg,#f26522,#ff8c42,transparent,#f26522)] blur-[1px] opacity-80 group-hover:opacity-100 transition-opacity"
          />

          <div className="relative w-11 h-11 rounded-full bg-[#0a0f1d] flex items-center justify-center z-10">
            <Headset className="w-5 h-5 text-brandOrange group-hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(242,101,34,0.8)]" />
          </div>

          <span className="absolute top-0 right-0 flex h-3 w-3 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#020617]" />
          </span>

          <div className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-black/90 border border-white/15 text-white font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            {store.activeAgent.name} · {isEs ? 'IA & Voz' : 'AI & Voice'}
          </div>
        </motion.button>
      </div>

      {/* Chat / Call Modal */}
      <AnimatePresence>
        {store.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            className="fixed bottom-6 right-6 z-[60] w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] bg-[#0a0f1d]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <ChatHeader
              activeAgent={store.activeAgent}
              sentiment={store.sentiment}
              isCallActive={store.isCallActive}
              isVoiceEnabled={store.isVoiceEnabled}
              isSpeaking={store.isSpeaking}
              isListening={store.isListening}
              isEs={isEs}
              onToggleCall={() => store.setIsCallActive(!store.isCallActive)}
              onToggleVoice={() => store.setIsVoiceEnabled(!store.isVoiceEnabled)}
              onOpenSelector={() => store.setIsSelectorOpen(true)}
              onClose={store.closeChat}
            />

            {/* Agent Selector Overlay */}
            {store.isSelectorOpen && (
              <AgentSelector
                activeAgentId={store.activeAgent.agentId}
                isEs={isEs}
                onSelectAgent={store.selectAgent}
                onClose={() => store.setIsSelectorOpen(false)}
              />
            )}

            {/* In-Call View or Message List */}
            {store.isCallActive ? (
              <VoiceCallView
                activeAgent={store.activeAgent}
                isSpeaking={store.isSpeaking}
                isListening={store.isListening}
                isEs={isEs}
                onToggleListening={store.toggleListening}
                onEndCall={() => store.setIsCallActive(false)}
              />
            ) : (
              <>
                <ChatMessageList
                  messages={store.messages}
                  isSending={store.isSending}
                  isEs={isEs}
                  onSpeakText={store.speakText}
                />

                <ChatInputBar
                  message={store.inputMessage}
                  isSending={store.isSending}
                  isListening={store.isListening}
                  isEs={isEs}
                  onChange={store.setInputMessage}
                  onSend={() => store.sendMessage(store.inputMessage)}
                  onToggleListening={store.toggleListening}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
