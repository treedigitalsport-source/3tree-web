import os

file = 'src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

original_button = '''<button 
            onClick={toggleLang}
            className="hoverable flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-full bg-white/[0.03] backdrop-blur-md hover:border-brandOrange/40"
          >
            <Globe className="w-3 h-3 text-white/60" /> {lang === 'en' ? 'ES' : 'EN'}
          </button>'''

animated_globe_button = '''<button 
            onClick={toggleLang}
            className="group hoverable flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-full bg-white/[0.03] backdrop-blur-md hover:border-brandOrange/40"
          >
            <Globe className="w-3 h-3 text-white/60 group-hover:text-brandOrange group-hover:rotate-180 transition-all duration-700 ease-in-out" /> {lang === 'en' ? 'ES' : 'EN'}
          </button>'''

if original_button in text:
    text = text.replace(original_button, animated_globe_button)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Added hover spin effect to globe.")
else:
    print("Could not find the original button.")
