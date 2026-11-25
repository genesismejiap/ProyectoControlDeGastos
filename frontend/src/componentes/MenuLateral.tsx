import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  Wallet,
  BarChart3,
  Users,
  Files,
  Globe,
  LogOut
} from 'lucide-react';

import { useAuth } from '../contextos/AuthContext';

export const MenuLateral: React.FC = () => {

  const { cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate('/login', { replace: true });
  };

  const opciones = [
    {
      nombre: 'Panel principal',
      ruta: '/admin',
      icono: LayoutDashboard
    },
    {
      nombre: 'Proyectos',
      ruta: '/admin/proyectos',
      icono: FolderKanban
    },
    {
      nombre: 'Categorías',
      ruta: '/admin/categorias',
      icono: Tags
    },
    {
      nombre: 'Gastos',
      ruta: '/admin/gastos',
      icono: Wallet
    },
    {
      nombre: 'Reportes',
      ruta: '/admin/reportes',
      icono: BarChart3
    },
    {
      nombre: 'Usuarios',
      ruta: '/admin/usuarios',
      icono: Users
    },
    {
      nombre: 'Archivos',
      ruta: '/admin/archivos',
      icono: Files
    }
  ];

  return (
    <aside className="w-64 min-h-screen bg-navy
      text-cream flex flex-col">

      {/* Logo de la empresa */}
      <div className="flex items-center gap-3
        px-5 py-6 border-b border-white/10">

        <div className="relative w-11 h-12 overflow-hidden">
          <img
            src="/img/logo.png"
            alt="Logo Taruma"
            className="absolute top-1/2 left-1/2
            w-[88px] h-[88px] max-w-none
            -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div>
          <h2 className="font-bold tracking-widest">
            TARUMA
          </h2>

          <p className="text-seafoam text-xs tracking-widest">
            ARQUITECTOS
          </p>
        </div>

      </div>

      {/* Menú administrativo */}
      <nav className="flex-1 px-4 py-6">

        <p className="text-seafoam text-xs uppercase
          tracking-widest mb-5 px-3">
          Administración
        </p>

        <ul className="space-y-2">

          {opciones.map((opcion) => (
            <li key={opcion.ruta}>

              <NavLink
                to={opcion.ruta}
                end={opcion.ruta === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3
                  rounded-md text-sm transition-colors
                  ${isActive
                    ? 'bg-teal text-white'
                    : 'hover:bg-navy-soft text-gray-300'
                  }`
                }
              >
                <opcion.icono className="w-5 h-5" />

                <span>{opcion.nombre}</span>

              </NavLink>

            </li>
          ))}

        </ul>

      </nav>

      {/* Regresar al sitio público y cerrar sesión */}
      <div className="border-t border-white/10 p-4 space-y-2">

        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-3
          text-sm text-seafoam hover:bg-navy-soft rounded-md"
        >
          <Globe className="w-5 h-5" />
          Ver sitio web
        </Link>

        <button
          type="button"
          onClick={salir}
          className="flex items-center gap-3 px-3 py-3
          w-full text-sm text-red-400
          hover:bg-navy-soft rounded-md cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>

      </div>

    </aside>
  );
};

export default MenuLateral;