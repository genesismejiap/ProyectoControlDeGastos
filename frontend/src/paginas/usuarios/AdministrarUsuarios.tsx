import React, { useEffect, useState } from 'react';
import {
  Pencil,
  Trash2,
  Users,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import api from '../../servicios/api';
import { useAuth } from '../../contextos/AuthContext';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export const AdministrarUsuarios: React.FC = () => {

  const { usuario } = useAuth();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [usuarioEliminar, setUsuarioEliminar] = useState<Usuario | null>(null);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('usuario');

  const obtenerError = (error: unknown, mensaje: string) => {

    if (axios.isAxiosError(error)) {
      return error.response?.data?.errores?.[0]?.msg ||
        error.response?.data?.mensaje ||
        mensaje;
    }

    return mensaje;
  };

  const consultarUsuarios = async () => {

    setCargando(true);

    try {

      const respuesta = await api.get('/usuarios', {
        params: {
          pagina,
          limite: 10
        }
      });

      setUsuarios(respuesta.data.usuarios);
      setTotal(respuesta.data.total);
      setTotalPaginas(
        Math.max(1, respuesta.data.total_paginas)
      );

    } catch (error) {

      setError(
        obtenerError(error, 'No se pudieron consultar los usuarios')
      );

    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    consultarUsuarios();
  }, [pagina]);

  const abrirEdicion = (datos: Usuario) => {

    setUsuarioEditar(datos);
    setNombre(datos.nombre);
    setCorreo(datos.correo);
    setRol(datos.rol);
    setError('');
    setMensaje('');
  };

  const actualizarUsuario = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (!usuarioEditar) return;

    setGuardando(true);
    setError('');

    try {

      const datos = {
        nombre: nombre.trim(),
        correo: correo.trim(),
        ...(usuarioEditar.id !== usuario?.id ? { rol } : {})
      };

      const respuesta = await api.put(
        `/usuarios/${usuarioEditar.id}`,
        datos
      );

      setMensaje(respuesta.data.mensaje);
      setUsuarioEditar(null);

      await consultarUsuarios();

    } catch (error) {

      setError(
        obtenerError(error, 'No se pudo actualizar el usuario')
      );

    } finally {
      setGuardando(false);
    }
  };

  const eliminarUsuario = async () => {

    if (!usuarioEliminar) return;

    setGuardando(true);
    setError('');

    try {

      const respuesta = await api.delete(
        `/usuarios/${usuarioEliminar.id}`
      );

      setMensaje(respuesta.data.mensaje);
      setUsuarioEliminar(null);

      if (usuarios.length === 1 && pagina > 1) {
        setPagina(pagina - 1);
      } else {
        await consultarUsuarios();
      }

    } catch (error) {

      setError(
        obtenerError(error, 'No se pudo eliminar el usuario')
      );

    } finally {
      setGuardando(false);
    }
  };

  return (

    <section className="space-y-6">

      {/* Encabezado */}

      <div>

        <h1 className="text-3xl font-bold text-navy">
          Gestión de usuarios
        </h1>

        <p className="text-text-muted mt-1">
          Administra los usuarios registrados y sus permisos de acceso.
        </p>

      </div>

      {/* Total de usuarios */}

      <div className="bg-white rounded-xl shadow-sm p-5 max-w-xs flex items-center gap-4">

        <div className="bg-teal/10 text-teal p-4 rounded-xl">
          <Users size={28} />
        </div>

        <div>

          <p className="text-text-muted text-sm">
            Usuarios registrados
          </p>

          <h2 className="text-3xl font-bold text-navy">
            {total}
          </h2>

        </div>

      </div>

      {/* Mensajes */}

      {error && !usuarioEditar && !usuarioEliminar && (

        <div
          role="alert"
          className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4"
        >
          {error}
        </div>

      )}

      {mensaje && (

        <div
          role="status"
          className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-4 flex justify-between items-center"
        >

          {mensaje}

          <button
            type="button"
            aria-label="Cerrar mensaje"
            onClick={() => setMensaje('')}
            className="cursor-pointer"
          >
            <X size={18} />
          </button>

        </div>

      )}

      {/* Tabla de usuarios */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="p-5 border-b border-gray-200">

          <h2 className="text-xl font-semibold text-navy">
            Listado de usuarios
          </h2>

        </div>

        {cargando ? (

          <p className="p-8 text-center text-text-muted">
            Cargando usuarios...
          </p>

        ) : usuarios.length === 0 ? (

          <p className="p-8 text-center text-text-muted">
            No hay usuarios registrados.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-navy text-white">

                <tr>

                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Nombre</th>
                  <th className="px-5 py-4">Correo electrónico</th>
                  <th className="px-5 py-4">Rol</th>
                  <th className="px-5 py-4 text-center">Acciones</th>

                </tr>

              </thead>

              <tbody>

                {usuarios.map((datos) => (

                  <tr
                    key={datos.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >

                    <td className="px-5 py-4">
                      {datos.id}
                    </td>

                    <td className="px-5 py-4 font-medium text-navy">

                      {datos.nombre}

                      {datos.id === usuario?.id && (

                        <span className="text-xs text-text-muted ml-2">
                          (Tú)
                        </span>

                      )}

                    </td>

                    <td className="px-5 py-4 text-text-muted">
                      {datos.correo}
                    </td>

                    <td className="px-5 py-4">

                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        datos.rol === 'administrador'
                          ? 'bg-teal/10 text-teal-dark'
                          : 'bg-gray-100 text-gray-600'
                      }`}>

                        {datos.rol === 'administrador'
                          ? 'Administrador'
                          : 'Usuario'}

                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-center gap-3">

                        <button
                          type="button"
                          title="Editar usuario"
                          aria-label={`Editar ${datos.nombre}`}
                          onClick={() => abrirEdicion(datos)}
                          className="p-2 rounded-lg bg-teal/10 text-teal hover:bg-teal hover:text-white transition-colors cursor-pointer"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          title="Eliminar usuario"
                          aria-label={`Eliminar ${datos.nombre}`}
                          disabled={datos.id === usuario?.id}
                          onClick={() => {
                            setUsuarioEliminar(datos);
                            setError('');
                            setMensaje('');
                          }}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {/* Paginación */}

        <div className="p-4 flex items-center justify-between border-t border-gray-200">

          <p className="text-sm text-text-muted">
            Total: {total} usuarios
          </p>

          <div className="flex items-center gap-3">

            <button
              type="button"
              aria-label="Página anterior"
              disabled={pagina === 1 || cargando}
              onClick={() => setPagina(pagina - 1)}
              className="border border-gray-300 rounded-lg p-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm text-text-muted">
              Página {pagina} de {totalPaginas}
            </span>

            <button
              type="button"
              aria-label="Página siguiente"
              disabled={pagina >= totalPaginas || cargando}
              onClick={() => setPagina(pagina + 1)}
              className="border border-gray-300 rounded-lg p-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* Ventana para editar usuario */}

      {usuarioEditar && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Editar usuario"
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
          >

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-navy">
                Editar usuario
              </h2>

              <button
                type="button"
                aria-label="Cerrar"
                disabled={guardando}
                onClick={() => setUsuarioEditar(null)}
                className="text-gray-500 cursor-pointer"
              >
                <X size={22} />
              </button>

            </div>

            {error && (

              <div role="alert" className="bg-red-50 text-red-700 rounded-lg p-3 mb-4 text-sm">
                {error}
              </div>

            )}

            <form
              onSubmit={actualizarUsuario}
              className="space-y-4"
            >

              <div>

                <label htmlFor="nombre" className="block font-medium text-navy mb-2">
                  Nombre
                </label>

                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  maxLength={100}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-teal"
                />

              </div>

              <div>

                <label htmlFor="correo" className="block font-medium text-navy mb-2">
                  Correo electrónico
                </label>

                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  maxLength={150}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-teal"
                />

              </div>

              <div>

                <label htmlFor="rol" className="block font-medium text-navy mb-2">
                  Rol
                </label>

                <select
                  id="rol"
                  value={rol}
                  disabled={usuarioEditar.id === usuario?.id}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-teal disabled:bg-gray-100"
                >

                  <option value="usuario">
                    Usuario
                  </option>

                  <option value="administrador">
                    Administrador
                  </option>

                </select>

                {usuarioEditar.id === usuario?.id && (

                  <p className="text-xs text-text-muted mt-2">
                    No puedes modificar tu propio rol.
                  </p>

                )}

              </div>

              <div className="flex gap-3 pt-4">

                <button
                  type="button"
                  disabled={guardando}
                  onClick={() => setUsuarioEditar(null)}
                  className="flex-1 border border-gray-300 rounded-lg py-3 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 bg-teal hover:bg-teal-dark text-white rounded-lg py-3 font-semibold cursor-pointer disabled:opacity-50"
                >
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Confirmación para eliminar usuario */}

      {usuarioEliminar && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Eliminar usuario"
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
          >

            <div className="text-center">

              <div className="bg-red-50 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={30} />
              </div>

              <h2 className="text-2xl font-bold text-navy">
                Eliminar usuario
              </h2>

              <p className="text-text-muted mt-3">

                ¿Estás seguro de eliminar a
                {' '}
                <strong>{usuarioEliminar.nombre}</strong>?

              </p>

              <p className="text-sm text-red-600 mt-3">
                También se eliminarán los archivos asociados a este usuario.
                Esta acción no se puede deshacer.
              </p>

            </div>

            {error && (

              <div role="alert" className="bg-red-50 text-red-700 rounded-lg p-3 mt-4 text-sm">
                {error}
              </div>

            )}

            <div className="flex gap-3 mt-6">

              <button
                type="button"
                disabled={guardando}
                onClick={() => setUsuarioEliminar(null)}
                className="flex-1 border border-gray-300 rounded-lg py-3 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={guardando}
                onClick={eliminarUsuario}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-semibold cursor-pointer disabled:opacity-50"
              >
                {guardando ? 'Eliminando...' : 'Eliminar'}
              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  );
};

export default AdministrarUsuarios;