import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { LangProvider } from "./i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Designer Web Premium | 3Tree Digital",
  description: "Diseño web de alta conversión y estética premium.",
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
          <LoadingScreen />
          <main className="flex-1 w-full">
            {children}
          </main>
        </LangProvider>
      </body>
    </html>
  );
}
