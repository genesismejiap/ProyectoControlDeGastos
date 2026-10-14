/**
 * TARUMA ARQUITECTOS - LÓGICA DE LA PÁGINA DE SERVICIOS
 * Información fidedigna extraída directamente del Portafolio Taruma Arquitectos.
 */

// Diccionario Completo de los 6 Servicios de Taruma Arquitectura
const SERVICIOS_DATA = {
  "diseno-arquitectonico": {
    id: "diseno-arquitectonico",
    numero: "01",
    titulo: "Diseño Arquitectónico",
    categoria: "diseno",
    categoriaLabel: "Diseño & Planificación",
    imagenPrincipal: "assets/images/cards/servicio_diseno_arquitectonico.png",
    proyectoDestacado: "Propuesta Fachada Casa I01 (2025)",
    descripcionCorta: "Desarrollo de proyectos arquitectónicos integrales con un estilo funcional, contemporáneo y minimalista. Transformamos ideas en espacios de vanguardia garantizando estética, habitabilidad y sostenibilidad.",
    descripcionLarga: "En Taruma Arquitectos concebimos el diseño arquitectónico como un diálogo continuo entre las necesidades del usuario, la morfología del entorno y la eficiencia espacial. Nuestro portafolio abarca desde viviendas unifamiliares de escala personalizada hasta complejos comerciales, deportivos y de uso mixto, aplicando conceptos bioclimáticos, materiales nobles y volumetrías distinguidas.",
    alcance: [
      "Conceptualización arquitectónica y zonificación funcional",
      "Modelado volumétrico y renders 3D fotorrealistas",
      "Planos arquitectónicos de plantas, elevaciones y cortes",
      "Estudio de asoleamiento, ventilación y eficiencia energética",
      "Catálogo de acabados, materiales y especificaciones técnicas"
    ],
    etapas: [
      "1. Etapa Conceptual: Bocetos y diagramas de masa",
      "2. Etapa Desarrollo de Diseño: Renderizado 3D y visualizaciones",
      "3. Etapa Proyecto Ejecutivo: Planos técnicos de edificación"
    ],
    proyectosPortafolio: [
      { nombre: "Propuesta Casa I01 (2025)", img: "assets/images/cards/servicio_diseno_arquitectonico.png" },
      { nombre: "Casa Delta (2025)", img: "assets/images/gallery/diseno_casa_delta.png" },
      { nombre: "Vivienda Modular (2024)", img: "assets/images/gallery/diseno_vivienda_modular.jpg" }
    ]
  },

  "gestion-proyectos": {
    id: "gestion-proyectos",
    numero: "02",
    titulo: "Gestión de Proyectos",
    categoria: "gestion",
    categoriaLabel: "Gestión & Ejecución",
    imagenPrincipal: "assets/images/cards/servicio_gestion_proyectos.jpg",
    proyectoDestacado: "Plantel Flota EMSULA (2025)",
    descripcionCorta: "Coordinación técnica integral que une análisis, diseño y administración. Supervisamos cada fase desde la etapa conceptual hasta la entrega final garantizando cronograma, costos y normativas.",
    descripcionLarga: "Nuestro enfoque de gestión garantiza que la visión proyectada en papel se materialice sin desvíos técnicos ni presupuestarios. Coordinamos equipos multidisciplinarios de ingeniería estructural, electromecánica y sanitaria, gestionamos permisos, elaboramos planos As-Built y realizamos una supervisión continua de los estándares de calidad vigentes.",
    alcance: [
      "Planificación y control de cronogramas y rutas críticas",
      "Elaboración de presupuestos detallados y control de costos",
      "Levantamiento y finalización de planos As-Built",
      "Coordinación de ingenierías electromecánicas y especiales",
      "Aseguramiento de calidad y cumplimiento normativo en obra"
    ],
    etapas: [
      "Supervisión y control técnico integral",
      "Coordinación interinstitucional y permisos",
      "Revisión de avances y liquidación de obra"
    ],
    proyectosPortafolio: [
      { nombre: "Plantel Flota EMSULA (2025)", img: "assets/images/gallery/gestion_emsula_planos.png" },
      { nombre: "Planos Ejecutivos Especiales", img: "assets/images/cards/servicio_gestion_proyectos.jpg" },
      { nombre: "Layouts Operativos", img: "assets/images/gallery/gestion_layout_taller.png" }
    ]
  },

  "planeacion-urbanismo": {
    id: "planeacion-urbanismo",
    numero: "03",
    titulo: "Planeación y Urbanismo",
    categoria: "diseno",
    categoriaLabel: "Diseño & Planificación",
    imagenPrincipal: "assets/images/cards/servicio_planeacion_urbanismo.png",
    proyectoDestacado: "Urbanización Rubra (2023)",
    descripcionCorta: "Planificación territorial y desarrollo de conjuntos habitacionales con altos estándares de calidad de vida. Integración de sectores residenciales, recreativos, educativos y comerciales.",
    descripcionLarga: "Desarrollamos proyectos urbanísticos y complejos habitacionales que fomentan comunidades sostenibles, accesibles y armónicas. Diseñamos masterplans ordenados donde la vialidad fluida, las áreas verdes recreativas, la infraestructura comunitaria y el entorno natural se complementan para crear un impacto positivo en la sociedad.",
    alcance: [
      "Masterplans de urbanizaciones y complejos habitacionales",
      "Zonificación y lotificación residencial y comercial",
      "Diseño de vialidades, accesos y circuitos peatonales",
      "Integración de parques, áreas verdes y zonas de equipamiento social",
      "Estudios de impacto urbano y normativas de desarrollo"
    ],
    etapas: [
      "Análisis territorial y topográfico",
      "Modelación masterplan 3D y trazado urbano",
      "Proyecto ejecutivo de infraestructura urbana"
    ],
    proyectosPortafolio: [
      { nombre: "Urbanización Rubra (2023)", img: "assets/images/cards/servicio_planeacion_urbanismo.png" },
      { nombre: "Urbanización San Jerónimo (2025)", img: "assets/images/gallery/urbanismo_san_jeronimo.png" },
      { nombre: "Complejo Habitacional Lapidario", img: "assets/images/gallery/urbanismo_lapidario.png" }
    ]
  },

  "interiorismo-remodelacion": {
    id: "interiorismo-remodelacion",
    numero: "04",
    titulo: "Interiorismo y Remodelación",
    categoria: "diseno",
    categoriaLabel: "Diseño & Planificación",
    imagenPrincipal: "assets/images/cards/servicio_interiorismo_remodelacion.png",
    proyectoDestacado: "Cabañas The Rubra & La Pizza Nostra",
    descripcionCorta: "Creación de atmósferas acogedoras, funcionales y de alto confort. Transformamos espacios residenciales y comerciales mediante iluminación especializada, mobiliario a medida y texturas.",
    descripcionLarga: "El interiorismo en Taruma Arquitectos parte del bienestar emocional y funcional de las personas. Diseñamos ambientes cálidos que invitan al descanso, al encuentro familiar o a la experiencia memorable de clientes comerciales. Realizamos renovaciones integrales que revitalizan inmuebles existentes sin perder su esencia.",
    alcance: [
      "Diseño de espacios interiores residenciales, gastronómicos y comerciales",
      "Planificación de iluminación cálida y escenográfica",
      "Selección y diseño de mobiliario fijo y carpintería personalizada",
      "Remodelaciones integrales de cocinas, salas y áreas de terraza",
      "Paleta de materiales: maderas nobles, vegetación interior y acabados premium"
    ],
    etapas: [
      "Diagnóstico espacial y necesidades del usuario",
      "Moodboards de texturas, paleta cromática y renders 3D",
      "Ejecución de remodelación y supervisión de acabados"
    ],
    proyectosPortafolio: [
      { nombre: "Residencia Principal Interior", img: "assets/images/cards/servicio_interiorismo_remodelacion.png" },
      { nombre: "Cabañas The Rubra (2025)", img: "assets/images/gallery/interiorismo_cabanas_rubra.png" },
      { nombre: "La Pizza Nostra (2023)", img: "assets/images/gallery/interiorismo_la_pizza_nostra.png" }
    ]
  },

  "consultorias-asesorias": {
    id: "consultorias-asesorias",
    numero: "05",
    titulo: "Consultorías y Asesorías",
    categoria: "gestion",
    categoriaLabel: "Gestión & Ejecución",
    imagenPrincipal: "assets/images/cards/servicio_consultorias_asesorias.png",
    proyectoDestacado: "Levantamientos de Campo & Normativas",
    descripcionCorta: "Acompañamiento técnico calificado para orientar tus inversiones arquitectónicas y constructivas. Levantamiento topográfico de precisión, análisis de viabilidad y peritajes técnicos.",
    descripcionLarga: "Brindamos certidumbre técnica y legal a propietarios, desarrolladores e instituciones antes y durante la ejecución de proyectos. Empleamos instrumental topográfico de precisión (estaciones totales y nivelación), inspeccionamos estructuras existentes, analizamos códigos de zonificación y asesoramos en optimización de recursos y sistemas constructivos.",
    alcance: [
      "Levantamientos topográficos de precisión y altimetría",
      "Estudios de factibilidad técnica y normativa de terrenos",
      "Asesoría en reglamentos y códigos de construcción locales",
      "Diagnósticos de patologías constructivas y recomendaciones",
      "Optimización de costos y selección de sistemas estructurales"
    ],
    etapas: [
      "Inspección en sitio y medición con instrumentos",
      "Procesamiento de datos y modelado de terreno",
      "Entrega de informe técnico pericial y recomendaciones"
    ],
    proyectosPortafolio: [
      { nombre: "Topografía en Terreno", img: "assets/images/cards/servicio_consultorias_asesorias.png" },
      { nombre: "Inspección de Instalaciones", img: "assets/images/gallery/gestion_emsula_planos.png" }
    ]
  },

  "construccion-ejecucion": {
    id: "construccion-ejecucion",
    numero: "06",
    titulo: "Construcción y Ejecución",
    categoria: "gestion",
    categoriaLabel: "Gestión & Ejecución",
    imagenPrincipal: "assets/images/cards/servicio_construccion_ejecucion.png",
    proyectoDestacado: "Tecnicentro Zamora & Bodegas La Confianza",
    descripcionCorta: "Ejecución material de obras civiles, bodegas comerciales e instalaciones especializadas. Rigor estructural, mano de obra calificada y acabados de máxima durabilidad.",
    descripcionLarga: "Materializamos cada proyecto con un compromiso inquebrantable con la solidez constructiva, los tiempos de entrega y la seguridad en obra. Contamos con experiencia en naves industriales, naves comerciales con cubiertas metálicas, obras de mampostería reforzada, concreto armado e instalaciones electromecánicas completas.",
    alcance: [
      "Construcción de obra civil residencial, comercial e industrial",
      "Estructuras metálicas, tijeras y cubiertas de gran luz",
      "Construcción de bodegas, planteles y centros automotrices",
      "Instalaciones eléctricas de potencia, sanitarias y pluviales",
      "Supervisión continua en campo y entrega llave en mano"
    ],
    etapas: [
      "Movimiento de tierras, cimentación y estructura principal",
      "Mampostería, cerramientos e instalaciones técnicas",
      "Acabados finales, pruebas de funcionamiento y entrega"
    ],
    proyectosPortafolio: [
      { nombre: "Obra Civil y Andamiaje", img: "assets/images/cards/servicio_construccion_ejecucion.png" },
      { nombre: "Tecnicentro Zamora (2025)", img: "assets/images/gallery/construccion_tecnicentro.png" },
      { nombre: "Bodegas La Confianza (2025)", img: "assets/images/gallery/construccion_bodegas_confianza.png" }
    ]
  }
};

