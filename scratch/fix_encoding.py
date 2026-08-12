import os

replacements = {
    "Visin": "Visión",
    "visin": "visión",
    "Demostracin": "Demostración",
    "Reduccin": "Reducción",
    "Anǭlisis": "Análisis",
    "anǭlisis": "análisis",
    "Algortmica": "Algorítmica",
    "Integracin": "Integración",
    "Friccin": "Fricción",
    "Innovacin": "Innovación",
    "Prximamente": "Próximamente",
    "Cinemǭtica": "Cinemática",
    "snete": "Únete",
    "mǭs": "más",
    "estǭn": "están",
    "anǭlogo": "análogo",
    "Polticas": "Políticas",
    "TǸrminos": "Términos",
    "BǸisbol": "Béisbol",
    "bǸisbol": "béisbol",
    "Ǹxito": "éxito",
    "cronmetro": "cronómetro",
    "nǧmero": "número",
    "conclusin": "conclusión",
    "Conclusin": "Conclusión",
    "pǭrrafo": "párrafo",
    "artculo": "artículo",
    "estǭ": "está",
    "temǭtica": "temática",
    "Revolucin": "Revolución"
}

files_to_fix = [
    'src/app/page.tsx',
    'src/app/journal/page.tsx',
    'src/components/features/ArticleReaderClient.tsx',
    'src/lib/articlesData.ts'
]

for filepath in files_to_fix:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # We will also open with cp1252 to see if that helps finding broken chars
    with open(filepath, 'rb') as f:
        raw_content = f.read()
    
    text = raw_content.decode('utf-8', errors='replace')
    
    for bad, good in replacements.items():
        text = text.replace(bad, good)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

print("Fixed encoding.")
