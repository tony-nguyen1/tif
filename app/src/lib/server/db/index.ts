import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import fs from 'fs';

console.info('index.ts');

export const isProd = env.APP_ENV === 'production';
export const isTest = env.APP_ENV === 'test';
export const isDev = env.APP_ENV === 'development';

export let client: ReturnType<typeof createClient>;
export let db: ReturnType<typeof drizzle>;

export function initDb() {
	console.info('initDb running');
	console.log(`Node environment=${env.NODE_ENV}`);
	console.log(`App environment=${env.APP_ENV}`);
	console.log(`Database url=${env.DATABASE_URL}`);

	let tmpClient;

	if (dev) {
		console.info('Using simple file database');
		tmpClient = createClient({ url: env.DATABASE_URL! });
	} else if (isTest) {
		const filePath = env.DATABASE_URL!.replace('file:', '');
		if (fs.existsSync(filePath)) {
			console.info('... test db already exists');
			fs.unlinkSync(filePath);
			console.info('... test db deleted');
		}
		console.info(`Using Turso file database ${env.DATABASE_URL}`);
		tmpClient = createClient({ url: env.DATABASE_URL! });
	} else if (isProd) {
		console.info('Using Turso cloud database');
		tmpClient = createClient({
			url: env.DATABASE_URL!,
			authToken: env.DATABASE_AUTH_TOKEN!
		});
	} else {
		console.info('Using Turso file database (default)');
		tmpClient = createClient({ url: env.DATABASE_URL! });
	}

	client = tmpClient;
	db = drizzle(tmpClient, { schema });
}
