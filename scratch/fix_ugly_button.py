import os

file = 'src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

ugly_button = '''<button 
            onClick={toggleLang}
            className="group relative hoverable flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brandOrange px-4 py-2 overflow-hidden border border-brandOrange/30 bg-brandOrange/5 backdrop-blur-md shadow-[0_0_10px_rgba(242,101,34,0.1)] hover:shadow-[0_0_20px_rgba(242,101,34,0.4)] transition-all duration-300"
          >
            <motion.div 
              animate={{ y: ["-100%", "400%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-[1px] bg-brandOrange shadow-[0_0_8px_#f26522] pointer-events-none" 
            />
            <Globe className="w-3.5 h-3.5 animate-[spin_4s_linear_infinite] pointer-events-none" />
            <span className="relative z-10 pointer-events-none">[ {lang === 'en' ? 'ES' : 'EN'} ]</span>
            
            {/* Esquinas tecnológicas */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-brandOrange/60 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-brandOrange/60 pointer-events-none"></div>
          </button>'''

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

if ugly_button in text:
    text = text.replace(ugly_button, premium_tech_button)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced ugly button with premium tech button.")
else:
    print("Could not find the ugly button.")
