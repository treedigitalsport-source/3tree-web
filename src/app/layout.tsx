import type { Metadata } from "next";
import { Inter, Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { LangProvider } from "./i18n";
import AgentChat from "@/components/ui/AgentChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://3treedigital.com"),
  title: "3Tree Digital Sport IA | Sports AI & Biomechanics Engineering",
  description: "Diseñamos el futuro del deporte. Fusionamos inteligencia artificial, biomecánica sin marcadores (Markerless Biomechanics), analítica de datos y desarrollo de vanguardia.",
  keywords: ["Sports AI", "Markerless Biomechanics", "Kinebase Pro", "Sports Analytics", "3Tree Digital Sport IA", "Tecnología Deportiva", "IA Deportes"],
  authors: [{ name: "3Tree Digital Sport IA" }],
  openGraph: {
    title: "3Tree Digital Sport IA | Sports AI & Biomechanics Engineering",
    description: "Diseñamos el futuro del deporte con IA, biomecánica y desarrollo de élite.",
    url: "https://3treedigital.com",
    siteName: "3Tree Digital Sport IA",
    locale: "es_LA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3Tree Digital Sport IA | Sports AI & Biomechanics Engineering",
    description: "Diseñamos el futuro del deporte con IA, biomecánica y desarrollo de élite.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    other: {
      "p:domain_verify": ["53d0f51fa8fae313829e944cd81b1745"],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${syne.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <head>
        <meta name="p:domain_verify" content="53d0f51fa8fae313829e944cd81b1745" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#020617] text-white font-sans">
        <LangProvider>
          <div className="flex-1 w-full">
            {children}
          </div>
          <AgentChat />
        </LangProvider>
      </body>
    </html>
  );
}
