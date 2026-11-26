import { rateLimit } from "express-rate-limit";

export const limitarRecuperacion = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 3,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    message: {
        mensaje: "Demasiadas solicitudes de recuperación. Intenta nuevamente en 15 minutos."
    }
});

export const limitarVerificacion = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 10,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    message: {
        mensaje: "Demasiados intentos de verificación. Intenta nuevamente en 15 minutos."
    }
});