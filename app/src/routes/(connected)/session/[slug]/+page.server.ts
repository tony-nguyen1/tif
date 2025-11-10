import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { _requireLogin } from '../../profile/+page.server.js';
import type { Actions } from './$types.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { redirect } from '@sveltejs/kit';
import { getAllExercises, getLastSeriesBis, getWorkoutSet } from '$lib/server/db/repo.js';
import { editSet } from '$lib/server/db/repo.js';

export async function load({ params }) {
	// no verification for now ...
	const user = _requireLogin();
	const userExercise = await getAllExercises(user.id);
	const workoutId: number = Number(params.slug);
	const workoutDone = await getWorkoutSet(user.id, workoutId);

	const cleanMap: Map<number, Array<table.Set>> = new Map();
	const volumeMap: Map<number, number> = new Map();
	workoutDone?.set.forEach((aSet) => {
		const exerciseId: number = aSet.exerciseId!;

		// building cleanMap
		let exerciseDoneList: Array<table.Set> | undefined = cleanMap.get(exerciseId);
		if (!exerciseDoneList) {
			exerciseDoneList = [];
			cleanMap.set(exerciseId, exerciseDoneList);
		}
		exerciseDoneList.push(aSet);

		// building volumeMap
		if (!volumeMap.get(exerciseId)) {
			volumeMap.set(exerciseId, 0);
		}
		volumeMap.set(
			exerciseId,
			volumeMap.get(exerciseId)! + Number(aSet.repNumber) * Number(aSet.weight)
		);
	});

	dayjs.extend(relativeTime);

	const exerciseIdToNameMap: Map<number, string> = new Map();
	userExercise.forEach((anExercise) => {
		exerciseIdToNameMap.set(anExercise.id, anExercise.name);
	});
	const lastSet = await getLastSeriesBis(workoutId);

	return {
		trainingSessionInfo: {
			...workoutDone,
			formattedDateFromNow: dayjs(workoutDone?.date).fromNow()
		},
		user,
		userExercise,
		cleanMap,
		volumeMap,
		exerciseIdToNameMap,
		lastExercise: lastSet?.exerciseId ?? -1
	};
}

export const actions: Actions = {
	addASet: async ({ request }) => {
		const data = await request.formData();
		await db
			.insert(table.set)
			.values({
				workoutId: Number(data.get('trainingSessionId')!.toString()),
				exerciseId: Number(data.get('exerciseId')!.toString()),
				repNumber: Number(data.get('rep')!.toString()),
				weight: Number(data.get('weight')!.toString()),
				repInReserve: Number(data.get('rir')!.toString()),
				comment: data.get('comment')!.toString()
			})
			.returning({ insertedId: table.workout.id });

		// return { success: true };
	},
	editASet: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
		const setData = {
			id: Number(data.get('setId')!.toString()),
			workoutId: Number(data.get('trainingSessionId')!.toString()),
			exerciseId: Number(data.get('exerciseId')!.toString()),
			repNumber: Number(data.get('rep')!.toString()),
			weight: Number(data.get('weight')!.toString()),
			repInReserve: Number(data.get('rir')!.toString()),
			comment: data.get('comment')!.toString()
			// volume: Number(data.get('volume')!.toString())
		};

		await editSet(setData);
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		await db
			.delete(table.set)
			.where(eq(table.set.workoutId, Number(data.get('trainingSessionId')?.toString())));

		await db
			.delete(table.workout)
			.where(eq(table.workout.id, Number(data.get('trainingSessionId')?.toString())));

		return redirect(302, '/profile');
	},
	deleteSet: async ({ request }) => {
		const data = await request.formData();
		await db.delete(table.set).where(eq(table.set.id, Number(data.get('gymSetId')!.toString())));
	}
};
