import pymupdf
import os

doc = pymupdf.open("PORTAFOLIO TARUMA ARQUITECTOS-1.pdf")
os.makedirs("assets/images/labeled", exist_ok=True)

# Let's extract and label the exact parts from page 9 (processes / executive / construction)
p9 = doc[8] # page 9
for idx, img in enumerate(p9.get_images(full=True)):
    xref = img[0]
    base_img = doc.extract_image(xref)
    fn = f"assets/images/labeled/p9_img{idx}_{xref}_{base_img['width']}x{base_img['height']}.{base_img['ext']}"
    with open(fn, "wb") as f:
        f.write(base_img["image"])

# Also page 8
p8 = doc[7]
for idx, img in enumerate(p8.get_images(full=True)):
    xref = img[0]
    base_img = doc.extract_image(xref)
    fn = f"assets/images/labeled/p8_img{idx}_{xref}_{base_img['width']}x{base_img['height']}.{base_img['ext']}"
    with open(fn, "wb") as f:
        f.write(base_img["image"])

print("Extracted labeled images for p8 and p9")
