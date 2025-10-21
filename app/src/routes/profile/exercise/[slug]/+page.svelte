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

	// console.log(data);
	// data.
</script>

<main>
	<h1>
		{data.exerciseInfo.name}
	</h1>
	{#if data.cleanedData.length === 0}
		No data
	{:else}
		<ul>
			{#each data.cleanedData as aSeries}
				<li>
					{aSeries.repNumber}x
					{aSeries.weight}kg ({aSeries.repInReserve})
					<br />
					{aSeries.remark}
				</li>
			{/each}
		</ul>
		<section>
			<Chart data={beepBoop} {options} type="line" />
		</section>
	{/if}
</main>
