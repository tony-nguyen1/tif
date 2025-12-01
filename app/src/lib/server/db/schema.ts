import { relations, sql, type SQL } from 'drizzle-orm';
import { check, sqliteTable, integer, text, unique, primaryKey } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable(
	'user',
	{
		id: text('id').primaryKey(),
		username: text('username').notNull().unique(),
		passwordHash: text('password_hash').notNull(),
		goal: text('goal', { enum: ['cutting', 'bulking', 'maintaining', 'cardio', 'strength'] }),
		goalWeight: integer('goalWeight')
	},
	(table) => [
		check(
			'goalCheck',
			sql`${table.goal} IN ('cutting', 'bulking', 'maintaining', 'cardio', 'strength')`
		),
		check('goalWeightCheck', sql`${table.goalWeight} > 40`)
	]
);

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const exercise = sqliteTable(
	'exercise',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		name: text('name').notNull()
	},
	(table) => [unique('unique_name_per_user').on(table.userId, table.name)]
);

export const userRelation = relations(user, ({ many }) => ({
	exercise: many(exercise),
	workout: many(workout),
	meal: many(meal),
	sleep: many(sleep),
	tag: many(tag),
	weight: many(weight)
}));
export const exerciseRelation = relations(exercise, ({ one, many }) => ({
	user: one(user, {
		fields: [exercise.userId],
		references: [user.id]
	}),
	set: many(set)
}));

export const tag = sqliteTable(
	'tag',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		name: text('name').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id)
	},
	(table) => [unique('unique_tag_name_per_user').on(table.name, table.userId)]
);
export const tagRelation = relations(tag, ({ one, many }) => ({
	taggedWorkout: many(taggedWorkout),
	user: one(user, { fields: [tag.userId], references: [user.id] })
}));

// taggedWorkout.tagId taggedWorkout.workoutId
export const taggedWorkout = sqliteTable(
	'tagged_workout',
	{
		tagId: integer('tag_id')
			.notNull()
			.references(() => tag.id),
		workoutId: integer('workout_id')
			.notNull()
			.references(() => workout.id)
	},
	(table) => [
		primaryKey({ columns: [table.tagId, table.workoutId] }),
		unique('no_multiple_identical_tag_per_workout').on(table.tagId, table.workoutId)
	]
);
export const taggedWorkoutRelation = relations(taggedWorkout, ({ one, many }) => ({
	workout: many(workout),
	tag: one(tag, { fields: [taggedWorkout.tagId], references: [tag.id] })
}));

export const workout = sqliteTable('workout', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	duration: integer('duration'), // in minutes
	place: text('place'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	comment: text('comment')
});
export const workoutRelation = relations(workout, ({ one, many }) => ({
	set: many(set),
	user: one(user, {
		fields: [workout.userId],
		references: [user.id]
	}),
	taggedWorkout: one(taggedWorkout, { fields: [workout.id], references: [taggedWorkout.workoutId] })
}));

export const set = sqliteTable('set', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	exerciseId: integer('exercise_id')
		.notNull()
		.references(() => exercise.id),
	workoutId: integer('workout_id')
		.notNull()
		.references(() => workout.id),
	repNumber: integer('repetition_number').notNull(),
	weight: integer('weight').notNull(),
	repInReserve: integer('rip').notNull(),
	comment: text('comment'),
	volume: integer('volume').generatedAlwaysAs(
		(): SQL => sql`${set.repNumber}*${set.weight}`.mapWith(Number),
		{ mode: 'stored' }
	)
});
export const setRelation = relations(set, ({ one }) => ({
	// set: many(set),
	exercise: one(exercise, {
		fields: [set.exerciseId],
		references: [exercise.id]
	}),
	workout: one(workout, {
		fields: [set.workoutId],
		references: [workout.id]
	})
}));

// export const workoutExerciseComment = sqliteTable('workout_exercise_comment', {
// 	workoutId: integer('workout_id', { mode: 'number' })
// 		.notNull()
// 		.references(() => workout.id),
// 	exerciseId: integer('exercise_id', { mode: 'number' })
// 		.notNull()
// 		.references(() => exercise.id),
// 	comment: text('comment')
// }, (table) => [
// 	index("workout_idx").on(table.workoutId),
// 	index("exercise_idx").on(table.exerciseId),
// 	primaryKey({ columns: [table.workoutId, table.exerciseId] })
// ]);

// export const workoutRelation = relations(workout, ({ many }) => ({
// 	link: many(linkTable, {
// 		fields: [workout.id],
// 		references: [linkTable.workoutId]
// 	})
// }));
// export const workoutRelation = relations(workout, ({ many }) => ({
// 	group: many(linkTable, {
// 		fields: [usersToGroups.groupId],
// 		references: [groups.id],
// 	}),
// 	user: one(users, {
// 		fields: [usersToGroups.userId],
// 		references: [users.id],
// 	}),
// }));

// Meal tables
export const meal = sqliteTable('meal', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	place: text('place').notNull(),
	protein: integer('protein').notNull(),
	fullness: integer('fullness').notNull(),
	description: text('description').notNull()
});
export const mealRelation = relations(meal, ({ one }) => ({
	user: one(user, {
		fields: [meal.userId],
		references: [user.id]
	})
}));

// Sleep tables
export const sleep = sqliteTable('sleep', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	restQuality: integer('rest_quality').notNull()
});
export const sleepRelation = relations(sleep, ({ one }) => ({
	user: one(user, {
		fields: [sleep.userId],
		references: [user.id]
	})
}));

// Weight tables
export const weight = sqliteTable('weight', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	weight: integer('weight').notNull()
});
export const weightRelation = relations(weight, ({ one }) => ({
	user: one(user, {
		fields: [weight.userId],
		references: [user.id]
	})
}));

export type Meal = typeof meal.$inferSelect;
export type Sleep = typeof sleep.$inferSelect;
export type Weight = typeof weight.$inferSelect;

export type Exercise = typeof exercise.$inferSelect;
export type Workout = typeof workout.$inferSelect;
export type Set = typeof set.$inferSelect;
export type TaggedWorkout = typeof taggedWorkout.$inferSelect;
export type Tag = typeof tag.$inferSelect;

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
