import { _requireLogin } from '../workout/+page.server';
import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUser, editUser } from '$lib/server/db/repo';
import { resolve } from '$app/paths';
import { goalEnum, type Goal } from '$lib/customType';

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

		const tmpGoal = data.get('goal');
		if (!goalEnum.some((elem) => elem === tmpGoal) && tmpGoal !== '') {
			return fail(400, { incorrect: true, message: `Goal value '${tmpGoal}' is not authorized` });
		}

		const goal: Goal | null = tmpGoal ? (tmpGoal as Goal) : null;

		const tmpGoalWeight: number = Number(data.get('goalWeight'));
		if (tmpGoalWeight <= 40 && data.get('goalWeight') !== '') {
			return fail(400, {
				incorrect: true,
				message: `Goal weight must be greater than 40kg`
			});
		}
		const goalWeight: number | null = data.get('goalWeight')
			? Number(data.get('goalWeight'))
			: null;

		const result = await editUser(user.id, goal, goalWeight);
		if (result.length === 1) {
			return {
				success: true,
				updatedValues: { goal: result[0].goal, goalWeight: result[0].goalWeight }
			};
		}
		return fail(500, { success: false, message: `${result.length} rows were affected` });
	}
};
