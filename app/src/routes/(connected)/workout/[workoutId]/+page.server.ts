import * as table from '$lib/server/db/schema';
import { _requireLogin } from '../+page.server.js';
import type { Actions } from './$types.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {
	getAllExercises,
	getLastSeriesBis,
	getWorkoutSet,
	getTagOfUser
} from '$lib/server/db/repo.js';
import {
	editSet,
	editWorkout,
	addASet,
	deleteWorkoutCascade,
	deleteSet,
	addTagToUser,
	getWorkout,
	getTagOfUserAndId,
	getTagOfWorkout,
	addTagToWorkout,
	removeTagToWorkout,
	getAllTagOfWorkout
} from '$lib/server/db/repo.js';
import { resolve } from '$app/paths';

export async function load({ params }) {
	// no verification for now ...
	const user = _requireLogin();
	const userExercise = await getAllExercises(user.id);
	const workoutId: number = Number(params.workoutId);
	const workoutDone = await getWorkoutSet(user.id, workoutId);
	const userTag = await getTagOfUser(user.id);
	const workoutTag = await getAllTagOfWorkout(workoutId);
	const tagIds = new Set(workoutTag.map((obj) => obj.tagId));

	const cleanMap: Map<number, Array<table.Set>> = new Map();
	const volumeMap: Map<number, number> = new Map();

	// FIXME : put that in a function
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
		lastExercise: lastSet?.exerciseId ?? -1,
		userTag,
		tagIds
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
			repInReserve: data.get('rir') ? Number(data.get('rir')!.toString()) : 10,
			comment: data.get('comment') ? data.get('comment')!.toString() : null
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
			comment: data.get('comment') ? data.get('comment')!.toString() : null,
			place: data.get('place') ? data.get('place')!.toString() : null,
			duration: data.get('duration') ? Number(data.get('duration')!.toString()) : null
		};

		await editWorkout(userId, workoutId, inputData);
	},
	deleteWorkout: async ({ request }) => {
		const data = await request.formData();
		deleteWorkoutCascade(Number(data.get('trainingSessionId')?.toString()));
		return redirect(302, resolve('/(connected)/workout'));
	},
	deleteSet: async ({ request }) => {
		const data = await request.formData();
		await deleteSet(Number(data.get('gymSetId')!.toString()));
	},
	createTag: async ({ request }) => {
		const data = await request.formData();
		const tag = {
			name: data.get('newTagName')!.toString(),
			userId: data.get('userId')!.toString()
		};
		await addTagToUser(tag);
	},
	toggleTag: async ({ request }) => {
		const data = await request.formData();
		const tag = {
			userId: data.get('userId')!.toString(),
			tagId: Number(data.get('tagId')!.toString()),
			workoutId: Number(data.get('workoutId')!.toString()),
			name: data.get('tagName')!.toString()
		};

		// FIXME
		// check if user exist
		// check if workout exist
		// check if tag exist

		// check if user can modify this workout
		if (!(await getWorkout(tag.userId, tag.workoutId))) {
			error(403, 'User not authorized to modify this workout');
		}

		// check if tag belongs to user
		// If user doesn't exit, 403
		// If user exist, we always get an answer (not an undefined)
		const res = await getTagOfUserAndId(tag.userId, tag.tagId);
		if (!res || res!.tag.length < 1) {
			error(403, 'User not authorized to add this tag');
		}

		// check if workoutId linked to tagId
		if (await getTagOfWorkout(tag.tagId, tag.workoutId)) {
			const rmRes = await removeTagToWorkout({ tagId: tag.tagId, workoutId: tag.workoutId });
			return { success: rmRes.rowsAffected === 1 };
		} else {
			const addRes = await addTagToWorkout({ tagId: tag.tagId, workoutId: tag.workoutId });
			return { success: addRes.length === 1 };
		}
	}
};
