import { getRequestEvent } from '$app/server';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { getAllExercises, findWorkoutOfUser } from '$lib/server/db/repo';
import { resolve } from '$app/paths';
import { userAlreadyHasWorkoutToday, createWorkout } from '$lib/server/db/workoutRepo';

export const load: PageServerLoad = async () => {
	const user = _requireLogin();
	const trainingSessionData = await findWorkoutOfUser(user.id);
	const userExercise = await getAllExercises(user.id);
	return { user, trainingSessionData, userExercise };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	},
	createNewTrainingSession: async () => {
		const user = _requireLogin();
		const alreadyExistingWorkout = await userAlreadyHasWorkoutToday(user.id);
		if (alreadyExistingWorkout) {
			return redirect(
				302,
				resolve('/(connected)/workout/[workoutId]', {
					workoutId: alreadyExistingWorkout.id.toString()
				})
			);
		}

		console.info('...no workout found for today\n...creating a new one');
		const newWorkout = await createWorkout(user.id);
		if (!newWorkout) {
			return fail(500, { sucess: false, message: 'Inserting a workout into DB went wrong' });
		}
		return redirect(
			302,
			resolve('/(connected)/workout/[workoutId]', { workoutId: newWorkout.toString() })
		);
	},
	deleteTrainingSession: async ({ request }) => {
		const data = await request.formData();

		await db
			.delete(table.workout)
			.where(eq(table.workout.id, Number(data.get('trainingSessionId')?.toString())));
	}
};

// FIXME : put that function in lib, and create a type to get full type safety
export function _requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/login');
	}

	return locals.user;
}
