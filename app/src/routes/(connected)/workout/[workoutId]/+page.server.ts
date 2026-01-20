import * as table from '$lib/server/db/schema';
import { _requireLogin } from '../+page.server.js';
import type { Actions } from './$types.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {
	getAllExercises,
	getLastSeriesBis,
	getWorkoutSet,
	getTagOfUser,
	getTag
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
import { FormState } from '$lib/components/custom/form/myEnum.js';
import {
	exerciseBelongToUser,
	exerciseExist,
	workoutBelongsToUser,
	workoutExist
} from '$lib/server/db/workoutRepo.js';

export async function load({ params }) {
	// no verification for now ...
	const user = _requireLogin();
	const userExercise = await getAllExercises(user.id);
	const workoutId: number = Number(params.workoutId);
	const workoutDone = await getWorkoutSet(user.id, workoutId);
	const tagUserAll = await getTagOfUser(user.id);

	const tagWorkoutObject = await getAllTagOfWorkout(workoutId);
	const tagWorkoutId = new Set(tagWorkoutObject.map((obj) => obj.tagId));

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
			...workoutDone
			// formattedDateFromNow: dayjs(workoutDone?.date).fromNow()
		},
		user,
		userExercise,
		cleanMap,
		volumeMap,
		exerciseIdToNameMap,
		lastExercise: lastSet?.exerciseId ?? -1,
		tagUserAll,
		tagWorkoutId
	};
}

export const actions: Actions = {
	addASet: async ({ request, params }) => {
		const user = _requireLogin();
		const workoutId = params.workoutId;
		const data = await request.formData();

		// syntax check
		const tmpExerciseId = Number(data.get('exerciseId')?.toString());
		if (!data.get('exerciseId') || tmpExerciseId < 0) {
			return fail(400, { missing: true, message: 'Form is missing exerciseId input' });
		}

		const tmpRep = Number(data.get('rep')?.toString());
		if (!data.get('rep') || tmpRep < 0) {
			return fail(400, { missing: true, message: 'Form is missing rep input' });
		}

		const tmpWeight = Number(data.get('weight')?.toString());
		if (!data.get('weight') || tmpWeight < 0) {
			return fail(400, { missing: true, message: 'Form is missing weight input' });
		}

		const input = {
			workoutId: Number(workoutId),
			exerciseId: tmpExerciseId,
			repNumber: tmpRep,
			weight: tmpWeight,
			repInReserve: data.get('rir') ? Number(data.get('rir')!.toString()) : 10,
			comment: data.get('comment') ? data.get('comment')!.toString() : null
		};

		// semantic check
		if (!(await workoutExist(input.workoutId))) {
			return fail(422, {
				message: `Exercise ${input.workoutId} does not exist`
			});
		}

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

		const success = await addASet(input);
		if (!success) {
			return fail(500, { message: 'Insertion of a set went wrong' });
		}
		return { success, workoutId: input.workoutId };
	},
	editASet: async ({ request, params }) => {
		// const user = _requireLogin();
		const workoutId = params.workoutId;
		// check if this set belongs to user

		const data = await request.formData();

		const setData = {
			id: Number(data.get('setId')!.toString()),
			workoutId: workoutId,
			repNumber: Number(data.get('rep')!.toString()),
			weight: Number(data.get('weight')!.toString()),
			repInReserve: Number(data.get('rir')!.toString()),
			comment: data.get('comment')!.toString()
		};

		await editSet(setData);
		// FIXME : proper checking if db write is ok or went wrong
		return { success: true, workoutId: setData.workoutId };
	},
	editWorkout: async ({ request }) => {
		const user = _requireLogin();
		const data = await request.formData();

		const workoutId = Number(data.get('trainingSessionId')!.toString());
		const inputData = {
			comment: data.get('comment') ? data.get('comment')!.toString() : null,
			place: data.get('place') ? data.get('place')!.toString() : null,
			duration: data.get('duration') ? Number(data.get('duration')!.toString()) : null
		};

		const res = await editWorkout(user.id, workoutId, inputData);
		if (res.length === 1) {
			return { success: true, workoutId: workoutId };
		}
		return fail(500, { workoutId: workoutId, message: `Editing workout ${workoutId} went wrong` });
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
		const user = _requireLogin();
		const data = await request.formData();
		const tag = {
			name: data.get('newTagName')!.toString(),
			userId: user.id
		};

		try {
			const res = await addTagToUser(tag);
			if (res.length === 1) {
				return {
					success: true,
					message:
						res.length === 1
							? 'Tag has been inserted into db'
							: `Error creating the tag ${tag.name} `,
					lastOperation: FormState.AddTag,
					tagName: tag.name
				};
			}

			return fail(500, {
				success: false,
				message: `Error creating the tag ${tag.name} `,
				lastOperation: FormState.AddTag,
				tagName: tag.name
			});
		} catch (error) {
			console.error(error);
			return fail(500, {
				success: false,
				message: `Error creating the tag ${tag.name} `,
				lastOperation: FormState.AddTag,
				tagName: tag.name
			});
		}
	},
	toggleTag: async ({ request, params }) => {
		const user = _requireLogin();
		const data = await request.formData();
		const workoutId = params.workoutId;
		const tagInput = {
			userId: user.id,
			tagId: Number(data.get('tagId')!.toString()),
			workoutId: Number(workoutId)
		};

		// FIXME
		// check if user exist
		// check if workout exist
		// check if tag exist

		// check if user can modify this workout
		if (!(await getWorkout(tagInput.userId, tagInput.workoutId))) {
			error(403, 'User not authorized to modify this workout');
		}

		// check if tag belongs to user
		// If user doesn't exit, 403
		// If user exist, we always get an answer (not an undefined)
		const res = await getTagOfUserAndId(tagInput.userId, tagInput.tagId);
		if (!res || res!.tag.length < 1) {
			error(403, 'User not authorized to add this tag');
		}

		const tag = (await getTag(tagInput.tagId))!;

		// check if workoutId linked to tagId
		if (await getTagOfWorkout(tagInput.tagId, tagInput.workoutId)) {
			const rmRes = await removeTagToWorkout({
				tagId: tagInput.tagId,
				workoutId: tagInput.workoutId
			});
			return {
				success: rmRes.rowsAffected === 1,
				lastOperation: FormState.AddTag,
				tagName: tag.name,
				removed: true
			};
		} else {
			const addRes = await addTagToWorkout({
				tagId: tagInput.tagId,
				workoutId: tagInput.workoutId
			});
			return {
				success: addRes.length === 1,
				lastOperation: FormState.AddTag,
				tagName: tag.name,
				removed: false
			};
		}
	}
};
