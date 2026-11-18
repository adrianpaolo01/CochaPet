export function htmlEncabezadoLista() {
  return `
    <h1>Mascotas perdidas y encontradas</h1>
    <p class="subtitulo">Mira las publicaciones de Cochabamba sin crear una cuenta.</p>
    <nav class="acciones-reporte">
      <a id="reportar-perdida" class="boton boton-grande" href="#/reportar/perdida">Perdí mi mascota</a>
      <a id="reportar-encontrada" class="boton boton-grande" href="#/reportar/encontrada">Encontré una mascota</a>
    </nav>`;
}

export function htmlFiltros() {
  return `
    <label class="etiqueta-filtro" for="buscar-mascotas">Buscar mascotas</label>
    <input id="buscar-mascotas" class="campo-filtro" type="search" placeholder="Ej.: Firulais, siamés, collar azul" disabled />
    <label class="etiqueta-filtro" for="filtro-especie">Especie</label>
    <select id="filtro-especie" class="campo-filtro" disabled><option value="">Todas</option><option value="PERRO">Perro</option><option value="GATO">Gato</option><option value="OTRO">Otro</option></select>
    <label class="etiqueta-filtro" for="filtro-raza">Raza</label>
    <select id="filtro-raza" class="campo-filtro" disabled><option value="">Todas</option></select>
    <label class="etiqueta-filtro" for="filtro-color">Color</label>
    <select id="filtro-color" class="campo-filtro" disabled><option value="">Todos</option></select>
    <label class="etiqueta-filtro" for="filtro-barrio">Barrio</label>
    <select id="filtro-barrio" class="campo-filtro" disabled><option value="">Todos</option></select>`;
}

export function htmlVistaLista() {
  return `${htmlEncabezadoLista()}${htmlFiltros()}
    <p id="mensaje-inicio" class="mensaje-vacio" hidden></p>
    <div id="lista-publicaciones" class="grilla"></div>`;
}

export function htmlTarjeta() {
  return `
    <article class="tarjeta">
      <img class="tarjeta-foto" alt="" loading="lazy" />
      <div class="tarjeta-cuerpo">
        <span class="badge"></span>
        <span class="badge badge-destacada" hidden>Destacada</span>
        <h3 class="tarjeta-titulo"></h3>
        <p class="tarjeta-datos"></p>
        <a class="tarjeta-enlace">Ver detalle</a>
      </div>
    </article>`;
}
