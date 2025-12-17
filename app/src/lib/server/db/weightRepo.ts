import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

// Types
export type WeightValue = Omit<table.Weight, 'id'>;

// Functions
export async function createWeight(newWeight: WeightValue) {
	return await db.insert(table.weight).values(newWeight);
}
export async function findWeightOfUser(userId: string) {
	return await db.query.weight.findMany({ where: eq(table.weight.userId, userId) });
}
export async function findWeightByIdAndUserId(weightId: number, userId: string) {
	return await db.query.weight.findFirst({
		where: and(eq(table.weight.id, weightId), eq(table.weight.userId, userId))
	});
}
export async function deleteWeight(weightId: number) {
	await db.delete(table.weight).where(eq(table.weight.id, weightId));
}
export async function editWeight(newVal: table.Weight) {
	const result = await db
		.update(table.weight)
		.set(newVal)
		.where(eq(table.weight.id, newVal.id))
		.returning();
	return result;
}
