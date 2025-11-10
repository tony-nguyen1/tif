import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { _requireLogin } from '../../profile/+page.server.js';
import type { Actions } from './$types.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { redirect } from '@sveltejs/kit';
import { getAllExercises, getLastSeriesBis, getWorkoutSet } from '$lib/server/db/repo.js';
import { editSet, editWorkout, addASet } from '$lib/server/db/repo.js';

export async function load({ params }) {
	// no verification for now ...
	const user = _requireLogin();
	const userExercise = await getAllExercises(user.id);
	const workoutId: number = Number(params.workoutId);
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
		const input = {
			workoutId: Number(data.get('trainingSessionId')!.toString()),
			exerciseId: Number(data.get('exerciseId')!.toString()),
			repNumber: Number(data.get('rep')!.toString()),
			weight: Number(data.get('weight')!.toString()),
			repInReserve: data.get('rir') ? Number(data.get('rir')!.toString()) : -1,
			comment: data.get('comment')!.toString()
		};

		const success = await addASet(input);
		return { success };
	},
	editASet: async ({ request }) => {
		const data = await request.formData();
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
	editWorkout: async ({ request }) => {
		const data = await request.formData();
		const userId: string = data.get('userId')!.toString();
		const workoutId = Number(data.get('trainingSessionId')!.toString());
		const inputData = {
			comment: data.get('comment')!.toString(),
			place: data.get('place')!.toString(),
			duration: Number(data.get('duration')!.toString())
		};

		await editWorkout(userId, workoutId, inputData);
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
