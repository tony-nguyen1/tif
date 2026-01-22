import * as table from '$lib/server/db/schema';
import { _requireLogin } from '../../workout/+page.server';
import type { Actions } from './$types.js';
import {
	addASet,
	getAnExercise,
	getSeriesByWorkout,
	getSet,
	getSetBis,
	type WorkoutWithExercise
} from '$lib/server/db/repo.js';
import { fail, redirect } from '@sveltejs/kit';
import {
	exerciseBelongToUser,
	exerciseExist,
	userAlreadyHasWorkoutToday,
	workoutBelongsToUser
} from '$lib/server/db/workoutRepo';

export async function load({ params }) {
	const user = _requireLogin();

	const exerciseInfo = await getAnExercise(Number(params.exerciseId));
	if (!exerciseInfo || exerciseInfo!.userId !== user.id) {
		// Do something better than this
		redirect(307, '/');
	}

	const seriesDone = await getSet(user.id, Number(params.exerciseId));

	const workoutList: WorkoutWithExercise[] = await getSetBis(user.id, Number(params.exerciseId));

	const cleanedData: table.Set[] = [];
	seriesDone.forEach(({ set }) => {
		if (set) {
			cleanedData.push(set);
		}
	});

	const seriesByWorkout = await getSeriesByWorkout(user.id, Number(params.exerciseId));
	const x: Array<string> = [];
	const y: Array<number> = [];
	const nbWorkout = seriesByWorkout.length;
	let i = 0;
	seriesByWorkout.forEach((val) => {
		// x.push(`W-${val.id!}`);
		x.push(`W-${nbWorkout - i}`);
		y.push(Number(val.total!));
		i++;
	});

	const workoutAlreadyExisting = await userAlreadyHasWorkoutToday(user.id);

	return {
		user,
		workoutList,
		cleanedData,
		exerciseInfo,
		x,
		y,
		workoutAlreadyExisting
	};
}

export const actions: Actions = {
	addSet: async ({ request, params }) => {
		const user = _requireLogin();
		const exerciseId = params.exerciseId;

		const data = await request.formData();
		console.info(data);
		// FIXME : use zod to validate client input
		const tmpRep = Number(data.get('rep')?.toString());
		if (!data.get('rep') || tmpRep < 0) {
			return fail(400, { missing: true, message: 'Form is missing rep input' });
		}

		const tmpWeight = Number(data.get('weight')?.toString());
		if (!data.get('weight') || tmpWeight < 0) {
			return fail(400, { missing: true, message: 'Form is missing weight input' });
		}

		const alreadyExistingWorkout = await userAlreadyHasWorkoutToday(user.id);
		if (!alreadyExistingWorkout) {
			return fail(500);
		}

		const input = {
			workoutId: alreadyExistingWorkout.id,
			exerciseId: Number(exerciseId),
			repNumber: tmpRep,
			weight: tmpWeight,
			repInReserve: data.get('rir') ? Number(data.get('rir')!.toString()) : 10,
			comment: data.get('comment') ? data.get('comment')!.toString() : null
		};

		if (!(await exerciseExist(input.exerciseId))) {
			return fail(422, {
				message: `Exercise ${input.exerciseId} does not exist`
			});
		}

		// authorization checks
		if (!(await workoutBelongsToUser(input.workoutId, user.id))) {
			return fail(403, {
				message: `User ${user.id} not authorized to access workout ${input.workoutId}`
			});
		}

		if (!(await exerciseBelongToUser(input.exerciseId, user.id))) {
			return fail(403, {
				message: `User ${user.id} not authorized to user exercise ${input.workoutId}`
			});
		}

		const lastInsertRowid = await addASet(input);
		if (!lastInsertRowid) {
			return fail(500, { message: 'Insertion of a set went wrong' });
		}
		return { success: true, workoutId: input.workoutId };
	}
};
