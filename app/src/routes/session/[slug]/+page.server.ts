import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { _loadAllExercises, _requireLogin } from '../../profile/+page.server.js';
import type { Actions } from './$types.js';

export async function load({ params }) {
	console.log(params);
	// no verification for now ...

	const user = _requireLogin();
	const userExercise = await _loadAllExercises(user.id);

	const res2: {
		training_session: table.TrainingSession | null,
		gym_set: table.GymSet | null,
		// gym_exercise: table.GymExercise | null
	}[] = await db
		.select()
		.from(table.trainingSession)
		.leftJoin(table.gymSet, eq(table.trainingSession.id, table.gymSet.session))
		// .leftJoin(table.gymExercise, eq(table.gymSet.exercise, table.gymExercise.id))
		.where(eq(table.trainingSession.id, Number(params.slug)));
	// console.log(res2);
	const exerciseMap: Map<Number, String> = new Map();
	userExercise.forEach((value) => {
		exerciseMap.set(value.id, value.name);
	});
	// console.log('res2=');
	// console.log(res2[0].gym_exercise);

	let sets = []
	for (let set of res2) {
		sets.push(set.gym_set);
	}

	return {
		trainingSessionId: params.slug,
		sets,
		user,
		userExercise,
		exerciseMap
	};
}

export const actions: Actions = {
	addASet: async ({ request }) => {
		const data = await request.formData();
		await db
			.insert(table.gymSet)
			.values({
				session: Number(data.get('trainingSessionId')!.toString()),
				exercise: Number(data.get('exerciseId')!.toString()),
				repNumber: Number(data.get('rep')!.toString()),
				weight: Number(data.get('weight')!.toString()),
				repInReserve: Number(data.get('rir')!.toString()),
				remark: data.get('remark')!.toString()
			})
			.returning({ insertedId: table.trainingSession.id });
	}
};
