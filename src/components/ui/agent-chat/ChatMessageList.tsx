'use client';

/**
 * 3Tree Digital Sport IA LLC — Chat Message List Component
 * Specification: 3T-AUDIT-011-F2 Blueprint
 */

import { useEffect, useRef } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import type { ClientChatMessage } from './types';
import ToolExecutionBadge from './ToolExecutionBadge';

interface ChatMessageListProps {
  messages: ClientChatMessage[];
  isSending: boolean;
  isEs: boolean;
  onSpeakText: (text: string) => void;
}

export default function ChatMessageList({ messages, isSending, isEs, onSpeakText }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isSending]);

  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 text-sm font-sans" role="log" aria-live="polite">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        const isSystem = msg.role === 'system';

        if (isSystem) {
          return (
            <div key={msg.id} className="flex justify-center my-1">
              <div className="bg-brandOrange/10 border border-brandOrange/20 text-brandOrange px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>{msg.text}</span>
              </div>
            </div>
          );
        }

        return (
          <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                isUser
                  ? 'bg-brandOrange text-white rounded-tr-xs shadow-md font-medium'
                  : 'bg-white/[0.04] border border-white/10 text-white/90 rounded-tl-xs backdrop-blur-sm'
              }`}
            >
              {msg.toolsExecuted && msg.toolsExecuted.length > 0 && (
                <ToolExecutionBadge tools={msg.toolsExecuted} />
              )}

              <p className="whitespace-pre-wrap">{msg.text}</p>

              {!isUser && (
                <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-white/30">
                    {msg.agentId ? `[${msg.agentId}]` : ''} {msg.isFallback ? '• Local Fallback' : ''}
                  </span>
                  <button
                    onClick={() => onSpeakText(msg.text)}
                    className="text-[10px] text-white/40 hover:text-brandOrange flex items-center gap-1 transition-colors"
                    title={isEs ? 'Escuchar mensaje' : 'Listen to message'}
                    aria-label="Escuchar mensaje por voz"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isEs ? 'Escuchar' : 'Listen'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isSending && (
        <div className="flex justify-start">
          <div className="bg-white/[0.04] border border-white/10 text-brandOrange p-3 rounded-2xl rounded-tl-xs text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brandOrange animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-brandOrange animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 rounded-full bg-brandOrange animate-bounce delay-300" />
            <span className="text-[10px] font-mono text-white/40 ml-1">{isEs ? 'Procesando...' : 'Processing...'}</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
