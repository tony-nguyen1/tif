import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { _requireLogin } from '../../../profile/+page.server.js';
import type { Actions } from './$types.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { redirect } from '@sveltejs/kit';
import { getAllExercises, getATrainingSession } from '$lib/server/db/repo.js';

export async function load({ params }) {
	// no verification for now ...

	const user = _requireLogin();
	const userExercise = await getAllExercises(user.id);

	const res2: {
		workout: table.Workout | null,
		set: table.Set | null,
		// exercise: table.Exercise | null
	}[] = await db
		.select()
		.from(table.workout)
		.rightJoin(table.set, eq(table.workout.id, table.set.session))
		// .leftJoin(table.exercise, eq(table.set.exercise, table.exercise.id))
		.where(eq(table.workout.id, Number(params.slug)));
	const exerciseMap: Map<Number, String> = new Map();
	userExercise.forEach((value) => {
		exerciseMap.set(value.id, value.name);
	});

	// : Map<String, table.Set> 
	let cleanMap: Map<String, Array<table.Set>> = new Map();
	const volumeMap: Map<String, number> = new Map();
	res2.forEach((aSet) => {
		let exerciseName: String = exerciseMap.get(Number(aSet.set!.exercise))!

		let exerciseDoneList: Array<table.Set> = cleanMap.get(exerciseName!)!;
		if (!exerciseDoneList) {
			exerciseDoneList = new Array();
			cleanMap.set(exerciseName, exerciseDoneList);
			exerciseDoneList.push(aSet.set!);
		} else {
			exerciseDoneList.push(aSet.set!);
		}

		if (!volumeMap.get(exerciseName)) {
			volumeMap.set(exerciseName, 0);
		}
		volumeMap.set(exerciseName, volumeMap.get(exerciseName)! + Number(aSet.set!.repNumber) * Number(aSet.set!.weight));
	});

	dayjs.extend(relativeTime);

	const exerciseNameToExerciseIdMap: Map<String, number> = new Map();
	userExercise.forEach((val) => {
		exerciseNameToExerciseIdMap.set(val.name, val.id);
	});

	const trainingSessionData = await getATrainingSession(Number(params.slug));
	return {
		trainingSessionId: params.slug,
		trainingSessionInfo: trainingSessionData,
		user,
		userExercise,
		cleanMap,
		test: dayjs(trainingSessionData.date).fromNow(),
		volumeMap,
		exerciseNameToExerciseIdMap
	};
}

export const actions: Actions = {
	addASet: async ({ request }) => {
		const data = await request.formData();
		await db
			.insert(table.set)
			.values({
				session: Number(data.get('trainingSessionId')!.toString()),
				exercise: Number(data.get('exerciseId')!.toString()),
				repNumber: Number(data.get('rep')!.toString()),
				weight: Number(data.get('weight')!.toString()),
				repInReserve: Number(data.get('rir')!.toString()),
				comment: data.get('comment')!.toString()
			})
			.returning({ insertedId: table.workout.id });
	},
	modifyPlace: async ({ params, request }) => {
		const data = await request.formData();
		const result = await db
			.update(table.workout)
			.set({ place: data.get('newPlace')?.toString() })
			.where(eq(table.workout.id, Number(params.slug)));
	},
	modifyDuration: async ({ params, request }) => {
		const data = await request.formData();
		const result = await db
			.update(table.workout)
			.set({ duration: Number(data.get('newDuration')?.toString()) })
			.where(eq(table.workout.id, Number(params.slug)));
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const b = await db
			.delete(table.set)
			.where(eq(table.set.session, Number(data.get('trainingSessionId')?.toString())));


		const a = await db
			.delete(table.workout)
			.where(eq(table.workout.id, Number(data.get('trainingSessionId')?.toString())));



		return redirect(302, '/profile');
	},
	deleteSet: async ({ request }) => {
		const data = await request.formData();
		await db
			.delete(table.set)
			.where(eq(table.set.id, Number(data.get('gymSetId')!.toString())));
	},
	updateSet: async ({ params, request }) => {
		const data = await request.formData();
		const result = await db
			.update(table.set)
			.set({
				id: Number(data.get('exerciseId')!.toString()),
				repNumber: Number(data.get('rep')!.toString()),
				weight: Number(data.get('weight')!.toString()),
				repInReserve: Number(data.get('rir')!.toString()),
				comment: data.get('comment')!.toString()
			})
			.where(eq(table.set.id, Number(data.get('gymSetId'))));
	},
};