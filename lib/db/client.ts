import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Singleton-Pattern für die Datenbankverbindung
let db: ReturnType<typeof drizzle> | null = null;

export function getDB() {
  if (!db) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error('TURSO_DATABASE_URL environment variable is required');
    }

    // Erstelle LibSQL Client
    const client = createClient({
      url,
      authToken, // Optional für lokale Entwicklung
    });

    // Erstelle Drizzle-Instanz
    db = drizzle(client, { schema });
  }

  return db;
}

export { schema };
export type DB = ReturnType<typeof getDB>;
