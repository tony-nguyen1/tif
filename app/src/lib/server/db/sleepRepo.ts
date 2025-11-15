import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// Types
export type SleepValue = Omit<table.Sleep, 'id'>;

// Functions
export async function createSleep(newSleep: SleepValue) {
	await db.insert(table.sleep).values(newSleep);
}
export async function findSleepOfUser(userId: string) {
	return await db.query.sleep.findMany({ where: eq(table.sleep.userId, userId) });
}
export async function findSleep(sleepId: number) {
	return await db.query.sleep.findFirst({ where: eq(table.sleep.id, sleepId) });
}
export async function deleteSleep(sleepId: number) {
	await db.delete(table.sleep).where(eq(table.sleep.id, sleepId));
}
