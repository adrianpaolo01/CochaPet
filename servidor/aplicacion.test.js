import { Readable } from "node:stream";
import { crearManejador, manejarErrores } from "./aplicacion.js";

function peticionRegistro(datos) {
  return Object.assign(Readable.from([JSON.stringify(datos)]), { method: "POST", url: "/api/usuarios" });
}

const conSesion = { obtenerSesion: async () => ({ expiraEn: new Date(Date.now() + 60000), usuario: { id: 7 } }) };

function peticionReporte(datos) {
  return Object.assign(Readable.from([JSON.stringify(datos)]), { method: "POST", url: "/api/publicaciones", headers: { cookie: "sesion=abc" } });
}

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
  ])("rechaza %s %s sin consultar la base", async (method, url) => {
    const repositorio = { listar: jest.fn() };
    const respuesta = crearRespuesta();

    await crearManejador(repositorio)({ method, url }, respuesta);

    expect(respuesta.writeHead.mock.calls[0][0]).toBe(404);
    expect(repositorio.listar).not.toHaveBeenCalled();
  });

  it("responde 401 al publicar un reporte sin sesion iniciada", async () => {
    const respuesta = crearRespuesta();
    await crearManejador({}, {}, {})({ method: "POST", url: "/api/publicaciones", headers: {} }, respuesta);
    expect(respuesta.writeHead.mock.calls[0][0]).toBe(401);
  });

  it("consulta la sesion de la cookie al publicar un reporte", async () => {
    const autenticacion = { obtenerSesion: jest.fn(async () => undefined) };
    const peticion = { method: "POST", url: "/api/publicaciones", headers: { cookie: "sesion=abc" } };
    await crearManejador({}, {}, autenticacion)(peticion, crearRespuesta());
    expect(autenticacion.obtenerSesion).toHaveBeenCalled();
  });

  it("responde 400 con el error al publicar un reporte invalido con sesion", async () => {
    const peticion = peticionReporte({});
    const respuesta = crearRespuesta();
    await crearManejador({}, {}, conSesion)(peticion, respuesta);
    expect(respuesta.end).toHaveBeenCalledWith(JSON.stringify({ error: "Elige la especie de la mascota" }));
  });

  it("responde 201 con la publicacion creada al reportar una perdida con sesion", async () => {
    const peticion = peticionReporte({ especie: "PERRO", barrio: "Cala Cala", fecha: "2026-11-17", descripcion: "Collar rojo" });
    const respuesta = crearRespuesta();
    await crearManejador({ crear: async () => ({ id: 30 }) }, { listar: async () => [{ nombre: "Cala Cala" }] }, conSesion)(peticion, respuesta);
    expect(respuesta.writeHead).toHaveBeenCalledWith(201, expect.anything());
  });

  it("responde 400 si el reporte no llega como objeto JSON", async () => {
    const respuesta = crearRespuesta();
    await crearManejador({}, {}, conSesion)(peticionReporte("texto"), respuesta);
    expect(respuesta.end).toHaveBeenCalledWith(JSON.stringify({ error: "Los datos enviados no son validos" }));
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

  it("registra un usuario y responde 201 con la cuenta creada", async () => {
    const datos = { nombre: "Ana", correo: "ana@correo.com", telefono: "71234567", clave: "secreta123" };
    const usuariosRepositorio = { buscarUsuarioPorCorreo: async () => undefined, crear: async () => ({ id: 5, ...datos }), crearSesion: async () => {} };
    const respuesta = crearRespuesta();

    await crearManejador({}, {}, usuariosRepositorio)(peticionRegistro(datos), respuesta);

    expect(respuesta.writeHead.mock.calls[0][0]).toBe(201);
    expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual({ id: 5, nombre: "Ana", correo: "ana@correo.com", telefono: "71234567" });
  });

  it("responde 400 con el error si el correo ya esta registrado", async () => {
    const usuariosRepositorio = { buscarUsuarioPorCorreo: async () => ({ id: 1 }), crear: jest.fn() };
    const datos = { nombre: "Ana", correo: "ana@correo.com", telefono: "71234567", clave: "secreta123" };
    const respuesta = crearRespuesta();

    await crearManejador({}, {}, usuariosRepositorio)(peticionRegistro(datos), respuesta);

    expect(respuesta.writeHead.mock.calls[0][0]).toBe(400);
    expect(JSON.parse(respuesta.end.mock.calls[0][0])).toEqual({ error: "Ese correo ya está registrado" });
  });

  it("deja la sesion iniciada con una cookie al registrarse", async () => {
    const datos = { nombre: "Ana", correo: "ana@correo.com", telefono: "71234567", clave: "secreta123" };
    const usuariosRepositorio = { buscarUsuarioPorCorreo: async () => undefined, crear: async () => ({ id: 5 }), crearSesion: jest.fn(async () => {}) };
    const respuesta = crearRespuesta();

    await crearManejador({}, {}, usuariosRepositorio)(peticionRegistro(datos), respuesta);

    expect(usuariosRepositorio.crearSesion).toHaveBeenCalledWith(expect.objectContaining({ usuarioId: 5 }));
    expect(respuesta.writeHead.mock.calls[0][1]["Set-Cookie"]).toMatch(/^sesion=\w+; HttpOnly/);
  });

  it("responde 400 si el registro no trae un JSON valido", async () => {
    const peticion = Object.assign(Readable.from(["no es json"]), { method: "POST", url: "/api/usuarios" });
    const respuesta = crearRespuesta();

    await crearManejador({}, {}, {})(peticion, respuesta);

    expect(respuesta.writeHead.mock.calls[0][0]).toBe(400);
  });
});
