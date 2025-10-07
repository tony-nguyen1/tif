import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

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
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
});

export const trainingSession = sqliteTable('training_session', {
	id: text('id').primaryKey(),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	duration: integer('duration').notNull(), // in minutes
	place: text('place'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
})

export const gymSet = sqliteTable('gym_set', {
	id: text('id').primaryKey(),
	session: text('session')
		.notNull()
		.references(() => trainingSession.id),
	exercise: text('exercise')
		.notNull()
		.references(() => gymExercise.id),
	repNumber: integer('repetition_number').notNull(),
	weight: integer('weight').notNull(),
	repInReserve: integer('rip').notNull(),
	remark: text('remark')
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
