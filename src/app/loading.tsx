export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-50 pointer-events-none">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-brandOrange/20 border-t-brandOrange animate-spin" />
        <div className="absolute font-display font-black text-xs text-brandOrange animate-pulse">
          3T
        </div>
      </div>
      <p className="mt-4 font-mono text-[10px] text-white/40 uppercase tracking-widest animate-pulse">
        Sports OS · Cargando
      </p>
    </div>
  );
}
