import os

file = 'src/components/features/ArticleReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('{article.time}', '{isEs ? article.timeEs : article.timeEn}')
text = text.replace('article.desc\n', '(isEs ? article.descEs : article.descEn)\n')
text = text.replace('article.desc}', '(isEs ? article.descEs : article.descEn)}')

with open(file, 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Reader")
