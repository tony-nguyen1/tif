import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

console.info('index.ts');
console.log(`Node environment=${env.NODE_ENV}`);

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
// if (!dev && !env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');
// if (!dev && !env.DATABASE_REPLICA) throw new Error('DATABASE_REPLICA is not set');
// if (!dev && !env.DATABASE_SYNC) throw new Error('DATABASE_SYNC is not set');

let tmpClient;
if (dev) {
	// Simple file database
	tmpClient = createClient({
		url: env.DATABASE_URL!
	});

	console.info('Using simple file database');
} else {
	// Embedded replica databse
	tmpClient = createClient({
		url: 'file:local.db'

		// url: env.DATABASE_REPLICA!,
		// authToken: env.DATABASE_AUTH_TOKEN,
		// syncUrl: env.DATABASE_URL,
		// syncInterval: Number(env.DATABASE_SYNC!),
		// offline: false
	});

	console.info(`Using Turso embedded replica database setup\nsync every ${env.DATABASE_SYNC}sec`);

	// Monkey-patch the sync() function
	// const originalSync = tmpClient.sync.bind(tmpClient);

	// tmpClient.sync = async (...args) => {
	// 	console.info('... syncing');
	// 	const res = await originalSync(...args);
	// 	console.info(`Frames applied=${res?.frames_synced ?? 'N/A'}`);
	// 	console.info('... syncing OK');
	// 	return res;
	// };
}

export const db = drizzle(tmpClient, { schema });
