import React from 'react';
import { Outlet } from 'react-router-dom';
import Encabezado from '../componentes/Encabezado';
import Pie from '../componentes/Pie';

export const LayoutPublico: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">

      <Encabezado />

      <main className="flex-1">
        <Outlet />
      </main>

      <Pie />

    </div>
  );
};

export default LayoutPublico;