# CochaPet

Plataforma web para reportar y encontrar mascotas perdidas en Cochabamba. Cualquier persona puede ver y buscar mascotas sin crear una cuenta; para publicar, chatear o promocionar una publicación se necesita una cuenta.

Proyecto de Ingeniería de Software (UCB), desarrollado con Scrum y TDD por Mateo, Bernardo, Paolo y Carlos. Parte de la plantilla [parcel-jest-base](https://github.com/israelantezana/parcel-jest-base) de la materia.

## Stack

El proyecto **no usa frameworks**: HTML, CSS y JavaScript escritos a mano.

| Parte | Tecnología |
|---|---|
| Frontend | HTML, CSS propio y JavaScript vanilla, servido con Parcel |
| Backend | Node.js con el módulo `node:http` (sin Express) |
| Base de datos | PostgreSQL en [Neon](https://neon.tech) |
| Acceso a datos | Driver `pg` con SQL escrito a mano (sin ORM) |
| Contraseñas | `scrypt` de `node:crypto` |
| Pruebas | Jest |
| CI | GitHub Actions |

## Requisitos

- Node.js 20.6 o superior (para `node --env-file`).
- Un archivo `.env` con la cadena de conexión de Neon (ver abajo).

## Puesta en marcha

1. Instalar las dependencias:

   ```
   npm install
   ```

2. Crear un archivo `.env` en la raíz del proyecto con una sola línea:

   ```
   DATABASE_URL=postgresql://usuario:contraseña@ep-xxxx.neon.tech/neondb?sslmode=verify-full
   ```

   La cadena la comparte el equipo por un medio privado. **El archivo `.env` nunca se sube al repositorio** (está en `.gitignore`).

3. Levantar la aplicación en dos terminales:

   ```
   # Terminal 1: servidor de la API (puerto 3000)
   node --env-file=.env servidor/servidor.js



   # Terminal 2: página web (puerto 1234)
   npm start
   ```

4. Abrir http://localhost:1234. Parcel redirige las peticiones `/api` al servidor (configurado en `.proxyrc`).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm start` | Levanta la página en http://localhost:1234 |
| `npm test` | Ejecuta las pruebas una vez y registra el resultado (rojo o verde) en `script/tdd_log.json` para la gráfica de TDD |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run db:esquema` | Crea las tablas en la base. **Ya está ejecutado**; si se vuelve a correr, falla sin tocar datos |
| `npm run db:seed` | **Borra todos los datos** y vuelve a cargar los datos de ejemplo. La base es compartida: avisar al equipo antes de usarlo |

## Despliegue en Vercel

La página se compila con Parcel a `dist/`. La ruta `/api/publicaciones` se
ejecuta como una función de Node.js (`api/publicaciones.js`) y consulta Neon.
El servidor local y Vercel comparten el manejador de `servidor/aplicacion.js`.
No se necesita agregar un framework.

1. Subir los cambios de despliegue a la rama que se va a importar. Vercel
   recibe los archivos de GitHub, no los cambios pendientes de tu computadora.
2. En Vercel, seleccionar **Add New → Project** e importar `CochaPet`.
   Si GitHub solicita permisos, limitar la instalación a ese repositorio.
3. Seleccionar **Framework Preset: Other** y **Root Directory: ./**.
   `vercel.json` define la instalación, el build (`npm run build`), la salida
   (`dist`) y la región de la función (`gru1`, São Paulo).
4. En **Environment Variables**, agregar `DATABASE_URL` con la conexión de
   Neon recibida por un medio privado. Habilitarla en Production y, si las
   previews deben consultar la misma base compartida, también en Preview.
   Se puede agregar `HUSKY=0`; el comando de instalación ya lo establece y
   evita descargar el binario de Cypress durante el despliegue.
5. Seleccionar **Deploy**. Usar la dirección que Vercel asigne: el nombre
   `cochapet.vercel.app` puede pertenecer a otro proyecto.
6. Comprobar `/api/publicaciones`: debe responder HTTP 200 con un arreglo
   JSON. Abrir el inicio y verificar tarjetas, estilos y fotografías.
   Ante un error 500, revisar **Logs** y la variable `DATABASE_URL`.
   Después de cambiar variables de entorno, crear un nuevo despliegue.

No ejecutar `db:seed` durante la instalación o el build: borra los datos de
la base compartida. Las fotos se cargan desde las URL guardadas en la tabla
`foto`; el seed del repositorio utiliza placeholders y el despliegue no
reemplaza esas imágenes automáticamente.

El archivo `.env` se usa solo en desarrollo. `.gitignore` y `.vercelignore`
evitan subirlo. `.env.example` documenta el formato sin credenciales reales.

## Base de datos

- `db/schema.sql`: tablas `usuario`, `barrio`, `publicacion`, `foto`, `plan`, `promocion`, `conversacion`, `mensaje`, `aviso` y `sesion`.
- `db/seed.js`: datos de ejemplo con 12 barrios, 9 publicaciones (perros, gatos y otros; perdidas y encontradas), fotos, 3 planes de promoción y una promoción En curso.

Usuarios de prueba (**solo para desarrollo**):

| Correo | Contraseña | Rol |
|---|---|---|
| `prueba@cochapet.bo` | `prueba123` | Usuario |
| `ana@cochapet.bo` | `ana12345` | Usuario |
| `admin@cochapet.bo` | `admin123` | Administrador |

## Estructura

```
db/                 Esquema SQL, conexión y seed
servidor/           API con node:http
  servidor.js       Rutas (GET /api/publicaciones)
  *Servicio.js      Reglas de negocio, probadas con un repositorio en memoria
  *Repositorio.js   Consultas SQL a Neon
src/                Frontend
  publicaciones.js  Lógica pura (sin DOM), con sus pruebas
  presenter.js      Conecta la lógica con la página
  estilos.css       Estilos
index.html          Página de inicio
script/             Registro de TDD de la plantilla (no modificar)
```

## Forma de trabajo

Cada historia de usuario se desarrolla con TDD, en ciclos pequeños:

1. **Rojo:** escribir una prueba y verla fallar con `npm test`.
2. **Espera de 5 minutos** antes de implementar.
3. **Verde:** escribir el código mínimo para que pase.
4. **Refactor:** mejorar el código sin romper las pruebas.
5. **Un commit por ciclo**, de una línea: `feat(HU13): mostrar primero las publicaciones destacadas`.
6. **Push después de cada commit**, para que GitHub Actions corra una vez por ciclo.

Reglas:

- Cada historia en su propia rama (`HU13`), creada desde `main`.
- Antes del primer ciclo se abre un **pull request en borrador** hacia `main`: GitHub Actions solo corre en pull requests hacia `main`, no en push a otras ramas.
- Ningún pull request entra a `main` sin CI en verde y sin la aprobación de otro integrante.
- Se fusiona con **"Create a merge commit"**, nunca con "Squash and merge": así cada ciclo queda visible en la gráfica de TDD.
- Commits en español con el formato `tipo(HUxx): descripción` (`feat`, `fix`, `style`, `refactor`, `test`, `docs`, `chore`). El scope va sin guiones.
- No usar `--no-verify` ni saltar los hooks de husky: el hook `post-commit` registra cada commit para la gráfica de TDD.
