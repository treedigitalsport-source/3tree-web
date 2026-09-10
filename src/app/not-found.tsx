import Link from 'next/link';
import { ArrowLeft, Home, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-brandOrange/10 blur-[120px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -bottom-20 -right-20" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10 bg-[#060c1c]/80 border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-brandOrange/15 border border-brandOrange/30 flex items-center justify-center text-brandOrange mx-auto shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs text-brandOrange uppercase tracking-widest font-black">Error 404 · Sports OS</span>
          <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight text-white">Página No Encontrada</h1>
          <p className="font-sans text-xs md:text-sm text-white/60 font-light leading-relaxed">
            La ruta o contenido deportivo que buscas no existe o ha sido reubicada en nuestro ecosistema.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brandOrange hover:bg-[#ff7a3a] text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Inicio</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/90 border border-white/15 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Contacto</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
