import re
with open('src/lib/articlesData.ts', 'r', encoding='utf-8') as f:
    content = f.read()
    
# Check if there are any articles missing execSummary
replacement = r'''\1execSummaryEs: "[Resumen Ejecutivo] - Un breve párrafo introductorio o conclusión principal que resume la tesis del artículo y engancha al lector.",
    execSummaryEn: "[Executive Summary] - A brief introductory paragraph or main conclusion summarizing the article's thesis and hooking the reader.",
    insightsEs: [
      "Punto clave de análisis número uno sobre la temática.",
      "Conclusión accionable o dato revelador número dos."
    ],
    insightsEn: [
      "Key analytical point number one on the subject.",
      "Actionable conclusion or revealing data point number two."
    ],
    \2'''

content = re.sub(r'(desc:\s*".*?",\s*)(image:\s*".*?")', replacement, content)

with open('src/lib/articlesData.ts', 'w', encoding='utf-8') as f:
    f.write(content)
