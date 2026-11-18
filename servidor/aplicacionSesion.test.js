import { scryptSync } from "node:crypto";
import { Readable } from "node:stream";
import { crearManejador } from "./aplicacion.js";
import { hashDeToken } from "./autenticacionServicio.js";

const SAL = "00ff00ff00ff00ff00ff00ff00ff00ff";
const claveHash = `${SAL}:${scryptSync("prueba123", SAL, 64).toString("hex")}`;
const usuario = { id: 1, nombre: "Usuario de Prueba", correo: "prueba@cochapet.bo", telefono: "70000001", rol: "USUARIO", claveHash };
const usuarioPublico = { id: 1, nombre: "Usuario de Prueba", correo: "prueba@cochapet.bo", telefono: "70000001", rol: "USUARIO" };
const credenciales = { correo: "prueba@cochapet.bo", clave: "prueba123" };

function crearRepositorio(cambios = {}) {
  return { buscarUsuarioPorCorreo: async () => usuario, crearSesion: jest.fn(async () => {}), obtenerSesion: async () => undefined, ...cambios };
}

async function iniciar(cuerpo, repositorio = crearRepositorio(), headers = {}) {
  const texto = typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo);
  const peticion = Object.assign(Readable.from([texto]), { method: "POST", url: "/api/sesion", headers });
  const respuesta = { writeHead: jest.fn(), end: jest.fn() };
  await crearManejador({}, {}, repositorio)(peticion, respuesta);
  return { estado: respuesta.writeHead.mock.calls[0][0], cabeceras: respuesta.writeHead.mock.calls[0][1], cuerpo: JSON.parse(respuesta.end.mock.calls[0][0]) };
}

describe("POST /api/sesion", () => {
  beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it("inicia sesion con datos correctos, guarda la sesion y envia la cookie", async () => {
    const repositorio = crearRepositorio();
    const { estado, cabeceras, cuerpo } = await iniciar(credenciales, repositorio);
    expect(estado).toBe(200);
    expect(cabeceras["Set-Cookie"]).toMatch(/^sesion=[0-9a-f]{64}; HttpOnly; SameSite=Lax; Path=\/; Max-Age=\d+$/);
    expect(cuerpo).toEqual({ usuario: usuarioPublico });
    expect(repositorio.crearSesion).toHaveBeenCalledTimes(1);
  });

  it("marca la cookie como Secure cuando la conexion llega por https", async () => {
    const { cabeceras } = await iniciar(credenciales, crearRepositorio(), { "x-forwarded-proto": "https" });
    expect(cabeceras["Set-Cookie"]).toContain("; Secure");
  });

  it("responde 401 con un mensaje general y sin cookie si los datos son incorrectos", async () => {
    const repositorio = crearRepositorio();
    const { estado, cabeceras, cuerpo } = await iniciar({ ...credenciales, clave: "equivocada" }, repositorio);
    expect(estado).toBe(401);
    expect(cuerpo).toEqual({ error: "Correo o contraseña incorrectos" });
    expect(cabeceras["Set-Cookie"]).toBeUndefined();
    expect(repositorio.crearSesion).not.toHaveBeenCalled();
  });

  it("responde 400 si faltan el correo o la clave", async () => {
    const { estado, cuerpo } = await iniciar({ correo: "", clave: "" });
    expect(estado).toBe(400);
    expect(cuerpo).toEqual({ error: "Ingresa tu correo y tu contraseña" });
  });

  it.each(["{no es json", "null", "5", '"texto"'])("responde 400 si el cuerpo no es un objeto JSON (%p)", async (cuerpoEnviado) => {
    const { estado, cuerpo } = await iniciar(cuerpoEnviado);
    expect(estado).toBe(400);
    expect(cuerpo).toEqual({ error: "Los datos enviados no son validos" });
  });

  it("responde 413 sin consultar la base si el cuerpo es demasiado grande", async () => {
    const repositorio = crearRepositorio({ buscarUsuarioPorCorreo: jest.fn() });
    const { estado, cuerpo } = await iniciar(JSON.stringify({ correo: "a".repeat(20000), clave: "x" }), repositorio);
    expect(estado).toBe(413);
    expect(cuerpo).toEqual({ error: "Los datos enviados son demasiado grandes" });
    expect(repositorio.buscarUsuarioPorCorreo).not.toHaveBeenCalled();
  });

  it("responde 500 sin revelar detalles si falla la base de datos", async () => {
    const repositorio = crearRepositorio({ buscarUsuarioPorCorreo: async () => { throw new Error("detalle privado"); } });
    const { estado, cuerpo } = await iniciar(credenciales, repositorio);
    expect(estado).toBe(500);
    expect(cuerpo).toEqual({ error: "No se pudo iniciar sesion" });
  });
});

async function consultar(headers, repositorio = crearRepositorio()) {
  const respuesta = { writeHead: jest.fn(), end: jest.fn() };
  await crearManejador({}, {}, repositorio)({ method: "GET", url: "/api/sesion", headers }, respuesta);
  return { estado: respuesta.writeHead.mock.calls[0][0], cuerpo: JSON.parse(respuesta.end.mock.calls[0][0]) };
}

describe("GET /api/sesion", () => {
  beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it("devuelve el usuario de la sesion vigente indicada en la cookie", async () => {
    const obtenerSesion = jest.fn(async () => ({ expiraEn: new Date(Date.now() + 60000), usuario: usuarioPublico }));
    const { estado, cuerpo } = await consultar({ cookie: "tema=oscuro; sesion=abc123" }, crearRepositorio({ obtenerSesion }));
    expect(estado).toBe(200);
    expect(cuerpo).toEqual({ usuario: usuarioPublico });
    expect(obtenerSesion).toHaveBeenCalledWith(hashDeToken("abc123"));
  });

  it.each([undefined, { cookie: "tema=oscuro" }])("responde usuario null sin consultar la base si no hay cookie de sesion (%p)", async (headers) => {
    const obtenerSesion = jest.fn();
    const { estado, cuerpo } = await consultar(headers, crearRepositorio({ obtenerSesion }));
    expect(estado).toBe(200);
    expect(cuerpo).toEqual({ usuario: null });
    expect(obtenerSesion).not.toHaveBeenCalled();
  });

  it.each([undefined, { expiraEn: new Date(Date.now() - 1000), usuario: usuarioPublico }])("responde usuario null si la sesion no existe o ya vencio (%p)", async (sesion) => {
    const { estado, cuerpo } = await consultar({ cookie: "sesion=abc123" }, crearRepositorio({ obtenerSesion: async () => sesion }));
    expect(estado).toBe(200);
    expect(cuerpo).toEqual({ usuario: null });
  });

  it("responde 500 sin revelar detalles si falla la base de datos", async () => {
    const obtenerSesion = async () => { throw new Error("detalle privado"); };
    const { estado, cuerpo } = await consultar({ cookie: "sesion=abc123" }, crearRepositorio({ obtenerSesion }));
    expect(estado).toBe(500);
    expect(cuerpo).toEqual({ error: "No se pudo consultar la sesion" });
  });
});
