import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LayoutPublico from '../layouts/LayoutPublico';
import LayoutAdmin from '../layouts/LayoutAdmin';
import RutaProtegida from './RutaProtegida';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>

        {/* Rutas públicas */}
        <Route element={<LayoutPublico />}>

          <Route path="/" element={
            <div className="bg-navy min-h-screen flex
              items-center justify-center text-cream text-4xl">
              Taruma Arquitectos
            </div>
          } />

          <Route path="/servicios" element={
            <div className="pt-40 pb-20 text-center text-3xl">
              Nuestros servicios
            </div>
          } />

          <Route path="/proyectos" element={
            <div className="pt-40 pb-20 text-center text-3xl">
              Nuestros proyectos
            </div>
          } />

          <Route path="/nosotros" element={
            <div className="pt-40 pb-20 text-center text-3xl">
              Sobre nosotros
            </div>
          } />

          <Route path="/contacto" element={
            <div className="pt-40 pb-20 text-center text-3xl">
              Contacto
            </div>
          } />

          <Route path="/login" element={
            <div className="pt-40 pb-20 text-center text-3xl">
              Iniciar sesión
            </div>
          } />

        </Route>

        {/* Rutas administrativas protegidas */}
        <Route element={<RutaProtegida />}>

          <Route path="/admin" element={<LayoutAdmin />}>

            <Route index element={
              <h2 className="text-3xl font-bold">
                Panel principal
              </h2>
            } />

            <Route path="proyectos" element={
              <h2 className="text-3xl font-bold">
                Gestión de proyectos
              </h2>
            } />

            <Route path="categorias" element={
              <h2 className="text-3xl font-bold">
                Gestión de categorías
              </h2>
            } />

            <Route path="gastos" element={
              <h2 className="text-3xl font-bold">
                Gestión de gastos
              </h2>
            } />

            <Route path="reportes" element={
              <h2 className="text-3xl font-bold">
                Reportes
              </h2>
            } />

            <Route path="usuarios" element={
              <h2 className="text-3xl font-bold">
                Gestión de usuarios
              </h2>
            } />

            <Route path="archivos" element={
              <h2 className="text-3xl font-bold">
                Gestión de archivos
              </h2>
            } />

          </Route>

        </Route>

        {/* Redirección de rutas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;