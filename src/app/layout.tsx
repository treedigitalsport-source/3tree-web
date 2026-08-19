import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { LangProvider } from "./i18n";
import SmoothScroll from "@/components/SmoothScroll";
import AgentChat from "@/components/ui/AgentChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://3treedigital.com"),
  title: "3Tree Digital | Sports AI & Biomechanics Engineering",
  description: "Diseñamos el futuro del deporte. Fusionamos inteligencia artificial, biomecánica sin marcadores (Markerless Biomechanics), analítica de datos y desarrollo de vanguardia.",
  keywords: ["Sports AI", "Markerless Biomechanics", "Kinebase Pro", "Sports Analytics", "3Tree Digital", "Tecnología Deportiva", "IA Deportes"],
  authors: [{ name: "3Tree Digital Sport IA" }],
  openGraph: {
    title: "3Tree Digital | Sports AI & Biomechanics Engineering",
    description: "Diseñamos el futuro del deporte con IA, biomecánica y desarrollo de élite.",
    url: "https://3treedigital.com",
    siteName: "3Tree Digital",
    locale: "es_LA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3Tree Digital | Sports AI & Biomechanics Engineering",
    description: "Diseñamos el futuro del deporte con IA, biomecánica y desarrollo de élite.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${inter.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-black text-white font-sans">
        <LangProvider>
          <LoadingScreen />
          <main className="flex-1 w-full">
            {children}
          </main>
          <AgentChat />
        </LangProvider>
      </body>
    </html>
  );
}
