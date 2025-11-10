<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageServerData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data }: { data: PageServerData } = $props();
</script>

<section>
	<h1 class="text-5xl">Exercise</h1>
	<form method="POST" action="?/exercise" class="mt-3 grid">
		<h2 class="text-lg">Add a new exercise</h2>
		<div class="grid">
			<label for="name">Name </label>
			<input
				name="name"
				autocomplete="off"
				type="text"
				placeholder="Curl"
				class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
			<input name="userId" value={data.user.id} hidden />
		</div>
		<button
			class="mt-2 w-fit justify-self-end rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>
			Send
		</button>
	</form>
	<h2 class="mb-1 text-2xl">All</h2>
	<ul class="flex flex-col gap-4">
		{#each data.exerciseMap as [i, anExercise] (i)}
			<li>
				<a
					href={resolve(`/(connected)/profile/exercise/[exerciseId]`, { exerciseId: i.toString() })}
				>
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
