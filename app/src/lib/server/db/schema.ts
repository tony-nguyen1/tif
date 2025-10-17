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

export const gymExercise = sqliteTable('gym_exercise', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
}, (table) => [
	unique('unique_name_per_user').on(table.userId, table.name)
]);

export const trainingSession = sqliteTable('training_session', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	duration: integer('duration').notNull(), // in minutes
	place: text('place'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
})

export const gymSet = sqliteTable('gym_set', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	session: integer('session')
		.notNull()
		.references(() => trainingSession.id),
	exercise: integer('exercise')
		.notNull()
		.references(() => gymExercise.id),
	repNumber: integer('repetition_number').notNull(),
	weight: integer('weight').notNull(),
	repInReserve: integer('rip').notNull(),
	remark: text('remark')
});

export type GymExercise = typeof gymExercise.$inferSelect;
export type TrainingSession = typeof trainingSession.$inferSelect;
export type GymSet = typeof gymSet.$inferSelect;

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
