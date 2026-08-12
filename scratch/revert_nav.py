import os

file = 'src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

bad_nav_div = '<div className="hidden lg:flex gap-4 xl:gap-8 text-[10px] xl:text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-white/50 items-center lg:mr-12 xl:mr-32">'
original_nav_div = '<div className="hidden lg:flex gap-4 xl:gap-8 text-[10px] xl:text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-white/50 items-center">'

if bad_nav_div in text:
    text = text.replace(bad_nav_div, original_nav_div)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Reverted nav position.")
else:
    print("Could not find bad nav div.")
