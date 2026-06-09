import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
    const db = await open({
        filename: './database.sqlite', 
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_pet TEXT NOT NULL,
            especie TEXT NOT NULL,
            idade INTEGER,
            tutor_id INTEGER,
            FOREIGN KEY (tutor_id) REFERENCES usuarios (id)
        )
    `);

    return db;
}