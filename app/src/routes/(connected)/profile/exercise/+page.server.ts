import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { _requireLogin } from '../../profile/+page.server.js';
import type { Actions } from './$types.js';
import { getAllExercises } from '$lib/server/db/repo.js';

export async function load() {
	const user = _requireLogin();
	const userExercise = await getAllExercises(user.id);

	const exerciseMap: Map<number, string> = new Map();
	userExercise.forEach((value) => {
		exerciseMap.set(value.id, value.name);
	});

	return {
		user,
		exerciseMap
	};
}

export const actions: Actions = {
	exercise: async ({ request }) => {
		const data = await request.formData();
		await db // FIXME extract to lib method
			.insert(table.exercise)
			.values({ userId: data.get('userId')!.toString(), name: data.get('name')!.toString() })
			.returning({ insertedId: table.exercise.id });
	}
};
