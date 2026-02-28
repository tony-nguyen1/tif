import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from './schema';
import fs from 'fs';

console.info('index.ts');

if (!env.APP_ENV) throw new Error('APP_ENV is not set');
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

console.log(`Node environment=${env.NODE_ENV}`);
console.log(`App environment=${env.APP_ENV}`);
console.log(`Database url=${env.DATABASE_URL}`);

export const isProd = env.APP_ENV === 'production';
export const isTest = env.APP_ENV === 'test';
export const isDev = env.APP_ENV === 'development';

let tmpClient;
if (dev) {
	console.info('Using simple file database');
	tmpClient = createClient({
		url: env.DATABASE_URL
	});
} else {
	// running preview, built/optimized version
	if (isDev) {
		// for debugging purposes
		console.info(`Using Turso file database`);
		tmpClient = createClient({
			url: env.DATABASE_URL
		});
	} else if (isTest) {
		// for e2e tests
		const filePath = env.DATABASE_URL!.replace('file:', '');
		if (fs.existsSync(filePath)) {
			console.info('... test db already exist');
			fs.unlinkSync(filePath);
			console.info('... test db deleted');
		}

		console.info(`Using Turso file database ${env.DATABASE_URL}`);
		tmpClient = createClient({
			url: env.DATABASE_URL
		});
	} else if (isProd) {
		// if (!env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');
		// if (!env.DATABASE_REPLICA) throw new Error('DATABASE_REPLICA is not set');
		// if (!env.DATABASE_SYNC) throw new Error('DATABASE_SYNC is not set');

		// console.info(
		// 	`Using Turso cloud/Embedded replica database setup\nsyncinterval set at ${Number(env.DATABASE_SYNC)} sec`
		// );
		// // Embedded replica database
		// tmpClient = createClient({
		// 	url: env.DATABASE_REPLICA,
		// 	authToken: env.DATABASE_AUTH_TOKEN,
		// 	syncUrl: env.DATABASE_URL,
		// 	syncInterval: Number(env.DATABASE_SYNC)
		// });
		console.info(`Using simple Turso cloud database`);
		tmpClient = createClient({
			url: env.DATABASE_URL,
			authToken: env.DATABASE_AUTH_TOKEN
		});
	} else {
		throw new Error(
			`APP_ENV environment variable not set properly. Choose either: development, test or production`
		);
	}
}

export const client = tmpClient;
export const db = drizzle(tmpClient, { schema });

if (isTest) {
	console.info('... running migration');
	await migrate(db, {
		migrationsFolder: 'drizzle'
	});
}
