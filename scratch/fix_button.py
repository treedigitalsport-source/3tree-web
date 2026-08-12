import os

file = 'src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

old_button = '''<motion.div 
              animate={{ y: ["-100%", "400%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-[1px] bg-brandOrange shadow-[0_0_8px_#f26522]" 
            />
            <Globe className="w-3.5 h-3.5 animate-[spin_4s_linear_infinite]" />
            <span className="relative z-10">[ {lang === 'en' ? 'ES' : 'EN'} ]</span>
            
            {/* Esquinas tecnológicas */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-brandOrange/60"></div>
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-brandOrange/60"></div>'''

new_button = '''<motion.div 
              animate={{ y: ["-100%", "400%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-[1px] bg-brandOrange shadow-[0_0_8px_#f26522] pointer-events-none" 
            />
            <Globe className="w-3.5 h-3.5 animate-[spin_4s_linear_infinite] pointer-events-none" />
            <span className="relative z-10 pointer-events-none">[ {lang === 'en' ? 'ES' : 'EN'} ]</span>
            
            {/* Esquinas tecnológicas */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-brandOrange/60 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-brandOrange/60 pointer-events-none"></div>'''

if old_button in text:
    text = text.replace(old_button, new_button)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Fixed pointer events.")
else:
    print("Could not find button code.")
