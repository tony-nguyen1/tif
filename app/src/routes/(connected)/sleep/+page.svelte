<script lang="ts">
	import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';

	let value: CalendarDate | undefined = $state(undefined);
	let sleepQualityValue: number | undefined = $state(undefined);
	let { data }: { data: PageServerData } = $props();
	let foo = $state(data.user.id);
	const oof = data.user.id;
</script>

<h1 class="text-5xl">Sleep</h1>
<section class="mt-2 grid">
	<Calendar
		type="single"
		bind:value
		sleepCalendarDateMap={data.sleepCalendarDateMap}
		class="w-fit justify-self-center rounded-md border shadow-sm"
		captionLayout="dropdown"
	/>
</section>

<section id="addSleepForm">
	<header class="">
		<h2 class="text-2xl">Log sleep quality</h2>
	</header>
	<form
		method="POST"
		action="?/sleep"
		class="grid gap-2"
		use:enhance={() => {
			// foo = oof;

			return async ({ update }) => {
				await update({ reset: false });
				value = undefined;
				sleepQualityValue = undefined;
				// foo = oof;
			};
		}}
	>
		<div class="grid gap-1" hidden>
			<label for="rir" class="text-sm">Date :</label>
			<input
				readonly
				required
				name="date"
				type="date"
				bind:value
				class="cursor-not-allowed rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
		</div>

		<div class="grid gap-1">
			<label for="restQuality" class="text-sm"> Rest quality :</label>
			<input
				name="restQuality"
				type="number"
				placeholder="3"
				required
				bind:value={sleepQualityValue}
				class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
		</div>
		<input name="userId" value={data.user.id} hidden />

		<Button variant="outline" type="submit" class="w-fit justify-self-end">Send</Button>
	</form>
</section>
