import { DraftingCompass } from 'lucide-react';

const servicios = [
  {
    nombre: 'Diseño arquitectónico',
    descripcion: 'Damos forma a la idea del proyecto con propuestas de distribución, fachadas y planos que responden al terreno y a la manera de habitarlo.',
    imagen: 'proyecto-1.jpg',
    alt: 'Fachada de dos niveles con ventanales y estructura visible',
  },
  {
    nombre: 'Planeación y urbanismo',
    descripcion: 'Estudiamos cómo se relacionan edificios, recorridos y áreas verdes para ordenar el espacio y conectarlo con su entorno.',
    imagen: 'complejo-habitacional-lipidario.png',
    alt: 'Vista aérea de un conjunto habitacional con jardines y vías de acceso',
  },
  {
    nombre: 'Interiorismo y remodelación',
    descripcion: 'Replanteamos la distribución, la iluminación y los acabados para adaptar los espacios existentes a nuevos usos.',
    imagen: 'proyecto-2.jpg',
    alt: 'Interior luminoso con cocina abierta, comedor y sala',
  },
  {
    nombre: 'Construcción y ejecución',
    descripcion: 'Llevamos los planos a la obra mediante la coordinación de materiales, mano de obra y etapas de construcción.',
    imagen: 'proyecto-3.jpg',
    alt: 'Edificio con estructura, cubierta y acceso vehicular',
  },
  {
    nombre: 'Gestión de proyectos',
    descripcion: 'Organizamos actividades, tiempos y recursos para que propietarios, diseñadores y equipos de obra trabajen con un plan común.',
    imagen: 'complejo-turistico-colonial.png',
    alt: 'Vista general de un complejo con varias edificaciones',
  },
  {
    nombre: 'Consultorías y asesorías',
    descripcion: 'Revisamos ideas, planos y alternativas técnicas para orientar decisiones antes de diseñar, construir o remodelar.',
  },
];

export default function Servicios() {
  return (
    <section className="bg-cream pb-20 pt-32 text-navy">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h1 className="mb-10 text-4xl font-bold tracking-tight sm:text-5xl">Nuestros servicios</h1>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map(({ nombre, descripcion, imagen, alt }) => (
            <li key={nombre} className="overflow-hidden rounded-lg border border-navy/10 bg-white">
              {imagen ? (
                <img className="aspect-[16/9] w-full object-cover" src={'/img/' + imagen} alt={alt} />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-navy text-seafoam"
                  style={{ backgroundImage: 'linear-gradient(#a8dadc16 1px,transparent 1px),linear-gradient(90deg,#a8dadc16 1px,transparent 1px)', backgroundSize: '24px 24px' }}>
                  <DraftingCompass size={92} strokeWidth={1.2} aria-hidden="true" />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold">{nombre}</h2>
                <p className="mt-3 leading-relaxed text-text-muted">{descripcion}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
