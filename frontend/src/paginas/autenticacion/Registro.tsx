import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import api from '../../servicios/api';

export const Registro: React.FC = () => {

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const manejarRegistro = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setError('');

    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);

    try {

      const respuesta = await api.post('/usuarios/registro', {
        nombre: nombre.trim(),
        correo,
        contrasena
      });

      alert(respuesta.data.mensaje);

      navigate('/login', { replace: true });

    } catch (error) {

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.errores?.[0]?.msg ||
          error.response?.data?.mensaje ||
          'No se pudo registrar el usuario'
        );
      } else {
        setError('Ocurrió un error al registrar el usuario');
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
            Crear cuenta
          </h1>

          <p className="text-text-muted mt-2">
            Completa tus datos para registrarte
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

        <form onSubmit={manejarRegistro} className="space-y-5">

          <div>

            <label htmlFor="nombre" className="block text-navy font-medium mb-2">
              Nombre completo
            </label>

            <div className="relative">

              <User
                size={20}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
                autoComplete="name"
                maxLength={100}
                required
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />

            </div>

          </div>

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

            <label htmlFor="confirmarContrasena" className="block text-navy font-medium mb-2">
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
                placeholder="Repite tu contraseña"
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
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>

        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">

          <p className="text-text-muted text-sm">

            ¿Ya tienes una cuenta?{' '}

            <Link
              to="/login"
              className="text-teal font-semibold hover:underline"
            >
              Iniciar sesión
            </Link>

          </p>

        </div>

      </div>

    </section>

  );
};

export default Registro;