import os

file = 'src/app/journal/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace category usage
# Old: {article.category || "Report"}
# New: {isEs ? (article.categoryEs || "Reporte") : (article.categoryEn || "Report")}
text = text.replace('{article.category || "Report"}', '{isEs ? (article.categoryEs || "Reporte") : (article.categoryEn || "Report")}')

# We also need to style the span to be a Glass Ribbon.
# Old: <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 text-white/80 rounded-sm">
# New: <span className="font-mono text-[9px] font-bold uppercase tracking-widest pl-4 pr-5 py-2 bg-gradient-to-r from-brandOrange/20 to-white/5 backdrop-blur-xl border-b-2 border-l-2 border-brandOrange text-white/90 rounded-br-2xl -ml-8 -mt-8 shadow-[0_4px_30px_rgba(242,101,34,0.15)] relative overflow-hidden">
ribbon_old = '<span className="font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 text-white/80 rounded-sm">'
ribbon_new = '''<span className="font-mono text-[9px] font-bold uppercase tracking-widest pl-6 pr-5 py-2.5 bg-white/5 backdrop-blur-xl border-l-2 border-brandOrange text-white shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-center gap-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-brandOrange/10 to-transparent pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/30 to-transparent"></div>'''
text = text.replace(ribbon_old, ribbon_new)

# Wait, if I replace the opening span, I also need to make sure it closes. The existing one closes naturally.
# Let's adjust the arrow icon to not interfere.
# Also fix other properties:
# Old: {article.title}
# New: {isEs ? article.titleEs : article.titleEn}
text = text.replace('                    {article.title}\n', '                    {isEs ? article.titleEs : article.titleEn}\n')

# Old: {article.time || article.readTime}
# New: {isEs ? article.timeEs : article.timeEn}
text = text.replace('{article.time || article.readTime}', '{isEs ? article.timeEs : article.timeEn}')

# Old: featuredNeil.title
# New: isEs ? featuredNeil.titleEs : featuredNeil.titleEn
text = text.replace('{featuredNeil.title}', '{isEs ? featuredNeil.titleEs : featuredNeil.titleEn}')

# Old: featuredNeil.time || featuredNeil.readTime
# New: isEs ? featuredNeil.timeEs : featuredNeil.timeEn
text = text.replace('{featuredNeil.time || featuredNeil.readTime}', '{isEs ? featuredNeil.timeEs : featuredNeil.timeEn}')


with open(file, 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated journal page logic")
