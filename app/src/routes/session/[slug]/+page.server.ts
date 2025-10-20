import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { _loadAllExercises, _requireLogin } from '../../profile/+page.server.js';
import type { Actions } from './$types.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export async function load({ params }) {
	// console.log(params);
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
		.rightJoin(table.gymSet, eq(table.trainingSession.id, table.gymSet.session))
		// .leftJoin(table.gymExercise, eq(table.gymSet.exercise, table.gymExercise.id))
		.where(eq(table.trainingSession.id, Number(params.slug)));
	const exerciseMap: Map<Number, String> = new Map();
	userExercise.forEach((value) => {
		exerciseMap.set(value.id, value.name);
	});

	// : Map<String, table.GymSet> 
	let cleanMap: Map<String, Array<table.GymSet>> = new Map();
	// console.log(res2);
	res2.forEach((aSet) => {
		let exerciseName: String = exerciseMap.get(Number(aSet.gym_set!.exercise))!
		console.log(exerciseName)
		let exerciseDoneList: Array<table.GymSet> = cleanMap.get(exerciseName!)!;
		if (!exerciseDoneList) {
			exerciseDoneList = new Array();
			cleanMap.set(exerciseName, exerciseDoneList);
			exerciseDoneList.push(aSet.gym_set!);
		} else {
			exerciseDoneList.push(aSet.gym_set!);
		}

	});

	dayjs.extend(relativeTime);

	const trainingSessionData = await getATrainingSession(Number(params.slug));
	return {
		trainingSessionId: params.slug,
		trainingSessionInfo: trainingSessionData,
		user,
		userExercise,
		cleanMap,
		test: dayjs(trainingSessionData.date).fromNow()
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
	},
	modifyPlace: async ({ params, request }) => {
		const data = await request.formData();
		const result = await db
			.update(table.trainingSession)
			.set({ place: data.get('newPlace')?.toString() })
			.where(eq(table.trainingSession.id, Number(params.slug)));
	},
	modifyDuration: async ({ params, request }) => {
		const data = await request.formData();
		const result = await db
			.update(table.trainingSession)
			.set({ duration: Number(data.get('newDuration')?.toString()) })
			.where(eq(table.trainingSession.id, Number(params.slug)));
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const b = await db
			.delete(table.gymSet)
			.where(eq(table.gymSet.session, Number(data.get('trainingSessionId')?.toString())));
		console.log(b);

		const a = await db
			.delete(table.trainingSession)
			.where(eq(table.trainingSession.id, Number(data.get('trainingSessionId')?.toString())));
		console.log(a);
	}
};

async function getATrainingSession(trainingSessionId: number): Promise<table.TrainingSession> {
	const res = await db
		.select()
		.from(table.trainingSession)
		.where(eq(table.trainingSession.id, trainingSessionId))
		.limit(1);

	return res[0];
}