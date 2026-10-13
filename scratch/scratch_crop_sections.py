import pymupdf
from PIL import Image
import os

doc = pymupdf.open("PORTAFOLIO TARUMA ARQUITECTOS-1.pdf")
p9 = doc[8] # 0-indexed page 9

# High-resolution render of page 9 (300 DPI)
pix = p9.get_pixmap(dpi=300)
img_path = "assets/images/labeled/page_9_highres.png"
pix.save(img_path)

im = Image.open(img_path)
W, H = im.size
print(f"Page 9 size: {W} x {H}")

# On page 9:
# Right half is X from W/2 to W
# Bottom right is roughly X from 0.7*W to W, Y from 0.55*H to H
surveyor_crop = im.crop((int(W * 0.77), int(H * 0.54), W, H))
surveyor_crop.save("assets/images/services/consultorias_topografia.png")

# Warehouse interior is from 0.5*W to 0.78*W, Y from 0.54*H to H
warehouse_crop = im.crop((int(W * 0.5), int(H * 0.54), int(W * 0.78), H))
warehouse_crop.save("assets/images/services/construccion_nave.png")

# Construction site scaffolding is from 0.5*W to W, Y from 0.16*H to 0.53*H
scaffold_crop = im.crop((int(W * 0.5), int(H * 0.16), W, int(H * 0.53)))
scaffold_crop.save("assets/images/services/construccion_obra_civil.png")

# Executive floor plan (middle-bottom left)
planta_crop = im.crop((int(W * 0.32), int(H * 0.60), int(W * 0.49), int(H * 0.95)))
planta_crop.save("assets/images/services/gestion_planta_ejecutiva.png")

# Conceptual sketches from page 8
p8 = doc[7]
pix8 = p8.get_pixmap(dpi=300)
pix8.save("assets/images/labeled/page_8_highres.png")
im8 = Image.open("assets/images/labeled/page_8_highres.png")
W8, H8 = im8.size

# Left side of page 8: Conceptual sketches and massing
sketch_crop = im8.crop((0, int(H8 * 0.15), int(W8 * 0.49), H8))
sketch_crop.save("assets/images/services/diseno_conceptual_bocetos.png")

# Masterplan 3D on page 8 bottom
masterplan_crop = im8.crop((int(W8 * 0.5), int(H8 * 0.70), int(W8 * 0.73), H8))
masterplan_crop.save("assets/images/services/urbanismo_masterplan_aereo.png")

print("Cropped high-res sections successfully!")
