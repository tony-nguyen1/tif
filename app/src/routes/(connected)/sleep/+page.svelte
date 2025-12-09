<script lang="ts">
	// import type { SubmitFunction } from '@sveltejs/kit';
	import { CalendarDate } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let value: CalendarDate | undefined = $state(undefined);
	const { data, form }: { data: PageServerData; form: ActionData } = $props();

	// FIXME : extract to util lib
	function createDeferred<T>() {
		let resolve!: (value: T | PromiseLike<T>) => void;
		let reject!: (reason?: unknown) => void;

		const promise = new Promise<T>((res, rej) => {
			resolve = res;
			reject = rej;
		});

		return { promise, resolve, reject };
	}

	// FIXME : extract to util lib
	function toCalendarDate(date: Date): CalendarDate {
		return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
	}
</script>

<Toaster position="top-center" richColors />
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
			const deferred = createDeferred();
			toast.promise(deferred.promise, {
				loading: 'Processing ...',
				success: (val) => {
					return val as string;
				},
				error: (reason) => reason as string
			});
			return async ({ result, update }) => {
				await update({ reset: false });
				// reset of the selected date
				value = undefined;

				if (result.type === 'success') {
					deferred.resolve(
						`Sleep quality of ${form!.input!.restQuality} logged to ${toCalendarDate(form!.input!.date)}`
					);
				} else if (result.type === 'failure') {
					deferred.reject(form!.message);
				} else if (result.type === 'error') {
					deferred.reject('Something went wrong');
				} else {
					deferred.resolve('Redirect');
				}
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

		<label for="restQualityRadio" class="mt-1 text-sm"> Rest quality :</label>
		<RadioGroup.Root id="restQualityRadio" name="restQuality" value="3">
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="1" id="option-one" />
				<label for="option-one">The worst, sleep deprived</label>
			</div>
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="2" id="option-two" />
				<label for="option-two">Bad, less than 6</label>
			</div>
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="3" id="option-three" />
				<label for="option-three">Mid, more or less 6h </label>
			</div>
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="4" id="option-four" />
				<label for="option-four">Good, about 8h</label>
			</div>
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="5" id="option-five" />
				<label for="option-five">The best, arround 10h or more</label>
			</div>
		</RadioGroup.Root>

		<Button variant="outline" type="submit" class="mt-2 w-fit justify-self-end">Send</Button>
	</form>

	<!-- {#if form?.missing || form?.incorrect}
		<p class="text-sm text-red-500">{form!.message}</p>
	{/if} -->
</section>
