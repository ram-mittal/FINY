import os
import re

html_files = ['index.html', 'app.html']
for h in html_files:
    if os.path.exists(h):
        with open(h, 'r', encoding='utf-8') as f:
            content = f.read()
            scripts = set(re.findall(r'src=\"([^"]+\.js)\"', content))
            css = set(re.findall(r'href=\"([^"]+\.css)\"', content))
            imgs = set(re.findall(r'src=\"([^"]+\.(?:png|jpg|svg))\"', content))
            print(f'{h}:\n  Scripts: {scripts}\n  CSS: {css}\n  Imgs: {imgs}')
