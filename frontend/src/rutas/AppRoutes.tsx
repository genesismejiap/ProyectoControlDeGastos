import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LayoutPublico from '../layouts/LayoutPublico';
import { Archivos, SubirArchivo } from '../paginas/Archivos';
import LayoutAdmin from '../layouts/LayoutAdmin';
import RutaProtegida from './RutaProtegida';
import Login from '../paginas/autenticacion/Login';
import Registro from '../paginas/autenticacion/Registro';
import RecuperarContrasena from '../paginas/autenticacion/RecuperarContrasena';
import VerificarCodigo from '../paginas/autenticacion/VerificarCodigo';
import { RestablecerContrasena } from '../paginas/autenticacion/ReestablecerContrasena';
import AdministrarUsuarios from '../paginas/usuarios/AdministrarUsuarios';


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

    <Route path="/login" element={<Login />} />
<Route path="/registro" element={<Registro />} />
<Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
<Route path="/verificar-codigo" element={<VerificarCodigo />} />
<Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />

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

            <Route path="usuarios" element={<AdministrarUsuarios />} />

            <Route path="archivos" element={<Archivos />} />
            <Route path="archivos/imagenes" element={<SubirArchivo key="imagen" tipo="imagen" />} />
            <Route path="archivos/documentos" element={<SubirArchivo key="documento" tipo="documento" />} />

          </Route>

        </Route>

        {/* Redirección de rutas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;