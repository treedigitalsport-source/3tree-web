"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/dictionaries/en';
import { es } from '@/dictionaries/es';

type Language = 'en' | 'es';
type Dictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Add a simple hydration check to avoid server/client mismatch if we were reading from localStorage
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Optional: detect browser language on mount
    const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLanguage(browserLang);
    setMounted(true);
  }, []);

  const t = language === 'es' ? es : en;

  if (!mounted) {
    // Render with English initially during SSR to match the server output
    return (
      <LanguageContext.Provider value={{ language: 'en', setLanguage, t: en }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
