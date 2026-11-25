import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

export const Encabezado: React.FC = () => {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const manejarScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    manejarScroll();

    window.addEventListener('scroll', manejarScroll);

    return () => {
      window.removeEventListener('scroll', manejarScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50
      text-cream transition-all duration-300
      ${scrolled
        ? 'bg-navy/95 backdrop-blur-md py-3 shadow-md'
        : 'bg-gradient-to-b from-navy/90 to-transparent py-6'
      }`}
    >
      <div className="w-[88%] mx-auto flex flex-col
        lg:flex-row items-center justify-between gap-4">

        {/* Logo y nombre de la empresa */}
        <Link to="/" className="flex items-center gap-3">

          <div className="relative w-11 h-12 overflow-hidden">
            <img
              src="/img/logo.png"
              alt="Logo de Taruma Arquitectos"
              className="absolute top-1/2 left-1/2
              w-[88px] h-[88px] max-w-none
              -translate-x-1/2 -translate-y-1/2"
            />
          </div>

          <span className="uppercase font-bold
            tracking-[0.18em] text-base">
            Taruma{' '}
            <span className="text-seafoam font-normal">
              Arquitectos
            </span>
          </span>

        </Link>

        {/* Menú de navegación */}
        <nav aria-label="Navegación principal">

          <ul className="flex flex-wrap justify-center
            items-center gap-4 lg:gap-7 text-xs
            font-bold uppercase tracking-widest">

            <li>
              <NavLink to="/" end>
                Inicio
              </NavLink>
            </li>

            <li>
              <NavLink to="/servicios">
                Servicios
              </NavLink>
            </li>

            <li>
              <NavLink to="/proyectos">
                Proyectos
              </NavLink>
            </li>

            <li>
              <NavLink to="/nosotros">
                Nosotros
              </NavLink>
            </li>

            <li>
              <NavLink to="/contacto">
                Contacto
              </NavLink>
            </li>

            <li>
              <Link
                to="/login"
                className="bg-teal hover:bg-teal-dark
                px-5 py-3 text-white transition-colors"
              >
                Iniciar sesión
              </Link>
            </li>

          </ul>

        </nav>

      </div>
    </header>
  );
};

export default Encabezado;