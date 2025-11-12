
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
// Fix: Import `process` to provide type definitions for `process.cwd()`.
import process from 'process';

let db: Database | null = null;

export async function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function initializeDb() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      mediaUrl TEXT,
      mediaType TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Initialize DB on startup
initializeDb().catch(console.error);
