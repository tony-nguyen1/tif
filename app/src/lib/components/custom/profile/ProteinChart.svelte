<script lang="ts">
	import { dateToStringChartTimeScaleFormatted } from '$lib/util';
	import 'chartjs-adapter-date-fns';
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
	import { onMount } from 'svelte';
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

	export let mealInRange: { day: Date; totalProtein: number }[];

	const dataArray: TimePoint[] = [];
	mealInRange.forEach((aMeal) =>
		dataArray.push({ x: dateToStringChartTimeScaleFormatted(aMeal.day), y: aMeal.totalProtein })
	);

	type TimePoint = {
		x: string; // or Date
		y: number;
	};

	let canvas: HTMLCanvasElement;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let myChart: Chart<'bar', TimePoint[]> | null = null;
	onMount(() => {
		myChart = createBarChart(dataArray);
	});

	function createBarChart(input: TimePoint[]) {
		return new Chart(canvas, {
			type: 'bar',
			data: {
				datasets: [
					{
						label: 'Protein',
						data: input,
						backgroundColor: '#0e598b',
						borderColor: '#1794e8',
						borderWidth: 1.8
					}
				]
			},
			options: {
				// indexAxis: 'y',
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
							unit: 'day',
							displayFormats: {
								day: 'EEE' // Monday, Tuesday, Wednesday
							}
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
							text: 'grammes'
						},
						beginAtZero: true,
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
						text: 'Protein consumed this week',
						display: false,
						color: 'white',
						font: {
							size: 20
						}
					},
					legend: {
						labels: {
							// usePointStyle: true,
							font: {
								// size: 16
							}
						}
					},
					tooltip: {
						// usePointStyle: true,
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
</script>

<section>
	<h2 class="text-2xl">Protein eaten this week</h2>
	<section class="relative flex h-[35dvh] w-full justify-center">
		<canvas bind:this={canvas} class="max-w-full"></canvas>
	</section>
</section>
