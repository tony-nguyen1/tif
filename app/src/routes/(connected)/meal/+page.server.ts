import type { Actions, PageServerLoad } from './$types.js';
import { createMeal } from '$lib/server/db/mealRepo.js';
import * as table from '$lib/server/db/schema';
import { _requireLogin } from '../workout/+page.server';
import { findMealOfUser } from '$lib/server/db/mealRepo.js';

export const load: PageServerLoad = async () => {
	const user = _requireLogin();
	const mealArray: table.Meal[] = await findMealOfUser(user.id);

	return { user, mealArray };
};

export const actions: Actions = {
	meal: async ({ request }) => {
		const data = await request.formData();
		const input = {
			// id: undefined,
			userId: data.get('userId')!.toString(),
			date: new Date(),
			place: data.get('place')!.toString(),
			protein: Number(data.get('protein')!.toString()),
			fullness: Number(data.get('fullness')!.toString()),
			description: data.get('description')!.toString()
		};

		await createMeal(input);
	}
};
