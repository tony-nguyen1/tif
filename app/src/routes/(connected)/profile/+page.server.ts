import { _requireLogin } from '../workout/+page.server';
import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUser, editUser } from '$lib/server/db/repo';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async () => {
	const user = _requireLogin();

	const userInfo = await getUser(user.id);
	if (!userInfo) {
		fail(404, 'User info not found');
	}

	return { user, userInfo };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	},
	editUserInfo: async ({ request }) => {
		const user = _requireLogin();
		const data = await request.formData();

		if (!data.has('goal')) {
			return fail(400, { missing: true, message: 'Form is missing goal input' });
		}

		if (!data.has('goalWeight')) {
			return fail(400, { missing: true, message: 'Form is missing goalWeight input' });
		}

		// FIXME : transform this into a nice enum
		const arr = ['cutting', 'bulking', 'maintaining', 'cardio', 'strength'];
		const tmpGoal = data.get('goal');
		if (!(arr.some((elem) => elem === tmpGoal) || tmpGoal === null)) {
			return fail(400, { incorrect: true, message: `Goal value '${tmpGoal}' is not authorized` });
		}

		const goal: 'cutting' | 'bulking' | 'maintaining' | 'cardio' | 'strength' | null = tmpGoal as
			| 'cutting'
			| 'bulking'
			| 'maintaining'
			| 'cardio'
			| 'strength'
			| null;

		const goalWeight: number = Number(data.get('goalWeight'));
		if (goalWeight <= 40) {
			return fail(400, {
				incorrect: true,
				message: `Goal Weight must be stricly greater than 40kg`
			});
		}

		const result = await editUser(user.id, goal, goalWeight);
		if (result.rowsAffected === 1) {
			return { success: true };
		}
		return fail(500, { success: false, message: `${result.rowsAffected} rows were affected` });
	}
};
