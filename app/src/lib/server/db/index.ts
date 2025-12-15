import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

console.info('index.ts');

if (!env.APP_ENV) throw new Error('APP_ENV is not set');

console.log(`Node environment=${env.NODE_ENV}`);
console.log(`App environment=${env.APP_ENV}`);
console.log(`Database url=${env.DATABASE_URL}`);

export const isProd = env.APP_ENV === 'production';
export const isTest = env.APP_ENV === 'test';
export const isDev = env.APP_ENV === 'development';

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
	// tmpClient = createClient({
	// 	url: 'file:local.db'

	// 	// url: env.DATABASE_REPLICA!,
	// 	// authToken: env.DATABASE_AUTH_TOKEN,
	// 	// syncUrl: env.DATABASE_URL,
	// 	// syncInterval: Number(env.DATABASE_SYNC!),
	// 	// offline: false
	// });

	// console.info(`Using Turso embedded replica database setup\nsync every ${env.DATABASE_SYNC}sec`);
	// console.info(`Using Turso file database`);

	// Monkey-patch the sync() function
	// const originalSync = tmpClient.sync.bind(tmpClient);

	// tmpClient.sync = async (...args) => {
	// 	console.info('... syncing');
	// 	const res = await originalSync(...args);
	// 	console.info(`Frames applied=${res?.frames_synced ?? 'N/A'}`);
	// 	console.info('... syncing OK');
	// 	return res;
	// };

	if (isDev) {
		console.info(`Using Turso file database`);
		tmpClient = createClient({
			url: env.DATABASE_URL!
		});
	} else if (isTest) {
		console.info(`Using Turso file database`);
		tmpClient = createClient({
			url: env.DATABASE_URL!
		});
	} else if (isProd) {
		console.info(`Using Turso file database`);
		tmpClient = createClient({
			url: env.DATABASE_URL!
		});
	} else {
		throw new Error(`APP_ENV environment variable not set properly`);
	}
}

export const db = drizzle(tmpClient, { schema });
