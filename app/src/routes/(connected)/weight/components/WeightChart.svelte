<script lang="ts">
	import { enhance } from '$app/forms';
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
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { dateToStringChartTimeScaleFormatted } from '$lib/util.js';
	import type { Weight } from '$lib/server/db/schema';

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
	import { Button } from '$lib/components/ui/button/index.js';

	interface Props {
		weightArray: Weight[];
		goalWeight: number;
	}
	let { weightArray, goalWeight }: Props = $props();

	const dataArrayAvgState = $derived.by(() => {
		const map = new SvelteMap<string, { sum: number; count: number }>();

		for (const val of weightArray) {
			const key = dateToStringChartTimeScaleFormatted(val.date);

			const entry = map.get(key) ?? { sum: 0, count: 0 };
			entry.sum += val.weight;
			entry.count++;
			map.set(key, entry);
		}

		return [...map.entries()].map(([x, { sum, count }]) => ({
			x,
			y: sum / count
		}));
	});

	const firstInput = $derived(() => {
		// if (weightArray.length == 0) {
		// 	return { x: dateToStringChartTimeScaleFormatted() };
		// }
		return { x: dateToStringChartTimeScaleFormatted(weightArray.at(0)!.date), y: goalWeight };
	});
	const lastInput = $derived(() => {
		return { x: dateToStringChartTimeScaleFormatted(weightArray.at(-1)!.date), y: goalWeight };
	});
	const goalWeightDataArray = $derived([firstInput(), lastInput()]);

	type TimePoint = {
		x: string; // or Date
		y: number;
	};

	let canvas: HTMLCanvasElement | undefined = $state();
	let myChart: Chart<'line', TimePoint[]> | null = null;
	onMount(() => {
		myChart = createMyChart(dataArrayAvgState, goalWeightDataArray);
	});

	$effect(() => {
		if (myChart) {
			myChart.destroy();
			myChart = createMyChart(dataArrayAvgState, goalWeightDataArray);
			myChart?.render();
		}
	});

	function createMyChart(input: TimePoint[], goalWeightDataArray: TimePoint[]) {
		if (!canvas) return null;
		return new Chart(canvas, {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Weight',
						data: input,
						backgroundColor: 'rgba(255, 255, 255, 1)',
						borderColor: '#36A2EB',
						borderWidth: 1.2,
						pointStyle: 'rectRot',
						pointRadius: 4,
						tension: 0.3
					},
					{
						label: 'Goal weight',
						data: goalWeightDataArray,
						backgroundColor: 'rgba(114, 190, 0, 1)',
						borderColor: 'rgba(114, 190, 0, 1)',
						borderWidth: 1,
						pointStyle: 'line'
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						title: {
							display: true,
							text: 'Date',
							color: 'rgba(255,255,255, 0.6)'
						},
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
						title: {
							display: false,
							text: 'Kilogrammes'
						},
						beginAtZero: false,
						grid: { color: 'rgba(255,255,255, 0.1)' },
						ticks: {
							color: '#36A2EB',
							font: {
								size: 14
							}
						}
					}
				},
				plugins: {
					title: {
						text: 'Weight graph over time',
						display: false,
						color: 'white',
						font: {
							size: 20
						}
					},
					legend: {
						labels: {
							usePointStyle: true,
							// pointStyleWidth: 32,
							font: {
								// size: 16
							}
						}
					},
					tooltip: {
						usePointStyle: true,
						callbacks: {
							title: (tooltipItems) => {
								const formatted = new Intl.DateTimeFormat('en-US', {
									month: 'short',
									day: '2-digit',
									year: 'numeric'
								}).format(new Date(tooltipItems[0].parsed.x!));
								return formatted;
							}
						}
					}
				}
			}
		});
	}

	import type { SubmitFunction } from '@sveltejs/kit';

	const enhanceFn: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				weightArray = result.data!.weightArray as Weight[];
			}
		};
	};
</script>

<!-- {@debug weightArray} -->

{#if weightArray.length == 0}
	<p>We display nothing</p>
{:else}
	<section class="relative flex h-[35dvh] w-full justify-center">
		<canvas bind:this={canvas} class="max-w-full"></canvas>
	</section>
{/if}
<form action="?/test" method="post" use:enhance={enhanceFn}>
	<input type="text" hidden />
	<Button type="submit" variant="outline" class="w-fit" value="all" name="timeWindow">All</Button>
	<!-- <input type="text" hidden value="lastWeek" name="timeWindow" /> -->
	<Button type="submit" variant="outline" class="w-fit" value="lastWeek" name="timeWindow"
		>Last week</Button
	>
	<Button type="submit" value="last2Week" name="timeWindow" variant="outline" class="w-fit"
		>Last 2 week</Button
	>
</form>
