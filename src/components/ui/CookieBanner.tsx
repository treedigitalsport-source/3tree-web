"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useLang } from "@/app/i18n";

const CONSENT_KEY = "3tree_cookie_consent";

export default function CookieBanner() {
  const { lang } = useLang();
  const isEs = lang === "es";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // Ignora de forma segura si el almacenamiento local está restringido
    }
  }, []);

  const handleConsent = (level: "all" | "essential") => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ level, timestamp: new Date().toISOString() })
      );
    } catch {
      // Fallback seguro
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          aria-label="Consentimiento de Cookies"
          role="region"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 p-5 rounded-2xl bg-[#030712]/95 border border-white/10 backdrop-blur-xl shadow-2xl text-white font-sans"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-brandOrange/10 border border-brandOrange/20 text-brandOrange shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  {isEs ? "Control de Privacidad" : "Privacy & Cookies"}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-brandOrange font-bold">
                  GDPR · CCPA
                </span>
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                {isEs
                  ? "Utilizamos cookies esenciales para la navegación segura y de telemetría para optimizar la experiencia en 3Tree Digital Sport IA."
                  : "We use essential cookies for secure browsing and telemetry cookies to optimize your experience on 3Tree Digital Sport IA."}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <Link
              href="/cookies"
              className="text-[11px] font-mono text-white/40 hover:text-brandOrange underline underline-offset-4 transition-colors"
            >
              {isEs ? "Leer Política" : "Read Policy"}
            </Link>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleConsent("essential")}
                className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-mono font-medium tracking-wider uppercase text-white/70 hover:text-white transition-all cursor-pointer"
              >
                {isEs ? "Solo Esenciales" : "Essential Only"}
              </button>
              <button
                type="button"
                onClick={() => handleConsent("all")}
                className="px-3.5 py-1.5 rounded-lg bg-brandOrange hover:bg-[#d9551a] text-black font-mono font-bold text-[11px] tracking-wider uppercase transition-all shadow-md shadow-brandOrange/20 cursor-pointer"
              >
                {isEs ? "Aceptar Todo" : "Accept All"}
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
