import React from 'react';
import { Link } from 'react-router-dom';

export const Pie: React.FC = () => {
  return (
    <footer className="bg-navy-soft text-gray-300 pt-16 pb-8">

      <div className="w-[88%] mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2
          lg:grid-cols-[1.7fr_1fr_1fr_1fr] gap-10">

          {/* Información de la empresa */}
          <div>
            <h2 className="text-cream font-bold uppercase
              tracking-[0.18em] mb-4">

              Taruma{' '}
              <span className="text-seafoam font-normal">
                Arquitectos
              </span>

            </h2>

            <p className="text-sm leading-relaxed max-w-xs">
              Diseño arquitectónico, planeación y
              desarrollo de proyectos integrales en Honduras.
            </p>
          </div>

          {/* Páginas */}
          <div>
            <h3 className="text-seafoam text-xs font-bold
              uppercase tracking-widest mb-5">
              Páginas
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-seafoam">
                  Inicio
                </Link>
              </li>

              <li>
                <Link to="/servicios" className="hover:text-seafoam">
                  Servicios
                </Link>
              </li>

              <li>
                <Link to="/proyectos" className="hover:text-seafoam">
                  Proyectos
                </Link>
              </li>

              <li>
                <Link to="/nosotros" className="hover:text-seafoam">
                  Nosotros
                </Link>
              </li>

              <li>
                <Link to="/contacto" className="hover:text-seafoam">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-seafoam text-xs font-bold
              uppercase tracking-widest mb-5">
              Contacto
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+50432981900">
                  +504 3298-1900
                </a>
              </li>

              <li>
                <a href="mailto:tarumadmn@gmail.com">
                  tarumadmn@gmail.com
                </a>
              </li>

              <li>Tegucigalpa, Honduras</li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-seafoam text-xs font-bold
              uppercase tracking-widest mb-5">
              Síguenos
            </h3>

            <ul className="space-y-2 text-sm">
              <li>Instagram</li>
              <li>Facebook</li>
            </ul>
          </div>

        </div>

        {/* Derechos reservados */}
        <div className="border-t border-white/10 mt-12 pt-6
          flex flex-col md:flex-row justify-between
          gap-3 text-xs">

          <p>
            © {new Date().getFullYear()} Taruma Arquitectos.
            Todos los derechos reservados.
          </p>

          <p>Tegucigalpa, Honduras</p>

        </div>

      </div>

    </footer>
  );
};

export default Pie;