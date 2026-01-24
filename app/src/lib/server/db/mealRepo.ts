import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { and, eq, gte, lt, sql } from 'drizzle-orm';

// Types
export type MealValue = Omit<table.Meal, 'id'>;

// Functions
export async function createMeal(newMeal: MealValue) {
	return await db.insert(table.meal).values(newMeal);
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
export async function findLatestMealOf(userId: string) {
	return await db.query.meal.findFirst({
		where: eq(table.meal.userId, userId),
		orderBy: (t) => sql`${t.date} desc`
	});
}

export async function mealOfUserInRangeGroupedByDay(
	userId: string,
	beginDate: Date,
	endDate: Date
) {
	return await db
		.select({
			day: table.meal.date,
			totalProtein: sql<number>`sum(${table.meal.protein})`
		})
		.from(table.meal)
		.where(
			and(
				eq(table.meal.userId, userId),
				gte(table.meal.date, beginDate),
				lt(table.meal.date, endDate)
			)
		)
		.groupBy(sql`date(${table.meal.date}, 'unixepoch', 'localtime')`)
		.orderBy(sql`date(${table.meal.date}, 'unixepoch', 'localtime')`);
}
