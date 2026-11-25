import React from 'react';
import { Outlet } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';
import MenuLateral from '../componentes/MenuLateral';
import { useAuth } from '../contextos/AuthContext';

export const LayoutAdmin: React.FC = () => {

  const { usuario } = useAuth();

  return (
    <div className="flex min-h-screen bg-cream">

      <MenuLateral />

      <div className="flex-1 min-w-0 flex flex-col">

        <header className="bg-white border-b border-gray-200
          px-8 py-5 flex items-center justify-between">

          <h1 className="text-lg font-bold text-navy">
            Panel administrativo
          </h1>

          <div className="flex items-center gap-3 text-navy">

            <CircleUserRound className="w-7 h-7 text-teal" />

            <div>
              <p className="text-sm font-medium">
                {usuario?.nombre}
              </p>

              <p className="text-xs text-gray-500">
                {usuario?.rol}
              </p>
            </div>

          </div>

        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default LayoutAdmin;