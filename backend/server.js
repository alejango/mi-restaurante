const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// 🔐 CONFIGURACIÓN JWT
// ===============================
const SECRET = process.env.JWT_SECRET || "cambia_esta_clave_super_secreta";
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('Falta configurar la variable de entorno JWT_SECRET.');
}

// ===============================
// 🔐 MIDDLEWARE DE AUTENTICACIÓN
// ===============================
function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No autorizado" });

    try {
        jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Token inválido" });
    }
}

// ===============================
// 📁 SERVIR FRONTEND
// ===============================
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ===============================
// 🗄️ CONEXIÓN A LA BASE DE DATOS
// ===============================
const dbPath = path.join(__dirname, 'database', 'restaurante.db');
function configuracionNeon() {
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.delete('sslmode');
    return {
        connectionString: url.toString(),
        ssl: { rejectUnauthorized: true },
        max: 5
    };
}

const postgresPool = process.env.DATABASE_URL
    ? new Pool(configuracionNeon())
    : null;

function convertirPlaceholders(sql) {
    let indice = 0;
    return sql.replace(/\?/g, () => `$${++indice}`);
}

function postgresRun(sql, parametros, callback) {
    const esInsert = /^\s*INSERT\b/i.test(sql);
    const consulta = esInsert && !/\bRETURNING\b/i.test(sql)
        ? `${sql.trim().replace(/;$/, '')} RETURNING id`
        : sql;

    postgresPool.query(convertirPlaceholders(consulta), parametros)
        .then(resultado => callback.call({
            lastID: resultado.rows[0] ? resultado.rows[0].id : undefined,
            changes: resultado.rowCount
        }, null))
        .catch(error => callback.call({}, error));
}

const db = postgresPool ? {
    all(sql, parametros, callback) {
        postgresPool.query(convertirPlaceholders(sql), parametros)
            .then(resultado => callback(null, resultado.rows))
            .catch(callback);
    },
    get(sql, parametros, callback) {
        postgresPool.query(convertirPlaceholders(sql), parametros)
            .then(resultado => callback(null, resultado.rows[0]))
            .catch(callback);
    },
    run: postgresRun
} : new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error('❌ Error al conectar con la base de datos:', err.message);
    } else {
        console.log('✅ Conectado a restaurante.db');
    }
});

async function inicializarNeon() {
    const rutaEsquema = path.join(__dirname, 'database', 'estructura_postgres.sql');
    const declaraciones = fs.readFileSync(rutaEsquema, 'utf8')
        .split(';')
        .map(declaracion => declaracion.trim())
        .filter(Boolean);

    for (const declaracion of declaraciones) {
        await postgresPool.query(declaracion);
    }
    console.log('✅ Conectado a Neon PostgreSQL');
}

// ===============================
// 🔐 LOGIN
// ===============================
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    const sql = "SELECT * FROM usuarios WHERE usuario = ?";
    db.get(sql, [usuario], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

        bcrypt.compare(password, user.password, (err, ok) => {
            if (err) return res.status(500).json({ error: 'No se pudo verificar la contraseña.' });
            if (!ok) return res.status(401).json({ error: "Contraseña incorrecta" });

            const token = jwt.sign({ usuario }, SECRET, { expiresIn: "2h" });
            res.json({ token });
        });
    });
});

