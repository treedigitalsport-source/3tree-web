import React from "react";
import { InstagramIcon } from "./InstagramIcon";
import { RumbleIcon } from "./RumbleIcon";
import { BlueskyIcon } from "./BlueskyIcon";
import { TruthSocialIcon } from "./TruthSocialIcon";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export interface SocialAccountItem {
  name: string;
  handle: string;
  url: string;
  color: string;
  badge: string;
  category: string;
  icon: React.ReactNode;
}

export function SocialAccountsGrid() {
  const accounts: SocialAccountItem[] = [
    {
      name: "Truth Social",
      handle: "@3TreeSportAI",
      url: "https://truthsocial.com/@3TreeSportAI",
      color: "#605af5",
      badge: "Verificado",
      category: "Canal Oficial",
      icon: <TruthSocialIcon className="w-5 h-5 text-[#605af5]" />,
    },
    {
      name: "Instagram",
      handle: "@3treesportai",
      url: "https://www.instagram.com/3treesportai/",
      color: "#E1306C",
      badge: "Oficial",
      category: "Reels & Multimedia",
      icon: <InstagramIcon className="w-5 h-5 text-[#E1306C]" />,
    },
    {
      name: "Rumble",
      handle: "@3TreeSportAI",
      url: "https://rumble.com/user/3TreeSportAI",
      color: "#85c742",
      badge: "Oficial",
      category: "Video & Transmisión",
      icon: <RumbleIcon className="w-5 h-5 text-[#85c742]" />,
    },
    {
      name: "X (Twitter)",
      handle: "@3TreeSportAI",
      url: "https://x.com/3TreeSportAI",
      color: "#ffffff",
      badge: "Oficial",
      category: "IA & Telemetría",
      icon: (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Bluesky",
      handle: "@3treesportai.bsky.social",
      url: "https://bsky.app/profile/3treesportai.bsky.social",
      color: "#0285FF",
      badge: "Oficial",
      category: "Red Descentralizada",
      icon: <BlueskyIcon className="w-5 h-5 text-[#0285FF]" />,
    },
    {
      name: "YouTube",
      handle: "3Tree Digital Sport IA",
      url: "https://www.youtube.com/channel/UCN1HgKHwaj3Ln4gJOewQg4w",
      color: "#FF0000",
      badge: "Oficial",
      category: "Canal y Podcast",
      icon: (
        <svg className="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      handle: "@3treesportai",
      url: "https://www.pinterest.com/3treesportai/",
      color: "#E60023",
      badge: "Dominio Verificado",
      category: "Infografías & Media",
      icon: (
        <svg className="w-5 h-5 text-[#E60023]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.622 0 12.017 0z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      handle: "3Tree Digital",
      url: "https://linkedin.com/company/3treedigital",
      color: "#0077b5",
      badge: "Corporativo",
      category: "B2B & Alianzas",
      icon: (
        <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-[10px] font-bold text-brandOrange tracking-[0.25em] uppercase">
            Canales Oficiales
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
            Redes Sociales & Cuentas Conectadas
          </h3>
        </div>
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          8 Redes Verificadas
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {accounts.map((acc, i) => (
          <a
            key={i}
            href={acc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group hoverable p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-brandOrange/40 hover:bg-white/[0.06] transition-all duration-300 flex flex-col justify-between gap-3 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                {acc.icon}
              </div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 group-hover:text-brandOrange group-hover:border-brandOrange/30 transition-colors">
                {acc.badge}
              </span>
            </div>

            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">
                {acc.category}
              </p>
              <h4 className="font-display text-sm font-bold text-white group-hover:text-brandOrange transition-colors mt-0.5">
                {acc.name}
              </h4>
              <p className="font-mono text-xs font-bold text-brandOrange tracking-wide mt-1 break-all">
                {acc.handle}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/50 group-hover:text-white transition-colors">
              <span>Abrir Canal</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-brandOrange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
