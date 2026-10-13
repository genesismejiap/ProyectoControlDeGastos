import pymupdf
import os

doc = pymupdf.open("PORTAFOLIO TARUMA ARQUITECTOS-1.pdf")
os.makedirs("extracted_assets/pages", exist_ok=True)
os.makedirs("extracted_assets/images", exist_ok=True)

# Render pages 2, 3, 4, 6, 7, 8, 9
for p_idx in [1, 2, 3, 5, 6, 7, 8, 9]:
    page = doc[p_idx]
    pix = page.get_pixmap(dpi=150)
    pix.save(f"extracted_assets/pages/page_{p_idx+1}.png")

# Also let's extract high resolution images from the PDF
# Let's see all images across the document
img_count = 0
for p_idx in range(len(doc)):
    page = doc[p_idx]
    image_list = page.get_images(full=True)
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        width = base_image["width"]
        height = base_image["height"]
        
        # Only save significant images (> 200px)
        if width > 300 and height > 300:
            filename = f"extracted_assets/images/img_p{p_idx+1}_{xref}_{width}x{height}.{image_ext}"
            with open(filename, "wb") as f:
                f.write(image_bytes)
            img_count += 1

print(f"Extracted {img_count} significant images.")
