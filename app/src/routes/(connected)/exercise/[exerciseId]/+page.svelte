<script lang="ts">
	import type { PageServerData } from '../../exercise/[exerciseId]/$types';
	// import Chart from '$lib/components/CustomChart.svelte';
	import { resolve } from '$app/paths';
	import FormAddSet from '$lib/components/custom/exercise/FormAddSet.svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import {
		BarController,
		BarElement,
		CategoryScale,
		Chart,
		Legend,
		LinearScale,
		LineController,
		LineElement,
		PointElement,
		TimeScale,
		Title,
		Tooltip
	} from 'chart.js';

	import 'chartjs-adapter-date-fns';
	Chart.register(
		LineElement,
		PointElement,
		LineController,
		BarController,
		BarElement,
		TimeScale,
		CategoryScale,
		LinearScale,
		Title,
		Tooltip,
		Legend
	);
	import { FormState } from './myEnum';

	let { data }: { data: PageServerData } = $props();
	type TimePoint = {
		x: Date; // or Date
		y: number;
	};
	// const beepBoop = $derived<() => ChartData<'line', TimePoint[]>>(() => ({
	// 	// labels: data.x,
	// 	datasets: [
	// 		{
	// 			label: 'Volume',
	// 			data: data.workoutSummary,
	// 			backgroundColor: 'rgba(255, 255, 255, 1)',
	// 			borderColor: '#36A2EB',
	// 			borderWidth: 1.3,
	// 			pointStyle: 'triangle',
	// 			pointRadius: 8,
	// 			tension: 0.3
	// 		}
	// 	]
	// }));

	let interactivitySectionState: FormState = $derived(
		data.workoutAlreadyExisting ? FormState['AddSet'] : FormState['DisplayGraph']
	);

	let input = $derived(data.workoutSummary);
	let canvas: HTMLCanvasElement | null = $state(null);
	let myChart: Chart<'line', TimePoint[]> | null = null;
	onMount(() => {
		myChart = createMyChart(input);
	});

	$effect(() => {
		if (myChart) {
			myChart.destroy();
			myChart = createMyChart(input);
			myChart.render();
		}
	});

	function createMyChart(input: TimePoint[]) {
		return new Chart(canvas!, {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Volume',
						data: input,
						backgroundColor: 'rgba(255, 255, 255, 1)',
						borderColor: '#36A2EB',
						borderWidth: 1.3,
						pointStyle: 'triangle',
						pointRadius: 8,
						tension: 0.3
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'day'
						},
						grid: { color: 'rgba(255,255,255, 0.1)' },
						ticks: {
							color: 'rgba(255,255,255, 0.6)',
							font: {
								size: 16
							}
						}
					},
					y: {
						beginAtZero: true,
						grid: { color: 'rgba(255,255,255, 0.1)' },
						ticks: {
							color: '#36A2EB',
							font: {
								size: 16
							}
						}
					}
				},
				plugins: {
					legend: { labels: { usePointStyle: true } }
				}
			}
		});
	}
</script>

<section class="w-full">
	<h1 class="text-5xl">{data.exerciseInfo.name}</h1>
	<ButtonGroup.Root id="buttonGroupWorkoutForm" class="my-2">
		<Button
			variant="outline"
			class={['size-fit', 'px-2', 'py-1']}
			onclick={() => (interactivitySectionState = FormState['Hide'])}>Hide</Button
		>
		<Button
			hidden={data.workoutAlreadyExisting ? false : true}
			variant="outline"
			class={['size-fit', 'px-2', 'py-1']}
			onclick={() => (interactivitySectionState = FormState['AddSet'])}>Form</Button
		>
		<Button
			variant="outline"
			class={['size-fit', 'px-2', 'py-1']}
			onclick={() => (interactivitySectionState = FormState['DisplayGraph'])}>Graph</Button
		>
	</ButtonGroup.Root>
	{#if data.workoutAlreadyExisting}
		<FormAddSet
			workout={data.workoutAlreadyExisting}
			hidden={interactivitySectionState !== FormState.AddSet}
		></FormAddSet>
	{/if}
	<section
		class="relative flex h-[35dvh] w-full justify-center"
		hidden={interactivitySectionState !== FormState.DisplayGraph}
	>
		<canvas bind:this={canvas} class="max-w-full"></canvas>
	</section>
	{#if data.workoutList.length === 0}
		No data
	{:else}
		<div class="flex flex-col-reverse">
			{#each data.workoutList as aWorkout (aWorkout.id)}
				<!-- All workout are fetched, including those without the current exercise  -->
				{#if aWorkout.set.length !== 0}
					<article class="w-full">
						<h2 class="text-2xl font-semibold">
							<a
								href={resolve('/(connected)/workout/[workoutId]', {
									workoutId: aWorkout.id.toString()
								})}>Workout ID: {aWorkout.id}</a
							>
						</h2>
						<!-- <DraftsIcon /> -->
						<p class="text-sm text-slate-600 dark:text-slate-400">{aWorkout.comment}</p>
						<ul>
							{#each aWorkout.set as aSet (aSet.id)}
								<li class="grid grid-cols-(--custom-col-pattern)">
									<div class="flex flex-col">
										<span class="text-lg">{aSet.repNumber}x{aSet.weight}kg</span>
										<span class="text-xs text-slate-600 dark:text-slate-400">{aSet.comment}</span>
									</div>
									<div>{aSet.repInReserve} RIR</div>
									<div>
										<!-- <button
											class="rounded-xs bg-amber-700 p-1 text-white transition hover:bg-amber-800"
											><SolarPen2Linear class="size-[24px]" /></button
										>
										<button class="rounded-xs bg-red-600 p-1 text-white transition hover:bg-red-700"
											><SolarCloseSquareLineDuotone class="size-[24px]" /></button
										> -->
									</div>
								</li>
							{/each}
						</ul>
					</article>
				{/if}
			{/each}
		</div>
	{/if}
</section>
