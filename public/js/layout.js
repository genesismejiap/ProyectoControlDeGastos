// Carga el Header y el Footer comunes en todas las páginas.
// Cada página solo necesita:
//   <div id="site-header"></div> ... <div id="site-footer"></div>
//   <script src="/js/layout.js"></script>

async function cargarParcial(idContenedor, url) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    contenedor.innerHTML = await respuesta.text();
  } catch (error) {
    console.error(`No se pudo cargar ${url}:`, error);
  }
}

// Marca como activo el enlace de la página actual
function marcarEnlaceActivo() {
  const ruta = window.location.pathname.replace(/\/+$/, "") || "/";

  document.querySelectorAll(".nav-link").forEach((enlace) => {
    const destino = new URL(enlace.getAttribute("href"), window.location.origin)
      .pathname.replace(/\/+$/, "") || "/";
    enlace.classList.toggle("active", destino === ruta);
  });
}

// Header con fondo al hacer scroll
function iniciarScrollNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const actualizar = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", actualizar);
  actualizar();
}

// Menú móvil (hamburguesa)
function iniciarMenuMovil() {
  const boton = document.querySelector(".mobile-toggle");
  const menu = document.querySelector(".nav-links");
  if (!boton || !menu) return;

  boton.addEventListener("click", () => menu.classList.toggle("active"));
  menu.querySelectorAll(".nav-link").forEach((enlace) =>
    enlace.addEventListener("click", () => menu.classList.remove("active"))
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    cargarParcial("site-header", "/partials/header.html"),
    cargarParcial("site-footer", "/partials/footer.html")
  ]);

  marcarEnlaceActivo();
  iniciarScrollNavbar();
  iniciarMenuMovil();

  // Si la URL trae un ancla (ej. /servicios#cotizador), desplazar ahora que todo cargó
  if (window.location.hash) {
    document.querySelector(window.location.hash)?.scrollIntoView();
  }
});
