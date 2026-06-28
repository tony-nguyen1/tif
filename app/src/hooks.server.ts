import { env } from '$env/dynamic/private';
import * as auth from '$lib/server/auth';
import { db, initDb, isTest } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { migrate } from 'drizzle-orm/libsql/migrator';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

export const handle: Handle = handleAuth;

// checking for necesary env variables
export async function init() {
	if (!env.APP_ENV) throw new Error('APP_ENV is not set');
	if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
	if (
		!(env.DATABASE_URL != 'production') &&
		!(env.DATABASE_URL != 'production') &&
		!(env.DATABASE_URL != 'production')
	)
		throw new Error(
			`APP_ENV environment variable not set properly. Choose either: development, test or production`
		);
	initDb();
}

console.info('[hooks.server.ts] running once');
export const isProd = env.APP_ENV === 'production';
if (isProd) {
	init();
	if (isTest) {
		console.info('... running migration');
		await migrate(db, {
			migrationsFolder: 'drizzle'
		});
	}
	// console.info('[hooks.server.ts] syncing db');
	// console.info('... syncing');
	// const res = await client.sync();
	// console.info(res);
	// console.info(`... frames applied=${res?.frames_synced ?? 'N/A'}`);
	// console.info('... syncing OK');
	//
}
