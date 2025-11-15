import type { Actions } from './$types.js';
// import { _requireLogin } from '../+page.server.js';
// import * as table from '$lib/server/db/schema';
import { createSleep, findSleepOfUser } from '$lib/server/db/sleepRepo.js';
import type { SleepValue } from '$lib/server/db/sleepRepo.js';
import { _requireLogin } from '../workout/+page.server';

export async function load() {
	const user = _requireLogin();

	return {
		user,
		sleepArray: await findSleepOfUser(user.id)
	};
}

export const actions: Actions = {
	sleep: async ({ request }) => {
		const data = await request.formData();
		const input: SleepValue = {
			userId: data.get('userId')!.toString(),
			date: new Date(data.get('date')!.toString()),
			restQuality: Number(data.get('restQuality')!.toString())
		};
		console.log(input);
		const success = await createSleep(input);
		return { success };
	}
};
