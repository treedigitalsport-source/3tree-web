import os

file = 'src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

bad_nav_buttons = '''<div className="flex items-center gap-6 mr-2 md:mr-6 lg:mr-10">
          {/* Contacto movido a la izquierda */}
          <Link href="/contact" className="hoverable flex items-center gap-2 bg-brandOrange text-white px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brandOrange transition-all duration-500 shadow-[0_0_15px_rgba(242,101,34,0.3)]">
            {t.cta} <ArrowUpRight className="w-3 h-3" />
          </Link>
          
          {/* Traductor a la derecha con efecto Tecnolgico */}
          <button 
            onClick={toggleLang}
            className="group hoverable flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-full bg-white/[0.03] backdrop-blur-md hover:border-brandOrange/40"
          >
            <Globe className="w-3 h-3 text-white/60 group-hover:text-brandOrange group-hover:rotate-[360deg] transition-all duration-[1.5s] ease-in-out" /> {lang === 'en' ? 'ES' : 'EN'}
          </button>
        </div>'''

# Trying another version in case of encoding differences in comments
bad_nav_buttons_alt = '''<div className="flex items-center gap-6 mr-2 md:mr-6 lg:mr-10">
          {/* Contacto movido a la izquierda */}
          <Link href="/contact" className="hoverable flex items-center gap-2 bg-brandOrange text-white px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brandOrange transition-all duration-500 shadow-[0_0_15px_rgba(242,101,34,0.3)]">
            {t.cta} <ArrowUpRight className="w-3 h-3" />
          </Link>
          
          {/* Traductor a la derecha con efecto Tecnológico */}
          <button 
            onClick={toggleLang}
            className="group hoverable flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-full bg-white/[0.03] backdrop-blur-md hover:border-brandOrange/40"
          >
            <Globe className="w-3 h-3 text-white/60 group-hover:text-brandOrange group-hover:rotate-[360deg] transition-all duration-[1.5s] ease-in-out" /> {lang === 'en' ? 'ES' : 'EN'}
          </button>
        </div>'''

original_nav_buttons = '''<div className="flex items-center gap-4 mr-2 md:mr-6 lg:mr-10">
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


import re
# Regex replacement to ensure we don't fail on comment encoding
pattern = re.compile(r'<div className="flex items-center gap-6 mr-2 md:mr-6 lg:mr-10">.*?</div>', re.DOTALL)
if pattern.search(text):
    text = pattern.sub(original_nav_buttons, text)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Reverted to absolutely original state.")
else:
    print("Could not find block with regex.")
