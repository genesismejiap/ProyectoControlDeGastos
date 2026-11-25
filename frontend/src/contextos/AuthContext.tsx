import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import api from '../servicios/api';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
  iniciarSesion: (
    correo: string,
    contrasena: string
  ) => Promise<Usuario>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const [cargando, setCargando] = useState(true);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    setToken(null);
    setUsuario(null);
  };

  useEffect(() => {

    const verificarSesion = async () => {

      try {
        const tokenGuardado = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');

        if (tokenGuardado && usuarioGuardado) {

          const datos = JSON.parse(usuarioGuardado);

          const respuesta = await api.get(
            `/usuarios/${datos.id}`
          );

          setUsuario(respuesta.data.usuario);
          setToken(tokenGuardado);

        } else {
          cerrarSesion();
        }

      } catch {
        cerrarSesion();

      } finally {
        setCargando(false);
      }

    };

    verificarSesion();

  }, []);

  const iniciarSesion = async (
    correo: string,
    contrasena: string
  ): Promise<Usuario> => {

    const respuesta = await api.post('/usuarios/login', {
      correo,
      contrasena
    });

    const { token, usuario } = respuesta.data;

    localStorage.setItem('token', token);

    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario)
    );

    setToken(token);
    setUsuario(usuario);

    return usuario;
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        cargando,
        iniciarSesion,
        cerrarSesion
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider'
    );
  }

  return contexto;
};