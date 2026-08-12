import os

file = 'src/app/journal/page.tsx'
with open(file, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "Destacada" in line and "Featured Vision" in line:
        new_lines.append('                  <Star className="w-4 h-4 fill-[#020617]" /> {isEs ? "Visión Destacada" : "Featured Vision"}\n')
    elif "profundos" in line and "Deep-dive insights" in line:
        new_lines.append('              {isEs \n                ? "Análisis profundos, investigación de la industria e ideas disruptivas en la intersección del deporte profesional y la innovación digital."\n                : "Deep-dive insights, industry research, and disruptive ideas at the intersection of professional sports and digital innovation."}\n')
    else:
        new_lines.append(line)

with open(file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
    
print("Fixed journal page")
