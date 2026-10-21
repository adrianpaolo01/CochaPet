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

  it("devuelve el detalle de una publicacion activa como JSON", async () => {
    const detalle = { id: 3, estado: "ACTIVA", descripcion: "Collar rojo" };
    const repositorio = { obtenerPorId: jest.fn(async () => detalle) };
    const respuesta = crearRespuesta();

    await crearManejador(repositorio)({ method: "GET", url: "/api/publicaciones/3" }, respuesta);

    expect(repositorio.obtenerPorId).toHaveBeenCalledWith(3);
    expect(respuesta.writeHead).toHaveBeenCalledWith(200, { "Content-Type": "application/json; charset=utf-8" });
    expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual(detalle);
  });

  it.each([undefined, { id: 4, estado: "OCULTA" }])("devuelve 404 si el detalle no esta disponible (%p)", async (publicacion) => {
    const repositorio = { obtenerPorId: async () => publicacion };
    const respuesta = crearRespuesta();

    await crearManejador(repositorio)({ method: "GET", url: "/api/publicaciones/4" }, respuesta);

    expect(respuesta.writeHead.mock.calls[0][0]).toBe(404);
    expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual({ error: "No encontrado" });
  });

  it("devuelve un error 500 al cargar el detalle sin revelar detalles de la base de datos", async () => {
    const repositorio = { obtenerPorId: async () => { throw new Error("detalle privado de conexion"); } };
    const respuesta = crearRespuesta();
    const registro = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      await crearManejador(repositorio)({ method: "GET", url: "/api/publicaciones/3" }, respuesta);

      expect(respuesta.writeHead.mock.calls[0][0]).toBe(500);
      expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual({ error: "No se pudo cargar la publicacion" });
    } finally {
      registro.mockRestore();
    }
  });

  it("devuelve la lista de barrios ordenada como JSON", async () => {
    const barriosRepositorio = { listar: async () => [{ id: 1, nombre: "Sarco" }, { id: 2, nombre: "Aranjuez" }] };
    const respuesta = crearRespuesta();

    await crearManejador({ listar: jest.fn() }, barriosRepositorio)({ method: "GET", url: "/api/barrios" }, respuesta);

    expect(respuesta.writeHead).toHaveBeenCalledWith(200, { "Content-Type": "application/json; charset=utf-8" });
    expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual(["Aranjuez", "Sarco"]);
  });

  it("devuelve un error 500 al cargar los barrios sin revelar detalles de la base de datos", async () => {
    const barriosRepositorio = { listar: async () => { throw new Error("detalle privado de conexion"); } };
    const respuesta = crearRespuesta();
    const registro = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      await crearManejador({ listar: jest.fn() }, barriosRepositorio)({ method: "GET", url: "/api/barrios" }, respuesta);

      expect(respuesta.writeHead.mock.calls[0][0]).toBe(500);
      expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual({ error: "No se pudieron cargar los barrios" });
    } finally {
      registro.mockRestore();
    }
  });
});
