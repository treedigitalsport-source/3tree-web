import os

# Fix ArticleReaderClient.tsx
file = 'src/components/features/ArticleReaderClient.tsx'
if os.path.exists(file):
    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if "Resumen Ejecutivo" in line and "Executive Summary" in line:
            new_lines.append('                {isEs ? "Resumen Ejecutivo" : "Executive Summary"}\n')
        elif "Datos Clave" in line and "Key Insights" in line:
            new_lines.append('                {isEs ? "Datos Clave (Insights)" : "Key Insights"}\n')
        elif "Compartir Reporte" in line and "Share Report" in line:
            new_lines.append('                {isEs ? "Compartir Reporte" : "Share Report"}\n')
        elif "Volver al Diario" in line and "Back to Journal" in line:
            new_lines.append('          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] hidden md:inline">{isEs ? "Volver al Diario" : "Back to Journal"}</span>\n')
        else:
            new_lines.append(line)
            
    with open(file, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)


# Fix articlesData.ts
file = 'src/lib/articlesData.ts'
if os.path.exists(file):
    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if "Un breve" in line and "introductorio" in line:
            new_lines.append('    execSummaryEs: "[Resumen Ejecutivo] - Un breve párrafo introductorio o conclusión principal que resume la tesis del artículo y engancha al lector.",\n')
        elif "Punto clave de" in line and "sobre la" in line:
            new_lines.append('      "Punto clave de análisis número uno sobre la temática.",\n')
        elif "accionable o dato revelador" in line:
            new_lines.append('      "Conclusión accionable o dato revelador número dos."\n')
        elif "Un relato personal sobre la" in line and "del analista en el" in line:
            new_lines.append('    desc: "Un relato personal sobre la evolución del rol del analista en el béisbol: de observar partidos con libreta y cronómetro, a orquestar redes neuronales que predicen el éxito de un jugador.",\n')
        elif "La barra lateral ya est" in line:
            new_lines.append(line.replace("estǭ", "está").replace("est", "está").replace("estáá", "está"))
        else:
            new_lines.append(line)
            
    with open(file, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

print("Fixed Reader and Data")
