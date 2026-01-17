import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { env } from '$env/dynamic/private';
import { client } from '$lib/server/db';

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

console.info('[hooks.server.ts] running once');
export const isProd = env.APP_ENV === 'production';
if (isProd) {
	console.info('[hooks.server.ts] syncing db');
	console.info('... syncing');
	const res = await client.sync();
	console.info(res);
	console.info(`... frames applied=${res?.frames_synced ?? 'N/A'}`);
	console.info('... syncing OK');
}
