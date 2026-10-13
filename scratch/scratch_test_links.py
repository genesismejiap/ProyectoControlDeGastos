import urllib.request
import re

with open("public/servicios.html", "r", encoding="utf-8") as f:
    content = f.read()

# Check img srcs and css/js
srcs = re.findall(r'src=["\']([^"\']+)["\']', content)
hrefs = re.findall(r'href=["\']([^"\']+\.css)["\']', content)

targets = [s for s in (srcs + hrefs) if s.strip()]
print(f"Testing {len(targets)} resource links...")

all_ok = True
for t in set(targets):
    url = f"http://localhost:8080/{t}"
    try:
        r = urllib.request.urlopen(url)
        print(f"✓ {t} -> Status {r.status}")
    except Exception as e:
        print(f"✗ {t} -> Failed: {e}")
        all_ok = False

if all_ok:
    print("ALL ASSETS LOADED WITH HTTP 200 SUCCESS!")
