import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../servicios/api';

type Tipo = 'imagen' | 'documento';
interface Archivo {
  id: number;
  tipo: Tipo;
  nombre_original: string;
  tamano_bytes: number;
  mimetype: string;
}

const formatos = { imagen: '.jpg,.jpeg,.png', documento: '.pdf,.doc,.docx,.xls,.xlsx' };
const boton = 'rounded-lg bg-teal-dark px-4 py-2 text-white font-medium disabled:opacity-50';
const accion = 'text-teal-dark underline disabled:opacity-50';
const inicio = '/admin/archivos';

function mensaje(error: unknown, alternativa: string) {
  return isAxiosError(error) && typeof error.response?.data?.mensaje === 'string'
    ? error.response.data.mensaje : alternativa;
}

export function SubirArchivo({ tipo }: { tipo: Tipo }) {
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const navegar = useNavigate();
  const limite = tipo === 'imagen' ? 5 : 10;
  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const archivo = datos.get(tipo);
    if (!(archivo instanceof File) || !archivo.name) return;
    if (archivo.size > limite * 1024 * 1024) {
      setError(`El archivo supera el límite de ${limite} MB.`);
      return;
    }
    setOcupado(true);
    setError('');
    try {
      await api.post(tipo === 'imagen' ? '/imagenes/subir' : '/documentos/subir', datos);
      navegar(inicio, { replace: true, state: { aviso: 'Archivo subido correctamente.' } });
    } catch (fallo) {
      setError(mensaje(fallo, 'No se pudo subir el archivo.'));
      setOcupado(false);
    }
  }
  return <section className="max-w-xl space-y-5">
    <Link className={accion} to={inicio}>Volver a mis archivos</Link>
    <h2 className="text-3xl font-bold">Subir {tipo}</h2>
    <form onSubmit={enviar} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <label className="block font-medium">Seleccionar {tipo}
        <input className="mt-2 block w-full rounded border p-3" type="file" name={tipo} accept={formatos[tipo]} required disabled={ocupado} />
      </label>
      <p>{formatos[tipo].replaceAll('.', '').toUpperCase().split(',').join(', ')} · Hasta {limite} MB</p>
      {error && <p role="alert">{error}</p>}
      <button className={boton} disabled={ocupado}>{ocupado ? 'Subiendo…' : 'Subir ' + tipo}</button>
    </form>
  </section>;
}

export function Archivos() {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [intento, setIntento] = useState(0);
  const [falloConsulta, setFalloConsulta] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [reemplazo, setReemplazo] = useState<number | null>(null);
  const { state } = useLocation();
  const [aviso, setAviso] = useState<string>(state?.aviso ?? '');
  useEffect(() => {
    const controlador = new AbortController();
    api.get<{ archivos: Archivo[] }>('/archivos', { signal: controlador.signal })
      .then(({ data }) => setArchivos(data.archivos))
      .catch(error => { if (!controlador.signal.aborted) setFalloConsulta(mensaje(error, 'No se pudieron consultar los archivos.')); })
      .finally(() => { if (!controlador.signal.aborted) setCargando(false); });
    return () => controlador.abort();
  }, [intento]);

  async function ejecutar(operacion: () => Promise<void>) {
    setOcupado(true);
    setAviso('');
    try { await operacion(); }
    catch (error) { setAviso(mensaje(error, 'No se pudo completar la operación.')); }
    finally { setOcupado(false); }
  }
  async function descargar(archivo: Archivo) {
    const { data } = await api.get<Blob>(`/archivos/${archivo.id}/descargar`, { responseType: 'blob' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(data);
    enlace.download = archivo.nombre_original;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(enlace.href), 60000);
  }
  async function eliminar(archivo: Archivo) {
    if (!window.confirm(`¿Eliminar «${archivo.nombre_original}» definitivamente?`)) return;
    await api.delete(`/archivos/eliminar/${archivo.id}`);
    setArchivos(lista => lista.filter(item => item.id !== archivo.id));
    setAviso('Archivo eliminado.');
  }
  function reemplazar(evento: FormEvent<HTMLFormElement>, id: number) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const imagen = datos.get('imagen');
    if (imagen instanceof File && imagen.size > 5 * 1024 * 1024) {
      setAviso('La imagen supera el límite de 5 MB.');
      return;
    }
    void ejecutar(async () => {
      const { data } = await api.put<{ imagen: Archivo }>(`/imagenes/${id}`, datos);
      setArchivos(lista => lista.map(item => item.id === id ? data.imagen : item));
      setReemplazo(null);
      setAviso('Imagen reemplazada.');
    });
  }
  return <section className="max-w-5xl space-y-5">
    <h2 className="text-3xl font-bold">Mis archivos</h2>
    <nav className="flex flex-wrap gap-3">
      <Link className={boton} to="imagenes">Subir imagen</Link>
      <Link className={boton} to="documentos">Subir documento</Link>
    </nav>
    <p role="status">{aviso}</p>
    {cargando ? <p>Cargando archivos…</p> : falloConsulta ? <p role="alert">{falloConsulta} <button className={accion} onClick={() => { setFalloConsulta(''); setCargando(true); setIntento(i => i + 1); }}>Reintentar</button></p> :
      archivos.length === 0 ? <p>Aún no tienes archivos registrados.</p> :
      <ul className="divide-y divide-gray-200 rounded-xl bg-white px-5 shadow-sm">{archivos.map(archivo =>
        <li key={archivo.id} className="space-y-2 py-4">
          <h3 className="break-all font-semibold">{archivo.nombre_original}</h3>
          <p className="break-words text-sm text-text-muted">{archivo.tipo === 'imagen' ? 'Imagen' : 'Documento'} · {archivo.mimetype} · {archivo.tamano_bytes.toLocaleString('es')} bytes</p>
          <div className="flex flex-wrap gap-4">
            <button className={accion} disabled={ocupado} onClick={() => ejecutar(() => descargar(archivo))}>Descargar</button>
            {archivo.tipo === 'imagen' && <button className={accion} disabled={ocupado} onClick={() => setReemplazo(archivo.id)}>Reemplazar imagen</button>}
            <button className="text-red-700 underline" disabled={ocupado} onClick={() => ejecutar(() => eliminar(archivo))}>Eliminar</button>
          </div>
          {reemplazo === archivo.id && <form className="flex flex-wrap items-center gap-3" onSubmit={e => reemplazar(e, archivo.id)}>
            <label>Nueva imagen (JPG o PNG, hasta 5 MB)
              <input type="file" className="block max-w-full" name="imagen" accept={formatos.imagen} required disabled={ocupado} />
            </label>
            <button className={boton} disabled={ocupado}>Guardar cambio</button>
            <button type="button" disabled={ocupado} onClick={() => setReemplazo(null)}>Cancelar</button>
          </form>}
        </li>)}</ul>}
  </section>;
}
