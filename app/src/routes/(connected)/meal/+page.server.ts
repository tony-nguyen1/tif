import type { Actions, PageServerLoad } from './$types.js';
import { createMeal, deleteMeal, findLatestMealOf } from '$lib/server/db/mealRepo.js';
import * as table from '$lib/server/db/schema';
import { _requireLogin } from '../workout/+page.server';
import { findMealOfUser, editMeal } from '$lib/server/db/mealRepo.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const user = _requireLogin();
	const mealArray: table.Meal[] = await findMealOfUser(user.id);

	const lastMeal: table.Meal | undefined = await findLatestMealOf(user.id);
	console.info(lastMeal ?? 'N/A');

	return { user, mealArray, lastMeal };
};

export const actions: Actions = {
	meal: async ({ request }) => {
		const data = await request.formData();

		await sleep(3000);

		if (!data.get('description')) {
			return fail(400, {
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}

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

		return { success: true, lastMealPlace: input.place };
	},
	deleteMeal: async ({ request }) => {
		const data = await request.formData();
		const mealId: number = Number(data.get('mealId')!.toString());
		console.log(mealId);
		await deleteMeal(mealId);

		return { success: true };
	},
	putMeal: async ({ request }) => {
		const data = await request.formData();

		const input = {
			// date: new Date(data.get('date')!.toString()),
			id: Number(data.get('mealId')!.toString()),
			userId: data.get('userId')!.toString(),
			description: data.get('description')!.toString(),
			place: data.get('place')!.toString(),
			protein: Number(data.get('protein')!.toString()),
			fullness: Number(data.get('fullness')!.toString())
		};

		await editMeal(input);

		return { success: true };
	}
};

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
