import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import AppRoutes from './rutas/AppRoutes';
import { AuthProvider } from './contextos/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <AuthProvider>
      <AppRoutes />
    </AuthProvider>

  </StrictMode>
);