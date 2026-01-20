import type { Actions, PageServerLoad } from './$types.js';
import { createMeal, deleteMeal, findLatestMealOf, findMeal } from '$lib/server/db/mealRepo.js';
import * as table from '$lib/server/db/schema';
import { _requireLogin } from '../workout/+page.server';
import { findMealOfUser, editMeal } from '$lib/server/db/mealRepo.js';
import { fail } from '@sveltejs/kit';
import { sleep } from '$lib/util';

export const load: PageServerLoad = async () => {
	const user = _requireLogin();
	const mealArray: Promise<table.Meal[]> = findMealOfUser(user.id);

	const lastMeal: table.Meal | undefined = await findLatestMealOf(user.id);

	return { mealArray, lastMeal };
};

export const actions: Actions = {
	meal: async ({ request }) => {
		const data = await request.formData();

		if (!data.get('description')) {
			return fail(400, { missing: true, message: 'Form is missing description input' });
		}

		if (!data.get('fullness')) {
			return fail(400, { missing: true, message: 'Form is missing fullness input' });
		}

		if (!data.get('protein')) {
			return fail(400, { missing: true, message: 'Form is missing protein input' });
		}

		if (!data.get('place')) {
			return fail(400, { missing: true, message: 'Form is missing place input' });
		}

		const tmpFullness = Number(data.get('fullness')!.toString());
		if (!(tmpFullness > 0 && tmpFullness <= 10)) {
			return fail(400, {
				incorrect: true,
				message: 'Fulness input must be between 1 and 10 included'
			});
		}

		const tmpProtein = Number(data.get('protein')!.toString());
		if (tmpProtein < 0) {
			return fail(400, {
				incorrect: true,
				message: 'Protein input must be positive'
			});
		}

		const userId = _requireLogin().id;

		const input = {
			userId: userId,
			date: new Date(),
			place: data.get('place')!.toString(),
			protein: tmpProtein,
			fullness: tmpFullness,
			description: data.get('description')!.toString()
		};

		const res = await createMeal(input);
		if (!res.lastInsertRowid) {
			return fail(500, {
				message: 'Somehow multiple rows were affected'
			});
		}

		return { success: true, lastMealPlace: input.place, message: 'Meal inserted successfully' };
	},
	deleteMeal: async ({ request }) => {
		const data = await request.formData();
		const mealId: number = Number(data.get('mealId')!.toString());
		await deleteMeal(mealId);

		return { success: true };
	},
	putMeal: async ({ request }) => {
		const data = await request.formData();
		const userId = _requireLogin().id;

		await sleep(2000);

		if (!data.get('description')) {
			return fail(400, { missing: true, message: 'Form is missing description input' });
		}

		if (!data.get('fullness')) {
			return fail(400, { missing: true, message: 'Form is missing fullness input' });
		}

		if (!data.get('protein')) {
			return fail(400, { missing: true, message: 'Form is missing protein input' });
		}

		if (!data.get('place')) {
			return fail(400, { missing: true, message: 'Form is missing place input' });
		}

		if (!data.get('place')) {
			return fail(400, { missing: true, message: 'Form is missing place input' });
		}

		const tmpDatetime = new Date(data.get('datetime')!.toString());
		if (!data.get('datetime') || tmpDatetime.toString() === 'Invalid Date') {
			return fail(400, { missing: true, message: 'Form is missing datetime-local input' });
		}

		const tmpFullness = Number(data.get('fullness')!.toString());
		if (!(tmpFullness > 0 && tmpFullness <= 10)) {
			return fail(400, {
				incorrect: true,
				message: 'Fulness input must be between 1 and 10 included'
			});
		}

		const tmpProtein = Number(data.get('protein')!.toString());
		if (tmpProtein < 0) {
			return fail(400, {
				incorrect: true,
				message: 'Protein input must be positive'
			});
		}

		const mealId = Number(data.get('mealId')!.toString());
		const mealFromDb = await findMeal(mealId);
		if (!mealFromDb) {
			return fail(404, { message: `Meal id ${mealId} not found` });
		}

		if (mealFromDb?.userId !== userId) {
			return fail(403, {
				message: "User isn't authorized to update this meal"
			});
		}

		const input = {
			date: tmpDatetime,
			id: mealId,
			userId: userId,
			description: data.get('description')!.toString(),
			place: data.get('place')!.toString(),
			protein: tmpProtein,
			fullness: tmpFullness
		};

		const res = await editMeal(input);
		if (res.length === 1) {
			return { success: true, message: 'Meal updated successfully' };
		} else if (res.length < 0) {
			return fail(500, {
				message: 'No row were affected'
			});
		} else {
			return fail(500, {
				message: 'Somehow multiple rows were affected'
			});
		}
	}
};
