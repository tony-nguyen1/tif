import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, sql, sum, desc, asc } from 'drizzle-orm';
import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
	'one' | 'many',
	boolean,
	TSchema,
	TSchema[TableName]
>['with'];

export type InferResultType<
	TableName extends keyof TSchema,
	With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
	TSchema,
	TSchema[TableName],
	{
		with: With;
	}
>;

export async function getATrainingSession(trainingSessionId: number): Promise<table.Workout> {
	const res = await db
		.select()
		.from(table.workout)
		.where(eq(table.workout.id, trainingSessionId))
		.limit(1);

	return res[0];
}

// type UserWithExercise = InferResultType<'user', { exercise: { with: { set: true } } }>

// : Promise<table.Exercise[]>
// type UserWithExercise = InferResultType<'user', { exercise: true }>
export async function getAllExercises(userId: string): Promise<table.Exercise[]> {
	const res = await db.query.user.findFirst({
		where: eq(table.user.id, userId),
		with: {
			exercise: true
		}
	});
	return res?.exercise ?? [];
}

// Get a workout of a user
export async function getWorkoutSet(userId: string, workoutId: number) {
	const res = await db.query.workout.findFirst({
		where: and(eq(table.workout.userId, userId), eq(table.workout.id, workoutId)),
		with: {
			set: {
				with: {
					exercise: true
				}
			}
		}
	});
	return res;
}

// Get all set an exercise from all workout that userId did
export async function getSet(
	userId: string,
	exerciseId: number
): Promise<{ exercise: table.Exercise | null; set: table.Set | null }[]> {
	const res: { exercise: table.Exercise | null; set: table.Set | null }[] = await db
		.select()
		.from(table.set)
		.leftJoin(table.exercise, eq(table.set.workoutId, table.exercise.id))
		.where(and(eq(table.exercise.userId, userId), eq(table.exercise.id, exerciseId)));
	// await db.query.linkTable.findMany({
	//     // where: ()
	//     with: {

	//     }
	// });

	return res;
}

export type WorkoutWithExercise = InferResultType<'workout', { set: true }>;
export async function getSetBis(
	userId: string,
	exerciseId: number
): Promise<WorkoutWithExercise[]> {
	const res = await db.query.workout.findMany({
		with: {
			set: {
				where: eq(table.set.exerciseId, exerciseId)
			}
		}
	});

	return res;
}

export async function getAnExercise(exerciseId: number): Promise<table.Exercise | null> {
	const res: table.Exercise | undefined = await db.query.exercise.findFirst({
		where: eq(table.exercise.id, exerciseId)
	});
	return res ?? null;
}

export async function getSeriesByWorkout(userId: string, exerciseId: number) {
	let res;
	res = await db
		.select({ id: table.workout.id, total: sum(table.set.volume) })
		.from(table.set)
		.leftJoin(table.workout, eq(table.set.workoutId, table.workout.id))
		.groupBy(table.workout.id)
		.where(and(eq(table.set.exerciseId, exerciseId), eq(table.workout.userId, userId)));
	return res;
}

export async function getLastSeries(
	workoutId: number
): Promise<{ workout: table.Workout; set: table.Set | null }> {
	const res: { workout: table.Workout; set: table.Set | null }[] = await db
		.select()
		.from(table.workout)
		.leftJoin(table.set, eq(table.set.workoutId, table.workout.id))
		.where(eq(table.workout.id, workoutId))
		.orderBy(desc(table.set.id))
		.limit(1);
	return res[0];
}

export async function getLastSeriesBis(workoutId: number) {
	const res = await db.query.set.findFirst({
		where: eq(table.set.workoutId, workoutId),
		orderBy: [desc(table.set.id)]
	});
	return res;
}

export async function editSet(aSet: { id: number }) {
	const result = await db.update(table.set).set(aSet).where(eq(table.set.id, aSet.id)).returning();
	return result;
}
