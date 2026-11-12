export function htmlEncabezadoLista() {
  return `
    <h1>Mascotas perdidas y encontradas</h1>
    <p class="subtitulo">Mira las publicaciones de Cochabamba sin crear una cuenta.</p>`;
}

export function htmlFiltros() {
  return `
    <label for="buscar-mascotas">Buscar por nombre</label>
    <input id="buscar-mascotas" type="search" placeholder="Ej.: Firulais" disabled />
    <label for="filtro-especie">Especie</label>
    <select id="filtro-especie" disabled><option value="">Todas</option><option value="PERRO">Perro</option><option value="GATO">Gato</option><option value="OTRO">Otro</option></select>
    <label for="filtro-raza">Raza</label>
    <select id="filtro-raza" disabled><option value="">Todas</option></select>
    <label for="filtro-color">Color</label>
    <select id="filtro-color" disabled><option value="">Todos</option></select>
    <label for="filtro-barrio">Barrio</label>
    <select id="filtro-barrio" disabled><option value="">Todos</option></select>`;
}
