<script lang="ts">
	// import WorkoutForm from '$lib/components/custom/form/WorkoutForm.svelte';
	import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	// import isEqual from "lodash.isequal";
	import {
		// SvelteDate,
		SvelteMap
		// SvelteSet,
		// SvelteURL,
		// SvelteURLSearchParams
	} from 'svelte/reactivity';
	// import type { CalendarDate } from '@internationalized/date';

	// let testValue = $state(today(getLocalTimeZone()));
	let value = $state(today(getLocalTimeZone()));
	let test: CalendarDate = toCalendarDate(new Date());
	console.log(test);
	let { data }: { data: PageServerData } = $props();
	let calendarDateArray: SvelteMap<number, string> = new SvelteMap<number, string>();
	data.sleepArray.forEach((s) => {
		calendarDateArray.set(s.date.valueOf(), s.restQuality.toString());
	});
	console.log(calendarDateArray);
	function toCalendarDate(date: Date): CalendarDate {
		// return CalendarDate.fromDate(date, getLocalTimeZone())
		return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
	}
</script>

<h1 class="text-5xl">Sleep</h1>
<section class="mt-2 grid">
	<Calendar
		onValueChange={(val) => console.log(val)}
		type="single"
		bind:value
		bind:customMapCalendarDateValue={calendarDateArray}
		class="w-fit justify-self-center rounded-md border shadow-sm"
		captionLayout="dropdown"
	/>
	{value}
</section>

<section id="addSleepForm">
	<header class="">
		<h2 class="text-2xl">Log sleep quality</h2>
	</header>
	<form method="POST" action="?/sleep" class="grid gap-2" use:enhance>
		<!-- <div class="grid gap-1">
			<label for="rir" class="text-sm">Date :</label>
			<input
				readonly
				name="date"
				type="date"
				bind:value
				class="cursor-not-allowed rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
		</div> -->

		<div class="grid gap-1">
			<label for="restQuality" class="text-sm"> Rest quality :</label>
			<input
				name="restQuality"
				type="number"
				placeholder="3"
				required
				class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
		</div>
		<input name="userId" value={data.user.id} hidden />

		<Button variant="outline" type="submit" class="w-fit justify-self-end">Send</Button>
	</form>
</section>

<section id="displaySleepLog">
	{#each data.sleepArray as aSleepLog (aSleepLog.id)}
		<p>{aSleepLog.date} - {aSleepLog.restQuality}</p>
	{/each}
</section>
