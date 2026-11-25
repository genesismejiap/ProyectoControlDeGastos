import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext';

export const RutaProtegida: React.FC = () => {

  const { usuario, token, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verificando sesión...
      </div>
    );
  }

  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RutaProtegida;