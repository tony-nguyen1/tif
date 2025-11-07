<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import dayjs from 'dayjs';
	import type { PageServerData } from './$types';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import * as Card from '$lib/components/ui/card/index.js';

	import SolarPen2Linear from '@iconify-svelte/solar/pen-2-linear';
	import SolarCloseSquareLineDuotone from '@iconify-svelte/solar/close-square-line-duotone';

	dayjs.extend(relativeTime);

	let { data }: { data: PageServerData } = $props();
</script>

<header class="grid grid-cols-2">
	<h1 class="text-5xl">Profile</h1>
	<aside class="justify-self-end text-right text-muted-foreground">
		<h2 class="text-xs">connected as {data.user.username}</h2>
		<h2 class="text-xs">{data.user.id}</h2>
		<form method="post" action="?/logout" use:enhance>
			<button class="text-sm text-red-400">Log out</button>
		</form>
	</aside>
</header>
<section class="grid place-items-center gap-y-3">
	<a
		href={resolve('/profile/exercise/')}
		class="rounded-md bg-blue-800 px-4 py-2 text-white transition hover:bg-blue-900"
	>
		My exercises
	</a>
	<form method="post" action="?/createNewTrainingSession">
		<input name="userId" value={data.user.id} hidden />
		<button class="rounded-md bg-blue-800 px-4 py-2 text-white transition hover:bg-blue-900"
			>Begin new training session</button
		>
	</form>
</section>

<section>
	<h2 class="mb-2 text-3xl">Past workout</h2>
	<div class="flex flex-col gap-3">
		{#each data.trainingSessionData as aTrainingSession (aTrainingSession.id)}
			<article>
				<Card.Root>
					<Card.Header>
						<Card.Title class="grid grid-cols-2 text-base">
							{aTrainingSession.id}
							<div class="flex w-fit flex-row gap-2 self-end justify-self-end">
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
							</div>
						</Card.Title>
						<Card.Description>
							At {aTrainingSession.place ? aTrainingSession.place : 'N/A'}

							{aTrainingSession.duration !== -1
								? `during ${aTrainingSession.duration} minutes`
								: ''}
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="grid gap-2">
							<p class="text-blue-600 dark:text-blue-100">{aTrainingSession.comment}</p>
							<div class="grid grid-cols-2">
								<a
									class="w-fit rounded-md bg-blue-800 px-4 py-2 text-white transition hover:bg-blue-900"
									href={resolve('/(connected)/session/[slug]', {
										slug: aTrainingSession.id.toString()
									})}
								>
									Details
								</a>
								<p class="self-end justify-self-end text-xs text-muted-foreground">
									{dayjs(aTrainingSession.date).fromNow()}
								</p>
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
