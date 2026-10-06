-- ==========================================
-- ELIMINAR TABLAS SI EXISTEN
-- ==========================================
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;

-- ==========================================
-- TABLA CATEGORIAS (CON ORDEN ÚNICO)
-- ==========================================
CREATE TABLE categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    orden INTEGER NOT NULL UNIQUE
);

-- ==========================================
-- TABLA PRODUCTOS (SIN ORDEN)
-- ==========================================
CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL,
    idcategoria INTEGER NOT NULL,
    precio_total REAL,
    precio_media REAL,
    foto TEXT,
    FOREIGN KEY (idcategoria) REFERENCES categorias(id)
);
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nombre TEXT,
    rol TEXT DEFAULT 'admin',
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