// Inicialización cuando carga el DOM
document.addEventListener("DOMContentLoaded", () => {
  initFilterTabs();
  initModalListeners();
  initEstimator();
  initContactForm();
});

// (La barra de navegación y el menú móvil ahora se manejan en js/layout.js)

// 3. Filtros Interactivos para las Tarjetas
function initFilterTabs() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const serviceCards = document.querySelectorAll(".service-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-filter");

      serviceCards.forEach(card => {
        const cardCat = card.getAttribute("data-category");
        if (filterVal === "all" || cardCat === filterVal) {
          card.style.display = "flex";
          card.style.animation = "fadeInCard 0.4s ease forwards";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// 4. Modal de Detalles de Servicios
function initModalListeners() {
  const modalBackdrop = document.getElementById("serviceModal");
  const closeBtn = document.querySelector(".modal-close-btn");

  // Botones dentro de las tarjetas
  document.querySelectorAll(".service-detail-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const serviceId = btn.getAttribute("data-service-id");
      openServiceModal(serviceId);
    });
  });

  // Clic en la tarjeta entera también puede abrir el detalle
  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Si no fue el botón, abre el modal
      if (!e.target.closest(".service-btn")) {
        const serviceId = card.getAttribute("data-service-id");
        openServiceModal(serviceId);
      }
    });
  });

  // Cerrar modal
  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener("click", closeServiceModal);
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        closeServiceModal();
      }
    });
  }

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop.classList.contains("active")) {
      closeServiceModal();
    }
  });
}