// ===============================
// 📂 CATEGORÍAS (PÚBLICAS ORDENADAS)
// ===============================
app.get('/categorias', (req, res) => {
    const sql = `SELECT * FROM categorias ORDER BY orden`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ===============================
// 📂 CRUD CATEGORÍAS (ADMIN)
// ===============================
app.post('/categorias', auth, (req, res) => {
    const { nombre } = req.body;
    const sql = `
        INSERT INTO categorias (nombre, orden)
        SELECT ?, COALESCE(MAX(orden), 0) + 1
        FROM categorias
    `;

    db.run(sql, [nombre], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.put('/categorias/:id', auth, (req, res) => {
    const { nombre } = req.body;
    const sql = "UPDATE categorias SET nombre = ? WHERE id = ?";

    db.run(sql, [nombre, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Categoría actualizada" });
    });
});

app.delete('/categorias/:id', auth, (req, res) => {
    db.get("SELECT COUNT(*) AS total FROM productos WHERE idcategoria = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row.total > 0) {
            return res.status(409).json({ error: "No se puede eliminar una categoría que tiene productos." });
        }

        db.run("DELETE FROM categorias WHERE id = ?", [req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Categoría no encontrada." });
            res.json({ mensaje: "Categoría eliminada" });
        });
    });
});

// ===============================
// 🍽️ PRODUCTOS (PÚBLICOS ORDENADOS)
// ===============================
app.get('/productos', (req, res) => {
    const sql = `
        SELECT p.*, c.nombre AS categoria
        FROM productos p
        JOIN categorias c ON p.idcategoria = c.id
        ORDER BY p.idcategoria
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ===============================
// 🍽️ PRODUCTO POR ID
// ===============================
app.get('/productos/:id', (req, res) => {
    const sql = `
        SELECT p.*, c.nombre AS categoria
        FROM productos p
        JOIN categorias c ON p.idcategoria = c.id
        WHERE p.id = ?
    `;
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// ===============================
// 🍽️ AÑADIR PRODUCTO (ADMIN)
// ===============================
app.post('/productos', auth, (req, res) => {
    const { descripcion, idcategoria, precio_total, precio_media, foto } = req.body;

    const sql = `
        INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [descripcion, idcategoria, precio_total, precio_media, foto], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, mensaje: 'Producto añadido correctamente' });
    });
});

// ===============================
// 🍽️ EDITAR PRODUCTO (ADMIN)
// ===============================
app.put('/productos/:id', auth, (req, res) => {
    const { descripcion, idcategoria, precio_total, precio_media, foto } = req.body;

    const sql = `
        UPDATE productos
        SET descripcion=?, idcategoria=?, precio_total=?, precio_media=?, foto=?
        WHERE id=?
    `;

    db.run(sql, [descripcion, idcategoria, precio_total, precio_media, foto, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Producto actualizado" });
    });
});

// ===============================
// 🍽️ ELIMINAR PRODUCTO (ADMIN)
// ===============================
app.delete('/productos/:id', auth, (req, res) => {
    const sql = "DELETE FROM productos WHERE id = ?";
    db.run(sql, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Producto eliminado" });
    });
});

// ===============================
// 📜 CARTA COMPLETA (PÚBLICA)
// ===============================
app.get('/carta', (req, res) => {
    const sqlCategorias = `SELECT id, nombre, orden FROM categorias ORDER BY orden`;
    const sqlProductos = `
        SELECT p.*, c.nombre AS categoria
        FROM productos p
        JOIN categorias c ON p.idcategoria = c.id
        ORDER BY p.idcategoria
    `;

    db.all(sqlCategorias, [], (err, categorias) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(sqlProductos, [], (err, productos) => {
            if (err) return res.status(500).json({ error: err.message });

            const carta = categorias.map(cat => ({
                id: cat.id,
                nombre: cat.nombre,
                orden: cat.orden,
                productos: productos.filter(p => p.idcategoria === cat.id)
            }));

            res.json(carta);
        });
    });
});

// ===============================
// 🚀 INICIAR SERVIDOR
// ===============================
const PORT = Number(process.env.PORT) || 3000;
function iniciarServidor() {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor funcionando en el puerto ${PORT}`);
    });
}

if (postgresPool) {
    inicializarNeon()
        .then(iniciarServidor)
        .catch(error => {
            console.error('❌ No se pudo inicializar Neon PostgreSQL:', error.message);
            process.exitCode = 1;
            postgresPool.end();
        });
} else {
    iniciarServidor();
}
