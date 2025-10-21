<script lang="ts">
	import { onMount } from 'svelte';
	import { type ChartConfiguration } from 'chart.js';
	import {
		Chart,
		BarController,
		LineController,
		BarElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Title,
		Tooltip,
		Legend,
		LineElement
	} from 'chart.js';

	Chart.register(
		LineElement,
		PointElement,
		LineController,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Title,
		Tooltip,
		Legend
	);

	// Props
	export let type: ChartConfiguration['type'] = 'bar';
	export let data: ChartConfiguration['data'];
	export let options: ChartConfiguration['options'] = {};

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	// Create the chart only in the browser
	onMount(() => {
		const config: ChartConfiguration = { type, data, options };
		chart = new Chart(canvas, config);

		// Clean up on unmount
		return () => chart?.destroy();
	});
</script>

<div class="chart-container">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 400px;
		display: flex;
		justify-content: center;
	}

	canvas {
		max-width: 100%;
	}
</style>
