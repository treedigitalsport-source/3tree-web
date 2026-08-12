import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { LangProvider } from "./i18n";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3Tree Digital | Sport Tech Agency",
  description: "Diseñamos el futuro del deporte. Fusionamos diseño de alto rendimiento, analítica de datos y desarrollo de vanguardia para la industria deportiva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans overflow-x-hidden">
        <LangProvider>
          {/* <SmoothScroll /> */}
          <LoadingScreen />
          <main className="flex-1 w-full">
            {children}
          </main>
        </LangProvider>
      </body>
    </html>
  );
}
