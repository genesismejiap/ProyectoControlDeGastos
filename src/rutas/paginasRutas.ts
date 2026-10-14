import { Router, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const carpetaPublica = path.join(__dirname, "../../public");

const router = Router();


const paginas: Record<string, string> = {
    "/": "index.html",
    "/servicios": "servicios.html",
    "/nosotros": "nosotros.html",
    "/contacto": "contacto.html"
};

for (const [ruta, archivo] of Object.entries(paginas)) {
    router.get(ruta, (req: Request, res: Response) => {
        res.sendFile(path.join(carpetaPublica, archivo));
    });
}


router.get("/inicio", (req: Request, res: Response) => {
    res.redirect(301, "/");
});

export const paginaNoEncontrada = (req: Request, res: Response) => {
    
    if (req.originalUrl.startsWith("/api")) {
        return res.status(404).json({ mensaje: "Ruta de la API no encontrada" });
    }

    res.status(404).sendFile(path.join(carpetaPublica, "404.html"));
};

export default router;
