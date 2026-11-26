import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contextos/AuthContext';

export const Login: React.FC = () => {

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const manejarLogin = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setError('');
    setCargando(true);

    try {

      const usuario = await iniciarSesion(correo, contrasena);

      if (usuario.rol === 'administrador') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (error) {

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.mensaje ||
          'No se pudo iniciar sesión'
        );
      } else {
        setError('Ocurrió un error inesperado');
      }

    } finally {
      setCargando(false);
    }

  };

  return (

    <section className="min-h-screen bg-cream flex items-center justify-center pt-32 pb-16 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">

         

          <h1 className="text-3xl font-bold text-navy">
            Iniciar sesión
          </h1>

          <p className="text-text-muted mt-2">
            Bienvenido al sistema de Taruma Arquitectos
          </p>

        </div>

        {error && (
          <div
            role="alert"
            className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-5 text-sm"
          >
            {error}
          </div>
        )}

        <form onSubmit={manejarLogin} className="space-y-5">

          <div>

            <label htmlFor="correo" className="block text-navy font-medium mb-2">
              Correo electrónico
            </label>

            <div className="relative">

              <Mail
                size={20}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                required
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />

            </div>

          </div>

          <div>

            <label htmlFor="contrasena" className="block text-navy font-medium mb-2">
              Contraseña
            </label>

            <div className="relative">

              <Lock
                size={20}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                id="contrasena"
                type={mostrarContrasena ? 'text' : 'password'}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-12 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />

              <button
                type="button"
                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
              >

                {mostrarContrasena ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

          </div>

          <div className="text-right">

            <Link
              to="/recuperar-contrasena"
              className="text-sm text-teal hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>

          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">

          <p className="text-text-muted text-sm">

            ¿No tienes una cuenta?{' '}

            <Link
              to="/registro"
              className="text-teal font-semibold hover:underline"
            >
              Regístrate
            </Link>

          </p>

        </div>

      </div>

    </section>

  );

};

export default Login;