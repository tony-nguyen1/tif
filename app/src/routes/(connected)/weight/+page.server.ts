import { _requireLogin } from '../workout/+page.server';
import type { Actions, PageServerLoad } from './$types';
import { findWeightOfUser, createWeight } from '$lib/server/db/weightRepo';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const user = _requireLogin();

	const weightArray = findWeightOfUser(user.id);

	return { weightArray };
};

export const actions: Actions = {
	addWeight: async ({ request }) => {
		const user = _requireLogin();
		const data = await request.formData();

		console.info(data);

		const tmpWeight: number | null = data.get('weight') ? Number(data.get('weight')) : null;
		if (!tmpWeight) {
			return fail(400, { missing: true, message: 'Form is missing weight input' });
		}

		if (tmpWeight < 40) {
			return fail(400, { incorrect: true, message: 'Weight input must be at least 40' });
		}

		const input = {
			date: new Date(),
			userId: user.id,
			weight: tmpWeight
		};

		const result = await createWeight(input);
		if (result.rowsAffected === 1) {
			return {
				success: true,
				inserted: { weight: input.weight, date: input.date }
			};
		}
		return fail(500, { success: false, message: `${result.rowsAffected} rows were affected` });
	}
};
