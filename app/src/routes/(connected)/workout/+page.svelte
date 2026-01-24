<script lang="ts">
	import { resolve } from '$app/paths';
	// import * as dayjs from 'dayjs';
	// import * as relativeTime from 'dayjs/plugin/relativeTime.js';
	import type { PageServerData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { dateToStringCustomFormat } from '$lib/util';

	// import SolarPen2Linear from '@iconify-svelte/solar/pen-2-linear';
	// import SolarCloseSquareLineDuotone from '@iconify-svelte/solar/close-square-line-duotone';

	// dayjs.extend(relativeTime.default);

	let { data }: { data: PageServerData } = $props();
</script>

<header class="grid grid-cols-2">
	<h1 class="text-5xl">Workout</h1>
	<aside class="justify-self-end text-right text-muted-foreground"></aside>
</header>
<section class="grid place-items-center gap-y-3">
	<div class="flex flex-row gap-x-3">
		<Button variant="outline" href={resolve('/(connected)/exercise')}>My exercises</Button>
		<Button variant="outline" href={resolve('/(connected)/tag')}>My tags</Button>
	</div>
	<form method="post" action="?/createNewTrainingSession">
		<Button type="submit" variant="outline">Begin new training session</Button>
	</form>
</section>

<section>
	<h2 class="mb-2 text-3xl">Past workout</h2>
	<div class="flex flex-col-reverse gap-3">
		{#each data.trainingSessionData as aTrainingSession (aTrainingSession.id)}
			<article>
				<Card.Root>
					<Card.Header>
						<Card.Title class="grid grid-cols-2 text-lg">
							{dateToStringCustomFormat(aTrainingSession.date)}
							<!-- <div class="flex w-fit flex-row gap-2 self-end justify-self-end">
								<button
									class="size-min cursor-not-allowed rounded-xs bg-gray-900 p-1 text-white transition hover:bg-amber-800"
								>
									<SolarPen2Linear class="size-[16px]" />
								</button>
								<form
									method="POST"
									action="?/deleteTrainingSession"
									class="h-[1rem] w-[24px]"
									use:enhance
								>
									<input name="trainingSessionId" value={aTrainingSession.id} hidden />
									<button
										class="cursor-pointer rounded-xs bg-red-600 p-1 text-white transition hover:bg-red-700"
										><SolarCloseSquareLineDuotone class="size-[16px]" /></button
									>
								</form>
							</div> -->
						</Card.Title>
						<Card.Description>
							At {aTrainingSession.place ? aTrainingSession.place : 'N/A'}

							{aTrainingSession.duration ? `during ${aTrainingSession.duration} minutes` : ''}
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="grid gap-2">
							{#if aTrainingSession.comment && aTrainingSession.comment!.length !== 0}
								<p class="whitespace-pre-wrap text-blue-600 dark:text-blue-100">
									{aTrainingSession.comment}
								</p>
							{/if}
							<div class="flex flex-row gap-2">
								{#each aTrainingSession.taggedWorkout as aTaggedWorkout (aTaggedWorkout.tag.id)}
									<span
										class="block w-fit rounded-full border px-2 py-0.5 text-sm dark:border-white dark:bg-black"
										>{aTaggedWorkout.tag.name}</span
									>
								{/each}
							</div>
							<div class="grid grid-cols-2">
								<Button
									variant="outline"
									class="w-fit"
									href={resolve('/(connected)/workout/[workoutId]', {
										workoutId: aTrainingSession.id.toString()
									})}
								>
									Details
								</Button>
								<!-- <p class="self-end justify-self-end text-xs text-muted-foreground">
									{dayjs.unix(aTrainingSession.date.getTime()).fromNow()}
								</p> -->
							</div>
						</div>
					</Card.Content>
					<!-- <Card.Footer>

					</Card.Footer> -->
				</Card.Root>
			</article>
		{/each}
	</div>
</section>
