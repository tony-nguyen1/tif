<script lang="ts">
	import type { PageServerData } from '../../exercise/[slug]/$types';
	import Chart from '$lib/components/Chart.svelte';
	import DraftsIcon from '@iconify-svelte/material-symbols/drafts';
	import SolarPen2Linear from '@iconify-svelte/solar/pen-2-linear';
	import SolarCloseSquareLineDuotone from '@iconify-svelte/solar/close-square-line-duotone';

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

<section>
	<h1 class="text-5xl">{data.exerciseInfo.name}</h1>
	{#if data.workoutList.length === 0}
		No data
	{:else}
		{#each data.workoutList as aWorkout}
			{#if aWorkout.set.length !== 0}
				<article>
					<h2 class="text-2xl">Workout ID: {aWorkout.id}</h2>
					<!-- <DraftsIcon /> -->
					<p class="text-sm text-slate-400">{aWorkout.comment}</p>
					<ul>
						{#each aWorkout.set as aSet}
							<li class="grid grid-cols-(--custom-col-pattern)">
								<div class="flex flex-col">
									<span class="text-lg">{aSet.repNumber}x{aSet.weight}kg</span>
									<span class="text-xs text-slate-400">{aSet.comment}</span>
								</div>
								<div>{aSet.repInReserve} RIR</div>
								<div>
									<button
										class="rounded-xs bg-amber-700 p-1 text-white transition hover:bg-amber-800"
										><SolarPen2Linear class="size-[24px]" /></button
									>
									<button class="rounded-xs bg-red-600 p-1 text-white transition hover:bg-red-700"
										><SolarCloseSquareLineDuotone class="size-[24px]" /></button
									>
								</div>
							</li>
						{/each}
					</ul>
				</article>
			{/if}
		{/each}
		<Chart data={beepBoop} {options} type="line" />
	{/if}
</section>
