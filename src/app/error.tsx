'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log telemetry to error monitoring in production
  }, [error]);

  return (
    <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6 relative overflow-hidden font-sans">
      <div className="max-w-md w-full text-center space-y-6 relative z-10 bg-[#060c1c]/90 border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest font-black">Recuperación Automática</span>
          <h1 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-white">Interrupción en la Vista</h1>
          <p className="font-sans text-xs md:text-sm text-white/60 font-light leading-relaxed">
            Ocurrió un error inesperado al cargar esta sección. El sistema de auto-recuperación de 3Tree Digital está listo para reintentar.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-brandOrange hover:bg-[#ff7a3a] text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/90 border border-white/15 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            <span>Inicio</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
