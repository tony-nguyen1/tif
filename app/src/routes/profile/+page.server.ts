import { getRequestEvent } from '$app/server';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, gte, lt } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const user = _requireLogin();
	const trainingSessionData: table.TrainingSession[] = await getAllTrainingSession(user.id);
	const userExercise = await _loadAllExercises(user.id);
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
			.insert(table.trainingSession)
			.values({ date: new Date(), duration: -1, place: '', userId: data.get('userId')!.toString() })
			.returning({ insertedId: table.trainingSession.id });
		console.log(`res=${a}`);

		return redirect(302, '/session/' + a[0].insertedId);
	},
	exercise: async ({ request }) => {
		const data = await request.formData();
		const a = await db
			.insert(table.gymExercise)
			.values({ userId: data.get('userId')!.toString(), name: data.get('name')!.toString() })
			.returning({ insertedId: table.gymExercise.id });
		console.log(`res=${a}`);
	},
	foo: async ({ cookies, request }) => {
		const data = await request.formData();
		console.log(data);
		if (data.get('userId') !== null) {
			const todayBOD: Date = new Date();
			todayBOD.setHours(0, 0, 0, 0);
			const todayEOD: Date = new Date();
			todayEOD.setHours(23, 59, 59, 999);
			const res: table.TrainingSession[] = await db.select().from(table.trainingSession).where(
				and(
					eq(table.trainingSession.userId, data.get('userId')!.toString()),
					and(
						gte(table.trainingSession.date, todayBOD),
						lt(table.trainingSession.date, todayEOD)
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
					.insert(table.trainingSession)
					.values({ date: new Date(), duration: -1, place: '', userId: data.get('userId')!.toString() })
					.returning({ insertedId: table.trainingSession.id });
				console.log(`res=${a}`);
				aTrainingSessionId = a[0].insertedId;
			}

			const b = await db
				.insert(table.gymSet)
				.values({
					session: aTrainingSessionId,
					exercise: Number(data.get('exerciseId')!.toString()),
					repNumber: Number(data.get('rep')!.toString()),
					weight: Number(data.get('weight')!.toString()),
					repInReserve: Number(data.get('rir')!.toString()),
					remark: data.get('remark')!.toString()
				})
				.returning({ insertedId: table.trainingSession.id });
		}
	}
};

export function _requireLogin() {
	const { locals } = getRequestEvent();
	console.log('locals=');
	console.log(locals);

	if (!locals.user) {
		return redirect(302, '/login');
	}

	return locals.user;
}

async function getAllTrainingSession(userId: string): Promise<table.TrainingSession[]> {
	const res = await db.select().from(table.trainingSession).where(eq(table.trainingSession.userId, userId));
	return res;
}

export async function _loadAllExercises(userId: string): Promise<table.GymExercise[]> {
	console.log('exercise : ');
	const res = await db.select().from(table.gymExercise).where(eq(table.gymExercise.userId, userId));
	console.log(res);
	return res;
}
