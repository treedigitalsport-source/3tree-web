import os

file = 'src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

old_nav_buttons = '''<div className="flex items-center gap-4 mr-2 md:mr-6 lg:mr-10">
          <button 
            onClick={toggleLang}
            className="hoverable flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-full bg-white/[0.03] backdrop-blur-md hover:border-brandOrange/40"
          >
            <Globe className="w-3 h-3 text-white/60" /> {lang === 'en' ? 'ES' : 'EN'}
          </button>
          
          <Link href="/contact" className="hoverable flex items-center gap-2 bg-brandOrange text-white px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brandOrange transition-all duration-500">
            {t.cta} <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>'''

new_nav_buttons = '''<div className="flex items-center gap-6 mr-2 md:mr-6 lg:mr-10">
          {/* Contacto movido a la izquierda */}
          <Link href="/contact" className="hoverable flex items-center gap-2 bg-brandOrange text-white px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brandOrange transition-all duration-500 shadow-[0_0_15px_rgba(242,101,34,0.3)]">
            {t.cta} <ArrowUpRight className="w-3 h-3" />
          </Link>
          
          {/* Traductor a la derecha con efecto Tecnológico */}
          <button 
            onClick={toggleLang}
            className="group relative hoverable flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brandOrange px-4 py-2 overflow-hidden border border-brandOrange/30 bg-brandOrange/5 backdrop-blur-md shadow-[0_0_10px_rgba(242,101,34,0.1)] hover:shadow-[0_0_20px_rgba(242,101,34,0.4)] transition-all duration-300"
          >
            <motion.div 
              animate={{ y: ["-100%", "400%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-[1px] bg-brandOrange shadow-[0_0_8px_#f26522]" 
            />
            <Globe className="w-3.5 h-3.5 animate-[spin_4s_linear_infinite]" />
            <span className="relative z-10">[ {lang === 'en' ? 'ES' : 'EN'} ]</span>
            
            {/* Esquinas tecnológicas */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-brandOrange/60"></div>
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-brandOrange/60"></div>
          </button>
        </div>'''

if old_nav_buttons in content:
    content = content.replace(old_nav_buttons, new_nav_buttons)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated navigation buttons.")
else:
    print("Could not find the exact old navigation buttons block.")
