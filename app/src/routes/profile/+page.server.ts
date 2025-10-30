import { getRequestEvent } from '$app/server';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, gte, lt } from 'drizzle-orm';
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


		const a = await db
			.delete(table.workout)
			.where(eq(table.workout.id, Number(data.get('trainingSessionId')?.toString())));

	},
	foo: async ({ cookies, request }) => {
		const data = await request.formData();

		if (data.get('userId') !== null) {
			const todayBOD: Date = new Date();
			todayBOD.setHours(0, 0, 0, 0);
			const todayEOD: Date = new Date();
			todayEOD.setHours(23, 59, 59, 999);
			const res: table.Workout[] = await db.select().from(table.workout).where(
				and(
					eq(table.workout.userId, data.get('userId')!.toString()),
					and(
						gte(table.workout.date, todayBOD),
						lt(table.workout.date, todayEOD)
					)
				));

			let aTrainingSessionId: number;
			if (res.length > 0) {
				console.log(`This user (${data.get('userId')!.toString()}) has logged some training today`);
				aTrainingSessionId = res[0].id;
			} else {
				console.log(`This user (${data.get('userId')!.toString()}) has not logged any training today`);
				console.log(`Inserting a new gym session for (${data.get('userId')!.toString()}) today`);
				const a = await db
					.insert(table.workout)
					.values({ date: new Date(), duration: -1, place: '', userId: data.get('userId')!.toString() })
					.returning({ insertedId: table.workout.id });

				aTrainingSessionId = a[0].insertedId;
			}

			// const b = await db
			// 	.insert(table.set)
			// 	.values({
			// 		session: aTrainingSessionId,
			// 		exercise: Number(data.get('exerciseId')!.toString()),
			// 		repNumber: Number(data.get('rep')!.toString()),
			// 		weight: Number(data.get('weight')!.toString()),
			// 		repInReserve: Number(data.get('rir')!.toString()),
			// 		comment: data.get('comment')!.toString()
			// 	})
			// 	.returning({ insertedId: table.workout.id });
		}
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
