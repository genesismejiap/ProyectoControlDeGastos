import fitz # PyMuPDF
import json
import os

pdf_path = "PORTAFOLIO TARUMA ARQUITECTOS-1.pdf"
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")

services_keywords = [
    "consultor",
    "gesti",
    "construcc",
    "interioris",
    "planeaci",
    "arquitect",
    "servicio"
]

results = []

for page_idx in range(len(doc)):
    page = doc[page_idx]
    text = page.get_text()
    if not text.strip():
        continue
    
    # Check if page has any keyword
    found = []
    text_lower = text.lower()
    for kw in services_keywords:
        if kw in text_lower:
            found.append(kw)
    
    if found:
        results.append({
            "page": page_idx + 1,
            "keywords": found,
            "preview": text.strip()[:300].replace("\n", " ")
        })

print(f"Found {len(results)} pages with keywords:")
for r in results[:20]:
    print(f"Page {r['page']}: {r['keywords']} -> {r['preview'][:120]}...")

with open("pdf_text_summary.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
