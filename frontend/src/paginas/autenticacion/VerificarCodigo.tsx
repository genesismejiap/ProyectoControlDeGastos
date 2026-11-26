import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../servicios/api';

export const VerificarCodigo: React.FC = () => {

  const [codigo, setCodigo] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const correo = location.state?.correo;

  const manejarCodigo = (valor: string, indice: number) => {

    if (!/^\d?$/.test(valor)) return;

    const nuevoCodigo = [...codigo];

    nuevoCodigo[indice] = valor;

    setCodigo(nuevoCodigo);
    setError('');

    if (valor && indice < 5) {
      inputs.current[indice + 1]?.focus();
    }
  };

  const manejarTecla = (
    e: React.KeyboardEvent<HTMLInputElement>,
    indice: number
  ) => {

    if (e.key === 'Backspace' && !codigo[indice] && indice > 0) {
      inputs.current[indice - 1]?.focus();
    }
  };

  const manejarPegado = (e: React.ClipboardEvent<HTMLInputElement>) => {

    e.preventDefault();

    const valor = e.clipboardData
      .getData('text')
      .trim();

    if (/^\d{6}$/.test(valor)) {
      setCodigo(valor.split(''));
      setError('');
      inputs.current[5]?.focus();
    }
  };

  const manejarVerificacion = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();
    setError('');

    const codigoCompleto = codigo.join('');

    if (codigoCompleto.length !== 6) {
      setError('Debes ingresar los 6 dígitos');
      return;
    }

    setCargando(true);

    try {

      const respuesta = await api.post('/usuarios/verificar-recuperacion', {
        correo,
        codigo: codigoCompleto
      });

      navigate('/restablecer-contrasena', {
        state: {
          token: respuesta.data.token
        },
        replace: true
      });

    } catch (error) {

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.mensaje ||
          'No se pudo verificar el código'
        );
      } else {
        setError('Ocurrió un error inesperado');
      }

    } finally {
      setCargando(false);
    }
  };

  if (!correo) {
    return <Navigate to="/recuperar-contrasena" replace />;
  }

  return (

    <section className="min-h-screen bg-cream flex items-center justify-center pt-32 pb-16 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-navy">
            Verificar código
          </h1>

          <p className="text-text-muted mt-2">
            Si tu correo está registrado, recibirás un código de seis dígitos.
          </p>

          <p className="text-teal font-medium text-sm mt-2 break-all">
            {correo}
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

        <form onSubmit={manejarVerificacion} className="space-y-5">

          <div className="flex justify-center gap-2">

            {codigo.map((digito, indice) => (

              <input
                key={indice}
                ref={(elemento) => {
                  inputs.current[indice] = elemento;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digito}
                aria-label={`Dígito ${indice + 1}`}
                onChange={(e) => manejarCodigo(e.target.value, indice)}
                onKeyDown={(e) => manejarTecla(e, indice)}
                onPaste={manejarPegado}
                required
                className="w-full min-w-0 max-w-12 h-14 text-center text-2xl font-semibold text-navy border border-gray-300 rounded-lg outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />

            ))}

          </div>

          <p className="text-center text-xs text-text-muted">
            El código tiene una validez de 5 minutos.
          </p>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? 'Verificando...' : 'Verificar código'}
          </button>

        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">

          <p className="text-text-muted text-sm mb-2">
            ¿No recibiste el código?
          </p>

          <Link
            to="/recuperar-contrasena"
            className="text-teal font-semibold hover:underline text-sm"
          >
            Solicitar otro código
          </Link>

          <div className="mt-4">

            <Link
              to="/login"
              className="text-text-muted hover:text-teal text-sm"
            >
              Volver a iniciar sesión
            </Link>

          </div>

        </div>

      </div>

    </section>

  );
};

export default VerificarCodigo;