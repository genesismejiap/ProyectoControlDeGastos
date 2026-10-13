import shutil

# 1. Copy public/servicios.html -> public/index.html
shutil.copy("public/servicios.html", "public/index.html")

# 2. Also ensure css and js directories exist in root so opening root/servicios.html directly in browser works seamlessly
shutil.copytree("public/css", "css", dirs_exist_ok=True)
shutil.copytree("public/js", "js", dirs_exist_ok=True)
shutil.copy("public/servicios.html", "servicios.html")

print("Created public/index.html, root servicios.html, and synced css & js folders!")
