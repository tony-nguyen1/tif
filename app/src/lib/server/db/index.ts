import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!dev && !env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');
if (!dev && !env.DATABASE_REPLICA) throw new Error('DATABASE_REPLICA is not set');
if (!dev && !env.DATABSE_SYNC) throw new Error('DATABSE_SYNC is not set');

console.log(`Node environment=${env.NODE_ENV}`);

let tmpClient;
if (dev) {
	// Simple file database
	tmpClient = createClient({
		url: env.DATABASE_URL!
	});

	console.info('Using simple file databse');
} else {
	// Embedded replica databse
	tmpClient = createClient({
		url: env.DATABASE_REPLICA!,
		authToken: env.DATABASE_AUTH_TOKEN,
		syncUrl: env.DATABASE_URL,
		syncInterval: Number(env.DATABSE_SYNC!),
		offline: true
	});

	console.info('Using Turso embedded replica database setup');
	console.info('... syncing');
	await tmpClient.sync();
	console.info('... syncing OK');
}
const client = tmpClient;

export const db = drizzle(client, { schema });
