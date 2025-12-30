<script lang="ts">
	import type { PageServerData, ActionData } from './$types.js';
	import { enhance } from '$app/forms';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import {
		dateToStringChartTimeScaleFormatted,
		dateToStringCustomFormat,
		createDeferred,
		enhanceWithParam
	} from '$lib/util.js';
	import WeightListDisplay from '$lib/components/custom/weight/WeightListDisplay.svelte';
	import type { Weight } from '$lib/server/db/schema';
	// import CustomChart from '$lib/components/CustomChart.svelte';
	import 'chartjs-adapter-date-fns';

	import { onMount } from 'svelte';
	// import { type ChartConfiguration } from 'chart.js';
	import {
		Chart,
		BarController,
		LineController,
		BarElement,
		PointElement,
		CategoryScale,
		LinearScale,
		TimeScale,
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
		TimeScale,
		CategoryScale,
		LinearScale,
		Title,
		Tooltip,
		Legend
	);

	const { data, form }: { data: PageServerData; form: ActionData } = $props();
	let formProcessing = $state(false);

	const dataArrayState = $derived(() => {
		return data.weightArrayNotPromised;
	});

	const dataArray = () =>
		Array.from(dataArrayState(), (w) => {
			return { x: dateToStringChartTimeScaleFormatted(w.date), y: w.weight };
		});
	const test: Map<string, number[]> = new Map();
	dataArrayState().forEach((val) => {
		const strDate = dateToStringChartTimeScaleFormatted(val.date);
		let foo = test.get(strDate);
		// console.info(foo);
		if (!foo) {
			// console.info('in if block');
			foo = [];
			test.set(strDate, foo);
		}
		// console.info('out of if block');
		foo!.push(val.weight);
	});
	const dataArrayAvgState = [];
	for (let [a, b] of test.entries()) {
		console.info(a, b);
		let sum = 0;
		b.forEach((val) => (sum += val));
		dataArrayAvgState.push({ x: a, y: sum / b.length });
	}

	const firstInput = $derived(() => {
		return { x: dataArray().at(0)?.x, y: data.userInfo!.goalWeight! };
	});
	const lastInput = $derived(() => {
		return { x: dataArray().at(-1)?.x, y: data.userInfo!.goalWeight! };
	});
	const goalWeightDataArray = $derived([firstInput(), lastInput()]);

	console.info(goalWeightDataArray);

	let canvas: HTMLCanvasElement;
	let myChart = null;
	onMount(() => {
		myChart = createMyChart(dataArray(), goalWeightDataArray);
	});

	$effect(() => {
		if (myChart) {
			myChart.destroy();
			myChart = createMyChart(dataArray(), goalWeightDataArray);
			myChart.render();
		}
	});

	function createMyChart(input, goalWeightDataArray) {
		return new Chart(canvas, {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Weight',
						data: input,
						backgroundColor: 'rgba(255, 255, 255, 1)',
						borderColor: '#36A2EB',
						borderWidth: 1,
						pointStyle: 'rectRot',
						pointRadius: 3,
						tension: 0.3
					},
					{
						label: 'Goal weight',
						data: goalWeightDataArray,
						backgroundColor: 'rgba(114, 190, 0, 1)',
						borderColor: 'rgba(114, 190, 0, 1)',
						borderWidth: 1,
						pointStyle: false
					}
				]
			},
			options: {
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
						beginAtZero: false,
						grid: { color: 'rgba(255,255,255, 0.1)' },
						ticks: {
							color: '#36A2EB',
							font: {
								size: 12
							}
						}
					}
				},
				plugins: {
					title: {
						text: 'Weight graph',
						display: false
					},
					legend: {
						labels: {
							usePointStyle: true,
							font: {
								// size: 16
							}
						}
					},
					tooltip: {
						usePointStyle: true
					}
				}
			}
		});
	}
</script>

<h1 class="text-5xl">Weight</h1>
<!-- <CustomChart data={chartDataDerived} {options} type="line" /> -->

