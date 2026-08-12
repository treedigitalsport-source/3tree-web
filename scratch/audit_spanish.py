import os
import re
import json

files_to_check = [
    'src/app/page.tsx',
    'src/app/journal/page.tsx',
    'src/components/features/ArticleReaderClient.tsx',
    'src/components/ui/Navigation.tsx',
    'src/components/ui/Footer.tsx'
]

results = []
for file_path in files_to_check:
    if not os.path.exists(file_path): continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.findall(r'isEs \? "(.*?)" \: "(.*?)"', content)
    for match in matches:
        results.append({
            'file': file_path,
            'es': match[0],
            'en': match[1]
        })

with open('scratch/translation_audit.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
