import { relations, sql, type SQL } from 'drizzle-orm';
import { sqliteTable, integer, text, unique } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

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
	workout: many(workout)
}));
export const exerciseRelation = relations(exercise, ({ one, many }) => ({
	user: one(user, {
		fields: [exercise.userId],
		references: [user.id]
	}),
	set: many(set)
}));

export const tag = sqliteTable('tag', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const taggedWorkout = sqliteTable('tagged_workout', {
	tagId: text('tag_id')
		.notNull()
		.references(() => tag.id),
	workoutId: text('workout_id')
		.notNull()
		.references(() => workout.id)
}); // add relation

export const workout = sqliteTable('workout', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	duration: integer('duration').notNull(), // in minutes
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
	})
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

export type Exercise = typeof exercise.$inferSelect;
export type Workout = typeof workout.$inferSelect;
export type Set = typeof set.$inferSelect;

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
