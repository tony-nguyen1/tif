import * as table from '$lib/server/db/schema';
import { _requireLogin } from '../../../profile/+page.server.js';
import type { Actions } from './$types.js';
import { getAnExercise, getSeriesByWorkout, getSet, getSetBis, type WorkoutWithExercise } from '$lib/server/db/repo.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const user = _requireLogin();

	const exerciseInfo = await getAnExercise(Number(params.slug));
	if (!exerciseInfo || exerciseInfo!.userId !== user.id) {
		// Do something better than this
		redirect(307, '/');
	}

	const seriesDone = await getSet(user.id, Number(params.slug));
	console.log('seriesDone=');
	console.log(seriesDone);

	const workoutList: WorkoutWithExercise[] = await getSetBis(user.id, Number(params.slug));
	console.log('workoutList=');
	console.log(workoutList);
	workoutList.forEach((aWorkout) => {
		console.log(aWorkout);
	})


	const cleanedData: table.Set[] = new Array();
	seriesDone.forEach(({ set, exercise }, i) => {
		if (set) {
			cleanedData.push(set);
		}
	});
	// console.log(cleanedData);

	const seriesByWorkout = await getSeriesByWorkout(user.id, Number(params.slug));
	// console.log(foo);
	const x: Array<number> = [];
	const y: Array<number> = [];
	seriesByWorkout.forEach((val) => {
		x.push(val.id!); y.push(Number(val.total!));
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