import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// Types
export type MealValue = Omit<table.Meal, 'id'>;

// Functions
export async function createMeal(newMeal: MealValue) {
	await db.insert(table.meal).values(newMeal);
}
export async function findMealOfUser(userId: string) {
	return await db.query.meal.findMany({ where: eq(table.meal.userId, userId) });
}
export async function findMeal(mealId: number) {
	return await db.query.meal.findFirst({ where: eq(table.meal.id, mealId) });
}
export async function deleteMeal(mealId: number) {
	await db.delete(table.meal).where(eq(table.meal.id, mealId));
}
export async function editMeal(input: Omit<table.Meal, 'date'>) {
	const result = await db
		.update(table.meal)
		.set(input)
		.where(eq(table.meal.id, input.id))
		.returning();
	return result;
}
