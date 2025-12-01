import type { LayoutServerLoad } from './$types';
import { _requireLogin } from './workout/+page.server';
import { getUser } from '$lib/server/db/repo';
import { fail } from '@sveltejs/kit';

export const load: LayoutServerLoad = async () => {
	const user = _requireLogin();

	const userInfo = await getUser(user.id);
	if (!userInfo) {
		fail(404, 'User info not found');
	}

	return { userInfo };
};
