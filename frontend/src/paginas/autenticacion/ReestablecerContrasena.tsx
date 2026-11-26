import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CircleCheck } from 'lucide-react';
import axios from 'axios';
import api from '../../servicios/api';

export const RestablecerContrasena: React.FC = () => {

  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const location = useLocation();

  const token = location.state?.token;

  const manejarRestablecimiento = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();
    setError('');

    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (new TextEncoder().encode(contrasena).length > 72) {
      setError('La contraseña supera la longitud permitida');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);

    try {

      const respuesta = await api.post(
        '/usuarios/restablecer-contrasena',
        {
          token,
          contrasena
        }
      );

      setMensaje(respuesta.data.mensaje);
      setContrasena('');
      setConfirmarContrasena('');

    } catch (error) {

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.mensaje ||
          'No se pudo restablecer la contraseña'
        );
      } else {
        setError('Ocurrió un error inesperado');
      }

    } finally {
      setCargando(false);
    }
  };

  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    return <Navigate to="/recuperar-contrasena" replace />;
  }

  return (

    <section className="min-h-screen bg-cream flex items-center justify-center pt-32 pb-16 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {mensaje ? (

          <div className="space-y-6">

            <div role="status" className="text-center">

              <CircleCheck
                size={64}
                className="mx-auto text-teal mb-4"
              />

              <h1 className="text-3xl font-bold text-navy">
                ¡Contraseña restablecida!
              </h1>

              <p className="text-text-muted mt-3">
                Tu contraseña se ha actualizado correctamente.
              </p>

            </div>

            <Link
              to="/login"
              replace
              className="block w-full bg-teal hover:bg-teal-dark text-white font-semibold py-3 rounded-lg text-center transition-colors"
            >
              Iniciar sesión
            </Link>

          </div>

        ) : (

          <>

            <div className="text-center mb-8">

              <h1 className="text-3xl font-bold text-navy">
                Restablecer contraseña
              </h1>

              <p className="text-text-muted mt-2">
                Ingresa una nueva contraseña para tu cuenta.
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

            <form
              onSubmit={manejarRestablecimiento}
              className="space-y-5"
            >

              <div>

                <label
                  htmlFor="contrasena"
                  className="block text-navy font-medium mb-2"
                >
                  Nueva contraseña
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
                    placeholder="Ingresa tu nueva contraseña"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
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

                <p className="text-xs text-text-muted mt-1">
                  Mínimo 8 caracteres.
                </p>

              </div>

              <div>

                <label
                  htmlFor="confirmarContrasena"
                  className="block text-navy font-medium mb-2"
                >
                  Confirmar contraseña
                </label>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    id="confirmarContrasena"
                    type={mostrarContrasena ? 'text' : 'password'}
                    value={confirmarContrasena}
                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                    placeholder="Repite tu nueva contraseña"
                    autoComplete="new-password"
                    maxLength={72}
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
                {cargando ? 'Guardando...' : 'Cambiar contraseña'}
              </button>

              <div className="pt-5 border-t border-gray-200 text-center">

                <Link
                  to="/recuperar-contrasena"
                  className="text-teal font-semibold hover:underline text-sm"
                >
                  Solicitar otro código
                </Link>

              </div>

            </form>

          </>

        )}

      </div>

    </section>

  );
};

export default RestablecerContrasena;