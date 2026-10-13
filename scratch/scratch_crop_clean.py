from PIL import Image

# Clean crop of construction image to remove left/right borders
im = Image.open("assets/images/cards/servicio_construccion_ejecucion.png")
w, h = im.size
# Notice the original image had a light border: let's crop 7% on left and right
cropped_im = im.crop((int(w * 0.08), 0, int(w * 0.92), h))
cropped_im.save("assets/images/cards/servicio_construccion_ejecucion.png")

# Also let's prepare a hero background image from the PDF
# Page 1 or Page 5 interior or Page 2
hero_bg = Image.open("assets/images/services/interiorismo_remodelacion_p5_168_1024x1024.png")
hero_bg.save("assets/images/hero_architecture_bg.png")

print("Image cropping perfected.")
