import shutil
import os

os.makedirs("public", exist_ok=True)
if os.path.exists("public/assets"):
    shutil.rmtree("public/assets")
shutil.copytree("assets", "public/assets")
print("Assets synced to public/assets successfully!")
