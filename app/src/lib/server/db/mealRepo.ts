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
export async function editMeal(updatedMeal: table.Meal) {
	await db.delete(table.meal).where(eq(table.meal.id, updatedMeal.id));
}
