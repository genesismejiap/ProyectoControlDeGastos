import pymupdf
import os

doc = pymupdf.open("PORTAFOLIO TARUMA ARQUITECTOS-1.pdf")
os.makedirs("assets/images/services", exist_ok=True)
os.makedirs("assets/images/portfolio", exist_ok=True)
os.makedirs("assets/images/brand", exist_ok=True)

# 1. Brand Logo
# We saw img_p1_23_954x935.png is the logo
# Let's also extract page 1 full cover and high-res logo
page1 = doc[0]
logo_img = doc.extract_image(23)
with open("assets/images/brand/taruma-logo.png", "wb") as f:
    f.write(logo_img["image"])

# Also let's extract the key images for the 6 services:
# Service 1: DISEÑO ARQUITECTÓNICO
# Projects: Casa Delta (p35-36), Casa I01 (p28), Complejo Deportivo (p11-12)
# Let's extract Casa Delta / Casa I01 render
p28 = doc[27] # 0-indexed page 28 Casa I01
p35 = doc[34] # Casa Delta
p13 = doc[12] # Complejo Colonial
p23 = doc[22] # Vivienda Modular

# Service 2: GESTIÓN DE PROYECTOS
# Projects: Plantel Flota EMSULA (p37-38), Project Execution, Process diagrams
p6 = doc[5]
p38 = doc[37]

# Service 3: PLANEACIÓN Y URBANISMO
# Projects: Urbanización Rubra (p21), Urbanización San Jerónimo (p31-34), Lapidario (p15-16)
p21 = doc[20]
p31 = doc[30]
p15 = doc[14]

# Service 4: INTERIORISMO Y REMODELACIÓN
# Projects: Page 5 interior, Page 2 interior, Pizza Nostra (p19), Cabañas The Rubra (p29-30)
p5 = doc[4]
p19 = doc[18]
p29 = doc[28]

# Service 5: CONSULTORÍAS Y ASESORÍAS
# Projects: Page 8 conceptual & optimization, Page 9 topographic surveying, technical advisory
p8 = doc[7]
p9 = doc[8]

# Service 6: CONSTRUCCIÓN Y EJECUCIÓN
# Projects: Page 9 construction site, Tecnicentro Zamora (p25-26), Bodegas La Confianza (p27)
p25 = doc[24]
p27 = doc[26]

# Function to extract images from page with metadata
def extract_from_page(p_num, target_prefix):
    page = doc[p_num - 1]
    imgs = page.get_images(full=True)
    saved = []
    for idx, img in enumerate(imgs):
        xref = img[0]
        base_img = doc.extract_image(xref)
        w, h = base_img["width"], base_img["height"]
        if w > 400 and h > 300:
            filename = f"assets/images/{target_prefix}_p{p_num}_{xref}_{w}x{h}.{base_img['ext']}"
            with open(filename, "wb") as f:
                f.write(base_img["image"])
            saved.append(filename)
    return saved

# Let's extract images for each category
extracted_info = {}
extracted_info["diseno_arquitectonico"] = (
    extract_from_page(28, "services/diseno_arquitectonico") +
    extract_from_page(35, "services/diseno_arquitectonico") +
    extract_from_page(23, "services/diseno_arquitectonico") +
    extract_from_page(11, "services/diseno_arquitectonico")
)

extracted_info["gestion_proyectos"] = (
    extract_from_page(6, "services/gestion_proyectos") +
    extract_from_page(9, "services/gestion_proyectos") +
    extract_from_page(37, "services/gestion_proyectos") +
    extract_from_page(38, "services/gestion_proyectos")
)

extracted_info["planeacion_urbanismo"] = (
    extract_from_page(21, "services/planeacion_urbanismo") +
    extract_from_page(31, "services/planeacion_urbanismo") +
    extract_from_page(15, "services/planeacion_urbanismo") +
    extract_from_page(8, "services/planeacion_urbanismo")
)

extracted_info["interiorismo_remodelacion"] = (
    extract_from_page(5, "services/interiorismo_remodelacion") +
    extract_from_page(2, "services/interiorismo_remodelacion") +
    extract_from_page(19, "services/interiorismo_remodelacion") +
    extract_from_page(29, "services/interiorismo_remodelacion")
)

extracted_info["consultorias_asesorias"] = (
    extract_from_page(8, "services/consultorias_asesorias") +
    extract_from_page(9, "services/consultorias_asesorias") +
    extract_from_page(37, "services/consultorias_asesorias")
)

extracted_info["construccion_ejecucion"] = (
    extract_from_page(9, "services/construccion_ejecucion") +
    extract_from_page(25, "services/construccion_ejecucion") +
    extract_from_page(27, "services/construccion_ejecucion")
)

for k, v in extracted_info.items():
    print(f"{k}: {len(v)} images extracted -> {v[:2]}")
