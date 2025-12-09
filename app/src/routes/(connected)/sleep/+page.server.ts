import type { Actions } from './$types.js';
// import { _requireLogin } from '../+page.server.js';
// import * as table from '$lib/server/db/schema';
import { createSleep, findSleepOfUser } from '$lib/server/db/sleepRepo.js';
import type { SleepValue } from '$lib/server/db/sleepRepo.js';
import { _requireLogin } from '../workout/+page.server';
import { CalendarDate } from '@internationalized/date';
import { fail } from '@sveltejs/kit';

export async function load() {
	const user = _requireLogin();

	const sleepArray = await findSleepOfUser(user.id);
	const sleepCalendarDateMap: Map<string, number> = new Map();
	sleepArray.forEach((s) => {
		sleepCalendarDateMap.set(toCalendarDate(s.date).toString(), s.restQuality);
	});

	return {
		user,
		sleepArray,
		sleepCalendarDateMap
	};
}

export const actions: Actions = {
	sleep: async ({ request }) => {
		const data = await request.formData();
		const user = _requireLogin();

		if (!data.has('date') || data.get('date') === '') {
			return fail(400, { missing: true, message: 'Form is missing date input' });
		}

		if (!data.has('restQuality')) {
			return fail(400, { missing: true, message: 'Form is missing restQuality input' });
		}

		const input: SleepValue = {
			userId: user.id,
			date: new Date(data.get('date')!.toString()),
			restQuality: Number(data.get('restQuality')!.toString())
		};

		if (input.restQuality < 0 || input.restQuality > 5) {
			return fail(400, {
				incorrect: true,
				message: 'Rest quality input must be between 1 and 5 included'
			});
		}

		const res = await createSleep(input);

		if (res.rowsAffected === 1) {
			await sleep(1000);
			return { success: false, user, input };
			// return { success: true, user, input };
		} else {
			return fail(500, {
				message: 'Somehow multiple rows were affected'
			});
		}
	}
};

function toCalendarDate(date: Date): CalendarDate {
	return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
