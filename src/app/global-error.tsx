'use client';

import { RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 font-sans antialiased">
        <div className="max-w-md w-full text-center space-y-6 bg-[#060c1c] border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs text-rose-400 uppercase tracking-widest font-black">3Tree Digital · Global Error</span>
            <h1 className="text-2xl font-bold text-white">Error Crítico del Sistema</h1>
            <p className="text-xs text-white/60 font-light">
              Se ha detectado una anomalía a nivel raíz. Presiona el botón para reiniciar el entorno de ejecución.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-[#f26522] hover:bg-[#ff7a3a] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md"
          >
            Reiniciar Aplicación
          </button>
        </div>
      </body>
    </html>
  );
}
