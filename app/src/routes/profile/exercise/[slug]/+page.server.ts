import * as table from '$lib/server/db/schema';
import { _requireLogin } from '../../../profile/+page.server.js';
import type { Actions } from './$types.js';
import { getAnExercise, getSeriesByWorkout, getSet } from '$lib/server/db/repo.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const user = _requireLogin();

	const exerciseInfo = await getAnExercise(Number(params.slug));
	if (!exerciseInfo || exerciseInfo!.userId !== user.id) {
		// Do something better than this
		redirect(307, '/');
	}

	const seriesDone = await getSet(user.id, Number(params.slug));
	// console.log(seriesDone);


	const cleanedData: table.GymSet[] = new Array();
	seriesDone.forEach(({ gym_set, gym_exercise }, i) => {
		if (gym_set) {
			cleanedData.push(gym_set);
		}
	});
	// console.log(cleanedData);

	const foo = await getSeriesByWorkout(Number(params.slug));
	console.log(foo);
	const x: Array<number> = [];
	const y: Array<number> = [];
	foo.forEach((val) => {
		x.push(val.id!); y.push(Number(val.total!));
	});





	return {
		user,
		cleanedData,
		exerciseInfo,
		x,
		y
	};
}

export const actions: Actions = {};