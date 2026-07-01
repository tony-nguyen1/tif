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
	if (!['development', 'test', 'production'].includes(env.APP_ENV)) {
		throw new Error('APP_ENV must be one of: development, test, production');
	}

	initDb();

	if (isTest) {
		console.info('... running migration');
		await migrate(db, { migrationsFolder: 'drizzle' });
	}
}
