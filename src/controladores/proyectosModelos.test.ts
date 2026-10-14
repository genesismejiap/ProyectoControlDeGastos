import test from "node:test";
import assert from "node:assert/strict";

import { actualizarProyecto } from "./proyectosModelos.js";
import { db } from "../configuraciones/db.js";

test("actualizarProyecto devuelve 200 cuando actualiza un proyecto existente", async () => {
  let response: { statusCode: number; payload: unknown } | null = null;

  const originalExecute = db.execute.bind(db);
  (db as any).execute = async (_query: string, values: unknown[]) => {
    assert.equal(values[6], 1);
    return [{ affectedRows: 1 }] as any;
  };

  try {
    const req = {
      params: { id: "1" },
      body: {
        nombre: "Proyecto actualizado",
        descripcion: "Nueva descripción",
        ubicacion: "San Pedro",
        presupuesto: 5000,
        fecha_inicio: "2026-01-01",
        fecha_fin: "2026-12-31"
      }
    } as any;

    const res = {
      status(code: number) {
        return {
          json(payload: unknown) {
            response = { statusCode: code, payload };
            return payload;
          }
        };
      }
    } as any;

    await actualizarProyecto(req, res);

    assert.ok(response);
    if (!response) {
      throw new Error("La respuesta esperada no fue generada");
    }

    const respuesta = response as { statusCode: number; payload: unknown };

    assert.equal(respuesta.statusCode, 200);
    assert.deepEqual(respuesta.payload, {
      mensaje: "Proyecto actualizado correctamente",
      id: 1
    });
  } finally {
    (db as any).execute = originalExecute;
  }
});
