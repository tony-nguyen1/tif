import * as table from '$lib/server/db/schema';
import { _requireLogin } from '../../../profile/+page.server.js';
import type { Actions } from './$types.js';
import {
	getAnExercise,
	getSeriesByWorkout,
	getSet,
	getSetBis,
	type WorkoutWithExercise
} from '$lib/server/db/repo.js';
import { redirect } from '@sveltejs/kit';

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

	return {
		user,
		workoutList,
		cleanedData,
		exerciseInfo,
		x,
		y
	};
}

export const actions: Actions = {};
