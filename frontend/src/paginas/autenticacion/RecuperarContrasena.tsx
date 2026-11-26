import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import axios from 'axios';
import api from '../../servicios/api';

export const RecuperarContrasena: React.FC = () => {

  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarRecuperacion = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setError('');
    setCargando(true);

    try {

     await api.post('/usuarios/recuperar-contrasena', {
  correo
});

navigate('/verificar-codigo', {
  state: { correo }
});
    } catch (error) {

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.mensaje ||
          'No se pudo procesar la solicitud'
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
            Recuperar contraseña
          </h1>

          <p className="text-text-muted mt-2">
           Ingresa tu correo electrónico para recibir un código de verificación.
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

        <form onSubmit={manejarRecuperacion} className="space-y-5">

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
                maxLength={150}
                required
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? 'Enviando...' : 'Enviar código'}
          </button>

        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">

          <Link
            to="/login"
            className="text-teal font-semibold hover:underline text-sm"
          >
            Volver a iniciar sesión
          </Link>

        </div>

      </div>

    </section>

  );
};

export default RecuperarContrasena;