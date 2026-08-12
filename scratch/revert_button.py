import os

file = 'src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

premium_tech_button = '''<button 
            onClick={toggleLang}
            className="group relative hoverable flex items-center gap-3 px-4 py-2 bg-[#020617] border border-white/10 hover:border-brandOrange/40 transition-all duration-500 overflow-hidden shadow-lg"
          >
            {/* Fondo de micro-cuadrícula tecnológica */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4px_4px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Punto LED de estado */}
            <div className="w-1.5 h-1.5 bg-brandOrange rounded-full shadow-[0_0_8px_rgba(242,101,34,0.8)] animate-pulse"></div>
            
            {/* Texto Minimalista HUD */}
            <div className="flex flex-col items-start relative z-10">
              <span className="font-mono text-[7px] text-white/40 tracking-widest leading-none mb-1">SYSTEM_LANG</span>
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/90 group-hover:text-brandOrange transition-colors leading-none">
                {lang === 'en' ? 'ENGLISH' : 'ESPAÑOL'}
              </span>
            </div>
            
            {/* Acento minimalista inferior */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brandOrange/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 pointer-events-none"></div>
          </button>'''

original_button = '''<button 
            onClick={toggleLang}
            className="hoverable flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-full bg-white/[0.03] backdrop-blur-md hover:border-brandOrange/40"
          >
            <Globe className="w-3 h-3 text-white/60" /> {lang === 'en' ? 'ES' : 'EN'}
          </button>'''

if premium_tech_button in text:
    text = text.replace(premium_tech_button, original_button)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Reverted to original button.")
else:
    print("Could not find premium tech button.")
