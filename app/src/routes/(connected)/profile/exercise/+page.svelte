<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageServerData } from '../../profile/exercise/$types';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data }: { data: PageServerData } = $props();
</script>

<section>
	<h1 class="text-5xl">Exercise</h1>
	<form method="POST" action="?/exercise">
		<h2 class="text-lg">Add a new exercise</h2>
		<label>
			Name
			<!-- <input name="name" autocomplete="off" type="text" /> -->
			<input
				name="name"
				autocomplete="off"
				type="text"
				placeholder="Curl"
				class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
		</label>

		<input name="userId" value={data.user.id} hidden />

		<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
			>Create</button
		>
	</form>
	<h2 class="mb-1 text-2xl">All</h2>
	<ul class="flex flex-col gap-4">
		{#each data.exerciseMap as [i, anExercise] (i)}
			<li>
				<a href={resolve(`/(connected)/profile/exercise/[slug]`, { slug: i.toString() })}>
					<Card.Root>
						<Card.Content>
							{anExercise}
						</Card.Content>
					</Card.Root>
				</a>
			</li>
		{/each}
	</ul>
</section>
