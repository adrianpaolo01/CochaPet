-- Esquema de CochaPet (traducido del esquema de datos del documento v4).
-- Se ejecuta una sola vez sobre una base vacia: npm run db:esquema
-- Si una tabla o tipo ya existe, falla sin tocar los datos.

BEGIN;

-- Tipos enumerados

CREATE TYPE rol AS ENUM ('USUARIO', 'ADMIN');
CREATE TYPE tipo_reporte AS ENUM ('PERDIDA', 'ENCONTRADA');
CREATE TYPE especie AS ENUM ('PERRO', 'GATO', 'OTRO');
CREATE TYPE estado_publicacion AS ENUM ('ACTIVA', 'VOLVIO_A_CASA', 'OCULTA');
CREATE TYPE estado_promocion AS ENUM ('PENDIENTE_PAGO', 'PAGADA', 'EN_CURSO', 'FINALIZADA');
CREATE TYPE metodo_pago AS ENUM ('QR', 'TARJETA');

-- Tablas

CREATE TABLE usuario (
  id         SERIAL PRIMARY KEY,
  nombre     TEXT        NOT NULL,
  correo     TEXT        NOT NULL UNIQUE,
  telefono   TEXT        NOT NULL,
  clave_hash TEXT        NOT NULL,
  foto_url   TEXT,
  rol        rol         NOT NULL DEFAULT 'USUARIO',
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE barrio (
  id     SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE publicacion (
  id                SERIAL PRIMARY KEY,
  tipo              tipo_reporte       NOT NULL,
  especie           especie            NOT NULL,
  nombre            TEXT,
  raza              TEXT,
  color             TEXT,
  descripcion       TEXT               NOT NULL,
  fecha             TIMESTAMPTZ        NOT NULL,
  barrio_id         INTEGER            NOT NULL REFERENCES barrio (id),
  telefono_contacto TEXT               NOT NULL,
  latitud           DOUBLE PRECISION,
  longitud          DOUBLE PRECISION,
  estado            estado_publicacion NOT NULL DEFAULT 'ACTIVA',
  autor_id          INTEGER            NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
  creado_en         TIMESTAMPTZ        NOT NULL DEFAULT now()
);

CREATE INDEX publicacion_estado_creado_en_idx ON publicacion (estado, creado_en);
CREATE INDEX publicacion_barrio_id_idx ON publicacion (barrio_id);
CREATE INDEX publicacion_autor_id_idx ON publicacion (autor_id);

CREATE TABLE foto (
  id             SERIAL PRIMARY KEY,
  url            TEXT    NOT NULL,
  orden          INTEGER NOT NULL DEFAULT 0,
  publicacion_id INTEGER NOT NULL REFERENCES publicacion (id) ON DELETE CASCADE
);

CREATE TABLE plan (
  id               SERIAL PRIMARY KEY,
  nombre           TEXT          NOT NULL UNIQUE,
  precio_bs        NUMERIC(10, 2) NOT NULL,
  duracion_dias    INTEGER       NOT NULL,
  redes            TEXT          NOT NULL,
  zona             TEXT          NOT NULL,
  alcance_estimado INTEGER       NOT NULL
);

CREATE TABLE promocion (
  id                 SERIAL PRIMARY KEY,
  publicacion_id     INTEGER          NOT NULL REFERENCES publicacion (id) ON DELETE CASCADE,
  plan_id            INTEGER          NOT NULL REFERENCES plan (id),
  estado             estado_promocion NOT NULL DEFAULT 'PENDIENTE_PAGO',
  metodo_pago        metodo_pago,
  monto_bs           NUMERIC(10, 2)   NOT NULL,
  pagada_en          TIMESTAMPTZ,
  inicio_en          TIMESTAMPTZ,
  fin_en             TIMESTAMPTZ,
  resultado_redes    TEXT,
  resultado_desde    TIMESTAMPTZ,
  resultado_hasta    TIMESTAMPTZ,
  resultado_personas INTEGER,
  creado_en          TIMESTAMPTZ      NOT NULL DEFAULT now()
);

CREATE INDEX promocion_estado_idx ON promocion (estado);

CREATE TABLE conversacion (
  id             SERIAL PRIMARY KEY,
  publicacion_id INTEGER     NOT NULL REFERENCES publicacion (id) ON DELETE CASCADE,
  iniciador_id   INTEGER     NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (publicacion_id, iniciador_id)
);

CREATE TABLE mensaje (
  id              SERIAL PRIMARY KEY,
  conversacion_id INTEGER     NOT NULL REFERENCES conversacion (id) ON DELETE CASCADE,
  remitente_id    INTEGER     NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
  texto           TEXT        NOT NULL,
  leido           BOOLEAN     NOT NULL DEFAULT false,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX mensaje_conversacion_creado_en_idx ON mensaje (conversacion_id, creado_en);

CREATE TABLE aviso (
  id         SERIAL PRIMARY KEY,
  usuario_id INTEGER     NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
  texto      TEXT        NOT NULL,
  enlace     TEXT,
  leido      BOOLEAN     NOT NULL DEFAULT false,
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX aviso_usuario_leido_idx ON aviso (usuario_id, leido);

-- Sesiones de usuario (HU01, HU02, HU32).
CREATE TABLE sesion (
  id         TEXT        PRIMARY KEY,
  usuario_id INTEGER     NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
  expira_en  TIMESTAMPTZ NOT NULL
);

CREATE INDEX sesion_expira_en_idx ON sesion (expira_en);

COMMIT;
