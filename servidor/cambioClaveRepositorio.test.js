import db from "../db/conexion.js";
import { autenticacionRepositorio } from "./autenticacionRepositorio.js";

jest.mock("../db/conexion.js", () => ({ __esModule: true, default: { query: jest.fn() } }));

describe("Persistencia del cambio de clave", () => {
  it("deberia actualizar solo si coinciden el usuario y su hash anterior", async () => {
    db.query.mockResolvedValueOnce({ rowCount: 1 }).mockResolvedValueOnce({ rowCount: 0 });
    expect(await autenticacionRepositorio.actualizarClave(7, "hash-nuevo", "hash-anterior")).toBe(true);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE id = $1 AND clave_hash = $3"), [7, "hash-nuevo", "hash-anterior"]);
    expect(await autenticacionRepositorio.actualizarClave(7, "hash-nuevo", "hash-anterior")).toBe(false);
  });
});
