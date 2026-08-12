import os

files_to_fix = [
    'src/app/page.tsx',
    'src/app/journal/page.tsx',
    'src/components/features/ArticleReaderClient.tsx',
    'src/lib/articlesData.ts'
]

# We know the specific corrupted substrings
replacements = {
    "Demostracin": "Demostración",
    "Reduccin": "Reducción",
    "Anlisis": "Análisis",
    "Algortmica": "Algorítmica",
    "Integracin": "Integración",
    "Friccin": "Fricción",
    "Innovacin": "Innovación",
    "Prximamente": "Próximamente",
    "Cinemtica": "Cinemática",
    "snete": "Únete",
    "ms de": "más de",
    "estn": "están",
    "anlogo": "análogo",
    "Polticas": "Políticas",
    "Trminos": "Términos",
    "Bisbol": "Béisbol",
    "xito": "éxito",
    "cronmetro": "cronómetro",
    "nmero": "número",
    "conclusin": "conclusión",
    "Conclusin": "Conclusión",
    "prrafo": "párrafo",
    "artculo": "artículo",
    "est": "está",
    "temtica": "temática",
    "Revolucin": "Revolución",
    "Visin": "Visión"
}

# The actual character might be \ufffd () in the file if it was read/written wrong
# Let's just do a manual replace of the exact lines using python string replace
for filepath in files_to_fix:
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
        
    text = text.replace("Demostracin", "Demostración")
    text = text.replace("Reduccin", "Reducción")
    text = text.replace("Anǭlisis", "Análisis")
    text = text.replace("Algortmica", "Algorítmica")
    text = text.replace("Integracin", "Integración")
    text = text.replace("Friccin", "Fricción")
    text = text.replace("Innovacin", "Innovación")
    text = text.replace("Prximamente", "Próximamente")
    text = text.replace("Cinemǭtica", "Cinemática")
    text = text.replace("snete", "Únete")
    text = text.replace("mǭs", "más")
    text = text.replace("estǭn", "están")
    text = text.replace("anǭlogo", "análogo")
    text = text.replace("Polticas", "Políticas")
    text = text.replace("TǸrminos", "Términos")
    text = text.replace("BǸisbol", "Béisbol")
    text = text.replace("Ǹxito", "éxito")
    text = text.replace("cronmetro", "cronómetro")
    text = text.replace("nǧmero", "número")
    text = text.replace("conclusin", "conclusión")
    text = text.replace("Conclusin", "Conclusión")
    text = text.replace("pǭrrafo", "párrafo")
    text = text.replace("artculo", "artículo")
    text = text.replace("estǭ", "está")
    text = text.replace("temǭtica", "temática")
    text = text.replace("Revolucin", "Revolución")
    text = text.replace("Visin", "Visión")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

print("Fixed exactly.")
