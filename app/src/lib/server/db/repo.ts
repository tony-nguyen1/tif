import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, sql, sum, desc } from 'drizzle-orm';

export async function getATrainingSession(trainingSessionId: number): Promise<table.TrainingSession> {
    const res = await db
        .select()
        .from(table.trainingSession)
        .where(eq(table.trainingSession.id, trainingSessionId))
        .limit(1);

    return res[0];
}

export async function getAllExercises(userId: string): Promise<table.GymExercise[]> {

    const res = await db.select().from(table.gymExercise).where(eq(table.gymExercise.userId, userId));

    return res;
}

// Get all set an exercise from all workout that userId did 
export async function getSet(userId: string, exerciseId: number): Promise<{ gym_exercise: table.GymExercise | null, gym_set: table.GymSet | null }[]> {
    const res: { gym_exercise: table.GymExercise | null, gym_set: table.GymSet | null }[] = await db
        .select()
        .from(table.gymSet)
        .leftJoin(table.gymExercise, eq(table.gymSet.exercise, table.gymExercise.id))
        .where(and(
            eq(table.gymExercise.userId, userId),
            eq(table.gymExercise.id, exerciseId)));
    return res;
}

export async function getAnExercise(exerciseId: number): Promise<table.GymExercise | null> {
    const res: table.GymExercise[] | null = await db
        .select()
        .from(table.gymExercise)
        .where(eq(table.gymExercise.id, exerciseId));
    return res[0] ?? null;
}

export async function getSeriesByWorkout(exerciseId: number) {
    let res;
    res = await db
        .select({ id: table.trainingSession.id, total: sum(table.gymSet.volume) })
        .from(table.gymSet)
        .leftJoin(table.trainingSession, eq(table.gymSet.session, table.trainingSession.id))
        .groupBy(table.trainingSession.id)
        .where(eq(table.gymSet.exercise, exerciseId));
    return res;
}

export async function getLastSeries(workoutId: number): Promise<{ training_session: table.TrainingSession, gym_set: table.GymSet | null }> {
    const res: { training_session: table.TrainingSession, gym_set: table.GymSet | null }[] = await db
        .select()
        .from(table.trainingSession)
        .leftJoin(table.gymSet, eq(table.gymSet.session, table.trainingSession.id))
        .where(eq(table.trainingSession.id, workoutId))
        .orderBy(desc(table.gymSet.id))
        .limit(1);
    return res[0];
}


