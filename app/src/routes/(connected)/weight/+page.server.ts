import { _requireLogin } from '../workout/+page.server';
import type { Actions, PageServerLoad } from './$types';
import {
	findWeightOfUser,
	createWeight,
	deleteWeight,
	findWeightByIdAndUserId,
	editWeight
} from '$lib/server/db/weightRepo';
import { fail } from '@sveltejs/kit'; // , redirect
import type { Weight } from '$lib/server/db/schema.ts';
// import { resolve } from '$app/paths';

export const load: PageServerLoad = async () => {
	const user = _requireLogin();

	const weightArray = findWeightOfUser(user.id);

	return { weightArray, weightArrayNotPromised: await weightArray };
};

export const actions: Actions = {
	addWeight: async ({ request }) => {
		await sleep(1000);
		const user = _requireLogin();
		const data = await request.formData();

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
	},
	deleteWeight: async ({ request }) => {
		await sleep(1000);
		const user = _requireLogin();
		const data = await request.formData();

		const tmpWeightId: number | null = data.get('weightId') ? Number(data.get('weightId')) : null;
		if (!tmpWeightId) {
			return fail(400, { missing: true, message: 'Form is missing weightId input' });
		}

		const res = await findWeightByIdAndUserId(tmpWeightId, user.id);
		if (!res) {
			return fail(403, {
				incorrect: true,
				message: "Either this weight entry doesn't exist or it doesn't belong to this user"
			});
		}

		const deletionPromise = deleteWeight(res.id);
		return await deletionPromise.then(
			// onfulfilled
			() => {
				return {
					success: true
				};
			},
			// onrejected
			() => {
				return fail(403, {
					success: false,
					message: 'Delete weight has failed'
				});
			}
		);
	},
	putWeight: async ({ request }) => {
		await sleep(1000);
		const user = _requireLogin();
		const data = await request.formData();

		// input validation
		const weight: number = Number(data.get('weight'));
		if (weight === 0) {
			// default value of Number() constructor for incorrect parameter
			return fail(400, { missing: true, message: 'Form is missing weight input' });
		}

		const tmpDate = data.get('date');
		if (!tmpDate) {
			return fail(400, { missing: true, message: 'Form is missing date input' });
		}
		const date = new Date(tmpDate.toString());

		const tmpWeightId = data.get('weightId');
		if (!tmpWeightId) {
			return fail(400, { missing: true, message: 'Form is missing weightId input' });
		}
		const weightId = Number(tmpWeightId.toString());

		if (weight < 40) {
			return fail(400, { incorrect: true, message: 'Weight input must be at least 40' });
		}

		const input: Weight = {
			id: weightId,
			date,
			userId: user.id,
			weight
		};

		const res = await findWeightByIdAndUserId(weightId, user.id);
		if (!res) {
			return fail(403, {
				incorrect: true,
				message: "Either this weight entry doesn't exist or it doesn't belong to this user"
			});
		} // else user exist & weight entry exist & weight entry belongs to user

		const editRes = await editWeight(input);
		if (editRes.length === 1) {
			return {
				success: true,
				message: `Weight edited ${input}`
			};
		} else {
			return fail(500, {
				incorrect: true,
				message: 'Something went wrong'
			});
		}
	}
};

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
