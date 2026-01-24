import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function addTagToUser(val: Omit<table.Tag, 'id'>) {
	return await db.insert(table.tag).values(val).returning({ id: table.tag.id });
}

export async function addTagToWorkout(val: table.TaggedWorkout) {
	return await db.insert(table.taggedWorkout).values(val).returning();
}

export async function removeTagToWorkout(val: table.TaggedWorkout) {
	return await db
		.delete(table.taggedWorkout)
		.where(
			and(
				eq(table.taggedWorkout.tagId, val.tagId),
				eq(table.taggedWorkout.workoutId, val.workoutId)
			)
		);
}

export async function getTagOfUser(userId: string) {
	return await db.query.tag.findMany({
		where: eq(table.tag.userId, userId)
	});
}

export async function getTagOfUserAndId(userId: string, tagId: number) {
	return await db.query.user.findFirst({
		where: eq(table.user.id, userId),
		with: {
			tag: {
				where: eq(table.tag.id, tagId)
			}
		}
	});
}

export async function getTag(tagId: number) {
	return await db.query.tag.findFirst({
		where: eq(table.tag.id, tagId)
	});
}

export async function getTagOfWorkout(tagId: number, workoutId: number) {
	return await db.query.taggedWorkout.findFirst({
		where: and(eq(table.taggedWorkout.tagId, tagId), eq(table.taggedWorkout.workoutId, workoutId))
	});
}

export async function getAllTagOfWorkout(workoutId: number) {
	return await db.query.taggedWorkout.findMany({
		columns: {
			tagId: true,
			workoutId: false
		},
		where: eq(table.taggedWorkout.workoutId, workoutId)
	});
}
