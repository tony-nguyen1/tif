import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { and, eq, gte, lt, sql } from 'drizzle-orm';

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

export async function userAlreadyHasWorkoutToday(userId: string) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	const workoutAlreadyExisting = await db.query.workout.findFirst({
		where: (w) => and(gte(w.date, today), lt(w.date, tomorrow), eq(w.userId, userId))
	});

	return workoutAlreadyExisting;
}

export async function createWorkout(userId: string) {
	const newWorkout = await db.insert(table.workout).values({ userId, date: new Date() });
	return newWorkout.lastInsertRowid;
}

// export async function workoutOfUserWithExerciseId(
// 	userId: string,
// 	exerciseId: number,
// 	limit: number
// ) {
// 	return await db.query.workout.findMany({
// 		where: and(eq(table.workout.userId, userId)),
// 		with: {
// 			set: { where: eq(table.set.exerciseId, exerciseId) }
// 		},
// 		limit
// 	});
// }

// export async function workoutOfUserWithExerciseId(
// 	userId: string,
// 	exerciseId: number,
// 	limit: number
// ) {
// 	return await db.query.workout.findMany({
// 		where: and(
// 			eq(table.workout.userId, userId),
// 			exists(
// 				db
// 					.select({ id: table.set.id })
// 					.from(table.set)
// 					.where(
// 						and(eq(table.set.workoutId, table.workout.id), eq(table.set.exerciseId, exerciseId))
// 					)
// 			)
// 		),
// 		with: {
// 			set: {
// 				where: eq(table.set.exerciseId, exerciseId)
// 			}
// 		},
// 		limit
// 	});
// }

export async function workoutSummaryForExercise(userId: string, exerciseId: number) {
	return await db
		.select({
			x: table.workout.date,
			y: sql<number>`sum(${table.set.volume})`
		})
		.from(table.workout)
		.innerJoin(
			table.set,
			and(eq(table.set.workoutId, table.workout.id), eq(table.set.exerciseId, exerciseId))
		)
		.where(eq(table.workout.userId, userId))
		.groupBy(table.workout.id);
}
