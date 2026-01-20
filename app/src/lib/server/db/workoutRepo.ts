import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function workoutBelongsToUser(workoutId: number, userId: string) {
	const res = await db.query.user.findFirst({
		where: eq(table.user.id, userId),
		with: { workout: { where: eq(table.workout.id, workoutId) } }
	});

	return res ? true : false;
}

export async function exerciseBelongToUser(workoutId: number, userId: string) {
	const res = await db.query.user.findFirst({
		where: eq(table.user.id, userId),
		with: { workout: { where: eq(table.workout.id, workoutId) } }
	});

	return res ? true : false;
}

export async function exerciseExist(exerciseId: number) {
	const res = await db.query.exercise.findFirst({
		where: eq(table.exercise.id, exerciseId)
	});

	return res ? true : false;
}

export async function workoutExist(workoutId: number) {
	const res = await db.query.workout.findFirst({
		where: eq(table.workout.id, workoutId)
	});

	return res ? true : false;
}
