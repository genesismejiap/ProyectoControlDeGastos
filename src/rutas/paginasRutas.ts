import { Router, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta con las páginas HTML del frontend (src/rutas -> ../../public)
const carpetaPublica = path.join(__dirname, "../../public");

const router = Router();

// Páginas del sitio: ruta -> archivo HTML dentro de /public
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

// /inicio es un alias de la página principal
router.get("/inicio", (req: Request, res: Response) => {
    res.redirect(301, "/");
});

// Middleware para rutas inexistentes (se registra al FINAL en server.ts)
export const paginaNoEncontrada = (req: Request, res: Response) => {
    // Las rutas de la API responden en JSON
    if (req.originalUrl.startsWith("/api")) {
        return res.status(404).json({ mensaje: "Ruta de la API no encontrada" });
    }

    res.status(404).sendFile(path.join(carpetaPublica, "404.html"));
};

export default router;
