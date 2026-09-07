"use client";

import React from "react";
import Link from "next/link";
import { useLang } from "@/app/i18n";
import { SocialAccountsGrid } from "./SocialAccountsGrid";

export function Footer() {
  const { lang } = useLang();
  const isEs = lang === "es";

  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-[#020617] pt-16 pb-12 overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* ─── REDES SOCIALES Y CUENTAS CONECTADAS ─── */}
        <div className="mb-14">
          <SocialAccountsGrid />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
          <div>
            <div className="font-display font-black text-xl md:text-2xl tracking-widest uppercase mb-3 text-white">
              3Tree Digital <span className="text-brandOrange">Sport IA</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              {isEs ? "AI Sports Intelligence Company · Florida, USA" : "AI Sports Intelligence Company · Florida, USA"}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            {/* Enlaces Legales */}
            <div className="flex flex-wrap gap-4 md:gap-6 font-mono text-[10px] font-bold uppercase tracking-widest text-white/50">
              <Link href="/terms" className="hover:text-brandOrange transition-colors hoverable">
                {isEs ? "Términos de Servicio" : "Terms of Service"}
              </Link>
              <Link href="/privacy" className="hover:text-brandOrange transition-colors hoverable">
                {isEs ? "Políticas de Privacidad" : "Privacy Policy"}
              </Link>
              <Link href="/cookies" className="hover:text-brandOrange transition-colors hoverable">
                {isEs ? "Cookies" : "Cookies"}
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            © {new Date().getFullYear()} 3Tree Digital Sport IA. {isEs ? "Todos los derechos reservados." : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
