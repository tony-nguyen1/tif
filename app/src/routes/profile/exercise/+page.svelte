<script lang="ts">
	import type { PageServerData } from '../../profile/exercise/$types';

	let { data }: { data: PageServerData } = $props();
</script>

<form method="POST" action="?/exercise">
	<label>
		Name of the exercise
		<input name="name" autocomplete="off" type="text" />
	</label>

	<input name="userId" value={data.user.id} hidden />

	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Create</button
	>
</form>

<ul>
	{#each data.exerciseMap as [i, anExercise]}
		<li>
			<a href={`exercise/${i}`}>{anExercise}</a>
		</li>
	{/each}
</ul>
