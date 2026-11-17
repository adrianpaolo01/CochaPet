import { crearManejador, manejarErrores } from "./aplicacion.js";

function crearRespuesta() {
  return { writeHead: jest.fn(), end: jest.fn() };
}

describe("API compartida entre desarrollo y Vercel", () => {
  beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it("manejarErrores ejecuta la accion cuando no falla", async () => {
    const accion = jest.fn(async () => {});
    await manejarErrores(crearRespuesta(), "Fallo", accion);
    expect(accion).toHaveBeenCalled();
  });

  it("manejarErrores responde 500 con el mensaje si la accion falla", async () => {
    const respuesta = crearRespuesta();
    await manejarErrores(respuesta, "Fallo", async () => { throw new Error("privado"); });
    expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual({ error: "Fallo" });
  });

  it("manejarErrores registra el error en la consola", async () => {
    const error = new Error("privado");
    await manejarErrores(crearRespuesta(), "Fallo", async () => { throw error; });
    expect(console.error).toHaveBeenCalledWith(error);
  });

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

    await crearManejador(repositorio)({ method: "GET", url: "/api/publicaciones" }, respuesta);

    expect(respuesta.writeHead.mock.calls[0][0]).toBe(500);
    expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual({ error: "No se pudieron cargar las publicaciones" });
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

    await crearManejador(repositorio)({ method: "GET", url: "/api/publicaciones/3" }, respuesta);

    expect(respuesta.writeHead.mock.calls[0][0]).toBe(500);
    expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual({ error: "No se pudo cargar la publicacion" });
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

    await crearManejador({ listar: jest.fn() }, barriosRepositorio)({ method: "GET", url: "/api/barrios" }, respuesta);

    expect(respuesta.writeHead.mock.calls[0][0]).toBe(500);
    expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual({ error: "No se pudieron cargar los barrios" });
  });
});
