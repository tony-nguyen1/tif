<script lang="ts">
	import type { PageServerData } from '../../profile/exercise/$types';

	let { data }: { data: PageServerData } = $props();
	console.log(data);
</script>

<ul>
	{#each data.exerciseMap as [i, anExercise]}
		<li>
			{anExercise}
		</li>
	{/each}
</ul>
