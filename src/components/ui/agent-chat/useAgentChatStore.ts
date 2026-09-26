'use client';

/**
 * 3Tree Digital Sport IA LLC — Client Agent UI State Management Hook
 * Specification: 3T-AUDIT-011-F2 Blueprint
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ClientChatMessage, SentimentType, AgentDescriptor, SpeechRecognitionInstance, SpeechRecognitionEvent } from './types';
import { DEFAULT_AGENT, detectClientSentiment, getLocalFallbackReply, ALL_AGENTS } from './constants';

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function useAgentChatStore(lang: string = 'es') {
  const isEs = lang === 'es';
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [activeAgent, setActiveAgent] = useState<AgentDescriptor>(DEFAULT_AGENT);
  const [messages, setMessages] = useState<ClientChatMessage[]>([]);
  const [sentiment, setSentiment] = useState<SentimentType>('POSITIVE_NEUTRAL');
  const [isSending, setIsSending] = useState(false);
  const [activeError, setActiveError] = useState<string | null>(null);

  // Audio / Voice State
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sessionIdRef = useRef<string>(generateId('sess'));
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const welcomeText = isEs
    ? `¡Hola! 👋 Soy ${activeAgent.name}, ${activeAgent.role} en 3Tree Digital Sport. ¿En qué te puedo colaborar hoy?`
    : `Hello! 👋 I'm ${activeAgent.name}, ${activeAgent.role} at 3Tree Digital Sport. How can I assist you today?`;

  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isEs ? 'es-US' : 'en-US';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  }, [isEs]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: generateId('msg_init'),
        role: 'assistant',
        text: welcomeText,
        timestamp: Date.now(),
        agentId: activeAgent.agentId,
      }]);
    }
  }, [welcomeText, messages.length, activeAgent.agentId]);

  const selectAgent = useCallback((agentId: string) => {
    const found = ALL_AGENTS.find((ag) => ag.agentId === agentId);
    if (found) {
      setActiveAgent(found);
      setIsSelectorOpen(false);
      const greeting = isEs
        ? `Has transferido la consulta a ${found.name} (${found.role} · ${found.departmentName}). ¿En qué puedo apoyarte?`
        : `Transferred inquiry to ${found.name} (${found.role} · ${found.departmentName}). How may I assist you?`;
      setMessages((prev) => [
        ...prev,
        { id: generateId('msg_handoff'), role: 'system', text: greeting, timestamp: Date.now(), agentId: found.agentId },
      ]);
      if (isVoiceEnabled || isCallActive) speakText(greeting);
    }
  }, [isEs, isVoiceEnabled, isCallActive, speakText]);

  const sendMessage = useCallback(async (queryText: string) => {
    const cleanText = queryText.trim();
    if (!cleanText || isSending) return;

    const detectedMood = detectClientSentiment(cleanText);
    setSentiment(detectedMood);
    setActiveError(null);

    const userMessage: ClientChatMessage = {
      id: generateId('msg_u'),
      role: 'user',
      text: cleanText,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputMessage('');
    setIsSending(true);

    // Fire-and-forget webhook ingestion (3T-AUDIT-010)
    fetch('/api/webhooks/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: cleanText,
        sentiment: detectedMood,
        source: 'WEBHOOK_CHAT',
        agentId: activeAgent.agentId,
      }),
    }).catch(() => {});

    // Abort controller for cancellation
    abortControllerRef.current = new AbortController();
    const correlationId = `corr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      const groqMessages = newHistory
        .filter((msg) => msg.role === 'user' || msg.role === 'assistant' || msg.role === 'agent')
        .map((msg) => ({
          role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
          content: msg.text,
        }));

      const res = await fetch(`/api/groq?t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        cache: 'no-store',
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          agentId: activeAgent.agentId,
          sessionId: sessionIdRef.current,
          correlationId,
          inputMessage: cleanText,
          messages: groqMessages,
        }),
      });

      const data = await res.json();
      let replyText = data?.response;
      let toolsExecuted = data?.execution?.toolsExecuted;

      if (!replyText || typeof replyText !== 'string' || replyText.trim().length === 0) {
        replyText = getLocalFallbackReply(cleanText, isEs, activeAgent.name);
      }

      if (data?.sentiment) setSentiment(data.sentiment);

      const assistantMsg: ClientChatMessage = {
        id: generateId('msg_a'),
        role: 'assistant',
        text: replyText,
        timestamp: Date.now(),
        agentId: activeAgent.agentId,
        toolsExecuted,
        isFallback: data?.status === 'recovered' || !data?.response,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (isVoiceEnabled || isCallActive) speakText(replyText);
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return;
      const fallbackReply = getLocalFallbackReply(cleanText, isEs, activeAgent.name);
      const fallbackMsg: ClientChatMessage = {
        id: generateId('msg_fb'),
        role: 'assistant',
        text: fallbackReply,
        timestamp: Date.now(),
        agentId: activeAgent.agentId,
        isFallback: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (isVoiceEnabled || isCallActive) speakText(fallbackReply);
    } finally {
      setIsSending(false);
      abortControllerRef.current = null;
    }
  }, [isSending, messages, activeAgent, isEs, isVoiceEnabled, isCallActive, speakText]);

  const toggleListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const win = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance };
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const rec = new SR();
      rec.lang = isEs ? 'es-ES' : 'en-US';
      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const text = e.results[0]?.[0]?.transcript;
        if (text) sendMessage(text);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
      rec.start();
    } catch {
      setIsListening(false);
    }
  }, [isListening, isEs, sendMessage]);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsSending(false);
    }
  }, []);

  const closeChat = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsCallActive(false);
    if (messages.length > 1) {
      fetch('/api/webhooks/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'CHAT_SESSION_ENDED', conversationHistory: messages, agentId: activeAgent.agentId }),
      }).catch(() => {});
    }
    setIsOpen(false);
  }, [messages, activeAgent.agentId]);

  return {
    isOpen, isSelectorOpen, inputMessage, activeAgent, messages, sentiment,
    isSending, activeError, isVoiceEnabled, isListening, isCallActive, isSpeaking,
    setIsOpen, setIsSelectorOpen, setInputMessage, selectAgent, sendMessage,
    cancelRequest, toggleListening, setIsVoiceEnabled, setIsCallActive, closeChat, speakText,
  };
}
