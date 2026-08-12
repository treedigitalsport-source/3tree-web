import os

file = 'src/app/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('<SmoothScroll />', '{/* <SmoothScroll /> */}')

with open(file, 'w', encoding='utf-8') as f:
    f.write(text)

print("Disabled SmoothScroll in layout")
