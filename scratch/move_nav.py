import os

file = 'src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

old_nav_div = '<div className="hidden lg:flex gap-4 xl:gap-8 text-[10px] xl:text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-white/50 items-center">'
new_nav_div = '<div className="hidden lg:flex gap-4 xl:gap-8 text-[10px] xl:text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-white/50 items-center lg:mr-12 xl:mr-32">'

if old_nav_div in text:
    text = text.replace(old_nav_div, new_nav_div)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Moved nav to the left.")
else:
    print("Could not find nav div.")
