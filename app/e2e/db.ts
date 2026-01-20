// tests/db.ts
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client'; // correct import for Node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.test
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined in .env.test');

let dbInstance: ReturnType<typeof drizzle> | null = null;

/**
 * Creates a fresh test database (file-based).
 */
export async function createTestDb() {
	// If DATABASE_URL is file-based, delete existing file
	if (DATABASE_URL!.startsWith('file:')) {
		const filePath = DATABASE_URL!.replace('file:', '');
		if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
	}

	// Create LibSQL client
	const client = createClient({ url: DATABASE_URL! });

	// Initialize Drizzle
	const db = drizzle(client);

	// Run migrations
	await migrate(db, {
		migrationsFolder: 'src/db/migrations'
	});

	dbInstance = db;
	return db;
}

/**
 * Get the last created test database instance
 */
export function getTestDb() {
	if (!dbInstance) throw new Error('Test DB not initialized. Call createTestDb first.');
	return dbInstance;
}
