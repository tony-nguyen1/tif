import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!dev && !env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

console.log(`Node environment=${env.NODE_ENV}`);

const client = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_AUTH_TOKEN
});

export const db = drizzle(client, { schema });

// if (!dev && !env.DATABASE_REPLICA) throw new Error('DATABASE_REPLICA is not set');
// if (!dev && !env.DATABSE_SYNC) throw new Error('DATABSE_SYNC is not set');
// let tmpClient;
// if (dev) {
// 	// Simple file database
// 	tmpClient = createClient({
// 		url: env.DATABASE_URL!
// 	});
// } else {
// 	// Embedded replica databse
// 	tmpClient = createClient({
// 		url: env.DATABASE_REPLICA!,
// 		authToken: env.DATABASE_AUTH_TOKEN,
// 		syncUrl: env.DATABASE_URL,
// 		syncInterval: Number(env.DATABSE_SYNC!)
// 	});
// }
// const client = tmpClient;
