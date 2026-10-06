const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

const databasePath = path.join(__dirname, 'database', 'restaurante.db');
const schemaPath = path.join(__dirname, 'database', 'estructura_postgres.sql');
const tableNames = ['categorias', 'productos', 'usuarios'];

function configuracionNeon() {
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.delete('sslmode');
    return {
        connectionString: url.toString(),
        ssl: { rejectUnauthorized: true },
        max: 1
    };
}

function leerTabla(db, nombre) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${nombre} ORDER BY id`, (error, filas) => {
            if (error) reject(error);
            else resolve(filas);
        });
    });
}

async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error('Define DATABASE_URL con la URL de conexión de Neon antes de migrar.');
    }
    if (!fs.existsSync(databasePath)) {
        throw new Error(`No se encontró la base SQLite local: ${databasePath}`);
    }

    const sqlite = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY);
    const pool = new Pool(configuracionNeon());

    try {
        const tablas = {};
        for (const nombre of tableNames) {
            tablas[nombre] = await leerTabla(sqlite, nombre);
        }

        const esquema = fs.readFileSync(schemaPath, 'utf8')
            .split(';')
            .map(declaracion => declaracion.trim())
            .filter(Boolean);

        for (const declaracion of esquema) {
            await pool.query(declaracion);
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            for (const nombre of tableNames) {
                const resultado = await client.query(`SELECT COUNT(*) AS total FROM ${nombre}`);
                if (Number(resultado.rows[0].total) > 0) {
                    throw new Error(`La tabla ${nombre} de Neon ya contiene datos; se cancela para no sobrescribirlos.`);
                }
            }

            for (const nombre of tableNames) {
                for (const fila of tablas[nombre]) {
                    const columnas = Object.keys(fila);
                    const valores = columnas.map(columna => fila[columna]);
                    const placeholders = valores.map((_, indice) => `$${indice + 1}`).join(', ');
                    const listaColumnas = columnas.map(columna => `"${columna}"`).join(', ');
                    await client.query(
                        `INSERT INTO ${nombre} (${listaColumnas}) VALUES (${placeholders})`,
                        valores
                    );
                }
            }

            for (const nombre of tableNames) {
                if (tablas[nombre].length) {
                    await client.query(
                        `SELECT setval(pg_get_serial_sequence($1, 'id'), (SELECT MAX(id) FROM ${nombre}), true)`,
                        [`public.${nombre}`]
                    );
                }
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

        console.log('Migración completada sin mostrar credenciales.');
        for (const nombre of tableNames) {
            console.log(`${nombre}: ${tablas[nombre].length} registros copiados.`);
        }
    } finally {
        await new Promise((resolve, reject) => {
            sqlite.close(error => error ? reject(error) : resolve());
        });
        await pool.end();
    }
}

main().catch(error => {
    console.error('No se pudo completar la migración:', error.message);
    process.exitCode = 1;
});