<canvas bind:this={canvas}></canvas>

<section id="addWeight">
	<h2 class="text-2xl">Add new log entry</h2>
	<form
		method="post"
		class="grid gap-2"
		action="?/addWeight"
		use:enhance={enhanceWithParam(
			formProcessing,
			() => `Weight entry registered !  ${form!.inserted!.weight} kg - ${form!.inserted!.date}`,
			() => `${form!.message}`
		)}
	>
		<div class="grid gap-1">
			<label for="weightInput" class="text-sm">Weight mesured :</label>
			<InputGroup.Root>
				<InputGroup.Input
					aria-invalid={form?.missing || form?.incorrect}
					id="weightInput"
					name="weight"
					placeholder="60"
					inputmode="numeric"
					pattern="^[0-9][0-9][0-9]?(\.[0-9][0-9]?)?$"
				/>
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text>Kilo</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>

		<Button
			type="submit"
			variant="outline"
			class={['w-fit justify-self-end']}
			bind:disabled={formProcessing}
		>
			Send
		</Button>
	</form>
</section>

<section id="weightsDisplay">
	<h2 class="mb-1.5 text-2xl">Weight log</h2>
	{#await data.weightArray}
		Waiting
	{:then weightArray}
		{#if weightArray.length === 0}
			<p>Empty</p>
		{:else}
			<div class="flex flex-col-reverse gap-y-3">
				<WeightListDisplay weightList={weightArray} {editDialog} {deleteForm} />
			</div>
		{/if}
	{:catch error}
		<p>error loading comments: {error.message}</p>
	{/await}
</section>

{#snippet deleteForm(aWeightEntry: Weight)}
	<form
		method="post"
		action="?/deleteWeight"
		data-weight-id={aWeightEntry.id}
		class="w-full"
		use:enhance={() => {
			console.info('Deletion form submitted');
			const deferred = createDeferred();
			toast.promise(deferred.promise, {
				loading: 'Processing deletion ...',
				success: (val) => {
					return val as string;
				},
				error: (reason) => reason as string
			});

			return async ({ result, update }) => {
				// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				await update();

				// `result` is the object returned by the action of the server
				if (result.type === 'success') {
					deferred.resolve(`Deleted !`);
				} else if (result.type === 'failure') {
					deferred.reject(form!.message);
				} else if (result.type === 'error') {
					deferred.reject('Something went wrong');
				} else {
					deferred.resolve('Redirect');
				}

				console.info('Deletion form processed');
			};
		}}
	>
		<input name="weightId" value={aWeightEntry.id} hidden />
		<button type="submit" class="w-full text-left text-red-500">Delete</button>
	</form>
{/snippet}

{#snippet editDialog(aWeightEntry: Weight)}
	<Dialog.Root>
		<Dialog.Trigger class="w-full text-left">Edit</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="text-xl">
					Edit weight entry {aWeightEntry.id}
				</Dialog.Title>
				<Dialog.DialogDescription>
					{dateToStringCustomFormat(aWeightEntry.date)}
				</Dialog.DialogDescription>
			</Dialog.Header>
			<form method="post" action="?/putWeight" class="grid gap-2">
				<label for="weightInput" class="text-sm">Weight mesured :</label>
				<InputGroup.Root>
					<InputGroup.Input
						aria-invalid={form?.missing || form?.incorrect}
						value={aWeightEntry.weight}
						id="weightInput"
						name="weight"
						placeholder="60"
						inputmode="numeric"
						pattern="[0-9][0-9][0-9]?"
					/>
					<InputGroup.Addon align="inline-end">
						<InputGroup.Text>Kilo</InputGroup.Text>
					</InputGroup.Addon>
				</InputGroup.Root>

				<input name="weightId" value={aWeightEntry.id} hidden />
				<input name="date" value={aWeightEntry.date} hidden />

				<Button variant="outline" type="submit" class="justify-self-end">Send</Button>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/snippet}
