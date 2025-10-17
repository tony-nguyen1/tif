import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	console.log(params);
	// no verification for now ...

	const res2: { training_session: table.TrainingSession | null, gym_set: table.GymSet | null }[] = await db
		.select()
		.from(table.trainingSession)
		.leftJoin(table.gymSet, eq(table.trainingSession.id, table.gymSet.session))
		.where(eq(table.trainingSession.id, Number(params.slug)))
		;
	console.log(res2);

	let sets = []
	for (let set of res2) {
		sets.push(set.gym_set);
	}

	return {
		trainingSessionId: params.slug,
		sets
	};
}