function openServiceModal(serviceId) {
  const service = SERVICIOS_DATA[serviceId];
  if (!service) return;

  const modal = document.getElementById("serviceModal");
  document.getElementById("modalHeroImg").src = service.imagenPrincipal;
  document.getElementById("modalHeroImg").alt = service.titulo;
  document.getElementById("modalBadge").textContent = `Servicio #${service.numero} • ${service.categoriaLabel}`;
  document.getElementById("modalTitle").textContent = service.titulo;
  document.getElementById("modalDesc").textContent = service.descripcionLarga;

  // Lista de Alcance
  const scopeList = document.getElementById("modalScopeList");
  scopeList.innerHTML = service.alcance.map(item => `<li>${item}</li>`).join("");

  // Lista de Etapas
  const stagesList = document.getElementById("modalStagesList");
  stagesList.innerHTML = service.etapas.map(item => `<li>${item}</li>`).join("");

  // Galería de Proyectos
  const galleryGrid = document.getElementById("modalGalleryGrid");
  galleryGrid.innerHTML = service.proyectosPortafolio.map(p => `
    <div class="modal-gallery-item" title="${p.nombre}">
      <img src="${p.img}" alt="${p.nombre}">
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.7); font-size: 0.72rem; padding: 4px 6px; color: #fff; font-weight: 600;">
        ${p.nombre}
      </div>
    </div>
  `).join("");

  // Botón de Cotizar este servicio desde el modal
  const quoteBtn = document.getElementById("modalQuoteBtn");
  if (quoteBtn) {
    quoteBtn.onclick = () => {
      closeServiceModal();
      selectServiceInEstimator(serviceId);
      const estimatorSec = document.getElementById("cotizador");
      if (estimatorSec) {
        estimatorSec.scrollIntoView({ behavior: "smooth" });
      }
    };
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeServiceModal() {
  const modal = document.getElementById("serviceModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// 5. Cotizador Interactivo
function initEstimator() {
  const checkboxes = document.querySelectorAll(".estimator-checkbox");
  const scaleSelect = document.getElementById("projectScale");
  const estimatorSummary = document.getElementById("estimatorSummary");
  const sendWhatsAppBtn = document.getElementById("sendWhatsAppBtn");

  function updateSummary() {
    const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    const scale = scaleSelect ? scaleSelect.value : "residencial";

    if (selected.length === 0) {
      estimatorSummary.innerHTML = `<em>Selecciona al menos un servicio para visualizar el alcance estimado.</em>`;
      return;
    }

    const serviceNames = selected.map(id => SERVICIOS_DATA[id] ? SERVICIOS_DATA[id].titulo : id);
    
    let scaleLabel = "Residencial";
    if (scale === "comercial") scaleLabel = "Comercial / Negocios";
    if (scale === "industrial") scaleLabel = "Industrial / Bodegas";
    if (scale === "urbanistico") scaleLabel = "Urbanización / Complejo";

    estimatorSummary.innerHTML = `
      <strong>Servicios seleccionados (${selected.length}):</strong><br>
      • ${serviceNames.join("<br>• ")}<br><br>
      <strong>Tipología de Proyecto:</strong> ${scaleLabel}<br>
      <strong>Metodología de Trabajo:</strong> Enfoque integral de 4 etapas (Análisis, Diseño 3D, Proyecto Ejecutivo y Supervisión).
    `;
  }

  checkboxes.forEach(cb => cb.addEventListener("change", updateSummary));
  if (scaleSelect) scaleSelect.addEventListener("change", updateSummary);

  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener("click", () => {
      const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
      if (selected.length === 0) {
        showToast("Por favor selecciona al menos un servicio.");
        return;
      }
      const serviceNames = selected.map(id => SERVICIOS_DATA[id]?.titulo || id).join(", ");
      const scale = scaleSelect ? scaleSelect.options[scaleSelect.selectedIndex].text : "General";
      const notes = document.getElementById("clientNotes")?.value || "";

      const msg = `Hola Taruma Arquitectos, me gustaría cotizar servicios para mi proyecto:\n\n*Servicios de interés:* ${serviceNames}\n*Tipología:* ${scale}\n*Detalles adicionales:* ${notes || "Solicito asesoría y presupuesto."}`;
      
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, "_blank");
      showToast("Abriendo WhatsApp con tu solicitud de cotización...");
    });
  }

  updateSummary();
}

function selectServiceInEstimator(serviceId) {
  const cb = document.querySelector(`.estimator-checkbox[value="${serviceId}"]`);
  if (cb) {
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
  }
}

// 6. Formulario de Contacto Directo
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("¡Gracias por contactar a Taruma Arquitectos! Un especialista se comunicará contigo.");
      form.reset();
    });
  }
}

// 7. Notificación Toast
function showToast(message) {
  let toast = document.querySelector(".toast-notice");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #2DD4BF;">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}
