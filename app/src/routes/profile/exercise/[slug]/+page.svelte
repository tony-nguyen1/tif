<script lang="ts">
	import type { PageServerData } from '../../exercise/[slug]/$types';
	import Chart from '$lib/components/Chart.svelte';

	let { data }: { data: PageServerData } = $props();
	const labels = data.x;
	const beepBoop = {
		labels,
		datasets: [
			{
				label: 'Volume',
				data: data.y,
				backgroundColor: 'rgba(75, 192, 192, 0.4)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1
			}
		]
	};

	const options = {
		responsive: true,
		scales: {
			y: { beginAtZero: true }
		}
	};
</script>

<main>
	<h1>
		{data.exerciseInfo.name}
	</h1>
	{#if data.workoutList.length === 0}
		No data
	{:else}
		{#each data.workoutList as aWorkout}
			<h2>Workout ID: {aWorkout.id}</h2>
			<ul>
				{#each aWorkout.set as aSet}
					<li>
						{aSet.repNumber} x{aSet.weight} ({aSet.repInReserve}) {aSet.comment}
					</li>
				{/each}
			</ul>
		{/each}
		<Chart data={beepBoop} {options} type="line" />
	{/if}
</main>
