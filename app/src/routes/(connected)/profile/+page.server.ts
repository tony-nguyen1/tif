import { getRequestEvent } from '$app/server';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { getAllExercises } from '$lib/server/db/repo';

export const load: PageServerLoad = async () => {
	const user = _requireLogin();
	const trainingSessionData: table.Workout[] = await getAllTrainingSession(user.id);
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
		const a = await db
			.insert(table.workout)
			.values({ date: new Date(), duration: -1, place: '', userId: data.get('userId')!.toString() })
			.returning({ insertedId: table.workout.id });

		return redirect(302, '/session/' + a[0].insertedId);
	},
	deleteTrainingSession: async ({ request }) => {
		const data = await request.formData();
		// const b = await db
		// 	.delete(table.set)
		// 	.where(eq(table.set.session, Number(data.get('trainingSessionId')?.toString())));

		await db
			.delete(table.workout)
			.where(eq(table.workout.id, Number(data.get('trainingSessionId')?.toString())));
	}
};

export function _requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/login');
	}

	return locals.user;
}

async function getAllTrainingSession(userId: string): Promise<table.Workout[]> {
	const res = await db.select().from(table.workout).where(eq(table.workout.userId, userId));
	return res;
}
