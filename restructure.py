import os
import re
import shutil

# Target directories
DIRS = ['css', 'js', 'assets']
for d in DIRS:
    os.makedirs(d, exist_ok=True)
os.makedirs('assets/images', exist_ok=True)

# Move CSS
css_files = ['style.css', 'app.css']
for f in css_files:
    if os.path.exists(f):
        shutil.move(f, os.path.join('css', f))

# Move JS
js_files = [f for f in os.listdir('.') if f.endswith('.js') and f not in ('find_links.py', 'restructure.py')]
for f in js_files:
    if os.path.exists(f):
        shutil.move(f, os.path.join('js', f))

# Move loose images
loose_imgs = [f for f in os.listdir('.') if f.endswith('.png') or f.endswith('.jpg') or f.endswith('.svg')]
for f in loose_imgs:
    if os.path.exists(f):
        shutil.move(f, os.path.join('assets', 'images', f))

# Move contents of 'images' if it exists to 'assets/images'
if os.path.exists('images') and os.path.isdir('images'):
    for item in os.listdir('images'):
        src = os.path.join('images', item)
        dst = os.path.join('assets', 'images', item)
        shutil.move(src, dst)
    shutil.rmtree('images')

# Update HTML files
html_files = ['index.html', 'app.html']
for h in html_files:
    if os.path.exists(h):
        with open(h, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
        
        # Replace CSS: href="app.css" -> href="css/app.css"
        for css in css_files:
            content = re.sub(rf'href=[\'\"]{css}[\'\"]', f'href="css/{css}"', content)
            
        # Replace JS: src="script.js" -> src="js/script.js"
        for js in js_files:
            content = re.sub(rf'src=[\'\"]{js}[\'\"]', f'src="js/{js}"', content)
            
        # Replace loose images: src="logo.png" -> src="assets/images/logo.png"
        for img in loose_imgs:
            content = re.sub(rf'src=[\'\"]{img}[\'\"]', f'src="assets/images/{img}"', content)
            
        # Replace 'images/' prefix: src="images/..." -> src="assets/images/..."
        # We can just look for src="images/ to src="assets/images/
        content = content.replace('src="images/', 'src="assets/images/')
        content = content.replace('src=\'images/', 'src=\'assets/images/')
        
        with open(h, 'w', encoding='utf-8') as file:
            file.write(content)

print("Restructuring complete.")
