import { getRequestEvent } from '$app/server';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { getAllExercises, createWorkout, findWorkoutOfUser } from '$lib/server/db/repo';
import { resolve } from '$app/paths';

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
	createNewTrainingSession: async ({ request }) => {
		const data = await request.formData();
		const insertedWorkoutId = await createWorkout(data.get('userId')!.toString());
		if (!insertedWorkoutId) {
			return fail(500, { sucess: false, message: 'Inserting a workout into DB went wrong' });
		}
		return redirect(
			302,
			resolve('/(connected)/workout/[workoutId]', { workoutId: insertedWorkoutId.toString() })
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
