import pymupdf
import os

doc = pymupdf.open("PORTAFOLIO TARUMA ARQUITECTOS-1.pdf")
os.makedirs("extracted_assets", exist_ok=True)

print("PDF Pages:", len(doc))

# Let's see what is on Page 5 (Services page)
p5 = doc[4] # 0-indexed page 5
print("Page 5 text:")
print(p5.get_text())

# Also render page 5 to see how it looks
pix = p5.get_pixmap(dpi=150)
pix.save("extracted_assets/page_5_services.png")

# Also render page 1 (cover)
pix1 = doc[0].get_pixmap(dpi=150)
pix1.save("extracted_assets/page_1_cover.png")

print("Saved preview of page 1 and page 5")
