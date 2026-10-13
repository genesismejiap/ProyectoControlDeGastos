from PIL import Image
import pymupdf
import shutil
import os

os.makedirs("assets/images/cards", exist_ok=True)
os.makedirs("assets/images/gallery", exist_ok=True)

# 1. DISEÑO ARQUITECTÓNICO:
# Casa I01 minimalista / moderna (2048x1096 render)
shutil.copy("assets/images/services/diseno_arquitectonico_p28_696_2048x1096.png", "assets/images/cards/servicio_diseno_arquitectonico.png")
shutil.copy("assets/images/services/diseno_arquitectonico_p35_814_865x588.png", "assets/images/gallery/diseno_casa_delta.png")
shutil.copy("assets/images/services/diseno_arquitectonico_p23_576_1500x1000.jpeg", "assets/images/gallery/diseno_vivienda_modular.jpg")

# 2. GESTIÓN DE PROYECTOS:
# Project Executive blueprint / EMSULA management / process
shutil.copy("assets/images/labeled/p9_img6_254_1620x1080.jpeg", "assets/images/cards/servicio_gestion_proyectos.jpg")
shutil.copy("assets/images/services/gestion_proyectos_p38_874_1151x765.png", "assets/images/gallery/gestion_emsula_planos.png")
shutil.copy("assets/images/labeled/p9_img4_252_414x499.png", "assets/images/gallery/gestion_layout_taller.png")

# 3. PLANEACIÓN Y URBANISMO:
# Urbanización Rubra masterplan
shutil.copy("assets/images/services/planeacion_urbanismo_p21_538_2048x1016.png", "assets/images/cards/servicio_planeacion_urbanismo.png")
shutil.copy("assets/images/services/planeacion_urbanismo_p31_746_1800x936.png", "assets/images/gallery/urbanismo_san_jeronimo.png")
shutil.copy("assets/images/services/planeacion_urbanismo_p15_403_2048x792.png", "assets/images/gallery/urbanismo_lapidario.png")

# 4. INTERIORISMO Y REMODELACIÓN:
# The iconic interior from page 5 of Taruma Arquitectos
shutil.copy("assets/images/services/interiorismo_remodelacion_p5_168_1024x1024.png", "assets/images/cards/servicio_interiorismo_remodelacion.png")
shutil.copy("assets/images/services/interiorismo_remodelacion_p29_709_2048x1024.png", "assets/images/gallery/interiorismo_cabanas_rubra.png")
shutil.copy("assets/images/services/interiorismo_remodelacion_p19_476_1844x785.png", "assets/images/gallery/interiorismo_la_pizza_nostra.png")

# 5. CONSULTORÍAS Y ASESORÍAS:
# Fine crop of the topographic and technical field survey from page 9
im9 = Image.open("assets/images/labeled/page_9_highres.png")
W9, H9 = im9.size
# Perfectly framed surveyor
topografia_precise = im9.crop((int(W9 * 0.802), int(H9 * 0.563), int(W9 * 0.943), int(H9 * 0.898)))
topografia_precise.save("assets/images/cards/servicio_consultorias_asesorias.png")

# 6. CONSTRUCCIÓN Y EJECUCIÓN:
# Direct extraction of the scaffolding construction photo p9_img1_249
shutil.copy("assets/images/labeled/p9_img1_249_1310x771.png", "assets/images/cards/servicio_construccion_ejecucion.png")
shutil.copy("assets/images/services/construccion_ejecucion_p25_633_1296x670.png", "assets/images/gallery/construccion_tecnicentro.png")
shutil.copy("assets/images/services/construccion_ejecucion_p27_679_1844x1023.png", "assets/images/gallery/construccion_bodegas_confianza.png")

# Brand assets
shutil.copy("assets/images/brand/taruma-logo.png", "assets/images/taruma_logo.png")

print("All card hero images and gallery images curated successfully!")
