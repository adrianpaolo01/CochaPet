import { crearManejador } from "./aplicacion.js";

function crearRespuesta() {
  return { writeHead: jest.fn(), end: jest.fn() };
}

describe("API compartida entre desarrollo y Vercel", () => {
  it("devuelve las publicaciones activas como JSON incluso con parametros de consulta", async () => {
    const activa = { id: 1, estado: "ACTIVA", fotos: ["https://ejemplo.com/perro.jpg"] };
    const repositorio = { listar: async () => [activa, { id: 2, estado: "OCULTA" }] };
    const respuesta = crearRespuesta();

    await crearManejador(repositorio)({ method: "GET", url: "/api/publicaciones?origen=inicio" }, respuesta);

    expect(respuesta.writeHead).toHaveBeenCalledWith(200, { "Content-Type": "application/json; charset=utf-8" });
    expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual([activa]);
  });

  it("devuelve un error 500 sin revelar detalles de la base de datos", async () => {
    const errorInterno = new Error("detalle privado de conexion");
    const repositorio = { listar: async () => { throw errorInterno; } };
    const respuesta = crearRespuesta();
    const registro = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      await crearManejador(repositorio)({ method: "GET", url: "/api/publicaciones" }, respuesta);

      expect(respuesta.writeHead.mock.calls[0][0]).toBe(500);
      expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual({ error: "No se pudieron cargar las publicaciones" });
    } finally {
      registro.mockRestore();
    }
  });

  it.each([
    ["GET", "/api/desconocida"],
    ["POST", "/api/publicaciones"],
  ])("rechaza %s %s sin consultar la base", async (method, url) => {
    const repositorio = { listar: jest.fn() };
    const respuesta = crearRespuesta();

    await crearManejador(repositorio)({ method, url }, respuesta);

    expect(respuesta.writeHead.mock.calls[0][0]).toBe(404);
    expect(repositorio.listar).not.toHaveBeenCalled();
  });
});
