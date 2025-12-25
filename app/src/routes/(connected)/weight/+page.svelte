<script lang="ts">
	import type { PageServerData, ActionData } from './$types.js';
	import { enhance } from '$app/forms';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { dateToStringCustomFormat, createDeferred, enhanceWithParam } from '$lib/util.js';
	import WeightListDisplay from '$lib/components/custom/weight/WeightListDisplay.svelte';
	import type { Weight } from '$lib/server/db/schema';
	import Chart from '$lib/components/Chart.svelte';
	import { createContext } from 'svelte';

	const { data, form }: { data: PageServerData; form: ActionData } = $props();
	let formProcessing = $state(false);

	let [get, set] = createContext<Weight[]>(); // index 0 is the get function, 1 is the set function
	set((() => data.weightArrayNotPromised)());
	get = () => data.weightArrayNotPromised;
	// let ddd = $state(data.weightArrayNotPromised);
	// let d = $derived.by(() => {
	// 	Array.from(ddd, (w: Weight) => w.date.toLocaleDateString());
	// });
	// let dd = $derived.by(() => {
	// 	Array.from(ddd, (w: Weight) => w.weight);
	// });
	// setContext('foo', () => data.weightArrayNotPromised);
	// const x = d;
	// const y = dd;
	const x = Array.from(get(), (w) => w.date.toLocaleDateString());
	const y = Array.from(get(), (w) => w.weight);
	const chartDataDerived = {
		labels: x,
		datasets: [
			{
				label: 'Weight',
				data: y,
				backgroundColor: 'rgba(75, 192, 192, 0.4)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1
			}
		]
	};

	const options = {
		responsive: true,
		scales: {
			y: { beginAtZero: false }
		}
	};
</script>

<h1 class="text-5xl">Weight</h1>
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
					pattern="^[0-9][0-9][0-9]?(\.[0-9][0-9][0-9]?)?$"
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

<Chart data={chartDataDerived} {options} type="line" />
